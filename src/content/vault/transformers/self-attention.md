---
title: Self-Attention
description: "Attention turned inward — every token attends to every other token in the same sequence."
type: concept
category: transformers
level: intermediate
status: mastered
tags:
  - attention
  - transformers
prerequisites:
  - attention
  - embeddings
related:
  - multi-head-attention
  - positional-encoding
papers:
  - attention-is-all-you-need
updated: 2026-01-06
---

# Self-Attention

[[attention|Attention]] originally compared a decoder state against encoder states. **Self**-attention removes the split: the query, key and value all come from the *same* sequence. Each token rewrites itself as a blend of every token, weighted by relevance.

## The Formula

Project every token embedding $x_i$ into three roles:

$$
Q = XW^Q, \quad K = XW^K, \quad V = XW^V
$$

Then:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

Row $i$ of the result is token $i$'s new representation — a weighted average of *all* value vectors.

## Why $\sqrt{d_k}$?

Dot products between $d_k$-dimensional vectors grow like $\sqrt{d_k}$. Large logits push softmax into saturation, where gradients vanish. Scaling keeps the softmax in its sensitive regime:

$$
\text{Var}(q \cdot k) \approx d_k \;\Rightarrow\; \text{scale by } \frac{1}{\sqrt{d_k}}
$$

## A Minimal Implementation

```python
import torch

def attention(x, Wq, Wk, Wv):
    Q, K, V = x @ Wq, x @ Wk, x @ Wv
    scores = Q @ K.T / (K.shape[-1] ** 0.5)
    weights = torch.softmax(scores, dim=-1)   # (n, n) attention map
    return weights @ V
```

> [!note] The n² bill
> The attention map is $n \times n$ — quadratic in sequence length. Every efficiency paper since ([[speculative-decoding]] aside) is partly a negotiation with this term.

## What It Learns

Interpretability work finds heads that behave like linguists: some track coreference, some attend to the previous token, some to syntactic heads. Nothing is wired in — the circuitry *emerges* from next-token prediction.

## Connections

- Parallelized across [[multi-head-attention|multiple heads]].
- Needs order injected separately: [[positional-encoding]].
- Assembled into the full block: [[transformers]].
- My [[nano-transformer]] project implements exactly this function.
