---
title:  Context Construction, Generation & Citations  
type: Notes
level: 
status: 
tags:
  - programming  
  - Agentic AI 
  - python
  - RAG
---


## Context Construction

### What is Context Construction?

**Context Construction** is the process of taking retrieved information and preparing the **final context** that will be given to the LLM.

Retrieval gives us candidate chunks.

Context construction decides:

> **Which information should actually be given to the LLM, in what order, and in what format?**

```text
User Query
    ↓
Retrieval
    ↓
Retrieved Chunks
    ↓
Context Construction
    ↓
Final Context
    ↓
LLM
```



## Why Context Construction Matters

Retrieval may return several chunks, but not every chunk should necessarily be placed directly into the prompt.

Poor context can cause:

* Irrelevant information
* Duplicate information
* Conflicting information
* Excessive context
* Important information being buried
* Higher token usage
* Higher latency
* Poorer answers

**Good context** should be:

* Relevant
* Concise
* Well organized
* Non-duplicated
* Easy for the LLM to understand



## Context Selection

Suppose retrieval returns:

```text
Chunk 1 → Highly relevant
Chunk 2 → Somewhat relevant
Chunk 3 → Irrelevant
Chunk 4 → Highly relevant
Chunk 5 → Duplicate of Chunk 1
```

Context construction can select:

```text
Chunk 1
Chunk 4
```

instead of passing everything.

This reduces noise and allows the model to focus on useful information.



## Context Ordering

The order of retrieved information can affect generation quality.

For example:

```text
Context:

[Document A]
[Document B]
[Document C]
[Document D]
```

is not always equivalent to:

```text
Context:

[Document C]
[Document A]
[Document D]
[Document B]
```

A common problem is the **Lost-in-the-Middle** effect.

Important information placed in the middle of a long context may receive less attention than information near the beginning or end.

Therefore, context ordering can be important when many chunks are retrieved.



## Deduplication

Different chunks may contain overlapping information.

Example:

```text
Chunk 1:
"The company was founded in 2010."

Chunk 2:
"The company, founded in 2010, initially had 10 employees."
```

Passing both may waste context space.

Deduplication removes highly redundant information.

```text
Retrieved Chunks
       ↓
Remove duplicates
       ↓
Clean Context
```


##  Context Formatting

The retrieved information should be presented in a structure the LLM can easily understand.

Example:

```text
SYSTEM:
Answer the user's question using the provided context.

CONTEXT:

[Source 1]
The company was founded in 2010.

[Source 2]
The company initially had 10 employees.

QUESTION:
When was the company founded?
```

Structured formatting makes the relationship between:

* instructions
* context
* question

clear to the model.


## Context Window

An LLM has a maximum amount of information it can process in a single request.

This is called the **context window**.

```text
Context Window
┌──────────────────────────────┐
│ System Instructions          │
│ User Query                   │
│ Retrieved Context            │
│ Conversation History         │
│ Other Information            │
└──────────────────────────────┘
```

If too much information is inserted:

```text
Too much context
      ↓
Higher token usage
      ↓
Higher latency/cost
      ↓
Potentially worse attention
```

Therefore:

> More context ≠ always better context.

The goal is **useful context**, not maximum context.


## Context Compression

Sometimes retrieved documents are useful but contain unnecessary information.

Context compression attempts to keep the important information while removing irrelevant content.

```text
Large Retrieved Chunk
        ↓
Compression
        ↓
Relevant Information
        ↓
LLM
```

This can reduce:

* Token usage
* Latency
* Noise


## Context Construction Pipeline

A practical pipeline can look like:

```text
Retrieved Chunks
      ↓
Filter
      ↓
Deduplicate
      ↓
Compress
      ↓
Order
      ↓
Format
      ↓
Final Context
```

Not every RAG system needs every step.



##  Core Mental Model

```text
Retrieval answers:

"What information might be relevant?"

Context Construction answers:

"What information should the LLM actually see?"
```


## Generation

### What is Generation?

**Generation** is the process where the LLM uses the constructed context and the user's query to produce the final answer.

```text
Query
  +
Context
  ↓
LLM
  ↓
Generated Answer
```

In RAG:

> The LLM should use retrieved context as the knowledge source for answering the question.


## Grounded Generation

**Grounded generation** means generating an answer based on the provided evidence.

Example:

```text
Context:
"The company was founded in 2010."

Question:
"When was the company founded?"

Answer:
"The company was founded in 2010."
```

The answer is directly supported by the context.


## Ungrounded Generation

If the model generates information that is not supported by the retrieved context, the answer may be ungrounded.

```text
Context:
"The company was founded in 2010."

Question:
"When was the company founded?"

Bad answer:
"The company was founded in 2008 by John Smith."
```

The additional claims are not supported by the provided context.

## Hallucination Control

RAG does not automatically eliminate hallucinations.

The model can still generate information that is not supported by the retrieved documents.

A common instruction is:

```text
Answer using only the provided context.

If the context does not contain enough information,
say that the information is unavailable.
```

This encourages grounded responses.

However:

> Prompt instructions alone cannot guarantee zero hallucinations.

The quality of retrieval, context construction, model, and evaluation all matter.


## Handling Insufficient Context

A good RAG system should recognize when the retrieved information is insufficient.

Example:

```text
Question:
Who founded the company?

Retrieved Context:
The company was founded in 2010.
```

The context provides the year but not the founder.

The system should avoid inventing a founder.

```text
Answer:

"The provided information does not specify who founded
the company."
```


##  Generation Pipeline

```text
User Query
     ↓
Retrieved Documents
     ↓
Context Construction
     ↓
Prompt
     ↓
LLM
     ↓
Generated Answer
```


## Citations

### What are Citations?

**Citations** connect claims in the generated answer back to the original sources used by the RAG system.

Example:

```text
The company was founded in 2010. [1]
```

```text
[1] company_history.pdf, page 3
```

This allows the user to verify the answer.


### Why Citations Matter

Citations provide:

* **Trust** — users can verify claims.
* **Transparency** — users can see where information came from.
* **Traceability** — answers can be connected to source documents.
* **Debugging** — developers can inspect whether the correct source was retrieved.

Citations are especially useful in:

* Enterprise RAG
* Research systems
* Legal systems
* Documentation assistants
* Customer support
* Knowledge bases

---

## Source Metadata

For citations, retrieved chunks should usually carry source information.

Example:

```text
Chunk:
"The company was founded in 2010."

Metadata:
{
    "document": "company_history.pdf",
    "page": 3,
    "section": "History"
}
```

The metadata allows the generated answer to reference the original source.


## Chunk → Source Mapping

A useful mental model is:

```text
Document
   ↓
Chunks
   ↓
Embeddings
   ↓
Vector DB
   ↓
Retrieved Chunk
   ↓
Source Metadata
   ↓
Generated Answer
   ↓
Citation
```

The system needs to preserve the relationship between a retrieved chunk and its original source.



## Citation Placement

Citations can be placed:

### After a claim

```text
The company was founded in 2010. [1]
```

### After multiple related claims

```text
The company was founded in 2010 and initially
had 10 employees. [1]
```

### With source information

```text
The company was founded in 2010.

Source: company_history.pdf, page 3
```

The exact format depends on the application.


## Citation Correctness

A citation existing does **not** necessarily mean the answer is correct.

Consider:

```text
Answer:
The company was founded in 2010. [1]

Source [1]:
"The company was founded in 2015."
```

The answer has a citation, but the citation contradicts the claim.

Therefore we care about:

> **Does the cited source actually support the claim?**

---

## Faithfulness

**Faithfulness** measures whether the generated answer is supported by the provided context.

```text
Context
   ↓
Generated Answer
   ↓
Is the answer supported?
```

High faithfulness:

```text
Context:
"The product costs $50."

Answer:
"The product costs $50."
```

Low faithfulness:

```text
Context:
"The product costs $50."

Answer:
"The product costs $50 and has a 2-year warranty."
```

The warranty claim is unsupported.


## Complete RAG Flow

These three concepts fit together:

```text
                    RAG
                     │
         ┌───────────┴───────────┐
         ↓                       ↓
     Retrieval              User Query
         ↓
 Retrieved Chunks
         ↓
 ┌─────────────────────┐
 │ Context Construction │
 └──────────┬──────────┘
            ↓
      Final Context
            ↓
        LLM Prompt
            ↓
       Generation
            ↓
      Generated Answer
            ↓
        Citations
            ↓
     Original Sources
```



## Quick Reference

| Concept               | Main Purpose                                     |
| --------------------- | ------------------------------------------------ |
| Context Construction  | Prepare useful retrieved information for the LLM |
| Context Selection     | Keep relevant information                        |
| Deduplication         | Remove repeated information                      |
| Context Ordering      | Arrange information effectively                  |
| Context Compression   | Reduce unnecessary information                   |
| Context Window        | Limit of information the model can process       |
| Generation            | Produce the final answer                         |
| Grounded Generation   | Generate using retrieved evidence                |
| Hallucination Control | Reduce unsupported claims                        |
| Citations             | Connect answers to sources                       |
| Source Metadata       | Preserve document/source information             |
| Citation Correctness  | Verify that citations support claims             |
| Faithfulness          | Measure whether answers are supported by context |

---

# 27. One-Line Summary

> **Context Construction prepares the evidence, Generation produces the answer, and Citations connect the answer back to that evidence.**
