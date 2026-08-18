---
title: Calculus
description: "Derivatives, gradients and the chain rule — the machinery that makes learning possible."
type: concept
level: foundations
status: mastered
tags:
  - math
  - calculus
related:
  - linear-algebra
  - optimization
updated: 2025-10-28
---

# Calculus

If [[linear-algebra|linear algebra]] describes the *space* models live in, calculus describes *change* — and learning is nothing but controlled change.

## The Derivative

The derivative is sensitivity: how much $f$ moves when $x$ moves a little.

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

## Partial Derivatives and the Gradient

For $f: \mathbb{R}^n \to \mathbb{R}$, collect every partial derivative into one vector — the **gradient**:

$$
\nabla f(x) = \left[ \frac{\partial f}{\partial x_1}, \dots, \frac{\partial f}{\partial x_n} \right]^\top
$$

Two facts do most of the work in ML:

1. $\nabla f$ points in the direction of *steepest ascent*.
2. Its magnitude tells you how steep that ascent is.

Descending against it is exactly [[gradient-descent]].

## The Chain Rule

The single most important formula in deep learning. For composed functions:

$$
\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}
$$

<details>
<summary>Why the chain rule powers backpropagation</summary>

A network is a composition $f = f_L \circ f_{L-1} \circ \dots \circ f_1$. The derivative of the whole thing is a *product* of local Jacobians — and [[backpropagation]] is just an efficient bookkeeping scheme for those products.

</details>

## Taylor Expansion

Local polynomial approximation — the reason quadratic models of the loss are useful near a minimum:

$$
f(x + \delta) \approx f(x) + \nabla f(x)^\top \delta + \tfrac{1}{2}\delta^\top H \delta
$$

where $H$ is the Hessian matrix of second derivatives.[^hessian]

[^hessian]: The eigenvalues of $H$ classify critical points: all positive → local minimum, mixed signs → saddle point. Saddle points dominate high-dimensional loss landscapes.

## Connections

- Gradient + step size = [[gradient-descent]].
- Jacobians are matrices: see [[linear-algebra]].
- Probabilistic models differentiate *log-densities*: [[probability]].
