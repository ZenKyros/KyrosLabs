---
title: Transformers
description: "Attention is all you need — the architecture that turned out to be all you need."
type: concept
category: transformers
level: intermediate
status: mastered
tags:
  - transformers
  - architecture
prerequisites:
  - self-attention
  - multi-head-attention
  - positional-encoding
related:
  - pretraining
papers:
  - attention-is-all-you-need
  - bert
updated: 2026-01-12
---

# Transformers

The Transformer ([Vaswani et al., 2017](https://arxiv.org/abs/1706.03762)) discarded recurrence and convolution and built a sequence model from three ingredients only: [[self-attention]], pointwise feed-forward layers, and [[positional-encoding|positional information]]. It is the skeleton of essentially every modern language, vision and multimodal model.

## One Block, Written Out

$$
\begin{aligned}
z &= x + \text{MultiHead}\big(\text{LN}(x)\big) \\
y &= z + \text{FFN}\big(\text{LN}(z)\big)
\end{aligned}
$$

That is the entire deep-learning content: attention mixes *across* positions, the FFN transforms *within* each position, residuals let gradients flow, norms keep scale sane.

```python
class Block(nn.Module):
    def __init__(self, d, heads):
        super().__init__()
        self.attn = nn.MultiheadAttention(d, heads, batch_first=True)
        self.ffn  = nn.Sequential(nn.Linear(d, 4*d), nn.GELU(), nn.Linear(4*d, d))
        self.ln1, self.ln2 = nn.LayerNorm(d), nn.LayerNorm(d)

    def forward(self, x):
        x = x + self.attn(self.ln1(x), self.ln1(x), self.ln1(x), need_weights=False)[0]
        x = x + self.ffn(self.ln2(x))
        return x
```

## Encoder vs Decoder

| | Encoder | Decoder |
| --- | --- | --- |
| Attention mask | none (bidirectional) | causal (past only) |
| Cross-attention | — | attends to encoder |
| Canonical model | [[bert]] | GPT family ([[gpt-3]]) |
| Pretraining task | fill the blank | predict the next |

## Why It Scaled

1. **Parallel training** — no recurrence, so GPUs see big dense matmuls.
2. **Shallow gradient paths** — residuals give every layer a highway to the loss.
3. **Capacity where it counts** — width and depth both scale smoothly with data (see [[scaling-laws]]).

> [!paper] The claim that named the paper
> "Attention Is All You Need" is a falsifiable statement: no recurrence, no convolution. Twenty-some billion-parameter models later, the title has held up better than most paper titles.

## Connections

- Assembled from [[self-attention]], [[multi-head-attention]], [[positional-encoding]].
- Trained at scale: [[pretraining]]; aligned afterwards: [[instruction-tuning]], [[rlhf]].
- Implemented from scratch in my [[nano-transformer]] project.
