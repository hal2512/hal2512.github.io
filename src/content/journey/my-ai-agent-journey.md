---
title: My AI agent journey in ten days
summary: Ten days building a local Hermes setup, from phone messages and memory to scheduled jobs and a specialist staff, with the failures left in.
date: 2026-11-18
type: story
order: 1
tags: [Hermes, agents, macOS, automation]
---

On November 9, I opened Hermes Agent on my MacBook Air M4. On November 18, a writer profile was drafting this series from the session logs. In between, I connected my phone, added memory, scheduled jobs, and started handing work to specialist agents. I also spent a surprising amount of time working out which Python a microphone button was using.

I'm a final-year AI student. This was a chance to work with agents beyond a chat window: give one tools, keep useful context between sessions, and see whether it could carry out work I could actually check. I directed the setup and made the account and permission decisions. The agents ran most commands and wrote most of the code, including these drafts. That division of work matters when describing what I built.

This overview assumes you know what an AI model is. The linked tutorials explain the setup; you don't need to read all eight parts in order.

## What the setup became

Hermes Agent, from Nous Research, runs locally on my Mac. The language models don't: requests go to remote providers through my configured accounts. Local faster-whisper handles transcription, cua-driver lets the agent operate Mac apps, and the gateway connects messaging and scheduled work.

I can use a desktop conversation or send a phone message. Profiles give recurring specialists separate roles, skills and histories. Small built-in notes hold facts; skills hold procedures; Honcho adds external recall, with an unresolved cross-channel identity problem. Connected services supply data and actions, each with its own credentials and permissions.

<figure>
<img src="/journey/my-ai-agent-journey/setup-map.svg" alt="Whole-setup map: desktop and phone clients reach Hermes on an awake MacBook. The local backend uses remote model accounts, local computer-use and transcription tools, built-in memory and skills, and external Honcho recall. Scheduled jobs and two distinct boards, Multica and Hermes Kanban, organize work. Connected accounts remain separate permission boundaries." loading="lazy" />
<figcaption>The agent runs on the Mac; models and connected services sit outside it. Arrows show logical relationships, not a network protocol diagram.</figcaption>
</figure>

Multica and Hermes Kanban are different boards. I first used Multica to track tasks and experiment with isolated workers. Later, Hermes Kanban coordinated the permanent staff profiles. Neither board makes a worker's success report proof that its output works.

## November 9–18

These are milestones, not ten clean daily releases. Several fixes took more than one attempt, and the tutorials group related work rather than following strict date order.

| When | What changed | What I had to check |
|---|---|---|
| November 9 | Desktop onboarding, computer use, and early Telegram conversations | macOS permissions and the actual Chrome window |
| November 10 | Photon iMessage, Honcho setup, and initial local transcription tests | A real agent reply, not the starter project's echo |
| November 12–14 | Account integrations, morning-brief scheduling, and microphone debugging | Real API reads and the backend's Python environment |
| November 15 | Multica runtime and worker troubleshooting | The isolated task home, not just an online indicator |
| November 16 | Parallel subagents building an interactive learning site | Shared content contracts, working exercises, and verified reading links |
| November 17 | Research with independent auditors, then permanent staff and a dashboard | Source claims, model configuration, and failures in my existing browser tab |
| November 18 | A writer profile and this series | Public-safe sources and a consistent account of what actually worked |

## The parts

### 2. Getting the Mac ready

[Setting up Hermes on a Mac](/journey/setting-up-hermes-on-a-mac) covers the desktop app, model accounts, computer use and local speech-to-text. The memorable failure was installing faster-whisper successfully into a Python environment the running backend wasn't importing from. Reopening the desktop app didn't restart that backend either.

If you're reproducing the setup, start here. The post separates the supported setup route from my manual source-install repair.

### 3. Texting the agent

[Texting my agent over iMessage and Telegram](/journey/texting-my-agent-imessage-telegram) starts with a wrong turn: we built an echo project before checking Hermes's native Photon command. It also covers sender restrictions, Telegram topics and restart testing.

The sleep test changed my expectations. In my setup, Telegram queued messages while the laptop slept; Photon iMessages sent during that test didn't reach the agent later. A phone interface hadn't moved the agent out of my bag.

### 4. Remembering the right things

[Memory, skills and Honcho](/journey/memory-skills-and-honcho) explains where I put persistent facts, reusable instructions and conversation history. It includes memory-budget failures and a skill installation blocked by the security scanner.

Honcho could connect and recall information. I still couldn't verify that desktop and phone recall consistently used the intended identity. I leave that problem open rather than describe a working connection as a complete memory setup.

### 5. Working without an open chat

[Scheduled agents with cron](/journey/scheduled-agents-with-cron) covers the morning brief and fixed checks that don't need a model. A script can compare inbox or board state and print an alert without asking an LLM to narrate it.

The important separation was scheduling, execution and delivery. A successful manual brief didn't prove tomorrow's scheduled run would start on time, and a poller couldn't guarantee it saw every intermediate board change.

### 6. Connecting real accounts

[Connecting real tools](/journey/connecting-real-tools) follows Google Workspace, Composio, AgentMail and MCP as separate access paths. One Google check passed while the actual calendar operation failed because the CLI used the wrong quota project.

This part also draws a boundary I needed earlier: telling an agent to be read-only doesn't remove write permissions from its token. Authorization needs more care than a well-worded prompt.

### 7. Putting work on a board

[A project board for agents with Multica](/journey/a-project-board-for-agents-multica) distinguishes tracking work from dispatching it. The custom worker looked online but crashed because its wrapper selected a profile inside an isolated home where that profile didn't exist.

Fixing startup wasn't the end. Model authentication and messaging authorization were separate problems. A worker that could answer on the board still couldn't necessarily send the requested phone message.

### 8. From subagents to staff

[From subagents to an AI staff](/journey/from-subagents-to-an-ai-staff) follows parallel course-building and research jobs into seven permanent specialists: researcher, engineer, designer, career, tutor, secretary and writer. My main profile acts as chief of staff, handing work through Hermes Kanban.

Temporary subagents could already load and save skills. Profiles added continuing roles and histories. The dashboard project then supplied less flattering lessons: a wrong usage percentage, stale browser assets and tests pointed at an old process. Those failures were more useful than another clean worker report.

## What worked, and what remains experimental

I got usable desktop computer control, phone replies, local desktop transcription, real account reads and completed multi-agent projects. Skills let later workers reuse procedures. Task dependencies let one phase wait for another without me copying every result between chats.

That isn't an always-on assistant. The Mac still has to be awake. Automatic phone-note transcription needed separate verification from manual Whisper tests. Honcho identity mapping remained unresolved. Configured fallback models and successful smoke tests didn't establish how every task would behave during real quota exhaustion.

I also wouldn't call local execution fully private. Remote models receive prompts; messaging services carry messages; an external memory provider can receive conversation context. I need to choose those data paths deliberately, not infer privacy from the fact that a process runs on my laptop.

## What I'd do differently

I'd check the installed commands before following a tutorial or accepting an agent's claim that an integration doesn't exist. I'd test one harmless end-to-end operation before adding another service. And I'd put the acceptance checks in the brief before splitting work across agents, especially checks for an existing browser session rather than only a fresh test window.

Most of all, I'd keep the evidence attached to the result. A successful import tests one Python. An online runtime tests registration. A completed run tests execution. None of those alone tells me the thing I asked for happened.

Next: [Part 2, setting up Hermes on a Mac](/journey/setting-up-hermes-on-a-mac). All parts: [the journey index](/journey).
