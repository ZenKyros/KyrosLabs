---
title: "Deep Residual Learning for Image Recognition"
description: "ResNet — skip connections that made 100+ layer networks trainable and rewrote optimization intuition."
type: paper
authors:
  - He
  - Zhang
  - Ren
  - Sun
year: 2015
venue: CVPR 2016 (Best Paper)
url: https://arxiv.org/abs/1512.03385
topics:
  - vision
  - optimization
  - architecture
concepts:
  - cnn
  - backpropagation
tags:
  - landmark
  - vision
status: understood
updated: 2025-12-19
---

# Deep Residual Learning

## Why This Paper Matters

Before ResNet, "deeper" meant "worse" — degradation, not overfitting: deeper nets had *higher training error*. Skip connections removed that wall, enabling the depth that modern networks (including transformers) depend on.

## Core Idea

Let layers learn the **residual** with respect to the identity:

$$
y = F(x, \{W_i\}) + x
$$

If the identity is optimal, driving $F \to 0$ is easier than learning an identity mapping from scratch. Optimization becomes "keep what you have, add corrections."

## Why It Works (Gradient View)

Backpropagating through the skip gives:

$$
\frac{\partial y}{\partial x} = \frac{\partial F}{\partial x} + 1
$$

The $+1$ is a gradient *highway*: even if $\partial F/\partial x$ vanishes, signal flows. Compare the vanishing products discussed in [[backpropagation]] and [[rnn]].

## Architecture

Stacks of residual blocks; 152 layers on ImageNet, 3.57% top-5 error, *fewer* parameters than VGG-19 despite ~8× the depth. Depth became cheap.

## My Understanding

Residuals are a prior on *change*: layers default to do-nothing and must earn their deviation. Transformers inherit this directly — every attention and FFN output is added to the stream, which is why 96-layer models train at all (see [[transformers]]).

> [!note] Beyond vision
> The "identity + correction" pattern now appears everywhere: LoRA adds low-rank corrections to frozen weights; diffusion models denoise by small corrections; [[latent-reasoning|latent reasoning]] proposals iterate corrections on a thought state.

## Related Concepts

[[cnn]] · [[backpropagation]]

## Follow-up Papers

- Batch Normalization refinements and pre-norm vs post-norm debates in transformers.
- Highway Networks — the gated precursor.
