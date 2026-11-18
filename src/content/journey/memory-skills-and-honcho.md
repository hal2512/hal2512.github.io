---
title: What my agent remembers with memory, skills and Honcho
summary: I split persistent facts, reusable procedures and searchable history into different places. Honcho added recall, but also exposed an identity-mapping problem.
date: 2026-11-10
type: tutorial
order: 4
tags: [memory, skills, Honcho, privacy]
---

My first test of memory was asking a new chat what it knew about me. It remembered my name, machine and tools. Then a later attempt to save one more fact failed because the profile was full. That was when "persistent memory" stopped being an abstract feature and became a small editing job.

I ended up using three mechanisms: built-in notes for facts that belong in every session, skills for procedures, and Honcho for recalling conversations beyond those notes. They overlap, but treating them as interchangeable made the setup harder to understand.

## What you'll build

A memory arrangement you can inspect and test: small local notes, a reusable skill, and an optional Honcho connection. This assumes you have Hermes working and know which profile you're using. You can stop after the skills section; the cloud provider is optional.

<figure>
<img src="/journey/memory-skills-and-honcho/memory-layers.svg" alt="Three kinds of persistent information: built-in MEMORY.md and USER.md hold compact facts for the session prompt, SKILL.md holds procedures loaded when relevant, and Honcho stores cloud conversation history and derived conclusions for retrieval. Local session history remains a separate source of evidence." loading="lazy" />
<figcaption>I choose where to save something based on how a later task should retrieve it.</figcaption>
</figure>

I configured Honcho on 10 November. The skill-install example below happened later while preparing this series. The commands were checked against Hermes 0.23.1; provider packaging and settings can change, so use the [current memory documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) alongside this account.

## 1. Inspect built-in memory before adding another provider

For the default profile, the two files are:

```bash
wc -m ~/.hermes/memories/MEMORY.md ~/.hermes/memories/USER.md
hermes memory status
```

Named profiles keep the equivalent files under `~/.hermes/profiles/<profile-name>/memories/`. Read them locally if you want to audit the contents, but don't paste them into a bug report. Mine contain personal information and machine details.

The budgets on my install are 2,200 characters for `MEMORY.md` and 1,375 for `USER.md`. Those are characters, not words. The first is for environment facts and the agent's notes; the second is for facts about me and my preferences. They are configurable limits, not an unlimited database.

The [docs describe a frozen snapshot](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory#how-memory-appears-in-the-system-prompt): Hermes loads these files into the prompt at session start. A memory-tool write persists immediately, but a new session is the clean test of whether the updated notes load. A long-running phone chat isn't automatically a new session because the laptop rebooted.

Ask the agent to save one non-sensitive, durable preference, then open a new chat and check it. For a messaging conversation, `/new` creates a natural boundary. Don't use a temporary test fact and leave it permanently in your profile.

### What happened when mine filled up

The memory tool rejected an update rather than silently dropping older entries:

```text
Applying all 1 operations would put memory at 1,415/1,375 chars ...
No operations were applied (batch is all-or-nothing).
```

The agent shortened existing entries and retried the changes together. That worked. It also reported what it had removed to make room, which is worth asking for: memory curation is editing, and editing can delete something you still care about.

I now keep these notes for facts with a reason to be in every session: preferred name, usual machine, writing preferences. A completed task, a long debugging procedure or today's next step doesn't belong in that small budget.

## 2. Put procedures in skills, not in biography

A skill is a folder with a `SKILL.md` file, optionally with supporting scripts or references. Hermes makes skill descriptions available, then loads the full instructions when the task needs them. That avoids putting an entire troubleshooting manual into every prompt.

My task-tracking skill was a practical example. I wanted substantial requests tracked on a board without repeating that instruction each time. The agent saved the scope, status workflow, verification rule and privacy restrictions as a skill. The distinction mattered: it was an instruction the agent could load, not a hard event hook guaranteed to fire on every request.

For a small local example, create the folder in the profile you're testing:

```bash
mkdir -p ~/.hermes/skills/project-writeup
```

Save this as `~/.hermes/skills/project-writeup/SKILL.md` in your editor:

```markdown
---
name: project-writeup
description: Use when drafting a project write-up. Check evidence first.
---

# Project write-up

Read the README and relevant source files before describing the project.
Separate what was implemented from what was proposed.
Include a result only when a file, test or command output supports it.
Leave out credentials and private account details.
```

This is an illustrative writing checklist, not a claim that I installed or tested this exact sample. The file layout follows the [skills documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills). For a named profile, use its `skills/` directory instead of the default one.

Verify discovery:

```bash
hermes skills list
```

The new skill should appear in the list. In a fresh CLI or messaging session, invoke `/project-writeup` with a real project request, then check that the agent actually reads the project before drafting. The existence of the file proves persistence, not compliance.

Keep a skill's instructions imperative because it describes a procedure. Keep ordinary memory declarative because it describes facts. A fact such as "I prefer short replies" and a procedure such as "Run the test suite before reporting success" have different jobs.

## 3. Inspect a hub skill before installing it

Hermes can search registries and install skills from more than one source. Source qualification matters: two entries with the same display name may contain different text.

```bash
hermes skills search technical-blog-writing
hermes skills inspect clawhub/technical-blog-writing
```

Those commands let you find candidates and read the instructions without installing them. If you choose one after review, the general command is:

```bash
printf 'Source-qualified skill identifier: '
read -r SKILL_IDENTIFIER
hermes skills install "$SKILL_IDENTIFIER"
```

Enter the identifier you inspected. Don't treat that command as a reason to install every result.

During this series' preparation, the agent tried the ClawHub copy of `technical-blog-writing`. Hermes refused it:

```text
Not installed: the security scan found 2 high-risk pattern(s) ...
Hermes never installs unverified skills with high-risk findings, even with --force.
```

A different copy from the inference-sh repository received a safe verdict and was installed. Both copies promoted an external CLI. We wanted the writing guidance, not another executable or paid generation service, so the writer's role explicitly forbids installing or running those CLIs.

I can't infer from the captured output which exact two patterns triggered the rejection. I also can't call the other copy trustworthy merely because it passed. The [skills docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) explain that the scanner checks threats including exfiltration, prompt injection and destructive commands, and that `--force` does not bypass a dangerous verdict. A scan is useful evidence, not permission to stop reading.

Skills are instructions the agent may follow with real tool access. Review their network calls, install steps and data handling as carefully as you would review a script. Never store tokens or private workspace identifiers in them.

## 4. Add Honcho only if you want external recall

I couldn't find Honcho in the memory-provider dropdown shown in a tutorial. It hadn't disappeared; my install needed its catalog plugin first.

Before installing, understand the data path. Honcho Cloud is an external service from Plastic Labs. An active provider can receive conversation turns and other context, then store and derive information from it. Hermes's [provider docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers) describe secret scrubbing, but also its limits. Don't paste secrets into chat and hope a filter catches them.

I approved the installation, and the agent ran:

```bash
hermes plugins install honcho
hermes memory setup
```

Select Honcho in the memory setup flow. I entered the authentication myself in settings, not into the conversation. The agent didn't need my key to explain the remaining fields.

I used Cloud, left the base URL and workspace at their defaults, and chose a stable lowercase peer name. Session strategy was Per directory. A peer is the identity the memory describes; a session is a conversation grouping. Those aren't the same thing.

Verify activation:

```bash
hermes memory status
```

On the later check of my install, the relevant lines were:

```text
Built-in (MEMORY.md / USER.md):
  Memory injection:   enabled
  User profile:       enabled
Provider:  honcho
Plugin:    installed
Status:    available
```

That checks local activation, not whether the service has stored the right fact under the right person. Once Honcho is active, its plugin commands provide further diagnostics:

```bash
hermes honcho status
hermes honcho peers
```

Don't publish the full output. It can include identity and session information.

## 5. Test attribution as well as recall

My connection check succeeded, and a saved conclusion came back in recalled context. Meanwhile, the peer card in the dashboard was empty. The empty card wasn't enough evidence of failure: a card is a generated summary, and it didn't appear immediately.

There was a more important problem. The configured peer name and the identity in desktop recall didn't match. Later phone recall also used a platform-derived identity. My agent had first implied that setting one peer name would unify the channels. The subsequent evidence didn't support that promise.

I have not verified a complete fix for that split. A working connection and successful retrieval are not proof of unified identity.

<figure>
<img src="/journey/memory-skills-and-honcho/identity-check.svg" alt="Verification checklist for Honcho: activation, service connection, write, recall, and correct identity attribution are separate checks. A desktop session and a phone session can store information under different peers even when both successfully recall it." loading="lazy" />
<figcaption>The final check is whether both channels attribute the memory to the intended peer.</figcaption>
</figure>

For your own test, use non-sensitive preferences. Open a fresh desktop session, save one, then ask from the phone. Check which profile handles each chat and which peer the provider uses. If retrieval fails, distinguish missing data from wrong identity and from stale session context. Avoid "fixing" this by saving the same fact repeatedly under every identity; that makes duplicates rather than proving the mapping works.

Honcho's tools help separate the questions. `honcho_profile` reads the compact peer card; `honcho_context` reads the current snapshot; `honcho_search` retrieves message excerpts. `honcho_reasoning` synthesizes an answer and costs more than a direct read. A synthesis is not a verbatim source, so for a disputed detail I prefer the actual message or command output.

## 6. Keep the option to turn it off

Honcho supplements built-in memory; it doesn't replace the local notes or skills. Only one external memory provider can be active at a time. To return to built-in memory alone:

```bash
hermes memory off
hermes memory status
```

To remove the plugin afterward:

```bash
hermes plugins uninstall honcho
```

Those commands change local behavior. They do not delete information already stored in the cloud account. Manage that separately with the provider. If the running gateway needs to pick up a configuration change, finish live work before restarting it, as covered in [Part 3](/journey/texting-my-agent-imessage-telegram).

## Lessons

I would decide the storage rule before adding another provider: facts in small notes, procedures in skills, old conversation details in searchable history. I'd test identity across channels immediately instead of waiting for a dashboard card. And I'd keep source evidence nearby: remembering a claim more persistently does not make it true.

Next: [Part 5, scheduled agents with cron](/journey/scheduled-agents-with-cron). Previous: [Part 3, phone messaging](/journey/texting-my-agent-imessage-telegram).
