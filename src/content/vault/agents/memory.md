---
title: Memory
description: "Beyond the context window — working, episodic and semantic memory for long-horizon agents."
type: concept
category: agents
level: advanced
status: learning
tags:
  - agents
  - memory
  - retrieval
prerequisites:
  - agent-loop
  - embeddings
related:
  - tool-calling
updated: 2026-01-11
---

# Memory

The context window is a *working* memory: fast, tiny, evanescent. Real tasks run longer than any window, so agents need memory systems — and the designs mirror cognitive science surprisingly well.

## A Taxonomy

| Type | Store | Retrieval | Analogue |
| --- | --- | --- | --- |
| Working | context window | free (it's the prompt) | RAM |
| Episodic | event log | time / recency | "last Tuesday" |
| Semantic | vector DB | similarity | facts |
| Procedural | tool / skill library | by task | habits |

## Retrieval Is Attention Over a Database

Semantic memory reduces to nearest neighbors in [[embeddings|embedding space]]:

$$
\text{mem}(q) = \underset{m \in \mathcal{M}}{\text{top-}k}\; \cos\big(e(q), e(m)\big)
$$

— which is precisely [[attention]] with the memory bank externalized. My [[semantic-retrieval]] project is this equation, packaged.

```python
hits = index.search(embed(query), k=5)          # vector similarity
hits = rerank(query, hits)                       # cross-encoder pass
context = memory.render(hits)                    # back into the prompt
```

> [!question] The write problem
> Reading memory is solved-ish; *writing* is not. What deserves storage? Summaries decay, raw logs explode. Consolidation — compressing episodes into semantic facts — is the open frontier, and the subject of my [[latent-reasoning]] note.

## Connections

- The [[agent-loop]] consumes memory at every OBSERVE step.
- [[tool-calling]] exposes memory stores as tools.
- Compression trade-offs echo [[scaling-laws]]: store tokens vs recompute.
