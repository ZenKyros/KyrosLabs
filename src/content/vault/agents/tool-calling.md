---
title: Tool Calling
description: "Structured actions — teaching models to emit valid function calls instead of prose."
type: concept
category: agents
level: advanced
status: learning
tags:
  - agents
  - tools
prerequisites:
  - agent-loop
related:
  - memory
updated: 2026-01-15
---

# Tool Calling

A model that can only produce text can only *describe* actions. Tool calling gives it a structured channel: emit a JSON specification, the runtime executes it, the result returns as observation.

## The Contract

Tools are declared as JSON schemas; the model chooses one and fills its arguments:

```json
{
  "name": "search_vault",
  "arguments": { "query": "scaling laws", "limit": 5 }
}
```

Training mixes SFT traces of (situation → correct call) with preference data over *when not to call* — restraint is half the skill.

## Design Principles I Keep

1. **Narrow tools beat clever tools** — `get_weather(city)` over `do_stuff(request)`.
2. **Errors are observations** — return the traceback; the loop self-corrects.
3. **Idempotent reads, guarded writes** — agents retry; the world should tolerate it.
4. **Schema as documentation** — the description field *is* the prompt.

> [!note] Tokenization reaches here
> JSON is tokenized like any text — malformed calls are often a formatting failure, not a reasoning one. Constrained decoding (grammars over the logits) removes the failure class entirely. See [[tokenization]] for why the alphabet matters.

## From Calls to Capabilities

Composition is where agency appears: search → read → compute → write. Multi-step compositions stress exactly the failure modes discussed in [[agent-loop]].

## Connections

- The act channel of the [[agent-loop]].
- Long-horizon tool use needs [[memory]].
- My [[semantic-retrieval]] project exposes retrieval as exactly this kind of tool.
