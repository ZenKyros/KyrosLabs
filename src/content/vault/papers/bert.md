---
title: "BERT: Pre-training of Deep Bidirectional Transformers"
description: "Masked language modeling — teaching a transformer to read both directions at once."
type: paper
authors:
  - Devlin
  - Chang
  - Lee
  - Toutanova
year: 2018
venue: NAACL 2019
url: https://arxiv.org/abs/1810.04805
topics:
  - pretraining
  - masked-lm
  - transfer-learning
concepts:
  - transformers
  - tokenization
tags:
  - landmark
  - nlp
status: understood
related:
  - gpt-3
updated: 2025-12-22
---

# BERT

## Why This Paper Matters

BERT showed that a single pretrained model, *fine-tuned with a task head*, could set records on eleven NLP benchmarks at once. It established the **pretrain → fine-tune** paradigm and proved bidirectional context matters for understanding tasks.

## Core Idea

Pretrain a [[transformers|transformer]] encoder with two self-supervised tasks:

1. **Masked LM** — hide 15% of tokens; predict them from *both* sides.
2. **Next Sentence Prediction** — classify whether two segments are consecutive (later shown to matter little).

The mask breaks the autoregressive constraint, letting information flow left *and* right — impossible in GPT-style causal models.

## The Masking Schedule

| Of the 15% masked | Replacement |
| --- | --- |
| 80% | `[MASK]` |
| 10% | random token |
| 10% | unchanged |

The mix prevents train/inference mismatch: at inference there are no `[MASK]` tokens, so the model must handle all three cases.

## Mathematics

Standard cross-entropy over masked positions plus the NSP classifier:

$$
\mathcal{L} = -\sum_{i \in \mathcal{M}} \log p(x_i \mid x_{\setminus \mathcal{M}}) \;-\; \log p_{\text{NSP}}
$$

## My Understanding

BERT is the *encoder* branch of [[attention-is-all-you-need]] taken seriously: comprehension over generation. Its embeddings became the default sentence encoder for retrieval — my [[semantic-retrieval]] project starts from exactly this lineage.

## Implementation

Trivia: BERT's tokenizer is WordPiece, the predecessor of the BPE variants discussed in [[tokenization]]. Fine-tuning is a few epochs, tiny learning rates ($2\text{e-}5$), and a single linear head.

## Related Concepts

[[transformers]] · [[tokenization]]

## Follow-up Papers

- [[gpt-3]] — argues the opposite direction: decoder-only + scale beats fine-tuning.
