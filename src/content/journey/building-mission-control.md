---
title: Building Mission Control, a dashboard for my AI staff
summary: How my agent staff built a local dashboard to watch and control them, with a pixel office, cat and human modes, and the bugs it exposed.
date: 2026-11-17
type: story
order: 9
tags: [Mission Control, FastAPI, SSE, Kanban, Pixel art]
---

**TL;DR:** I wanted to see what my background agents were doing without reading terminal output, so three of them built me a dashboard. It reads Hermes's own files read-only, streams a fresh snapshot to the browser, and sends every change through the `hermes kanban` CLI. The next day it got a pixel office, a cat/human toggle and an eighth character. Its fallback badge had only been tested with a fake failure until Claude hit a real rate limit that afternoon.

As in the rest of this series, I made the decisions and the agents did the typing. This post assumes you've read [Part 8](/journey/from-subagents-to-an-ai-staff) or know what a Hermes profile and the Kanban board are.

## Why I wanted it

By the evening of November 17 I had six staff profiles and a chief of staff (my main profile, which still talks to me as a cat called Neko-chan). Work happened in the background. When the chief handed something off, it started a shell loop that ran `hermes kanban list` every 60 seconds and grepped for "blocked" or "done". That was my view of the team: a notification when the loop exited.

Earlier that day I'd told the chief that Multica was better for visualization, and that what I actually wanted was some cute animation: when it split a job across four agents, I wanted to open a page and see four of them working. I sent two references, a screenshot of a pixel office and a screen recording of a J.A.R.V.I.S.-style "Mission Control" dashboard for Hermes from a YouTube short.

The chief asked me five questions. My answers: Mission Control first and the pixel office later, a browser tab on the Mac for now and the iPhone later, controls as well as viewing, voice later, and a cat office mascot. I also took every extra it suggested: the model each agent is using, a ⚠ when one falls back to ChatGPT, my remaining Claude usage, an alert when a task is blocked on me, task columns, and a way to give an agent a task from the page.

## The staff build it

This was the staff's first real project. The chief wrote one shared `BRIEF.md` with the roster, the models and fallback chains, the must-have features and the constraints: bind to 127.0.0.1 only, live updates without refreshing, a Python backend I can read, and no code copied from repos without a permissive license.

Then it filed three Kanban tasks. The researcher (Opus) worked out where every piece of live data could come from. The designer (Sonnet) made the look, a clickable mockup and the cats. The engineer's task (Opus) listed both as parents, so it sat in todo until they were done and then started without anyone touching it. The researcher took about 10 minutes, the designer 6 and the engineer 20.

The research report is what made the build quick. It mapped each feature to a source and marked what it had verified live: task state from `~/.hermes/kanban.db`, the session behind each worker run from an `owner_admitted` event, the current tool call from the worker's session database. It also checked licenses. One pixel-office repo for Hermes had no license, so we treated it as off limits. The designer drew seven SVG cats in Python, with no paid image generation.

## How it works

<figure>
<img src="/journey/building-mission-control/architecture.svg" alt="Architecture diagram. A browser page with the Mission Control view, the Pixel Office canvas and a localStorage-only mode toggle talks to a FastAPI server bound to 127.0.0.1:7777. The server's Hub rebuilds a snapshot every 1.5 seconds and streams it over SSE. snapshot.py and usage.py read kanban.db, each profile's state.db, config.yaml, agent.log and the Anthropic usage endpoint read-only. cli.py sends every write through hermes kanban, and the gateway dispatcher starts the staff worker runs, whose sessions feed the next snapshot." loading="lazy" />
<figcaption>The dashboard never writes to Hermes's databases. It reads them, and every change goes through the CLI.</figcaption>
</figure>

The backend is FastAPI and the frontend is plain HTML, CSS and JavaScript, about 3,000 lines in total. A background thread rebuilds a snapshot every 1.5 seconds and pushes it over server-sent events, but only when the data has changed.

Most of the work is in turning database rows into "what is this agent doing right now":

- **Working, blocked, done or idle.** A running task means working. A blocked task means it needs me. "Done" lasts an hour, which is a UI choice, not anything Hermes tracks.
- **Current tool.** The newest tool call in the worker's session that has no result yet. Arguments are shortened and secrets redacted.
- **Model and fallback.** The model that actually answered comes from the session's usage table, and the expected model from the task or the profile config. If they differ, the card gets a ⚠. Fallback lines from `agent.log` go into the feed.
- **Claude usage.** The usage endpoint rate-limits after a few calls, so the server polls it at most every 10 minutes, caches the result with its fetch time and labels it "real" or "last known". It never fills in a number.

Every control (create, comment, answer and unblock, reassign, stop, archive) runs `hermes kanban <verb>` as a subprocess with an argument list and no shell. The server strips `HERMES_*` variables first, so a worker's environment can't leak into those calls, and POST requests need a custom header.

<figure>
<img src="/journey/building-mission-control/mission-control-home.webp" alt="Mission Control dashboard in dark cat mode at 1440 pixels wide. An org chart runs from Hal to the Neko-chan orb to eight staff cats. Below it are agent cards: seven idle, and the writer working on 'Journey blog: Part 9 Building Mission Control' with its current terminal command shown. The right column shows Claude usage at 48% of the session used, tokens today per agent, a last-fallback note and a live activity feed." loading="lazy" />
<figcaption>The live dashboard while the writer drafted this post. Task IDs are masked; the working card is this post's own task.</figcaption>
</figure>

## Phase 2: the pixel office

Around midday on November 18 I asked for two things. Clicking the logo should switch every character between a cat and a human, and the pixel office should come in both versions. The chief wrote a second brief, the designer went first, and the engineer's task waited on it again. The designer took 14 minutes and the engineer 18.

All the art is generated in code: 14 sprite sheets (seven cats and seven humans), tiles and furniture, drawn with Python and Pillow, still with no paid image generation. The office needed no new backend data and runs on the same snapshot stream.

<figure>
<img src="/journey/building-mission-control/pixel-office-cat.webp" alt="Pixel Office in cat mode. A top-down pixel office with a kitchen, a lounge with a couch and red rug, six empty desks, Neko-chan's private office and a smaller room. Idle cats with model badges stand in the kitchen and lounge, and the writer cat sits at its desk in the lower-right room under a terminal activity label." loading="lazy" />
<figcaption>Idle agents wander to the kitchen and couch; the writer is at its desk because it is working.</figcaption>
</figure>

The characters follow real state. A working agent walks to its desk, sits down and types, its monitor lights up, and a label shows the current tool. A blocked agent stands next to its desk with a yellow "?", and clicking it opens the same reply box as the dashboard banner. A finished agent celebrates with a ✓ for a few seconds. Idle agents wander between the coffee machine, the fridge, the couch and the windows. That wandering is random and doesn't mean anything.

Walking uses breadth-first search on a grid of walkable tiles. Node tests check that every agent can get from every idle spot to its chair and back without walking through furniture. The canvas is 384×256 pixels and scales by whole numbers (3× at 1440 pixels wide) so the pixels stay sharp.

For a live test the engineer gave the secretary a real task on Haiku: "Reply with exactly: ok. Do not use any tools." The log shows the secretary marked working 23 seconds after the task was created, seated and typing at 29.5 seconds, done at 37, and walking back to the break area at 41. That cost a few Haiku tokens, and it showed the whole loop works on a real worker.

<figure>
<img src="/journey/building-mission-control/pixel-office-human.webp" alt="The same Pixel Office in human mode. Each cat is replaced by a matching human character with the same colors and role accessories, and an orange office cat wanders near the desks. The writer sits at its desk in the lower-right room." loading="lazy" />
<figcaption>Human mode. The choice is stored in the browser, and an office cat appears only in this mode.</figcaption>
</figure>

## Adding the writer

On the afternoon of November 18 the chief created an eighth profile, the writer that drafts this series. I asked it to put the writer on the dashboard too, and that showed how many places the roster lived. The chief did it itself instead of handing it to the engineer:

1. One new line in the roster in `config.py`, and the name added to the office script.
2. The writer added to each design script (cat SVG, human SVG, sprite sheet, office layout), then everything regenerated and copied into the app. Its desk went where the meeting table used to be.
3. A new test asserting the writer is in the live roster. It failed first, as intended. Then two older tests failed because they assumed exactly seven agents.
4. A backend restart. The roster is imported once at startup, so new static files alone don't add an agent. The chief stopped the old process, waited until port 7777 was free, then started the new one.

The commit touched 25 files. Afterwards the chief checked the roster and snapshot endpoints, a desktop screenshot in cat mode and a 390-pixel phone layout in human mode. Late that night a separate screenshot test, which still expected seven characters, failed as well. It now reads the count from the live roster.

## Bugs, and the badge that proved itself

[Part 8](/journey/from-subagents-to-an-ai-staff) covers the first four bugs: `PYTHONPATH` leaking into the venv, a usage meter showing 100% when the real figure was 1%, a stale cached stylesheet that showed cats and humans at the same time, and a restart that moved the app to port 7778 while the tests kept hitting the old process. Here are the newer ones.

**The fallback badge got its first real test.** Until then, the ⚠ badge had only been tested with a deliberately broken model name and, in the office, a staged screenshot. On November 18 at 14:14, three writer tasks were running in parallel and Anthropic started returning rate-limit errors. All three switched from Claude Opus to GPT-6.1 Sol within seconds, and the dashboard feed logged each switch. The chief fell back the same way later that afternoon. When it checked the dashboard after adding the writer, its own card showed an orange "⚠ gpt-6.1-sol · fallback".

**A reply always unblocks.** That night I tried asking for a dark-mode toggle as a dashboard task with only a title. Neko-chan blocked it within a minute and asked which project I meant. I typed "Cancel the current task." into the reply box. Replying is a comment plus an unblock, so the worker started again before the task was stopped and archived. The reply box can't cancel anything. I asked again in my chat with Neko-chan, and the light theme was committed at 23:31.

**"Working" is a guess for chat sessions.** Workers have a running task, so their state is exact. The chief usually works inside my chat, so the dashboard calls it working if the session has a message in the last two minutes or a tool call in flight. Its "thinking…" text comes from a field Hermes updates roughly once a minute.

**Short runs barely sit down.** The secretary's test run took about 14 seconds, and it spent about 7 of them seated. A very quick task can finish before the character reaches its desk.

## Known gaps

- It only listens on localhost. Optional token auth exists, but there's no HTTPS or remote access yet.
- It's only been tested in headless Chrome, including a 390-pixel iPhone emulation. It hasn't been opened on a real iPhone or in Safari.
- If the gateway isn't running, nothing moves, and the dashboard doesn't show gateway status yet. The Mac also has to be awake.
- The engineer covered stop and reassign with unit tests on the exact commands instead of a live run, because a live run would kill a real job.
- An agent with several open tasks shows only the first one.
- Seated characters are drawn from behind, and the idle wandering is decoration.

The next part is about getting this off the laptop: [Part 10, using the dashboard from my phone](/journey/using-the-dashboard-from-my-phone), is coming soon.

## What I'd do differently

I'd put the roster in one data file that the backend, the art scripts and the tests all read. Adding one agent shouldn't touch 25 files and need a restart.

I'd also design the reply box with a real cancel option. Right now every reply restarts the worker, and I found that out by trying to cancel something.

And I'd decide up front how to check features that only matter when something real goes wrong. The fallback badge worked, but for most of a day the only evidence was a broken model name and a staged screenshot. One line in the brief, "watch the feed the first time Claude runs out", would have made the first real failure a planned check.

Previous: [Part 8: From subagents to an AI staff](/journey/from-subagents-to-an-ai-staff). Next: [Part 10: Using the dashboard from my phone](/journey/using-the-dashboard-from-my-phone) (coming soon). Back to the start: [Part 1: My AI agent journey](/journey/my-ai-agent-journey).
