---
title: Recurrent Neural Networks
description: "A hidden state carried through time — the first architectures that read sequences."
type: concept
category: deep-learning
level: intermediate
status: understood
tags:
  - deep-learning
  - sequences
prerequisites:
  - neural-networks
  - backpropagation
related:
  - lstm
  - attention
updated: 2025-12-18
---

# Recurrent Neural Networks

Language, audio and time series are *ordered*. An RNN consumes a sequence one element at a time, keeping a summary in a hidden state:

$$
h_t = \tanh(W_{hh} h_{t-1} + W_{xh} x_t + b)
$$

The same weights are reused at every step — parameter sharing across *time* instead of across space (contrast [[cnn]]).

## Backpropagation Through Time

Unroll the recurrence and differentiate through the whole chain. The gradient of the loss at step $T$ w.r.t. an early state involves a long product:

$$
\frac{\partial h_T}{\partial h_1} = \prod_{t=2}^{T} \frac{\partial h_t}{\partial h_{t-1}}
$$

That product is the source of the famous **vanishing gradient**: long-range dependencies fade exponentially.

> [!warning] Why it mattered
> "The cat, which sat on the mat that was in the house…, *was* full." An RNN must carry the subject across the whole clause. Plain RNNs fail at this routinely.

## Fixes That Came Next

1. **Gates** — learn what to forget and what to keep: [[lstm]].
2. **Content-based addressing** — instead of squeezing everything through $h_t$, let the output *look back* at every state: this is [[attention]].

## Connections

- Gradient products: the same math as in [[backpropagation]]'s chain.
- Attention was invented *inside* RNNs before escaping them: [[attention]], then [[transformers]] removed recurrence entirely.

A good lecture-level overview: [Stanford CS224N, lecture 6](https://web.stanford.edu/class/cs224n/).
