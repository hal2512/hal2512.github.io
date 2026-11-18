---
title: Connecting my agent to real tools without handing it everything
summary: Connecting Google Workspace, Composio, AgentMail, and MCP meant checking credentials and permissions for each access path.
date: 2026-11-12
type: tutorial
order: 6
tags: [Google Workspace, OAuth, Composio, AgentMail, MCP]
---

A model that can explain my calendar is less useful than an agent that can actually read it. Giving it that access also changes the risk: a bad answer can become a sent email or an edited event.

I connected Google Workspace, installed Composio, and gave the agent a separate AgentMail inbox. These were different access paths, not one universal “connect my apps” switch. I handled account consent and credentials; the agent installed tools, ran checks, and diagnosed errors.

This post assumes you're comfortable with Terminal and have Hermes running. The aim is one verified read operation before enabling any automation. The examples use my `personal-profile` name; use your own profile consistently.

<figure>
<img src="/journey/connecting-real-tools/access-paths.svg" alt="Hermes reaches Google through a local CLI and OAuth token, other connected apps through Composio, a separate inbox through the AgentMail API, and tool servers through MCP. An approval boundary separates reading from external writes." loading="lazy" />
<figcaption>Each access path needs its own authentication, scope check, and real operation test.</figcaption>
</figure>

## Prerequisites

My setup used Hermes 0.23.0, `gws` 0.22.5, and Composio CLI 0.6.0. I checked the Hermes command syntax again on 0.23.1. You'll need Homebrew for the Google install shown here, a Google account, and permission to create an OAuth client in Google Cloud.

For AgentMail, I already had an account and inbox. This is not an account-creation walkthrough. Keep keys in local credential storage, never in prompts or public issue descriptions.

## 1. Choose the profile before storing credentials

```bash
hermes profile list
```

The default Hermes home is `~/.hermes`; my named profile uses `~/.hermes/profiles/personal-profile`. An API key saved in one isn't automatically available to every shell or worker on the Mac.

For manual commands in this tutorial, select the home explicitly:

```bash
export HERMES_HOME="$HOME/.hermes/profiles/personal-profile"
```

To edit that profile's secret file on macOS:

```bash
open -e "$HERMES_HOME/.env"
```

Use plain text and preserve existing entries. `cat` prints a file; it isn't an editor. That distinction mattered when I was learning this setup, because printing the file would have exposed all the other credentials too.

A `.env` file is still a plaintext secret file, not a vault. Don't commit it, paste it into chat, or ask an agent to show its contents. OAuth tokens may live in separate credential files rather than `.env`.

## 2. Install the Google CLI, then authorize your own client

```bash
brew install googleworkspace-cli
gws --version
```

My output was `gws 0.22.5`, followed by a notice that it isn't an officially supported Google product. Installation only proved the executable worked. It hadn't authorized my account.

I used Hermes's `google-workspace` skill to manage OAuth and its wrapper to call `gws`. In Google Cloud Console, I had to:

1. Create or select a project and enable the APIs I intended to use.
2. Configure the consent screen before creating the OAuth client.
3. Choose **Desktop app** as the client type.
4. Add my own account as a test user while the app was in Testing.
5. Download the client JSON locally.

For my wider setup, the enabled services included Gmail, Calendar, Drive, Sheets, Docs, and People. A morning brief doesn't require all of those. Decide the minimum scope before approving the consent screen.

The installed skill contains `scripts/setup.py`. Inspect its actual flags first, using Python from the Hermes environment:

```bash
GWS_SCRIPTS="$HERMES_HOME/skills/productivity/google-workspace/scripts"
python "$GWS_SCRIPTS/setup.py" --help
python "$GWS_SCRIPTS/setup.py" --check
```

An unauthenticated profile reports `NOT_AUTHENTICATED`. Register your downloaded file, replacing this example filename:

```bash
python "$GWS_SCRIPTS/setup.py" \
  --client-secret "$HOME/Downloads/google-client.json"
python "$GWS_SCRIPTS/setup.py" --auth-url
```

In my installed version, the URL flow requested a fixed, broad set of scopes. The skill's instructions suggested `--services` and `--format`, but the script rejected both as unrecognized arguments. I used plain `--auth-url` instead. Don't copy newer flags into an older helper and assume the permissions narrowed successfully.

After consent, this particular helper redirected to `localhost:1`, where the browser couldn't connect. That was expected for its manual exchange flow, not proof that consent had failed. Complete the exchange locally rather than sending the redirect, which contains an authorization code, into chat:

```bash
read -r -s -p 'Paste the complete OAuth redirect URL locally: ' GOOGLE_REDIRECT
printf '\n'
python "$GWS_SCRIPTS/setup.py" --auth-code "$GOOGLE_REDIRECT"
unset GOOGLE_REDIRECT
python "$GWS_SCRIPTS/setup.py" --check
python "$GWS_SCRIPTS/setup.py" --check-live
```

That input command is for Bash. The variable avoids putting the code literally in shell history; the helper still receives it as a process argument, so use this only in your own local session. Don't log the command with shell tracing.

My checks reported `AUTHENTICATED` and `LIVE_CHECK_OK`. For an external app in Testing that requests these scopes, refresh-token expiry can require another authorization later. A working login isn't a promise of permanent access.

## 3. Test the operation you'll actually schedule

I thought the live check meant I was finished. Then listing my calendar failed with a Google project-permission error.

```bash
python "$GWS_SCRIPTS/google_api.py" calendar list
python "$GWS_SCRIPTS/google_api.py" gmail search 'is:unread' --max 5
```

These return real event and mail data, so keep their output private. The useful success condition is a valid response from the intended account, even if it contains no items.

In my case, direct Google API calls with the token succeeded, while the `gws` path failed with `serviceusage.services.use`. That narrowed the problem: the account token worked, but the CLI was using the wrong quota project. The recorded fix was an explicit project override:

```bash
export GOOGLE_WORKSPACE_PROJECT_ID='<your-google-cloud-project-number>'
python "$GWS_SCRIPTS/google_api.py" calendar list
```

With my actual project number, calendar and mail reads worked. I didn't need to grant access to the unrelated project named in the error.

The original diagnosis attributed it to older Google Cloud credentials on the Mac. The stronger evidence was the comparison between successful direct calls, failed CLI calls, and success after the override. Separately, the default-profile morning brief used the Python fallback rather than `gws`. These were two profile-specific workarounds, not one global fix.

Also, my brief's “read-only” rule was behavioral: the token had broader permissions. I'd use narrower credentials where supported rather than treating prompt instructions as an access-control system.

## 4. Add Composio only where it earns another login

Composio gave me a second route to external apps. It wasn't necessary to replace already-working Google access.

I used its published installer, which downloaded CLI 0.6.0 and verified its checksum. For a new setup, I would read the installer before running it and use the current [Composio instructions](https://composio.dev), rather than blindly replaying an old installation command.

Once installed:

```bash
composio --version
composio login --no-wait --no-skill-install
```

Open the freshly generated login URL yourself. After approving it:

```bash
composio login --poll
composio whoami
composio connections list
```

Treat that output as private account information. The first successful login in my session still showed no connected apps. Logging into Composio did not connect Gmail, GitHub, or anything else.

Choose one app for one task. For example, this starts a GitHub authorization, not a repository write:

```bash
composio link github
composio connections list
```

That is a reusable example, not a claim that my original installation session completed a GitHub workflow. At that point, the agent had confirmed a Todoist tool through search and proposed automations. It had not built those automations.

The installer also modified shell startup and attempted plugins for detected agent hosts. I'd inspect those side effects before adding another connection manager. More integrations mean more credential state to diagnose.

## 5. Give the agent its own inbox

AgentMail separates the agent's email identity from my personal inbox. Its API supports listing messages, sending, replying, and changing the display name.

My first check stopped because `AGENTMAIL_API_KEY` wasn't available. After I added it to the profile's `.env`, the running shell still didn't have it exported. A file changing on disk doesn't rewrite an existing process environment.

The eventual read loaded the credential locally without printing it. The API returned an empty message list. A greeting I explicitly requested then returned a message and thread reference. That proved API acceptance, not inbox placement; new-sender mail can still land in spam.

For reproduction, first verify key presence without exposing its value:

```bash
if [ -n "${AGENTMAIL_API_KEY:-}" ]; then
  printf 'AgentMail key is available to this shell\n'
else
  printf 'AgentMail key is not exported in this shell\n'
fi
```

Use the [AgentMail API documentation](https://docs.agentmail.to/welcome) for the read request and your own inbox identifier. My saved `agentmail-inbox` skill records the workflow, not the secret. The scheduled checker in [Part 5](/journey/scheduled-agents-with-cron) only notifies; it doesn't send replies.

Incoming email is untrusted input. A sentence asking the agent to do something is message content, not permission from me. I would require explicit approval for recipients and content before any outgoing mail.

## 6. Keep MCP separate from hosted account connections

MCP is another way to expose tools to Hermes. A local server runs a command; a remote server exposes an endpoint and may require OAuth. Neither “the server is reachable” nor “tools were discovered” proves the intended operation succeeded.

Inspect the current profile first:

```bash
hermes -p personal-profile mcp list
hermes -p personal-profile mcp --help
```

Use Hermes's connection UI or supported MCP commands rather than hand-editing credential-bearing configuration. In an agent conversation, `manage_connections` distinguishes a hosted account connection from an MCP install. Ask for the one you mean.

I keep the verification sequence the same across them: authorize, inspect status, make one harmless read, then review the write capabilities. A tool catalog is not a safety policy.

## What I'd do differently

I'd connect fewer things at once and record the active profile, credential source, scopes, and one successful operation for each. “Google works” was too vague when one backend passed and another failed.

I'd also keep authorization codes out of chat from the start and avoid granting broad write access for a read-only digest. The convenience of an agent-owned inbox is real. So is the need to keep that inbox from becoming an instruction channel for anyone who can email it.

Sources: [Google Workspace CLI](https://github.com/googleworkspace/cli), [Google OAuth for installed applications](https://developers.google.com/identity/protocols/oauth2/native-app), and the installed commands' help output.

Previous: [Part 5 — Scheduled agents](/journey/scheduled-agents-with-cron). Next: [Part 7 — A project board for agents](/journey/a-project-board-for-agents-multica).
