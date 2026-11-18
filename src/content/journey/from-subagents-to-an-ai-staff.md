---
title: From temporary subagents to a permanent AI staff
summary: How I turned temporary subagents into seven permanent Hermes profiles, with Kanban handoffs, task-specific models, fallback chains and independent checks.
date: 2026-11-17
type: story
order: 8
tags: [Multi-agent, Kanban, Profiles, Subagents, QA]
---

**TL;DR:** Temporary subagents helped build a trading course and research report. I then turned recurring roles into seven permanent Hermes profiles, coordinated through Kanban, with a model per task and ChatGPT backups. The hard part was checking their work.

I directed this; the agents ran almost every command. This story assumes you know what a model and an agent are, but not how Hermes coordinates them.

## Round one: subagents build a trading course

On 16 November I asked my main agent for an interactive, Brilliant-style website to learn stocks and day trading. I wanted two paths, chapters going from easy to advanced, and a 6:4 ratio of text to graphs or images because I learn better from pictures. I also suggested it split the work across subagents.

Before it dispatched anyone, the agent wrote a `CONTENT_SCHEMA.md`: the exact shape of a chapter file, the allowed step types, the visual kinds and their parameters. That file was the contract between the content writers and the site engine. Then it started four subagents in the background with `delegate_task`: a curriculum planner, a researcher-writer for each path's first chapter, and a designer. While they worked, the main agent built the engine itself: a router, a lesson player, and the chart and slider components.

The batch came back after about seven minutes. What I liked most was that the reports were honest about their gaps:

- The curriculum planner said its German tax figures for later chapters were "from memory, not freshly researched" and should be checked before anyone wrote those chapters.
- Both researchers said the page-reading tool wasn't available to them (the web backend only did search), so they had checked facts against search-result excerpts from the official sites instead.
- Two of them noticed the same conflict: my brief asked for five lessons in Chapter 1, but the schema allowed three to four. They followed my brief and told the engine to accept five.

Round two added a further-reading curator. It checked every link it picked: HTTP 200 plus a matching page title, and YouTube's oEmbed endpoint for videos. It dropped sources it couldn't confirm. Investopedia returned HTTP 402 to curl and Babypips sat behind a Cloudflare 403. The researcher for Chapter 2 even found two mistakes in Chapter 1. One was the Xetra opening auction, which starts at 08:55, not 08:50, since a schedule change in December 2025.

My main agent tested everything with a script that played through every lesson in Chrome and answered every exercise. The play-through stalled once. The browser tab was in the background and the timers had slowed down, and it only finished after the agent brought the tab to the front. By Chapter 3, all 26 lessons passed with no page errors.

The part that mattered later: two subagents wrote their lessons into skills (`verified-reading-lists` and `trading-course-chapter-content`). The Chapter 3 workers loaded those skills first. The knowledge stayed even though the subagents were gone.

## Round two: researchers, then auditors

On 17 November, a platform-comparison report ran on GPT-6 Astra. Three subagents researched strategy-following apps, broker APIs and automation tools. Each wrote structured JSON with saved evidence, using the `grounded-citations` skill. Its ledger rejected a quote that didn't match the fetched text verbatim.

The first attempt stopped mid-turn. When I repeated the request later that morning, the agent resumed from its files.

It then started two auditors to re-check pricing, Germany eligibility and API permissions against live official pages, without editing the research. They reported no material reversals, but suggested clearer wording. Both also disclosed that the requested `web.run` tool wasn't available; they used browser and HTTP retrieval instead.

The finished report compared 12 platforms with 86 cited sources, and its browser checks passed. Nobody opened an account or placed a trade.

## From temporary roles to permanent profiles

A subagent got the task context the parent supplied, not a continuing relationship with me. These workers could load skills and save new ones, but they weren't permanent specialists. I wanted recurring roles with their own histories, rather than repeatedly briefing temporary helpers. My earlier Multica setup had a related continuity problem ([Part 7](/journey/a-project-board-for-agents-multica)).

So on 17 November I asked my main agent whether I could have permanent agents, an actual staff with different jobs, instead of temporary helpers. Hermes already supports this. A profile is a full, separate agent with its own job description (`SOUL.md`), memory, skills and chat history. The agent created six of them, cloned from my main profile:

```bash
for p in researcher engineer designer career tutor secretary; do
  hermes profile create $p --clone-from personal-profile --no-alias
done
```

It wrote a job description for each one and set a short board description with `hermes profile describe`. Only the secretary got my Google login. Then it ran a test task through the board (compare free paper-trading platforms usable from Germany), and the researcher finished it in under a minute, with sources.

My main profile became the chief of staff. I keep talking to it. When something fits a specialist, it files a task on the Hermes Kanban board, the gateway hands it to that profile, and the result comes back on the task.

<figure>
<img src="/journey/from-subagents-to-an-ai-staff/staff-flow.svg" alt="Flow diagram: Hal asks the chief of staff, which files tasks on the Hermes Kanban board (todo, ready, running, done). The gateway dispatches tasks to seven staff profiles: researcher, engineer and writer on Opus; designer, career, tutor and secretary on Sonnet. Workers report back, the chief of staff re-checks, then reports to Hal." loading="lazy" />
<figcaption>The intended workflow is for the chief of staff to check worker results before reporting them to me.</figcaption>
</figure>

Idle profiles use no model calls. Active workers share my account limits, and the gateway dispatcher needs the Mac awake. The clones also inherited the cat-themed personality. I kept it.

## A model for every task, and a backup for every model

All six clones came with my main profile's saved default, Claude Sonnet 5.5. I asked for the chief of staff, the engineer and the researcher to default to Opus 5.5. I also asked the chief to pick a model for each handoff based on the task, unless I name one: Opus for hard reasoning and debugging, Sonnet for normal writing and design, Haiku for simple jobs. Hermes allows that without touching the profile's default:

```bash
hermes kanban create "<title>" --assignee engineer \
  --model claude-opus-5-5 --provider anthropic
```

I asked for tier-matched backups: Opus to GPT-6.1 Sol, Sonnet to GPT-6.1 Terra, Haiku to GPT-6 Luna. The agent smoke-tested ChatGPT models from a staff profile, configured the chains and read them back. That verified access and configuration, not equal quality across models.

<figure>
<img src="/journey/from-subagents-to-an-ai-staff/model-tiers.svg" alt="Table diagram of fallback chains. Opus tier (chief of staff, researcher, engineer, writer): Claude Opus 5.5, then GPT-6.1 Sol, GPT-6.1 Terra, GPT-6 Luna. Sonnet tier (designer, career, tutor, secretary): Claude Sonnet 5.5, then GPT-6.1 Terra, GPT-6.1 Sol, GPT-6 Luna. Haiku tier: chosen per task only, falls back along the assigned profile's chain." loading="lazy" />
<figcaption>Backups are matched by tier, except Haiku, which can only be chosen per task.</figcaption>
</figure>

The agent pointed out a catch I hadn't thought of. A fallback chain belongs to a profile, not to a task, and no profile defaults to Haiku. If the chief gives a Haiku-sized job to the secretary and Claude runs out, the secretary falls back along its own chain to Terra, not Luna. The workaround is that once Claude is exhausted, the chief assigns simple jobs to Luna directly.

## The first real job: a dashboard to watch them

The staff's first real project was a dashboard where I can watch and control them, which I called Mission Control. The chief wrote one shared `BRIEF.md` and filed three tasks: research (data sources, which open-source repos we could legally reuse) on Opus, design on Sonnet, and the build on Opus. The build task had both other tasks as `--parent`, so it waited in todo and started by itself once they were done. The researcher took about 10 minutes, the designer 6 and the engineer 20.

The researcher checked licenses: one pixel-office repo for Hermes had no license, so we couldn't treat its public code as permission to reuse it. The designer drew seven cat characters as SVG without using paid image generation.

## Worker reports are claims, not proof

The engineer reported 58 passing tests and screenshots. The chief reran them. That helped, but fresh-browser tests still missed what broke in my existing tab:

1. **PYTHONPATH leaking into the venv.** The first test run failed. A Hermes session exports its own `PYTHONPATH`, and that broke the imports in the project's virtual environment. The fix was to unset `PYTHONPATH` and `PYTHONHOME` in the app's start script.
2. **A usage meter that said 100% when the real number was 1%.** Anthropic's usage endpoint returns a percentage (6.0 means 6%), but Hermes treats any value of 1 or less as a fraction and multiplies it by 100. So exactly 1% showed as 100%. The worker had tested that the data flowed through, not that the number was right. The dashboard now reads the raw value. The bug was already reported upstream many times, so the agent checked for duplicates and didn't file another.
3. **A stale browser cache.** After an update, every avatar showed both its cat and human versions at once. My open tab had mixed the new page with an old cached stylesheet. The test browser always started fresh, so it never saw the bug. The fix was to add a version hash to every CSS and JS link and serve them with `Cache-Control: no-cache`.
4. **Ports in TIME_WAIT.** After a restart, the app quietly moved from port 7777 to 7778. Its "find a free port" check rejected a port that was only in TIME_WAIT, and the tests then ran against the old process on 7777. The fix was `SO_REUSEADDR` in the port check, plus waiting until the old listener was really gone before testing.

The first dashboard release hadn't been tested through a real Claude quota exhaustion; its fallback warning used a deliberately broken model. Phone-width Chrome checks weren't iPhone Safari tests either.

Each bug became a checklist item in the chief's `personal-staff` skill.

## The writer, and this post

On 18 November I asked for a blog section on my portfolio and a writer to fill it. The chief of staff asked me one question first: how much of my real setup should a public site show? I chose to redact all identifiers but keep the real tools and workflows. It created a `writer` profile on Opus with the same backup chain as the other Opus profiles.

The writer's role also limits the installed writing skill to structure and forbids its promoted CLI. [Part 4](/journey/memory-skills-and-honcho) covers the rejected installation, the second copy's scan result, and why passing a scan wasn't enough.

The chief then wrote one brief for the whole series and filed three writing tasks in parallel, plus an overview task that waits for them through `--parent`. This post is one of those tasks. The writer drafted it from the session logs, and it goes through the chief of staff and me before it's published.

## Lessons

- **Write the contract before you fan out.** The content schema for the course and the `BRIEF.md` for each project did more to keep parallel workers consistent than any instruction in a single prompt.
- **Ask workers to say what they couldn't verify.** The most useful lines in every report were the caveats: figures from memory, pages that blocked automated access, a tool that didn't exist.
- **Check values, not just plumbing.** The workers tested that things ran. The bugs that reached me were wrong numbers, stale caches and the wrong port, and you only catch those by comparing against the source of truth.
- **Subagents for one-off jobs, profiles for recurring roles.** Anything I'll ask for again deserves a profile with memory and skills.

What I'd do differently: set up a web backend that can actually read pages before the first research job, because two rounds of researchers had to work from search snippets. Put cache-busting and port checks into the build brief from day one, so QA doesn't have to find them. And decide on the staff's personality before cloning six of them.

Previous: [Part 7: A project board for agents with Multica](/journey/a-project-board-for-agents-multica). This is the last part. Back to the start: [Part 1: My AI agent journey](/journey/my-ai-agent-journey).
