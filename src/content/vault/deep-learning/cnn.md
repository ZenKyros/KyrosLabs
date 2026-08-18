---
title: Convolutional Neural Networks
description: "Weight sharing and locality — architectures shaped like the data they see."
type: concept
category: deep-learning
level: intermediate
status: implemented
tags:
  - deep-learning
  - vision
prerequisites:
  - neural-networks
  - backpropagation
related:
  - attention
papers:
  - deep-residual-learning
updated: 2025-12-16
---

# Convolutional Neural Networks

Images have structure a fully connected layer ignores: pixels relate to their *neighbors*, and a cat-detector should work anywhere in the frame. CNNs bake both priors in.

## The Convolution Operation

Slide a small kernel $K$ over the input and accumulate:

$$
(I * K)(i, j) = \sum_m \sum_n I(i+m,\, j+n)\, K(m, n)
$$

Two consequences do the heavy lifting:

1. **Parameter sharing** — one kernel, every location. Millions of weights become hundreds.
2. **Translation equivariance** — detect a feature *here* and you have detected it *everywhere*.

```python
conv = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3, stride=1, padding=1)
features = conv(images)   # (B, 64, H, W)
```

## Building Blocks

| Block | Role |
| --- | --- |
| Conv + ReLU | feature extraction |
| Pooling | spatial downsampling, invariance |
| Skip connection | gradient highway ([[deep-residual-learning]]) |
| Global average pool | collapse space before the classifier |

## Receptive Field

A unit in layer $\ell$ sees a patch of the input that *grows with depth*. Deep stacks = large effective receptive fields: edges become parts, parts become objects.

> [!note] Convolution is attention's ancestor
> A conv kernel is a *fixed, local* weighting of positions. Attention replaces the fixed kernel with one computed from the content itself — see [[attention]] for the generalization, and [[self-attention]] for the version transformers use.

## Connections

- Trained with the same [[backpropagation]] as everything else.
- Residual connections fixed depth: [[deep-residual-learning]].
- Vision transformers now treat patches as tokens — CNN ideas absorbed into [[transformers]].
