---
title: Setting up Hermes Agent on a MacBook Air M4
summary: Installing Hermes, connecting my model accounts, enabling computer use, and fixing a microphone failure caused by installing into the wrong Python.
date: 2026-11-09
type: tutorial
order: 2
tags: [Hermes, macOS, computer use, faster-whisper]
---

On 9 November I opened the Hermes desktop app for the first time. By the end of that week the agent could see and click around my Mac, run on my existing Claude and ChatGPT subscriptions, and understand my voice. Most of that worked on the first try. Speech-to-text did not, and the fix was a good lesson in asking "which Python is actually running this?"

This post covers the base layer of the setup. The messaging, memory and scheduling parts come later in the series.

<figure>
<img src="/journey/setting-up-hermes-on-a-mac/setup-map.svg" alt="Diagram of the base setup: the Hermes desktop app talks to a local backend on the Mac. The backend reaches Claude through an Anthropic OAuth login and GPT through an OpenAI Codex login, drives macOS apps through cua-driver, transcribes audio with faster-whisper, and stores everything in the ~/.hermes folder." loading="lazy" />
<figcaption>The base layer: one backend on the Mac, two model accounts, computer use, and local speech-to-text.</figcaption>
</figure>

## What you'll build

A Hermes Agent install on an Apple Silicon Mac that:

- uses two model providers I was already signed in to (Anthropic and OpenAI), so the language models run remotely,
- can see and operate other apps through computer use (cua-driver),
- transcribes voice input locally with faster-whisper.

I made the decisions and clicked the macOS permission dialogs. The agent ran most commands. Output below has private paths and identifiers removed.

## Prerequisites

- An Apple Silicon Mac. The macOS installer is Apple Silicon only, according to the [install docs](https://hermes-agent.nousresearch.com/docs/getting-started/installation). Mine is a MacBook Air M4 with 16 GB.
- An account for at least one model provider. I used Anthropic (Claude Pro) and OpenAI (ChatGPT Plus).
- Space for the faster-whisper package, its dependencies and a model download.
- Hermes v0.23.x. I started on Hermes 0.23.0 and checked the commands against 0.23.1.

## Step 1: Install Hermes

The docs give two routes: download the desktop package (DMG, then copy `Hermes.app` to Applications), or do a command-line install and add the desktop app afterward:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes desktop   # optional: install and run the desktop app after a CLI install
```

Check what you ended up with:

```bash
hermes --version
```

Mine prints:

```text
Hermes Agent v0.23.1 (2026.9.24) · stable · local ...
Install directory: ~/.hermes/hermes-agent
Install method: git
```

Hermes keeps its main state under `~/.hermes`: config, `.env` secrets, memory, skills, sessions and logs. My source install also keeps pinned tools there, including Python, Node, ffmpeg and cua-driver. Step 4 depends on finding the right Python environment.

The desktop app's first run is a short onboarding chat: your name, an accent color, a layout, and an offer to look at your installed apps. I said yes to the last one. It listed my developer tools and a few apps, and when I asked "how much do you know about me?" it gave exactly that and said it hadn't opened any files or messages. That was the right answer.

## Step 2: Connect your model accounts

Pick a provider and default model interactively:

```bash
hermes model
```

This is also where you sign in. I signed in with my Anthropic account and my ChatGPT account, both through OAuth, so no API keys were involved. To see what Hermes holds afterward:

```bash
hermes auth list
```

On my Mac (IDs trimmed):

```text
anthropic (2 credentials):
  #1  anthropic-oauth-1    oauth   ... hermes_pkce ←
  #2  claude_code          oauth   ... claude_code

openai-codex (1 credentials):
  #1  device_code          oauth   ... device_code ←
```

The second Anthropic entry was picked up from Claude Code, which I had installed separately.

Two things I learned here.

**Don't ask the model which model it is.** My first real question was "what model are you using?" and the agent said Claude Sonnet 5. Later it "corrected" itself to Opus 5.5, then corrected that back to `claude-sonnet-5-5` after reading its session info. Its self-report wasn't reliable in that exchange. Check the config instead:

```bash
hermes profile list   # shows the configured model per profile
```

**Check which meter is moving.** Hermes's own docs and Anthropic's terms made me unsure whether a Pro subscription would even cover agent traffic, so I watched claude.ai's usage page. The regular 5-hour and weekly meters went up when I ran Hermes tasks. That suggests the requests counted against my plan limits, but I didn't isolate the credential serving each request. It's an observation, not a billing or policy guarantee. Anthropic's [legal and compliance page](https://code.claude.com/docs/en/legal-and-compliance) has rules about third-party tools and subscription credentials, so read it yourself before you depend on this.

### Profiles, briefly

A profile is a separate agent with its own config, memory, skills and scheduled jobs. You start on `default`. Later I added more (one per "staff" role, covered in part 8). Creating one from an existing profile looks like this:

```bash
hermes profile create demo --clone-from default --no-alias
```

Later, `hermes gateway status` warned that several of my profiles held the same Photon credential. One platform token can serve only one gateway. I don't know exactly when those copies were made. Current `profile create --help` says normal cloning leaves messaging channels behind; `--clone-channels` explicitly includes them. Don't assume copying an agent's files creates an independent messaging connection.

## Step 3: Let the agent use your Mac

Hermes drives other apps through [cua-driver](https://github.com/trycua/cua), which the installer sets up by default. It needs two macOS permissions: Accessibility and Screen Recording. Check the state with:

```bash
hermes computer-use doctor
```

My first run said `degraded`:

```text
⚠️ cua-driver cua-driver 0.21.0 on darwin — degraded
  ✅ binary_version: cua-driver 0.21.0
  ✅ bundle_identity: Bundle is com.trycua.driver.
  ❌ tcc_accessibility: Accessibility is NOT granted for this process.
  ❌ tcc_screen_recording: Screen Recording is NOT granted for this process.
```

The doctor output points to the grant command:

```bash
hermes computer-use permissions grant
```

That opens the macOS prompts for CuaDriver.app. Accessibility went through. Screen Recording was the annoying one: CuaDriver wasn't listed under System Settings → Privacy & Security → Screen Recording at all, so there was nothing to switch on. macOS only adds an app to that list after the app has tried to capture the screen. The agent made one capture attempt, CuaDriver appeared in the list, I switched it on, and the doctor went green:

```text
✅ cua-driver cua-driver 0.21.0 on darwin — ok
  ✅ tcc_accessibility: Accessibility is granted.
  ✅ tcc_screen_recording: Screen Recording is granted.
  ✅ ax_capability: AX is trusted and reachable.
```

If System Settings shows CuaDriver as on but the doctor still says it isn't granted, the doctor's own hint is to reset the stale grant (`tccutil reset ScreenCapture com.trycua.driver` or `tccutil reset Accessibility com.trycua.driver`) and grant again.

### The Chrome pitfall

cua-driver captures one window at a time. There is no "whole screen" capture. The first time I asked the agent to look at my Chrome tab, it reported that Chrome was running but it couldn't see any window. Capturing by app name alone also gave it only a strip of the menu bar.

The agent's tool calls are `list_windows` followed by `capture`. These are tool-call templates, not terminal commands; replace the angle-bracket values with numbers returned by `list_windows`:

```json
{"action": "list_windows", "app": "Google Chrome"}
```

The result had nine windows. Several belonged to Chrome, most with empty titles, and one had the title of the page I wanted:

```text
{"app_name": "Google Chrome", "pid": <pid>, "window_id": <window-id>, "title": "Photon — Dashboard"}
```

Then:

```text
{"action": "capture", "mode": "som", "pid": <pid>, "window_id": <window-id>}
```

After that it could read the page and click through it. If the agent tells you it can't see an app that is clearly open, ask it to list windows and pick one by ID.

## Step 4: Local speech-to-text (and the microphone that didn't work)

Hermes can transcribe voice locally with faster-whisper, with no API key. On my machine it was missing, and getting it working took three attempts over five days.

For a new setup, start with `hermes tools` and the current [voice setup instructions](https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode). The manual repair below was for my **source install**, not a signed app bundle or system Python. I haven't tested a clean install through the supported voice setup path.

**Attempt 1 (10 Nov).** A voice note I sent from my phone came in as "could not be transcribed automatically". The agent found no STT provider, installed faster-whisper into Hermes's bundled Python, and tested it on my voice note. The first test crashed:

```text
TypeError: open() got an unexpected keyword argument 'metadata_errors'
```

The newest `av` release (the audio library faster-whisper uses) didn't match. Downgrading with `av<17` fixed that. These were the versions that worked in the manual test:

```bash
~/.hermes/tools/python-3.14*/bin/python3 -m pip install faster-whisper==1.2.1 av==16.1.0
```

Keep that path in mind. The agent could call faster-whisper from this Python by hand, but it turned out not to be the Python the Hermes backend runs on. That's what attempt 3 is about.

The agent also wanted to switch the model from `base` to `small`, but it isn't allowed to edit `config.yaml` directly ("Agent cannot modify security-sensitive configuration"). The supported way is the CLI:

```bash
hermes config set stt.local.model small
```

The small model returned usable English text (language `en`, probability 0.93).

**Attempt 2 (13 Nov).** Voice notes failed again. The model files were still cached, but the Python package wasn't importable there. An update was one possible explanation; we didn't prove what removed or changed it. The agent reinstalled it.

**Attempt 3 (14 Nov).** The microphone button in the desktop app didn't work. The log had the real error:

```bash
grep -n -E "transcri|STT" ~/.hermes/logs/desktop.log | tail -4
```

```text
[hermes:api POST /api/audio/transcribe] Error: 400: {"detail":"No STT provider available. Install faster-whisper for free local transcription, ..."}
```

The agent reinstalled faster-whisper into the same bundled Python and asked me to restart the app. I quit and reopened it. Same error.

Two separate things were wrong.

1. **Quitting the app didn't restart the backend.** The backend process had been running since before the install, and the app simply reconnected to it. `ps` showed the same process and start time as before.
2. **The package was going into the wrong Python.** The bundled Python under `~/.hermes/tools/` is not the environment the backend imports from. The agent found this by reading the running process's environment:

```bash
ps aux | grep hermes_cli.main | grep -v grep
printf 'Backend PID from the listing: '
read -r BACKEND_PID
ps eww -p "$BACKEND_PID" | tr ' ' '\n' | grep -E '^(PYTHONPATH|VIRTUAL_ENV)='
```

`PYTHONPATH` pointed at a separate virtual environment under `~/.hermes/installs/`. The agent installed there with Hermes's bundled `uv`. For the same versions, use the actual **absolute venv path from your process**, not the redacted path from this article:

```bash
printf 'Backend venv directory (absolute path): '
read -r V
for candidate in "$HOME"/.hermes/tools/uv-*/uv; do
  if [ -x "$candidate" ]; then UV="$candidate"; fi
done
"$UV" pip install --python "$V/bin/python3" faster-whisper==1.2.1 av==16.1.0
"$V/bin/python3" -c "import faster_whisper, av; print(faster_whisper.__version__, av.__version__)"
```

```text
1.2.1 16.1.0
```

After a real backend restart (the agent ended the old process and the app started a fresh one), the microphone worked. The first transcription is slower because it loads the model.

<figure>
<img src="/journey/setting-up-hermes-on-a-mac/which-python.svg" alt="Diagram of three Python environments on the Mac: the system python3, Hermes's bundled Python under ~/.hermes/tools, and the backend's virtual environment under ~/.hermes/installs. The first two installs of faster-whisper went into the bundled Python and failed. Only the install into the backend's venv, followed by a backend restart, fixed the microphone." loading="lazy" />
<figcaption>Three Pythons on one Mac. Only the one the running backend imports from counts.</figcaption>
</figure>

Manual changes to Hermes-managed environments may not survive updates. If voice breaks again, check the backend import rather than assuming the package is still available.

## What you should see

- `hermes computer-use doctor` reports `ok` with both permissions granted.
- `hermes auth list` shows at least one credential with a `←` marking the active one.
- `hermes profile list` shows the model you expect.
- Recording a voice message in the desktop app gives you text, and `desktop.log` has no "No STT provider available" line.

## Pitfalls I hit

- The Screen Recording toggle only appeared after a capture request.
- Chrome needed a specific window, not an app-name capture.
- Quitting the desktop app didn't stop the backend. Check its start time.
- A successful Python import only tests that environment, not the running agent's.

## What I'd do differently

I'd use the error log to check the backend's actual environment before installing anything. We saw "No STT provider available" early, but still installed into the wrong Python. I'd also compare process start times before and after restarting: reopening the app was not enough.

Next up: [Part 3, texting my agent over iMessage and Telegram](/journey/texting-my-agent-imessage-telegram). Previous: [Part 1, the overview](/journey/my-ai-agent-journey).
