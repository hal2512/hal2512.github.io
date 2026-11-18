---
title: A project board for agents with Multica
summary: An online Multica runtime still crashed before work began. I traced the failure to a profile wrapper inside an isolated task home.
date: 2026-11-15
type: tutorial
order: 7
tags: [Multica, Hermes, task tracking, isolation]
---

I wanted to see what the agent was doing without reading an entire conversation. A board with Todo, In Progress, Blocked, and Done was a better view than several pages of tool output.

Multica gave me that view. It also introduced a distinction I initially missed: my personal Hermes chat could update a board, while a Hermes agent launched *from* that board was a separate worker. Giving both the same name didn't make them the same session.

This tutorial covers connecting a local runtime, tracking substantial requests, and the failure that taught me to inspect the worker's environment. I directed the setup; the agent handled most CLI and API work. The installation used Multica 0.8.2 and Hermes 0.23.0. I later checked commands against the installed CLI and Hermes 0.23.1.

<figure>
<img src="/journey/a-project-board-for-agents-multica/board-and-workers.svg" alt="Two paths share a Multica board: the personal Hermes session updates issues while doing work itself, or Multica dispatches an assigned issue through a local daemon and runtime into an isolated worker. The worker does not automatically receive the personal session's memory or messaging." loading="lazy" />
<figcaption>Updating an issue from chat and assigning an issue to a worker are different workflows.</figcaption>
</figure>

## Prerequisites

You need a Multica account and workspace, a working Hermes installation, and a Mac that is awake while local tasks run. Homebrew is the installation route shown here.

Before connecting anything, decide what belongs on an external board. My rule was short task titles and progress summaries, not private message contents, personal documents, or credentials. Being able to read a local file doesn't mean the agent should copy it into a cloud issue.

## 1. Separate the objects in the setup

A **workspace** contains issues and team configuration. The **daemon** is the local process connecting this Mac to Multica. A **runtime** is an executable environment the daemon can launch, such as Hermes or Codex. An **agent** has instructions and is bound to a runtime.

A custom Multica runtime profile is another object again: it tells the daemon how to launch a particular executable. It isn't interchangeable with a named Hermes profile.

My first onboarding registered Claude, Codex, and Hermes runtimes. I then added a custom runtime and an agent named “Hermes Personal.” The online status meant the daemon had registered the runtime. It did not mean a real task had completed.

## 2. Connect the machine and inspect detection

```bash
brew install multica-ai/tap/multica
multica version
multica login
```

Complete the browser login yourself. If using a personal access token instead, `multica login --token` prompts for it; don't put a literal token in a command you will paste into chat or store in shell history.

Then inspect your workspace and daemon:

```bash
multica workspace list
multica daemon status
```

If no daemon is running, start it and inspect the detected tools:

```bash
multica daemon start
multica daemon status
multica runtime list
```

My initial startup found three supported CLIs. On an earlier attempt, Hermes had been detected but skipped because its version probe timed out. The daemon log showed the version-check process being killed. Running the same `hermes --version` command afterward completed in about 0.3 seconds. A slow initial probe was plausible; an absent executable wasn't the explanation.

If a runtime is missing, check the daemon log and its executable's availability before reinstalling everything. Also check who owns the daemon: the desktop app can manage it. Don't start or restart a second process just because the tutorial uses a terminal command.

I left daemon autostart off while experimenting. Starting at login and staying awake are separate requirements. Autostart doesn't turn a sleeping laptop into an always-on worker.

## 3. Bind an agent and give it a tiny task

List existing agents before creating another:

```bash
multica agent list
```

After choosing the runtime from `runtime list`, a sanitized creation command is:

```bash
multica agent create \
  --name 'Hermes worker' \
  --runtime-id '<runtime-id>' \
  --description 'Private worker for small verified tasks' \
  --instructions 'Work only on the assigned task. Never expose secrets. Report blockers honestly. Verify the requested result before calling it complete.'
```

Replace the placeholder locally. The expected result is a new agent bound to the selected runtime, initially idle. Confirm it in the agent list and Multica UI.

Start with a task that only needs to reply on the board. My later smoke test asked for the current date, followed by a greeting. That isolated startup and model access from all the possible failures in Telegram delivery, browser authorization, or a large project.

For an assigned issue, inspect its execution history:

```bash
multica issue runs '<issue-id>'
```

A row marked `completed` is useful evidence about the run. Read the result too. It isn't proof that a requested external side effect happened.

## 4. Track real requests without pretending it's a hook

Before relying on workers, I tested the board API from my existing Hermes session. With approval, the agent created one harmless issue, moved it from Todo to In Progress to Done, and read it back. That proved board access independently of runtime execution.

I then asked for substantial requests to appear on the board automatically. The implementation was a skill, `multica-project-tracking`, not an event hook intercepting every prompt.

The skill says to look for an existing matching issue, create one for real build, research, or setup work, and move it to `in_progress` when work starts. Meaningful milestones get comments. Work waiting on me becomes `blocked`. Only a verified result becomes `done`.

Quick explanations and casual questions don't need cards. A skill is an instruction the agent follows, not a transactional guarantee that no task can start without a card. That difference matters if you want strict auditability.

The API workflow uses an authorization header and a workspace header, with the key loaded locally from the active profile's secret file. The skill contains the procedure, not the key. It also says to disclose a board outage instead of retrying in a loop or claiming a card was created when the service returned an error.

## 5. Debug the worker's actual home

The custom runtime looked online, but the “Hermes Personal” worker exited during initialization. The execution history showed two startup failures, followed by a separate model-selection failure.

The launcher was selecting `personal-profile` again with `-p personal-profile`. That was reasonable in my ordinary terminal, where the named profile existed. Multica, however, launched tasks with an isolated `HERMES_HOME`. Inside that home, the named profile wasn't there.

The saved debugging procedure identified the double selection as the startup problem. The fix was to launch the Hermes executable without selecting the named profile again, preserving the task home Multica supplied. The current wrapper still reflects that change.

<figure>
<img src="/journey/a-project-board-for-agents-multica/isolated-home.svg" alt="Before the fix, a wrapper selects a named profile inside Multica's isolated task home, where that profile is absent. After the fix, it preserves the task home and launches Hermes directly. OAuth and messaging remain separately authorized capabilities." loading="lazy" />
<figcaption>Fixing process startup did not give the isolated worker every capability of my desktop session.</figcaption>
</figure>

I would inspect rather than blindly replace a wrapper:

```bash
command -v personal-profile
multica runtime profile list
multica runtime profile set-path --help
```

`set-path` pins a custom runtime profile to a local executable. If you use it, the verified command shape is:

```bash
multica runtime profile set-path '<runtime-profile-id>' \
  --path '/absolute/path/to/your-reviewed-wrapper'
```

This is a launcher-specific repair, not a general recommendation to remove `-p` from ordinary Hermes commands. Outside Multica, selecting a named profile is often exactly what you want.

## 6. Treat authentication as a separate repair

After startup, the worker still reported `model_resolution_failed`. The isolated task home didn't automatically inherit the OAuth store used by my regular installation.

The recorded repair exposed the existing local OAuth store to this private worker through a link into its task home. I am deliberately not presenting that as a copy-paste default. Sharing that file lets the worker use and refresh the owner's credentials. It requires an explicit decision about which worker gets that authority.

The evidence is narrower than “everything worked”: the issue's history records failed initialization, failed model selection, and then completed runs. A verification comment records removal of the repeated profile selection and the OAuth-store link. The worker could respond afterward. I did not infer this from the runtime's green online indicator.

The original request involved Telegram, and it remained blocked because this worker lacked the recipient/channel authorization. A completed model run and a completed messaging request were different outcomes.

## 7. Pass project context, not your entire identity

The isolated worker didn't automatically have my conversation history, personal memory, full skill library, or messaging setup. One inspected task had only a small skill set compared with my personal session.

That is useful isolation. A worker building a page needs the project brief, relevant files, output location, and acceptance checks. It doesn't need everything my assistant knows about me.

I settled on two modes. For context-heavy work, my main session did the work and mirrored progress to Multica. For a bounded independent task, an assigned worker could run from the board with an explicit brief. I preferred having both options to copying my entire Hermes home into every worker.

The once-a-minute issue notifier from [Part 5](/journey/scheduled-agents-with-cron) gave me phone updates without requiring every worker to own my messaging credentials.

## What I'd do differently

I'd test “reply here” before “send me something elsewhere,” and write down what online, completed, and delivered actually prove. I would also inspect the wrapper and `HERMES_HOME` before changing model names in response to a startup error.

The board improved visibility. It didn't remove the need to verify artifacts or define a worker's permissions. That became even more important when I moved from a few temporary subagents to permanent specialist profiles.

Further reading: [Multica CLI](https://multica.ai/docs/cli) and [daemon and runtimes](https://multica.ai/docs/daemon-runtimes). Local sources for the failure story were the runtime wrapper, saved onboarding procedure, and issue execution history.

Previous: [Part 6 — Connecting real tools](/journey/connecting-real-tools). Next: [Part 8 — From subagents to an AI staff](/journey/from-subagents-to-an-ai-staff).
