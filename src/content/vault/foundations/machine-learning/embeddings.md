---
title: Embeddings
description: "Meaning as geometry — discrete symbols mapped to dense vectors you can do algebra on."
type: concept
level: beginner
status: understood
tags:
  - representation
  - embeddings
prerequisites:
  - linear-algebra
related:
  - tokenization
  - self-attention
updated: 2025-12-04
---

# Embeddings

An embedding is a learned lookup table: every symbol (word, token, user, node) gets a vector, and *geometry becomes semantics*.

## The Core Idea

$$
e: \text{symbol} \mapsto \mathbb{R}^d
$$

Similar meanings end up close under cosine similarity:

$$
\cos(u, v) = \frac{u \cdot v}{\|u\|\,\|v\|}
$$

## Famous Arithmetic

Word2Vec made the geometry concrete with analogies:

$$
v_{\text{king}} - v_{\text{man}} + v_{\text{woman}} \approx v_{\text{queen}}
$$

Directions in the space behave like *attributes* — a hint that trained models organize knowledge geometrically.

```python
import torch

embed = torch.nn.Embedding(num_embeddings=50_000, embedding_dim=256)
token_ids = torch.tensor([42, 1337, 7])
vectors = embed(token_ids)          # shape: (3, 256)
```

## Where Embeddings Live in Modern Models

1. **Token embeddings** — the first layer of every transformer ([[tokenization]] decides the vocabulary).
2. **Positional information** — added or injected, see [[positional-encoding]].
3. **Contextual embeddings** — after attention layers, the same token has a *different* vector depending on context ([[self-attention]]).
4. **Retrieval embeddings** — sentences or documents embedded for similarity search; the engine behind my [[semantic-retrieval]] project and [[memory]] in agents.

> [!tip] A useful mental model
> Think of an embedding matrix as a *basis change*: from sparse symbols to a dense space where [[linear-algebra]] can operate — and where [[linear-algebra|matrices]] can be multiplied by learned weights.

## Connections

- Input stage of [[neural-networks]]; transformed by [[transformers]].
- Distance in embedding space is the retrieval score in [[memory]] systems.
