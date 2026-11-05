<!--
  HTML comments like this one are not shown on the site.
  Your log says the repo isn't public yet and results aren't filled in. Once it runs, add e.g.
  "5/5 eval cases pass, end-to-end recommendation in <10s", and set githubUrl in src/data/portfolio-data.ts.
-->

## What it is

solar-sage is a **multi-tool AI agent** that advises homeowners on whether residential solar makes sense for them. It looks at **solar irradiance**, **electricity prices**, **panel yield** and **payback time**.

**Status:** in progress. The project is set up and I'm implementing the tools.

---

## Why I'm building it

To practise **agent engineering** end to end:

- **Tool calling:** the agent picks and combines several data tools
- **Streaming responses**, so answers appear as they're generated
- An **MCP server** exposing the tools
- A small **evaluation harness** to test the agent's answers

---

## My role

Solo. I designed and am building the whole thing.

---

## Stack

`Python` · `Claude Agent SDK` · `Tool calling` · `Streaming` · `MCP`
