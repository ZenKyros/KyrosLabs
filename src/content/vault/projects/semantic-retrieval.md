---
title: Semantic Retrieval Engine
description: "A retrieval pipeline over my own notes — embeddings, ANN search and reranking as a callable tool."
type: project
level: intermediate
status: experimented
tags:
  - retrieval
  - embeddings
  - rag
tech:
  - Python
  - FAISS
  - sentence-transformers
updated: 2026-01-17
created: 2025-12-28
---

# Semantic Retrieval Engine

A small retrieval-augmented pipeline that indexes this very knowledge vault: chunk every note, embed the chunks, and answer "which of my notes talks about X?" with ranked, cited results. It doubles as the retrieval *tool* for agent experiments ([[tool-calling]]).

## Pipeline

```
notes.md → chunk (≈256 tokens, 32 overlap)
        → embed (sentence-transformers)
        → FAISS index (HNSW)
        → query: embed → top-50 ANN → cross-encoder rerank → top-5
```

## The Core Equation

Retrieval is [[attention]] with an external memory bank:

$$
\text{results}(q) = \underset{c \in \text{chunks}}{\text{top-}k}\; \cos\big(e(q), e(c)\big)
$$

The reranker replaces the cheap cosine with an expensive joint encoding — the classic recall/precision split.

```python
scores = index.search(query_vec, k=50)
pairs = [(query, chunk.text) for chunk in scores]
ranked = reranker.predict(pairs)          # cross-encoder
cited = [attach_source(c) for c in ranked[:5]]
```

## Experiments

| Configuration | Recall@5 (50 qrels) |
| --- | --- |
| BM25 | 0.62 |
| Dense only | 0.71 |
| Dense + rerank | 0.83 |

> [!note] Failure mode worth remembering
> Queries phrased as *questions* ("why does attention scale badly?") retrieve worse than keyword-like queries. Query rewriting with a small LLM fixed most of it — a cheap win before touching the model.

## What I Learned

- Chunking strategy beats embedding model choice at this data size.
- Citation is a *product* feature: answers without provenance are untrustworthy.
- The memory analogy is precise — see [[memory]] for the agent-side framing.

## Connections

Built on [[embeddings]], [[attention]], [[tokenization]] and [[memory]]; evaluated against a [[bert]]-family reranker.
