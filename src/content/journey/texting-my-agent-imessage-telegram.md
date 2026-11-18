---
title: Texting my AI agent over iMessage and Telegram
summary: How I connected my phone to Hermes with Photon and Telegram, separated conversations with topics, and learned what happens when the Mac goes to sleep.
date: 2026-11-10
type: tutorial
order: 3
tags: [iMessage, Telegram, Photon, voice notes]
---

The first time I texted the number on my Photon dashboard, it replied with exactly what I'd sent. That was a successful test of Photon. It wasn't a successful test of Hermes. I'd built an echo bot, and the agent initially told me I needed to write a custom bridge to connect it. It was wrong: Hermes already had `hermes photon setup`.

This post is the shorter route I should have taken, plus the sleep test that made me keep Telegram as a second channel.

## What you'll build

A phone interface to the same Hermes install from [Part 2](/journey/setting-up-hermes-on-a-mac): iMessage through Photon, Telegram through its bot integration, and voice notes through local Whisper. The phone is a client; the Mac still does all the work. A delivered message on the phone is not proof that the agent received it.

<figure>
<img src="/journey/texting-my-agent-imessage-telegram/message-flow.svg" alt="Two phone message routes into Hermes on the Mac: iMessage goes through Photon Cloud and the Node sidecar, while Telegram goes through the Telegram Bot API. Both reach the Hermes gateway and the selected agent profile. Voice attachments pass through local speech-to-text before becoming agent input. Replies return along the same route." loading="lazy" />
<figcaption>Two routes into the same local agent. Neither moves the agent off the Mac.</figcaption>
</figure>

## Prerequisites

You need a working Hermes install, internet on the host Mac, an iMessage-capable phone for Photon, and a Telegram account for the other route. Photon setup uses Node/npm for a small sidecar. My Mac had Node and npm but not Bun; Bun was unnecessary for the built-in integration.

I did the initial setup on Hermes 0.23.0. Commands below were also checked against 0.23.1. Setup changes credentials and can restart the gateway, so finish any live task before running it.

## 1. Check the integration before following an old tutorial

Start with:

```bash
hermes photon --help
```

My installed version lists:

```text
setup               First-time setup (device login + project + user + sidecar)
status              Show login + project + sidecar dep state
install-sidecar     Run npm install inside the sidecar directory
```

The tutorial I was watching used a standalone Spectrum starter project. We scaffolded it with npm, fixed its `.env` loading, and confirmed it echoed a text. Then the agent claimed Hermes had no native Photon adapter and proposed an API bridge. Only when I challenged that did it check the CLI and find the existing command.

We stopped and deleted the starter project. The final setup doesn't depend on that project or a separate `npm run start` terminal. Hermes owns the sidecar.

## 2. Run Photon setup and restrict the sender

```bash
hermes photon setup
hermes photon status
```

Follow the setup flow for your Photon account. It supports device login, project creation, registration of your phone and sidecar installation. Mine reused an existing login, so it didn't need another browser approval. Yours may.

Give it your own phone in international E.164 format when prompted. The setup command also accepts `--phone`, but I prefer the prompt rather than putting my number in shell history. Keep credentials in the setup flow, not in a chat message.

On my run, setup created a new Photon project, allowlisted my phone, enabled the Photon platform, installed the Node sidecar, and set the phone conversation as a home channel for scheduled results. The assigned line was different from the echo project's line. Check `hermes photon status` locally to find yours; don't copy the number from a video.

Allowlisting matters because this is an agent with local tools, not a harmless FAQ bot. Don't expose it to arbitrary senders. A shared group or an additional authorized person changes who can ask it to act.

## 3. Complete opt-in, then test a real reply

Text the assigned agent line once from the phone you registered. This activates routing. My first message was the opt-in, not a conversation turn, so it didn't get a normal answer.

Check status again:

```bash
hermes photon status
hermes gateway status
```

What you want is an opted-in phone route and a running gateway. Once setup has finished and the gateway is connected, send a fresh, harmless question, such as asking what tools are available. A contextual reply proves more than an echo.

My first two tests went out before Photon reconnected. Nothing arrived. A later message, sent after connection, reached the gateway and received a reply. The apparent delivery failure was a timing error. I now test *after* the restart finishes rather than rereading old bubbles and expecting them to turn into new requests.

Avoid sharing raw status output: it may include your line, project identifiers or phone number. The useful public evidence is that routing and reply worked, not the identifiers.

## 4. Add Telegram as a second route

Telegram was already connected by the time I tested Photon, so I can't reconstruct its initial onboarding from that session. For a new install, the [official Telegram guide](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram) offers a desktop route: open Messaging → Telegram → Create with QR, then scan or open it in Telegram. Hermes creates the bot, detects your user, saves `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ALLOWED_USERS`, and restarts the gateway.

The documented manual alternative is to create a bot through Telegram's official BotFather with `/newbot`, then configure messaging:

```bash
hermes gateway setup
```

Select Telegram and follow the prompts. Put the token into the local setup form, never into your conversation with the agent. Restrict the allowed user list to people you actually want using the agent.

Open the bot on your phone and start a direct conversation. Test one harmless request before adding a group. If a group message doesn't reach the agent, distinguish two questions:

- Did Telegram deliver it? Bot privacy mode controls which group messages the bot sees. With privacy on, commands, mentions and replies are the safer tests. Disabling privacy exposes more group conversation to the bot.
- Did Hermes authorize the sender and dispatch it? The Hermes allowlist and group-response settings are a separate layer.

The guide explains the admin-bot alternative to changing privacy mode. Don't grant broad group permissions without deciding whether the bot should see everyone's messages.

### Topics are separate conversations, not new agents

I used forum topics to keep a course, general learning and quick captures apart. In the first Telegram group, the agent created three topics through Telegram's Bot API and chose icons from Telegram's built-in topic icon set. Each topic kept its own thread of conversation.

A later attempt in another group failed with:

```text
Bad Request: the chat is not a forum
```

The agent checked the group and its permissions. Topics weren't enabled, and the bot's `can_manage_topics` permission was false. The fix needed me: enable Topics in the group's settings, then give the bot Manage Topics rights if I wanted it to create them. You can also create topics yourself in Telegram without giving the bot that ability.

Topics use the platform's supported icons, not arbitrary profile pictures. I originally asked for topic "profile pics," which was the wrong mental model.

After setup, send a message inside each topic and check the reply stays there. My history also contains a `message thread not found` error from a send aimed at a thread that wasn't usable. A connected bot does not prove a particular topic destination is valid.

### Check which profile answers

Later, I had separate Telegram bots for the default and personal profiles. The agent initially reasoned from the gateway process and said my personal bot was using the default profile. It was wrong again. Checking the profile environment and logs showed a different token and a Telegram connection explicitly labeled for the personal profile.

The name and avatar of a bot don't tell you which agent configuration it uses. Conversation history stays separate by chat/topic, while tools, skills and built-in memory come from the handling profile. If a phone chat seems to have forgotten a workflow from desktop, verify that profile before changing memory settings.

## 5. Add voice notes, then test automatic transcription

Phone voice notes use Hermes's configured speech-to-text provider. I chose local faster-whisper with the `small` model. The install and Python-environment failure are covered in [Part 2](/journey/setting-up-hermes-on-a-mac).

The model setting in Part 2 doesn't install faster-whisper or make it visible to the running backend. My manual transcription test succeeded, but new phone notes still arrived with "could not be transcribed automatically." The agent then transcribed them by explicitly calling Python. Useful, but not the same thing as a working automatic pipeline.

Test a fresh short voice note after installation and restart. If the agent has to launch Python manually, keep debugging. Check its backend environment and STT availability rather than declaring success from one command-line transcription. Later desktop microphone testing confirmed that the backend needed the package in its own venv.

Local STT means the transcription model runs on the Mac. It doesn't make the whole interaction private: the messaging service carries the attachment, and the resulting text still goes to your configured language model and any active memory provider.

## 6. Test sleep before relying on delivery

I closed the laptop and sent messages. Telegram queued them; my Photon iMessages did not reach the agent later. That is what happened in my setup, not a universal claim about every Photon deployment.

<figure>
<img src="/journey/texting-my-agent-imessage-telegram/sleep-test.svg" alt="Sleep-test comparison: while the Mac sleeps, neither Telegram nor Photon can get an agent reply. After wake, Telegram can deliver queued updates, while iMessages sent during Hal's Photon offline test did not reach the agent later and had to be resent." loading="lazy" />
<figcaption>My sleep test changed which channel I trusted for requests that could wait.</figcaption>
</figure>

The [Telegram docs](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram#cold-boot-pending-queue-optional) say Bot API updates wait for up to 24 hours and Hermes preserves that backlog by default. That isn't indefinite storage, and settings can change it. It is still a better fallback for my laptop than assuming an iMessage will be replayed.

My gateway ran manually, not as a launchd service. Starting automatically after reboot would not solve sleep: no local agent runs while its host is suspended. For a temporary awake session on power, macOS provides:

```bash
caffeinate -s
```

Keep that terminal running for the assertion to remain active. It is not a workaround for closing the lid without a supported clamshell setup. I kept the laptop open and plugged in when I needed it reachable. An always-on host would be the longer-term solution; I hadn't moved to one.

## 7. Restart from outside the active conversation

Both memory changes and STT troubleshooting required a gateway restart. From inside a live chat, Hermes refused:

```text
Refusing to restart the gateway: 1 live session(s) would be interrupted.
```

That session was the one asking for the restart. The desktop app and messaging adapters shared the backend. A deliberate `--yes` restart cut the turn off and told me to send a new message once it was back.

The less confusing routine is to finish the task, then run this yourself in Terminal:

```bash
hermes gateway restart
hermes gateway status
```

If live work blocks the restart, let it finish. Only use `hermes gateway restart --yes` when you intend to interrupt those sessions. Once the gateway is ready, send a fresh phone message to verify the full path. Don't ask an agent to restart itself and then expect the same turn to confirm its own recovery.

## What I'd do differently

I'd check `--help` before building the tutorial's starter project. I'd separate opt-in, gateway connection and real reply into three checks. And I'd do the sleep test on day one: a phone interface feels remote, but my agent was still just a process on the laptop in my bag.

Next: [Part 4, memory, skills and Honcho](/journey/memory-skills-and-honcho). Previous: [Part 2, setting up Hermes on a Mac](/journey/setting-up-hermes-on-a-mac).
