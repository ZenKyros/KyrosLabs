---
title: Nano-Transformer
description: "A transformer implemented from scratch in PyTorch — every line accountable, trained on tiny Shakespeare."
type: project
level: intermediate
status: implemented
tags:
  - implementation
  - transformers
  - pytorch
tech:
  - PyTorch
  - Python
  - CUDA
updated: 2026-01-25
created: 2025-11-30
---

# Nano-Transformer

A minimal, honest implementation of the [[transformers]] architecture — no framework magic, every tensor's shape annotated in comments. The goal is not performance; it is *accountability*: I can point at the line where each idea from [[attention-is-all-you-need]] lives.

## Architecture

- 6 layers, $d_{\text{model}} = 384$, 6 heads, GELU FFNs at $4d$
- Pre-norm residual blocks exactly as in [[transformers]]
- Causal masking for autoregressive generation
- Weight-tied input/output [[embeddings|embeddings]] over a BPE vocabulary ([[tokenization]])

## Key Components

| Component | Note it implements |
| --- | --- |
| `scaled_dot_product` | [[self-attention]] |
| `MultiHead` with KV-cache | [[multi-head-attention]] |
| `rope` | [[positional-encoding]] |
| `train.py` loop | [[backpropagation]] + AdamW ([[gradient-descent]]) |

```python
def forward(self, x):
    h = self.tok_emb(x) + self.pos_emb(torch.arange(x.size(1)))
    for block in self.blocks:
        h = block(h)                     # residual attention + FFN
    logits = self.ln_f(h) @ self.tok_emb.weight.T   # weight tying
    return logits
```

## Training

TinyShakespeare, 300M tokens of patience on one GPU. Final validation loss 1.46 — the model generates plausible iambic nonsense, which is the correct result at this scale.

## Results

| Metric | Value |
| --- | --- |
| Params | 10.8M |
| Val loss | 1.46 |
| Throughput | 41k tok/s (A10G) |
| Bugs found by shape asserts | 7 |

## What I Learned

> [!tip] The lesson that stuck
> Pre-norm vs post-norm changes the required warmup dramatically; the $1/\sqrt{d_k}$ is not optional; and the KV-cache is just memoized [[self-attention]] — which is why [[speculative-decoding]] can attack it.

## Connections

Uses [[transformers]], [[self-attention]], [[tokenization]], [[backpropagation]] — and reproduces the core of [[attention-is-all-you-need]].
