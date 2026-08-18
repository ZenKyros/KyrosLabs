---
title: Neural Networks
description: "Stacked learned transformations — universal function approximators trained end-to-end."
type: concept
category: deep-learning
level: intermediate
status: mastered
tags:
  - deep-learning
  - networks
prerequisites:
  - linear-algebra
  - regression
  - gradient-descent
related:
  - backpropagation
  - activation-functions
updated: 2025-12-08
---

# Neural Networks

A neural network is a composition of simple layers, each a linear map plus a nonlinearity:

$$
f(x) = f_L \circ f_{L-1} \circ \dots \circ f_1 (x)
$$

Individually the layers are trivial. Composed, and trained on data, they approximate astonishing functions.

## One Layer, Fully Written Out

$$
h = \sigma(W x + b)
$$

```python
import torch.nn as nn

net = nn.Sequential(
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 128), nn.ReLU(),
    nn.Linear(128, 10),
)
```

## Why Depth?

- **Width alone** can approximate anything given enough units (universal approximation[^ua]), but may need *exponentially* many.
- **Depth composes features**: edges → textures → parts → objects. Each layer reuses the previous layer's work.

[^ua]: The universal approximation theorem guarantees existence, not learnability — finding the right weights is what training actually does.

## Training, in One Paragraph

Pick a loss ([[classification|cross-entropy]] for labels, MSE for values). Compute gradients of the loss w.r.t. *every* weight with [[backpropagation]]. Step against them with [[gradient-descent]]. Repeat until the function fits.

> [!note] The surprising part
> Nothing about the architecture encodes the task. The same stack of matrix multiplies learns vision, language and games — the data and loss do the specifying.

## Failure Modes

- Overfitting → [[regularization]].
- Saturation and dead units → [[activation-functions]].
- Training instability in very deep stacks → residual connections ([[deep-residual-learning]]).

## Connections

- Sequences need recurrence: [[rnn]], later superseded by [[attention]].
- Images exploit locality: [[cnn]].
- The whole modern story is this object, scaled: [[transformers]].
