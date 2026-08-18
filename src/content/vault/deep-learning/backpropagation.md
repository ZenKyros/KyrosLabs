---
title: Backpropagation
description: "The chain rule, industrialized — computing every gradient in one backward pass."
type: concept
category: deep-learning
level: intermediate
status: mastered
tags:
  - deep-learning
  - training
prerequisites:
  - neural-networks
  - calculus
related:
  - gradient-descent
updated: 2025-12-10
---

# Backpropagation

Backprop is not an algorithm for *learning* — it is an algorithm for *differentiating*. It applies the chain rule from [[calculus]] to a computational graph, reusing intermediate results so each edge is differentiated exactly once.

## Forward and Backward

Forward pass computes values; backward pass computes gradients **from the loss toward the inputs**:

$$
\frac{\partial \mathcal{L}}{\partial W^{(\ell)}} = \delta^{(\ell)} \, a^{(\ell-1)\top},
\qquad
\delta^{(\ell)} = \left( W^{(\ell+1)\top} \delta^{(\ell+1)} \right) \odot \sigma'(z^{(\ell)})
$$

## A Tiny Implementation

```python
# forward
z1 = W1 @ x + b1;  a1 = relu(z1)
z2 = W2 @ a1 + b2; loss = mse(z2, y)

# backward (same graph, reversed)
dz2 = 2 * (z2 - y) / len(y)
dW2 = dz2 @ a1.T
da1 = W2.T @ dz2
dz1 = da1 * (z1 > 0)          # ReLU derivative
dW1 = dz1 @ x.T
```

## The Graph View

Every tensor operation is a node; autograd records the graph and replays it backwards. This is why frameworks ask for `loss.backward()` and nothing else — the graph *is* the derivative bookkeeping.

> [!tip] Memory is the price
> Backprop trades compute for memory: activations from the forward pass must be kept for the backward pass. Gradient checkpointing re-computes them instead — a trick that matters when [[pretraining|training large models]].

## Connections

- Consumes the [[gradient-descent|optimizer's]] step; implements the [[calculus|chain rule]].
- Vanishing/exploding gradients motivated [[lstm]] gates and residual nets ([[deep-residual-learning]]).
- Attention layers are differentiated exactly like any other node: [[self-attention]].
