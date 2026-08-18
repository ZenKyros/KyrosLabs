---
title: Activation Functions
description: "The nonlinearities that make stacks of linear maps more than a linear map."
type: concept
category: deep-learning
level: intermediate
status: understood
tags:
  - deep-learning
prerequisites:
  - neural-networks
related:
  - regularization
updated: 2025-12-12
---

# Activation Functions

Without a nonlinearity, any depth of linear layers collapses to one linear layer. Activations are where expressiveness enters [[neural-networks|the network]].

## The Zoo

| Function | Formula | Where it shines |
| --- | --- | --- |
| Sigmoid | $\sigma(x) = \frac{1}{1+e^{-x}}$ | gates, binary outputs |
| Tanh | $\tanh(x)$ | recurrent states |
| ReLU | $\max(0, x)$ | CNNs, default for years |
| Leaky ReLU | $\max(\alpha x, x)$ | avoids dead units |
| GELU | $x\,\Phi(x)$ | transformers |
| SwiGLU | $(xW_1 \odot \sigma(xW_3))W_2$ | modern LLM FFNs |

## Vanishing Gradients

Sigmoid and tanh squash their input; their derivatives top out at $0.25$ and $1$, so long chains of them *multiply small numbers together*:

$$
\prod_{\ell=1}^{L} \sigma'(z_\ell) \;\xrightarrow{L \gg 1}\; 0
$$

This is why pre-2010 deep nets would not train — and why ReLU (derivative $0$ or $1$) changed everything.

> [!note] GELU, the transformer's choice
> $\text{GELU}(x) = x \cdot \Phi(x)$ smooths ReLU's corner and behaves like a soft gate. Feed-forward blocks in [[transformers]] almost always use GELU or SwiGLU.

## Choosing One

1. Hidden layers of transformers → GELU / SwiGLU.
2. Convolutions → ReLU family.
3. Output layer → dictated by the task: softmax for classes ([[classification]]), linear for regression ([[regression]]), sigmoid for gates ([[lstm]]).

## Connections

- Dead ReLUs and overfitting interact; see [[regularization]].
- Gates are just sigmoids with a job: [[lstm]].
