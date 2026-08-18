---
title: Latent Reasoning Without Tokens
description: "Can a transformer reason in continuous latent space instead of emitting chain-of-thought tokens?"
type: research
level: advanced
status: research
hypothesis: "Iterated latent refinement — repeated attention passes over a compressed thought state — can match token-level chain-of-thought on multi-hop reasoning at a fraction of the decoding cost."
tags:
  - research
  - reasoning
  - architecture
updated: 2026-01-21
created: 2026-01-12
---

# Latent Reasoning Without Tokens

## Hypothesis

> Chain-of-thought forces reasoning through the *vocabulary bottleneck*: discrete, lossy, expensive tokens. A recurrent latent "thought buffer" refined by $T$ attention passes can carry the same computation denser and cheaper.

## Motivation

CoT works — but each reasoning token costs a full forward pass, and language is a low-bandwidth serialization of thought ([[pretraining]] teaches the model to *compress* the web; forcing it to re-expand reasoning into English feels backwards). If intermediate states can stay continuous, reasoning cost decouples from output length.

## Literature

- Coconut — continuous chains of thought via recurrent latent states.
- Pause tokens / think-before-you-speak — extra computation without semantic tokens.
- Looped transformers — depth-as-iteration results suggesting fixed points exist.

## Proposed Architecture

$$
z^{(t+1)} = z^{(t)} + \text{Attn}\big(z^{(t)},\, C\big), \qquad t = 1 \dots T
$$

where $C$ is the encoded context and $z^{(0)}$ a learned query bundle. After $T$ refinements, a single decoding pass reads out the answer. Residual updates follow the correction-on-identity prior from [[deep-residual-learning]].

## Experiments

| Benchmark | CoT baseline | Latent (T=8) | Target |
| --- | --- | --- | --- |
| GSM8K (toy 3B) | 61% | ? | ≥ 58% |
| Proof-writing subset | 44% | ? | ≥ 40% |
| Decode tokens used | ~350 | ~60 | ≤ 100 |

## Limitations

- Latent states are *unauditable* — a real safety cost versus readable CoT.
- Training signal for $T$ passes: backprop through 8 attention passes is precisely the depth problem [[backpropagation]] warns about; residuals and gradient checkpointing will be needed.

## Open Questions

- Is there an *adaptive* $T$? A halting head (à la PonderNet) would make compute input-dependent.
- Does this compose with [[agent-loop]] systems — latent planning, token-level acting?
- Can [[memory]] consolidation run in latent space between episodes?

## Connections

Builds on [[transformers]], [[attention]], [[agent-loop]], [[memory]]; inspired by gaps noticed while running [[rlhf-playground]] evaluations.
