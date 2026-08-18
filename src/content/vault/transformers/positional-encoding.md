---
title: Positional Encoding
description: "Giving order to a permutation-invariant machine — from sine waves to rotary embeddings."
type: concept
category: transformers
level: intermediate
status: understood
tags:
  - transformers
  - embeddings
prerequisites:
  - self-attention
related:
  - transformers
papers:
  - attention-is-all-you-need
updated: 2026-01-10
---

# Positional Encoding

[[self-attention|Self-attention]] is *permutation invariant*: shuffle the tokens and the attention output shuffles identically. Language needs order — so position must be injected from outside.

## Sinusoidal Encoding (2017)

The original recipe adds a fixed vector to each token embedding:

$$
PE_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d}}\right), \qquad
PE_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d}}\right)
$$

Each dimension is a sinusoid of a different wavelength — a geometric progression from $2\pi$ to $10000 \cdot 2\pi$. Relative shifts become *linear* maps of the encoding, which is how the model can learn "attend 3 back".

## Learned and Rotary Encodings

1. **Learned embeddings** — BERT/GPT-2 just learn a lookup table per position. Simple; caps the max length.
2. **RoPE (rotary)** — rotate query/key vectors by an angle proportional to position *before* the dot product. Relative position falls out of the geometry:

$$
\langle R_m q,\; R_n k \rangle = f(q, k, m - n)
$$

RoPE is the modern default ([[pretraining|LLaMA-family models]]), and it extrapolates to longer contexts than it was trained on.

> [!note] Position is information, not decoration
> Ablations that remove positional encoding collapse performance on almost every task — order carries most of syntax.

## Connections

- Added on top of token [[embeddings]].
- One of the three pillars of [[transformers]] alongside attention and feed-forward blocks.
- Length extrapolation research leans on RoPE's structure; see [[scaling-laws]] for the context-length trade.
