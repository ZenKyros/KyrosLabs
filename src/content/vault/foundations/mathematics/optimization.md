---
title: Optimization
description: "Finding the best parameters under constraints — convexity, gradients and Lagrange multipliers."
type: concept
level: foundations
status: understood
tags:
  - math
  - optimization
prerequisites:
  - linear-algebra
  - calculus
related:
  - gradient-descent
  - backpropagation
updated: 2025-11-15
---

# Optimization

Every model is defined by an optimization problem: *choose parameters that minimize a loss*. The theory tells you when that problem is tractable.

## Convexity

A function is convex when chords lie above the graph:

$$
f(\alpha x + (1-\alpha) y) \le \alpha f(x) + (1-\alpha) f(y)
$$

For convex problems, **every local minimum is a global minimum** — a guarantee deep learning does not have, but keeps approximately exploiting.[^nonconvex]

[^nonconvex]: Empirically, high-dimensional non-convex loss surfaces are riddled with saddle points rather than bad local minima, which is why first-order methods work so well.

## First-Order Methods

Use only the gradient $\nabla f$ — cheap per step, scale to billions of parameters. The prototype:

$$
x_{t+1} = x_t - \eta \nabla f(x_t)
$$

This is [[gradient-descent]]; everything else (momentum, Adam) is a refinement of the step.

## Second-Order Methods

Also use curvature via the Hessian $H$:

$$
x_{t+1} = x_t - H^{-1} \nabla f(x_t)
$$

Newton's method converges fast but costs $O(n^3)$ — impractical for modern networks, yet it motivates quasi-Newton tricks and natural gradient methods.

## Constrained Optimization and Lagrange Multipliers

Optimize $f(x)$ subject to $g(x) = 0$ by solving:

$$
\nabla f = \lambda \nabla g
$$

| Idea | Tool | Where it shows up |
| --- | --- | --- |
| Equality constraints | Lagrangian | SVM dual |
| Inequality constraints | KKT conditions | margin losses |
| Trust in the step | line search | L-BFGS |

> [!tip] Why this matters for LLMs
> [[rlhf]] is constrained optimization in disguise: maximize reward *subject to* staying close to the base policy — solved with a Lagrange-style penalty (the KL term).

## Connections

- Needs gradients ([[calculus]]) and matrix calculus ([[linear-algebra]]).
- Backpropagation supplies the gradients: [[backpropagation]].
