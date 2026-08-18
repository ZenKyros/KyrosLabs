---
title: Multi-Head Attention
description: "Many attention maps at once — letting different heads specialize in different relations."
type: concept
category: transformers
level: intermediate
status: understood
tags:
  - attention
  - transformers
prerequisites:
  - self-attention
related:
  - transformers
papers:
  - attention-is-all-you-need
updated: 2026-01-08
---

# Multi-Head Attention

A single [[self-attention]] map has to do everything at once: syntax, coreference, position, topic. Multi-head attention runs $h$ independent attentions in parallel and blends their outputs:

$$
\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)\, W^O
$$

with

$$
\text{head}_i = \text{Attention}(QW_i^Q,\; KW_i^K,\; VW_i^V)
$$

## Why It Works

Each head gets a $d_k = d_{\text{model}} / h$ slice of the space. Different slices can specialize:

| Observed head behavior | Example |
| --- | --- |
| Previous-token head | attends to position $i-1$ |
| Separator head | finds sentence boundaries |
| Coreference head | links pronouns to antecedents |
| Local head | narrow window around $i$ |

The concat + $W^O$ projection is where heads *negotiate*: information from several specialists is fused into one residual stream update.

> [!tip] Same cost, more circuits
> Total FLOPs roughly match a single full-size attention (heads are smaller), so multi-head is almost free expressiveness — one of the paper's quiet bargains. See [[attention-is-all-you-need]].

## Modern Variants

- **Grouped-query attention (GQA)** — heads *share* key/value projections; inference gets cheaper ([[pretraining|frontier models]] all do this).
- **Multi-query attention (MQA)** — the extreme: one KV pair for all heads.
- **Sliding-window heads** — mix local and global heads in one layer.

## Connections

- Built from [[self-attention]]; wrapped by residual + norm in [[transformers]].
- KV-cache for autoregressive decoding lives here — central to [[speculative-decoding]].
