---
title: Agent Loop
description: "Observe, think, act — the control structure that turns a language model into an agent."
type: concept
category: agents
level: advanced
status: learning
tags:
  - agents
  - architecture
prerequisites:
  - instruction-tuning
  - rlhf
related:
  - tool-calling
  - memory
updated: 2026-02-02
---

# Agent Loop

An agent is not a bigger model — it is a *loop*. A language model becomes an agent when its outputs are allowed to change the world, and the world's response flows back in as new context.

## The Canonical Cycle

```
┌──────────────────────────────────────────────┐
│  1. OBSERVE   state, history, tool results   │
│  2. THINK     plan, reason, choose an action │
│  3. ACT       tool call / answer / stop      │
│  4. FEEDBACK  result appended to context     │
└───────────────────────┬──────────────────────┘
                        └──── repeat until done ────┘
```

```python
def agent_loop(task, model, tools, memory, max_steps=12):
    memory.add("user", task)
    for _ in range(max_steps):
        thought, action = model.step(memory, tools)
        if action.name == "finish":
            return action.value
        result = tools.run(action)
        memory.add("tool", result)
    raise TimeoutError("agent did not converge")
```

## ReAct: Reasoning + Acting

Interleaving explicit reasoning traces with actions measurably improves multi-step reliability — the model argues with itself *between* tool calls instead of committing to a plan blindly.

> [!question] Open: when does the loop fail?
> Error compounding is the core failure mode: each step's small mistake becomes the next step's context. Loops degrade gracefully for ~5–10 steps, then cliff. My [[latent-reasoning]] research note explores reasoning outside the token stream as one escape hatch.

## What an Agent Needs Beyond the Model

- **Tools** to act: [[tool-calling]].
- **Memory** that outlives the context window: [[memory]].
- A *stopping rule* — often the most underrated component.

## Connections

- The tuned policy comes from [[instruction-tuning]] + [[rlhf]].
- Retrieval-augmented loops share DNA with [[semantic-retrieval]].
