---
title: Scheduled agents and the laptop that went to sleep
summary: My morning brief and script-only alerts taught me to test scheduling, execution, and delivery separately.
date: 2026-11-13
type: tutorial
order: 5
tags: [Hermes, cron, automation, notifications]
---

I wanted a short morning brief at 7:00: check my calendar and recent email, tell me what needed attention, and stop talking if nothing did. The agent could already answer questions when I opened a chat. Scheduling meant it had to work without me sitting there to correct it.

The first real brief worked when run by hand. The scheduled runs failed. One started late; another waited roughly 39 minutes for a model response before interruption. I had also put the laptop in my bag. A recurring job on a MacBook is still a job on a MacBook.

This tutorial covers the pattern I ended up using: an agent for judgment, scripts for fixed checks, and a separate check that the result reached the right place. I directed the setup; Hermes ran most of the commands.

<figure>
<img src="/journey/scheduled-agents-with-cron/job-flow.svg" alt="A local scheduler starts either a fresh agent session for a morning brief or a deterministic script for inbox and board checks. Their final text goes through delivery routing to a phone or local history. All execution depends on an awake Mac." loading="lazy" />
<figcaption>Scheduling, doing the work, and delivering the result are separate failure points.</figcaption>
</figure>

## Prerequisites

You need Hermes, a working model login, and a running gateway. For a real brief, connect Gmail and Calendar first; [Part 6](/journey/connecting-real-tools) covers that. For phone delivery, finish [the messaging setup](/journey/texting-my-agent-imessage-telegram).

I used Hermes 0.23.0 during setup and checked the commands below against 0.23.1. These are Hermes scheduled jobs, not entries installed through macOS `crontab`.

## 1. Check the scheduler in the right profile

```bash
hermes profile list
hermes -p default cron status
hermes -p default cron list
```

On my Mac, status reports a running host gateway serving multiple profiles. The list for `default` contains the morning brief, price watch, and Multica notifier. The AgentMail check lives in `personal-profile`:

```bash
hermes -p personal-profile cron list
```

A blank list can mean you're looking in the wrong profile. It does not prove that the machine has no jobs.

For each job I look at its next run, last status, dispatch timing, and delivery error. A healthy scheduler heartbeat only proves the scheduler is alive. It doesn't prove Google access works or that my phone received anything.

## 2. Give the morning brief a complete brief

A cron agent starts in a fresh session. It doesn't have the conversation in which I said “keep it short.” The saved prompt must contain that instruction, the timezone, the data sources, and what the job may do.

My brief uses the `google-workspace` and `morning-brief` skills. Its rules are to read the current day's calendar and tomorrow morning, inspect a bounded recent mail window, ignore promotional noise, and extract concrete actions. It must not send email or change events. If authentication fails, it should report that rather than invent a quiet day.

Here is a sanitized starting point. It creates a **paused** job with local delivery, so it won't immediately start sending personal summaries to a channel:

```bash
hermes -p default cron create '0 7 * * *' \
  'Produce a short morning brief in Europe/Berlin time. Use the google-workspace skill. Read today and tomorrow morning from Calendar and recent important Gmail. Include deadlines, conflicts, and messages needing action. Ignore promotions. Never send mail or modify events. If nothing needs attention, use one or two lines. If a data source fails, say which one failed; do not treat failure as an empty inbox.' \
  --name 'Morning brief' \
  --timezone Europe/Berlin \
  --skill google-workspace \
  --deliver local \
  --paused
```

The creation response should show the name and schedule. Inspect it with `cron list` before enabling it. I created my original job from a Telegram topic using the `cronjob_manage` tool, with `deliver` set to `origin`; that retained the topic as its destination. A CLI-created local job does not magically know which Telegram conversation you mean.

The tool's `attach_to_session` option also attached my original job to its conversation. That was useful for replies, but it didn't turn the scheduled run into the same live chat.

## 3. Test execution before trusting the schedule

Replace the placeholder with the job returned by the list:

```bash
hermes -p default cron run '<job-id>'
hermes -p default cron runs '<job-id>' --limit 5
```

A manual run request schedules background work; it isn't the finished result. Check its eventual run record and output. Once the content and destination are correct, enable the job:

```bash
hermes -p default cron resume '<job-id>'
```

I initially had a Google backend problem too. The installed `gws` CLI selected a project for which my account lacked permission. The Python Google client worked, so the brief's procedure temporarily hid `gws` from `PATH` to select the fallback. That workaround had to be in the saved job procedure, not only in the desktop conversation.

After the later scheduler failures, a manual retry completed successfully in about nine seconds. That proved execution could work. It did not prove the next 7:00 run would start on time. By November 18, the live list showed a successful morning run dispatched on time; another day had run late. I would not summarize that history as “set it and forget it.”

## 4. Keep watches quiet when nothing changes

My stock-price watch checks every 30 minutes on weekdays inside a configured Berlin-time window:

```text
*/30 15-22 * * 1-5
```

That means minute 0 and 30 of hours 15 through 22, not a market calendar. It includes no holiday handling and doesn't automatically follow the weeks when US and European daylight-saving changes differ.

The useful mechanics were `continuity`, a material-change condition, and silence. Continuity brings the previous output into the next run so the agent can avoid repeating it. When nothing new warrants an alert, the final response must be exactly:

```text
[SILENT]
```

That is the scheduler's suppression token for agent jobs. It is different from returning a cheerful paragraph saying nothing changed. This watch is a notification experiment, not a reliable quote feed or an order-execution system. A missing alert doesn't prove a price stayed still: the source, model, network, or laptop might have failed.

## 5. Don't spend a model call on a fixed check

The daily AgentMail check runs at 19:00 Berlin time. A Python script fetches received messages, compares them with a saved set of seen messages, and prints a short alert for new ones. It never follows instructions in the mail. No new mail means empty standard output.

Hermes supports this with `--script` and `--no-agent`. After placing and testing your own script in the active profile's `scripts` directory, the scheduling command is:

```bash
hermes -p personal-profile cron create '0 19 * * *' \
  --name 'Agent inbox check' \
  --timezone Europe/Berlin \
  --script agentmail_check.py \
  --no-agent \
  --deliver local \
  --paused
```

This command assumes that script already exists; Hermes does not generate it from the filename. Script-only mode delivers stdout directly without an LLM. Empty stdout suppresses delivery.

I hit a path-validation error with the Multica notifier: `--script` rejected an absolute path. The accepted value was the filename relative to the profile's scripts directory.

Also, testing a stateful checker can consume its next notification. My inbox checker records messages as seen when it runs, before the scheduler has proved delivery. I'd separate observation from acknowledgment in a stronger version.

## 6. Notify on board changes, with honest limits

The Multica monitor polls once a minute. Its first fetch establishes a silent baseline. Later fetches compare issue statuses with a saved snapshot and print newly created issues or status transitions. The scheduler handles Photon delivery; the script doesn't ask a model to compose each notification.

One measured check took about 1.6 seconds of wall time and 0.05 seconds of CPU time. That's one sample, not a battery benchmark. Most of its time was spent waiting for the API.

It also isn't an event log. If an issue changes twice between polls, the script may see only the final state. The current implementation fetches a limited issue list, doesn't paginate, and saves its snapshot before delivery. So “notify on every status change” was my request, not a guarantee this poller can make.

## What I'd do differently

I'd test the first scheduled run as deliberately as the manual one, and make failure notifications visible. My notifier suppressed failure delivery to keep the phone quiet, which makes checking run history more important.

I'd also decide whether a job needs an always-on host before choosing its time. `--catch-up on` can run a missed job once after return, but grace windows still matter; it doesn't wake the Mac or recreate every missed interval. Local execution and Telegram's message queuing are different things.

The basic split has held up: use an agent when the task needs judgment, and a script when it needs a comparison. Neither arrangement survives a closed laptop by optimism alone.

Further reading: [Hermes cron documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron).

Previous: [Part 4 — Memory, skills, and Honcho](/journey/memory-skills-and-honcho). Next: [Part 6 — Connecting real tools](/journey/connecting-real-tools).
