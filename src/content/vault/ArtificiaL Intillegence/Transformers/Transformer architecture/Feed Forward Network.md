---
title: Feed Forward Network, Layer Normalization & Residual Connections 
type: Notes
level: Beginner
status:
tags:

* Deep Learning
* Transformers
* Attention
* Python
---

## Feed Forward Networks (FFN)

> After Multi-Head Attention identifies important relationships between tokens, the Feed Forward Network (FFN) processes each token independently to extract higher-level features and increase the model's representational power.

---

### Intuition

Think of Attention as:

```text
"What information is important?"
```

and FFN as:

```text
"How should I transform that information?"
```

Attention gathers information.

FFN processes and refines that information.

---

### Position Inside a Transformer Block

```text
Multi-Head Attention
        │
        ▼
    Add & Norm
        │
        ▼
Feed Forward Network
        │
        ▼
    Add & Norm
```

Every Encoder and Decoder layer contains an FFN.

---

### Structure of an FFN

A Feed Forward Network is simply a small neural network:

```text
Input
  │
  ▼

Linear Layer
  │
  ▼

Activation Function
  │
  ▼

Linear Layer
  │
  ▼

Output
```

---

### Mathematical Form

Original Transformer:

$$
FFN(x)
=
W_2 \; ReLU(W_1x+b_1)+b_2
$$

Modern LLMs often use:

$$
FFN(x)
=
W_2 \; GELU(W_1x+b_1)+b_2
$$

where:

- $W_1$ = Expansion matrix
- $W_2$ = Projection matrix
- $b_1,b_2$ = Bias terms

---

### Expansion and Compression

Example:

```text
Input Dimension = 768
```

FFN expands it:

```text
768 → 3072
```

then compresses it:

```text
3072 → 768
```

Visualization:

```text
768
 │
 ▼

3072
 │
 ▼

768
```

This allows the network to learn richer features.

---

### Why Expansion Helps

Expanding dimensions creates more space for learning complex patterns.

Example:

```text
cat
```

After attention:

```text
animal
pet
fur
living thing
subject
```

FFN combines and refines these features into a stronger representation.

---

### Token-Wise Processing

A key property:

```text
FFN processes every token independently.
```

Example:

```text
Token 1 → FFN
Token 2 → FFN
Token 3 → FFN
Token 4 → FFN
```

No communication occurs between tokens inside FFN.

Token communication happens only in Attention.

---

### Attention vs FFN

Attention:

```text
Token ↔ Token Interaction
```

FFN:

```text
Token → Feature Transformation
```

Attention learns relationships.

FFN learns richer representations.

---

### Modern FFN Variants

Many modern LLMs use:

```text
Gated FFN
SwiGLU
GEGLU
```

instead of traditional FFN.

Examples:

```text
LLaMA
PaLM
Gemma
```

These variants improve learning and performance.

---

### Why FFN Is Important

Without FFN:

```text
Attention only mixes information.
```

The model would have limited ability to learn complex transformations.

FFN provides:

- Non-linearity
- Feature extraction
- Representation learning
- Higher model capacity

---

### FFN in the Encoder

```text
Input
  │
  ▼

Multi-Head Attention
  │
  ▼

Add & Norm
  │
  ▼

Feed Forward Network
  │
  ▼

Add & Norm
```

Purpose:

```text
Understand and refine input representations.
```

---

### FFN in the Decoder

```text
Masked Attention
       │
       ▼

Cross Attention
       │
       ▼

Feed Forward Network
       │
       ▼

Token Prediction
```

Purpose:

```text
Refine information before predicting next tokens.
```

---



## Residual Connections

> Residual Connections allow information to bypass layers directly, helping deep networks train efficiently without losing important information.

---

### Intuition

Instead of learning:

```text
Output = F(x)
```

the model learns:

```text
Output = x + F(x)
```

where:

- $x$ = Original input
- $F(x)$ = Layer output

The original information is preserved.

---

### Formula

$$
y=x+F(x)
$$

This is called a skip connection.

---

### Why Do We Need Residual Connections?

Deep networks suffer from:

- Vanishing gradients
- Information loss
- Difficult training

As layers increase:

```text
Input
 ↓
Layer 1
 ↓
Layer 2
 ↓
Layer 3
 ↓
...
 ↓
Layer 96
```

Information may degrade.

Residual connections provide a shortcut path.

---

### Visualization

Without Residual:

```text
x
 │
 ▼
Layer
 │
 ▼
Output
```

With Residual:

```text
      x
      │
      ├──────────────┐
      │              │
      ▼              │
    Layer            │
      │              │
      ▼              │
     F(x)            │
      │              │
      └──────+───────┘
             │
             ▼
          Output
```

---

### Benefits

#### Better Gradient Flow

Gradients can travel directly through skip paths.

#### Easier Optimization

Layers only learn:

```text
What should be added?
```

instead of learning everything from scratch.

#### Information Preservation

Important features remain available throughout the network.

#### Enables Deep Models

Without residual connections:

```text
GPT-4
LLaMA
Gemma
Claude
```

would be much harder to train.

---

### Residual Connections in Transformers

After Attention:

```text
Output = x + Attention(x)
```

After FFN:

```text
Output = x + FFN(x)
```

Thus every major sublayer includes a residual path.

---

### Transformer Block

```text
Input
  │
  ▼

Attention
  │
  ▼

Add (Residual)
  │
  ▼

LayerNorm
  │
  ▼

FFN
  │
  ▼

Add (Residual)
  │
  ▼

LayerNorm
```



## Layer Normalization

> Layer Normalization (LayerNorm) stabilizes activations and keeps training more consistent across layers.

---

### Why Do We Need LayerNorm?

During training:

```text
Layer 1 Output
Layer 2 Output
Layer 3 Output
...
```

may have wildly different scales.

Example:

```text
Layer A → values around 5

Layer B → values around 5000
```

This makes optimization unstable.

LayerNorm fixes this.

---

### Core Idea

Normalize activations so they have:

```text
Mean ≈ 0
Variance ≈ 1
```

This helps maintain stable signal flow.

---

### Formula

Mean:

$$
\mu=\frac{1}{n}\sum x_i
$$

Variance:

$$
\sigma^2=\frac{1}{n}\sum (x_i-\mu)^2
$$

Normalization:

$$
LayerNorm(x)
=
\frac{x-\mu}{\sqrt{\sigma^2+\epsilon}}
\gamma+\beta
$$

where:

- $\gamma$ = Learnable scale
- $\beta$ = Learnable shift
- $\epsilon$ = Small constant

---

### Intuition

Before normalization:

```text
[100, 200, 300]
```

After normalization:

```text
[-1.22, 0, 1.22]
```

Values become more stable.

---

### Benefits

#### Stable Training

Prevents exploding activations.

#### Faster Convergence

Optimization becomes easier.

#### Better Gradient Flow

Reduces training instability.

#### Works Well With Residual Connections

LayerNorm and Residuals are designed to work together.

---

### Placement in Transformers

Classic Transformer:

```text
Attention
    │
    ▼

Add
    │
    ▼

LayerNorm
```

then:

```text
FFN
 │
 ▼

Add
 │
 ▼

LayerNorm
```

---

### Residual + LayerNorm Together

A Transformer block is often described as:

```text
Attention
     │
     ▼

Add & Norm

     │
     ▼

FFN

     │
     ▼

Add & Norm
```

where:

```text
Add
=
Residual Connection

Norm
=
Layer Normalization
```

---

### Why These Two Always Appear Together

Residual Connection:

```text
Preserves Information
```

LayerNorm:

```text
Stabilizes Information
```

Together they enable extremely deep Transformers.

---

### Transformer Block Summary

```text
Input
 │
 ▼

Multi-Head Attention
 │
 ▼

Add & Norm
 │
 ▼

Feed Forward Network
 │
 ▼

Add & Norm
 │
 ▼

Output
```
