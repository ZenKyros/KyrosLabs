---
title: "Attention Is All You Need"
description: "The 2017 paper that replaced recurrence with self-attention and founded the transformer era."
type: paper
authors:
  - Vaswani
  - Shazeer
  - Parmar
  - Uszkoreit
  - Jones
  - Gomez
  - Kaiser
  - Polosukhin
year: 2017
venue: NeurIPS 2017
url: https://arxiv.org/abs/1706.03762
topics:
  - attention
  - transformers
concepts:
  - self-attention
  - multi-head-attention
  - positional-encoding
  - transformers
tags:
  - landmark
  - architecture
status: understood
updated: 2026-01-05
---

# Attention Is All You Need

## Why This Paper Matters

Every dominant model in language, vision, audio and biology since ~2020 is a descendant of this architecture. It made sequence modeling **fully parallel** and unlocked the compute-scaling era — without it there is no [[gpt-3]], no [[bert]], no modern LLM.

## Core Idea

Discard recurrence and convolution. Build the model entirely from attention: each position attends to *all* positions with content-based weights ([[attention]]), using learned projections into query/key/value roles ([[self-attention]]).

## Architecture

Stacks of identical blocks; each block = multi-head attention + positionwise FFN, both wrapped in residuals and layer norms. Inputs receive [[positional-encoding|sinusoidal position encodings]] because attention itself is order-blind.

| Component | Choice in the paper |
| --- | --- |
| Layers | 6 encoder + 6 decoder |
| $d_{\text{model}}$ | 512 |
| Heads | 8 |
| FFN width | 2048 |
| Parameters | ~65M (base) |

## Mathematics

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

Scaled dot-product attention is derived from wanting dot-product speed with softmax stability; the $1/\sqrt{d_k}$ term is the paper's smallest but most load-bearing detail.

## My Understanding

The paper's real claim is about **path lengths**: recurrence connects distant tokens through $O(n)$ sequential steps; attention connects them in $O(1)$. Parallelism is the training-time reward; short paths are the learning-time reward.

## Implementation

Reproduced from scratch in my [[nano-transformer]] project — including the often-missed details: label smoothing 0.1, warmup schedule $\propto d_{\text{model}}^{-0.5}$, shared input/output embeddings.

> [!paper] Line I keep returning to
> "The Transformer is the first transduction model relying entirely on self-attention to compute representations of its input and output without using sequence-aligned RNNs or convolution."

## Related Concepts

[[self-attention]] · [[multi-head-attention]] · [[positional-encoding]] · [[transformers]]

## Follow-up Papers

- [[bert]] — encoder-only, bidirectional masking, fill-in-the-blank pretraining.
- [[gpt-3]] — decoder-only, autoregressive, scale as the independent variable.
