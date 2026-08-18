---
title: Attention
description: "Content-based addressing — letting a model look back at everything and choose what matters."
type: concept
category: deep-learning
level: intermediate
status: mastered
tags:
  - deep-learning
  - attention
  - sequences
prerequisites:
  - rnn
  - lstm
  - embeddings
related:
  - self-attention
  - transformers
papers:
  - attention-is-all-you-need
updated: 2026-01-04
---

# Attention

Attention replaced the [[rnn]]'s bottleneck — one hidden state summarizing the entire past — with a mechanism that can *look back at every past step* and weight them by relevance.

## The Alignment Idea (Bahdanau, 2014)

When producing output $t$, compute an alignment score with each encoder state $h_j$:

$$
\alpha_{tj} = \frac{\exp\big(\text{score}(s_t, h_j)\big)}{\sum_k \exp\big(\text{score}(s_t, h_k)\big)},
\qquad
c_t = \sum_j \alpha_{tj} h_j
$$

The context vector $c_t$ is a **soft lookup**: a weighted average of everything seen so far, weighted by how relevant each item is to the current step.

## Three Ingredients, Everywhere

1. **Query** — what am I looking for? ($s_t$)
2. **Keys** — what does each memory advertise? ($h_j$)
3. **Values** — what does each memory actually contain?

> [!paper] From the original Transformer paper
> [[attention-is-all-you-need|Vaswani et al.]] made the radical move of dropping recurrence *entirely* and building the whole model from this lookup — queries, keys and values are now learned projections of the same sequence: [[self-attention]].

## Why It Won

- **O(1) path length** between any two positions (RNNs: $O(n)$).
- **Parallel** across positions (recurrence forces serial computation).
- **Interpretable** — the weights $\alpha$ are literally a heatmap of relevance.

## Attention Taxonomy

| Kind | Query comes from | Used in |
| --- | --- | --- |
| Encoder–decoder | decoder states | translation RNNs |
| Self | the same sequence | [[self-attention]], [[transformers]] |
| Cross | another sequence | decoder attending to encoder |
| Causal (masked) | past only | [[pretraining|autoregressive LLMs]] |

## Connections

- Scales up into [[multi-head-attention]] and the full [[transformers]] stack.
- Retrieval systems do attention over a *database*: [[memory]], and my [[semantic-retrieval]] project.
