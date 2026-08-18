---
title: Gradient Descent
description: "The workhorse optimizer — stepping against the gradient, from SGD to Adam."
type: concept
level: beginner
status: mastered
tags:
  - optimization
  - training
prerequisites:
  - calculus
  - optimization
related:
  - backpropagation
updated: 2025-12-01
---

# Gradient Descent

All of deep learning is one loop: *measure the gradient, step against it, repeat*.

## The Update Rule

$$
\theta_{t+1} = \theta_t - \eta \nabla_\theta \mathcal{L}(\theta_t)
$$

The learning rate $\eta$ is the single most consequential hyperparameter in the loop.

## Variants That Matter

| Variant | Gradient from | Notes |
| --- | --- | --- |
| Batch GD | full dataset | exact, slow |
| SGD | 1 sample | noisy, escapes saddles |
| Mini-batch SGD | 32–4096 samples | the practical default |
| Momentum | moving average of $g$ | damps oscillation |
| Adam | per-parameter $m/\sqrt{v}$ | adaptive, ubiquitous |

Adam's core, in two lines:

$$
m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t, \quad
v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2, \quad
\theta_{t+1} = \theta_t - \eta \frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon}
$$

```python
# minimal SGD with momentum
v = 0.0
for x, y in dataloader:
    g = grad(loss(model(x), y))
    v = 0.9 * v + g
    params -= lr * v
```

> [!warning] Learning-rate intuition
> Too large → divergence; too small → stall. Modern practice couples the rate with a *schedule* (warmup, then cosine decay) — the same recipe used in [[pretraining]].

## Connections

- Gradients arrive via [[backpropagation]]; the theory sits in [[optimization]].
- Step geometry interacts with curvature from [[calculus]].
- [[rlhf]] fine-tunes with PPO — gradient descent on a *policy* objective.
