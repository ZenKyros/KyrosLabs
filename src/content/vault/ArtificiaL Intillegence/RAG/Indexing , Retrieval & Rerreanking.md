---
title:  Indexing Retrieval & Ranking  
type: Notes
level: Beginner 
status: 
tags:
  - programming  
  - Agentic AI 
  - python
  - RAG
---
# Indexing, Retrieval & Reranking

##  Overview

In a RAG system, finding the most useful documents usually happens in three stages:

```text
Query
  ↓
Indexing / Vector Search
  ↓
Retrieval
  ↓
Reranking
  ↓
Best Documents
  ↓
Context → LLM
```

These three concepts solve different problems:

* **Indexing** → How can we search a large collection of vectors efficiently?
* **Retrieval** → Which documents are potentially relevant to the query?
* **Reranking** → Among the retrieved documents, which are actually the most relevant?

---

## Indexing

### What is Indexing?

An **index** is a data structure that organizes vectors so that we can find similar vectors efficiently.

Without an index, we may need to compare the query vector with **every vector** in the database.

```text
Query Vector
     ↓
Compare with Vector 1
Compare with Vector 2
Compare with Vector 3
...
Compare with Vector N
```

For a large database, this becomes expensive.

An index reduces the amount of work needed to find good candidates.


###  Exact Search

The simplest approach is **brute-force / exact nearest-neighbor search**.

For every query:

```text
Query
 ↓
Compare against ALL vectors
 ↓
Calculate similarity/distance
 ↓
Sort results
 ↓
Return Top-K
```

If there are:

* $N$ vectors
* $d$ dimensions

the basic comparison work is roughly:

$$
O(Nd)
$$

This gives very accurate results but becomes expensive as $N$ grows.

---

# 4. Approximate Nearest Neighbor (ANN)

**ANN** tries to find very good nearest neighbors without checking every vector.

Instead of:

```text
Search ALL vectors
```

we do:

```text
Search a smaller set of promising candidates
```

This gives a trade-off:

$$
\text{Speed} \leftrightarrow \text{Recall}
$$

Higher search effort usually gives better recall but increases latency.

---

# 5. HNSW

**HNSW (Hierarchical Navigable Small World)** is a popular graph-based ANN indexing algorithm.

Instead of organizing vectors only as a list, HNSW creates a graph where vectors are connected to other nearby vectors.

Conceptually:

```text
        A
       / \
      B   C
     / \   \
    D   E---F
         \
          G
```

A query starts from a point in the graph and moves toward vectors that are increasingly similar to the query.

### Mental Model

Think of HNSW like navigating a map:

```text
Start
  ↓
Go toward promising area
  ↓
Move to closer neighbors
  ↓
Explore nearby candidates
  ↓
Return best matches
```

You do **not** need to understand the implementation details yet.

---

# 6. IVF

**IVF (Inverted File Index)** divides the vector space into groups called **clusters**.

Example:

```text
All vectors
    ↓
┌────────┬────────┬────────┐
│Cluster1│Cluster2│Cluster3│
└────────┴────────┴────────┘
```

For a query, we first identify the most relevant clusters and search mainly inside them.

```text
Query
  ↓
Find nearest clusters
  ↓
Search vectors inside those clusters
  ↓
Top-K
```

This reduces the search space.

---

# 7. Quantization

Quantization reduces the amount of memory required to store vectors and can improve search efficiency.

For example:

```text
FP32 → INT8
```

This reduces precision and may slightly affect accuracy, but can provide:

* Lower memory usage
* Faster computation
* Lower storage cost

Detailed quantization techniques can be learned later.

---

# 8. Retrieval

## What is Retrieval?

**Retrieval** is the process of finding documents that are relevant to a user's query.

Example:

```text
User Query
    ↓
Embedding
    ↓
Vector Search
    ↓
Candidate Documents
```

Suppose we have:

```text
Query: "How does backpropagation work?"

Retrieved:

1. Backpropagation explained
2. Gradient descent
3. Neural network training
4. CNN architecture
5. Python basics
```

The first few documents may be highly relevant, while others may be less useful.

---

# 9. Similarity Search

Retrieval commonly uses a similarity or distance metric.

### Cosine Similarity

$$
\cos(\theta)=
\frac{A\cdot B}
{\|A\|\|B\|}
$$

Higher cosine similarity generally means the vectors are more similar.

### Euclidean Distance

$$
d(A,B)=
\sqrt{\sum_{i=1}^{d}(A_i-B_i)^2}
$$

Lower distance means the vectors are closer.

---

# 10. Top-K Retrieval

Instead of returning every matching document, we normally retrieve the best $K$ candidates.

For example:

```text
K = 5
```

means:

```text
Query
 ↓
Search
 ↓
Top 5 candidate documents
```

A common RAG pipeline may retrieve more candidates than it ultimately sends to the LLM.

Example:

```text
Retrieve Top-20
      ↓
Rerank
      ↓
Keep Top-5
      ↓
Context
```

---

# 11. Retrieval Recall

Retrieval quality can be measured using **Recall@K**.

$$
Recall@K =
\frac{\text{Relevant documents retrieved}}
{\text{Relevant documents that should have been retrieved}}
$$

Example:

Suppose 5 relevant documents exist, and your Top-10 retrieval finds 4 of them:

$$
Recall@10 = \frac{4}{5}=0.8
$$

So:

$$
Recall@10 = 80\%
$$

High recall is important because if the correct document is never retrieved, the reranker cannot recover it.

---

# 12. Reranking

## What is Reranking?

**Reranking** takes the initially retrieved candidates and reorders them according to their relevance to the query.

Pipeline:

```text
Query
  ↓
Retriever
  ↓
Top-20 candidates
  ↓
Reranker
  ↓
Top-5 best documents
```

The retriever is optimized for **fast candidate retrieval**.

The reranker is optimized for **better relevance judgment**.

---

# 13. Why Reranking is Needed

Vector similarity does not always perfectly represent semantic relevance.

Example:

```text
Query:
"How do I reduce GPU memory usage during training?"
```

Initial retrieval:

```text
1. GPU architecture
2. GPU memory optimization
3. Deep learning training
4. CUDA programming
5. GPU history
```

A reranker can examine the **query and candidate document together** and determine that:

```text
GPU memory optimization
```

is more relevant than:

```text
GPU history
```

---

# 14. Bi-Encoder vs Cross-Encoder

### Bi-Encoder

The query and documents are embedded separately.

```text
Query ──→ Embedding
Document ──→ Embedding
              ↓
        Similarity Search
```

Advantages:

* Fast
* Scales well
* Good for initial retrieval

This is commonly used for vector search.

---

### Cross-Encoder

The query and document are processed together.

```text
Query + Document
       ↓
 Cross-Encoder
       ↓
 Relevance Score
```

Because the model directly examines the relationship between the query and document, it can usually make a stronger relevance judgment.

But it is more computationally expensive.

Therefore:

```text
Bi-Encoder → Retrieve many candidates quickly
Cross-Encoder → Rerank fewer candidates accurately
```

---

# 15. Complete Retrieval Pipeline

A typical RAG retrieval pipeline looks like:

```text
                    User Query
                        ↓
                    Query Embedding
                        ↓
                Vector Index Search
                        ↓
                 Retrieve Top-K
                        ↓
                  Candidate Set
                        ↓
                    Reranking
                        ↓
                Best Documents
                        ↓
                Context Construction
                        ↓
                       LLM
```

---

# 16. Retrieval vs Reranking

| Retrieval                 | Reranking                      |
| ------------------------- | ------------------------------ |
| Finds candidates          | Reorders candidates            |
| Very fast                 | More expensive                 |
| Searches large collection | Works on smaller candidate set |
| Optimized for recall      | Optimized for relevance        |
| Often uses vector search  | Often uses cross-encoder       |
| Example: Top-50           | Example: Top-5                 |

The key idea:

> **Retrieval finds the candidates; reranking chooses the best candidates.**

---

# 17. Important Trade-offs

A RAG retrieval system balances:

$$
\boxed{
\text{Recall}
\leftrightarrow
\text{Precision}
\leftrightarrow
\text{Latency}
\leftrightarrow
\text{Cost}
}
$$

For example:

```text
Retrieve Top-100
      ↓
High chance of finding relevant documents
      ↓
More reranking work
      ↓
Higher latency/cost
```

Whereas:

```text
Retrieve Top-5
      ↓
Fast
      ↓
But relevant documents may be missed
```

A good system finds the right balance.

---

# 18. Core Mental Model

Remember this:

```text
INDEXING
How can I search millions of vectors efficiently?
        ↓
RETRIEVAL
Which documents might be relevant?
        ↓
RERANKING
Which of those documents are actually the best?
```

Or:

$$
\boxed{
\text{Index}
\rightarrow
\text{Retrieve Candidates}
\rightarrow
\text{Rerank}
\rightarrow
\text{Top Results}
}
$$

---

# 19. What You Need to Know Now

### Must Understand

* Exact search
* ANN
* Vector indexes
* HNSW concept
* Top-K retrieval
* Similarity search
* Recall@K
* Candidate retrieval
* Why reranking is needed
* Bi-encoder vs Cross-encoder
* Retrieval → Reranking pipeline

### Quick Reference — Learn Later

* IVF in depth
* Product Quantization (PQ)
* Advanced quantization
* HNSW parameter tuning
* Sharding
* Replication
* Distributed vector search
* Multi-tenancy
* Advanced performance tuning

---

# 20. Final Mental Model

```text
Documents
    ↓
Chunking
    ↓
Embeddings
    ↓
Vector Database
    ↓
INDEX
    ↓
RETRIEVE candidates
    ↓
RERANK candidates
    ↓
Best documents
    ↓
Context
    ↓
LLM
    ↓
Answer
```

The three stages have one simple purpose:

$$
\boxed{
\text{Index efficiently}
\rightarrow
\text{Retrieve broadly}
\rightarrow
\text{Rerank accurately}
}
$$
