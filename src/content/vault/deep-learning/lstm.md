---
title: LSTM
description: "Gated memory — learning what to forget, write and read from a long-lived cell state."
type: concept
category: deep-learning
level: intermediate
status: understood
tags:
  - deep-learning
  - sequences
prerequisites:
  - rnn
related:
  - attention
updated: 2025-12-20
---

# LSTM

The Long Short-Term Memory network fixes the [[rnn]]'s vanishing gradient with *gates*: learned sigmoids that control an additive memory channel.

## The Cell State Highway

Memory $c_t$ is updated **additively**, so gradients can flow long distances without multiplying through saturating functions:

$$
c_t = f_t \odot c_{t-1} + i_t \odot \tilde c_t
$$

## The Three Gates

| Gate | Formula role | Intuition |
| --- | --- | --- |
| Forget $f_t$ | $\sigma(W_f [h_{t-1}, x_t])$ | what to erase |
| Input $i_t$ | $\sigma(W_i [h_{t-1}, x_t])$ | what to write |
| Output $o_t$ | $\sigma(W_o [h_{t-1}, x_t])$ | what to reveal |

$$
h_t = o_t \odot \tanh(c_t)
$$

> [!note] The forgotten trick
> The forget gate did not exist in the original 1997 paper — it was added later and turned out to matter more than any other piece. Defaults matter.

## Where LSTMs Still Win

- Small-data time-series forecasting.
- Streaming settings where a fixed-size state is a feature.
- Baselines — always know what you are beating.

But for language, content-addressed memory replaced gated memory: [[attention]] reads *any* past step directly, no compression bottleneck.

## Connections

- Gates are sigmoids from [[activation-functions]]; training is still [[backpropagation]] through time.
- The direct successor is [[attention]] → [[transformers]].
