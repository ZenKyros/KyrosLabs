---
title: Tokenization
description: "Where language meets integers — BPE, vocabularies and the atomic units of every LLM."
type: concept
category: llms
level: intermediate
status: implemented
tags:
  - llm
  - tokenization
prerequisites:
  - embeddings
related:
  - pretraining
updated: 2026-01-14
---

# Tokenization

Before a model sees text, text becomes integers. Tokenization decides the alphabet — and the alphabet shapes everything downstream: vocabulary size, context economics, even multilingual fairness.

## Byte-Pair Encoding

Start from characters; iteratively merge the most frequent adjacent pair until the vocabulary reaches its budget:

```
low low low lowest  →  merge "l o" → "lo" → "lo w" → "low" ...
```

```python
# the whole idea in five lines
from collections import Counter
pairs = Counter(zip(tokens, tokens[1:]))
best = pairs.most_common(1)[0][0]
tokens = [best[0] + best[1] if (a, b) == best else x
          for (a, b) in zip(tokens, tokens[1:] + ["<END>"]) for x in [a]]
```

## Design Tensions

| Choice | Effect |
| --- | --- |
| Small vocab | short tables, long sequences |
| Large vocab | rare words atomic, embedding table huge |
| Subword units | graceful handling of the unknown |
| Byte fallback | never fails, but slow on OOD text |

GPT-3 used ~50k BPE tokens; LLaMA ~32k; recent models push 100k+ to favor non-English text.

> [!warning] Tokens are the currency of inference
> Cost scales with token count, not character count. Tokenizers that eat 4 tokens per word in your language quietly make every API call 4× more expensive — a real equity issue.

## From Integers to Vectors

Each token id indexes a row of the [[embeddings|embedding matrix]] — the first layer of every transformer. At the end, the same matrix (transposed, "weight-tied") turns logits back into a distribution over the vocabulary.

## Connections

- Feeds [[pretraining]] directly; vocabulary defines the softmax space.
- Token boundaries matter for agents: [[tool-calling]] schemas are tokenized too.
- Draft models in [[speculative-decoding]] must share a tokenizer with the target.
