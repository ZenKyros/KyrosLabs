---
title: Self Attention
type: Notes
level: Beginner
status:
tags:

* Deep Learning
* Transformers
* Attention
* Python
---

# Self-Attention

## 1. What is Self-Attention?

**Self-Attention** is a mechanism that allows a model to determine how important each token is to every other token in the same sequence.

It allows each token to look at the other tokens and gather the information that is useful for understanding its meaning in context.

The key idea is:

> **Self-attention allows every token in a sequence to look at other tokens in the same sequence and determine which ones are relevant for understanding it.**

For example:

```
"The animal crossed the street because it was scared."
```

When processing the word **"it"**, the model can compare it with every other token:

```
The   animal   crossed   the   street   because   it   was   scared
 ↓      ↓         ↓       ↓       ↓        ↓      ↓     ↓      ↓
                       Compare with "it"
```

The model can learn that **"animal"** is highly relevant to understanding **"it"**.

---

# 2. Why Do We Need Self-Attention?

A token by itself often does not contain enough information to determine its meaning.

Consider:

```
"The bank was crowded."
```

The word **"bank"** could refer to a financial institution.

Now consider:

```
"The bank of the river was crowded."
```

The surrounding words provide additional information about the meaning of **"bank"**.

Self-attention allows the representation of a token to incorporate information from other tokens.

Therefore, instead of having a representation based only on the token itself:

```
bank
```

the model can create a contextual representation influenced by:

```
The
bank
of
the
river
was
crowded
```

This produces **context-dependent representations**.



##  Self-Attention vs General Attention

You already know the Scaled Dot-Product Attention equation:

$$
\operatorname{softmax}  
\left(  
\frac{QK^T}{\sqrt{d_k}}  
\right)V  
$$

The important question is:

> **Where do $Q$, $K$, and $V$ come from?**

In **self-attention**, Query, Key, and Value are all produced from the **same input sequence**.

$$  
Q = XW_Q  
$$

$$  
K = XW_K  
$$

$$  
V = XW_V  
$$

This is the defining characteristic of self-attention.

##  Input Representation

Suppose the input sequence is:

```
"The cat drank the milk"
```

Each token is represented by a vector.

Let the token representations be:

$$  
x_1, x_2, x_3, x_4, x_5  
$$

We combine them into an input matrix:

$$  
X =  
\begin{bmatrix}  
x_1 \  
x_2 \  
x_3 \  
x_4 \  
x_5  
\end{bmatrix}  
$$

If there are $n$ tokens and each token has dimension $d_{\text{model}}$, then:

$$  
X \in \mathbb{R}^{n \times d_{\text{model}}}  
$$

For example, if:

- Number of tokens = $5$
- Embedding dimension = $512$

then:

$$  
X \in \mathbb{R}^{5 \times 512}  
$$

Each row represents one token.

```
X

┌─────────────────────────────┐
│ representation of token 1   │
├─────────────────────────────┤
│ representation of token 2   │
├─────────────────────────────┤
│ representation of token 3   │
├─────────────────────────────┤
│ representation of token 4   │
├─────────────────────────────┤
│ representation of token 5   │
└─────────────────────────────┘

        5 × 512
```

## Creating Query, Key, and Value

The same input matrix $X$ is projected into three different spaces.

$$  
Q = XW_Q  
$$

$$  
K = XW_K  
$$

$$  
V = XW_V  
$$

where:

- $W_Q$ = Query projection matrix
- $W_K$ = Key projection matrix
- $W_V$ = Value projection matrix

These matrices are **learnable parameters**.

During training, the model learns values for these matrices that allow attention to capture useful relationships between tokens.



## Why Three Different Projections?

A common question is:

> If $Q$, $K$, and $V$ all come from the same $X$, why do we need three different matrices?

Because Query, Key, and Value have **different roles**.

### Query

The Query represents:

> **What information is this token looking for?**

### Key

The Key represents:

> **What information does this token offer for matching?**

### Value

The Value represents:

> **What information should actually be passed forward if this token receives attention?**

A useful analogy is a search system.

```
Query → What am I looking for?

Key   → What does each item match?

Value → What information should I retrieve?
```

Self-attention performs this process for every token simultaneously.

## Projection Dimensions

Suppose:

$$  
X \in \mathbb{R}^{n \times d_{\text{model}}}  
$$

and we want:

$$  
Q,K \in \mathbb{R}^{n \times d_k}  
$$

Then:

$$  
W_Q \in \mathbb{R}^{d_{\text{model}} \times d_k}  
$$

and:

$$  
W_K \in \mathbb{R}^{d_{\text{model}} \times d_k}  
$$

Therefore:

$$  
XW_Q  
$$

has shape:

$$  
(n \times d_{\text{model}})  
(d_{\text{model}} \times d_k)  
$$

which produces:

$$  
Q \in \mathbb{R}^{n \times d_k}  
$$

Similarly:

$$  
K \in \mathbb{R}^{n \times d_k}  
$$

For Values:

$$  
W_V \in \mathbb{R}^{d_{\text{model}} \times d_v}  
$$

giving:

$$  
V \in \mathbb{R}^{n \times d_v}  
$$

Therefore:

```
X : n × d_model

W_Q : d_model × d_k
W_K : d_model × d_k
W_V : d_model × d_v

        ↓

Q : n × d_k
K : n × d_k
V : n × d_v
```

## Computing Attention Scores

Once we have $Q$ and $K$, we calculate:

$$  
QK^T  
$$

This compares every Query with every Key.

Since:

$$  
Q \in \mathbb{R}^{n \times d_k}  
$$

and:

$$  
K^T \in \mathbb{R}^{d_k \times n}  
$$

we obtain:

$$  
QK^T \in \mathbb{R}^{n \times n}  
$$

This is called the **attention score matrix**.

##  Understanding the Attention Score Matrix

Suppose we have three tokens:

```
"I love cats"
```

The attention score matrix could conceptually look like:

$$  
QK^T =  
\begin{bmatrix}  
s_{11} & s_{12} & s_{13} \  
s_{21} & s_{22} & s_{23} \  
s_{31} & s_{32} & s_{33}  
\end{bmatrix}  
$$

Each row corresponds to a Query.

Each column corresponds to a Key.

For example:

$$  
s_{23}  
$$

means:

> How strongly does the Query of token 2 relate to the Key of token 3?

Therefore:

```
                 Keys
             1      2      3

Queries  1   s11    s12    s13
         2   s21    s22    s23
         3   s31    s32    s33
```

The matrix contains a score for **every Query-Key pair**.

##  Scaling the Scores

We already studied Scaled Dot-Product Attention.

The raw scores are divided by:

$$  
\sqrt{d_k}  
$$

Therefore:

$$  
S =  
\frac{QK^T}{\sqrt{d_k}}  
$$

This prevents the dot-product values from becoming unnecessarily large as the dimensionality increases.

For example, suppose:

$$  
d_k = 64  
$$

Then:

$$  
\sqrt{d_k} = 8  
$$

If:

$$  
QK^T =  
[16,\ 32,\ 48]  
$$

then:

$$
[2,\ 4,\ 6]  
$$

The scaled values are then passed to softmax.

## Softmax

The scaled scores are converted into attention weights:

$$  
A =  
\operatorname{softmax}  
\left(  
\frac{QK^T}{\sqrt{d_k}}  
\right)  
$$

Softmax converts each row into a probability distribution.

For example:

$$  
[2,\ 4,\ 6]  
$$

becomes approximately:

$$  
[0.016,\ 0.117,\ 0.867]  
$$

The values add up to approximately $1$:

$$  
0.016 + 0.117 + 0.867 = 1  
$$

This means the Query assigns:

```
Key 1 → 1.6%
Key 2 → 11.7%
Key 3 → 86.7%
```

The larger the attention weight, the more information the model takes from that Value.

## Attention Weight Matrix

The complete attention weight matrix is:

$$  
A =  
\operatorname{softmax}  
\left(  
\frac{QK^T}{\sqrt{d_k}}  
\right)  
$$

Its shape is:

$$  
A \in \mathbb{R}^{n \times n}  
$$

Every row corresponds to one Query.

Every column corresponds to one Key.

Each row sums to $1$.

For example:

$$  
A =  
\begin{bmatrix}  
0.7 & 0.2 & 0.1 \  
0.1 & 0.8 & 0.1 \  
0.2 & 0.3 & 0.5  
\end{bmatrix}  
$$

The first row means:

```
Query 1:

Key 1 → 70%
Key 2 → 20%
Key 3 → 10%
```

The second row means:

```
Query 2:

Key 1 → 10%
Key 2 → 80%
Key 3 → 10%
```

And so on.

## Applying Attention Weights to Values

The attention weights determine how much information to take from each Value.

We calculate:

$$  
O = AV  
$$

where:

$$  
A =  
\operatorname{softmax}  
\left(  
\frac{QK^T}{\sqrt{d_k}}  
\right)  
$$

Therefore:

$$  
\boxed{  
O =  
\operatorname{softmax}  
\left(  
\frac{QK^T}{\sqrt{d_k}}  
\right)V  
}  
$$

This is the complete self-attention operation.

##  Weighted Sum Intuition

Suppose a Query produces these attention weights:

$$  
[0.1,\ 0.7,\ 0.2]  
$$

and the corresponding Values are:

$$  
V_1,\ V_2,\ V_3  
$$

Then the output for that Query is:
$$ 
0.1V_1  
+  
0.7V_2  
+  
0.2V_3  
$$

The model takes:

- 10% of Value 1
- 70% of Value 2
- 20% of Value 3

and combines them into a new representation.

Therefore, the output representation contains information gathered from multiple tokens.


## Why Is It Called "Self"-Attention?

It is called **self-attention** because the Query, Key, and Value representations originate from the **same sequence**.

For example:

```
Input sequence
      ↓
      X
   /  |  \
  ↓   ↓   ↓
 Q    K    V
```

The sequence attends to itself.

Therefore:

$$  
Q = XW_Q  
$$

$$  
K = XW_K  
$$

$$  
V = XW_V  
$$

All three originate from $X$.



## Complete Self-Attention Pipeline

The entire process can be represented as:

```
Input sequence
      ↓
Token representations X
      ↓
 ┌────┼────┐
 ↓    ↓    ↓
Q     K    V
↓     ↓    ↓
└──→ QKᵀ ←┘
      ↓
Divide by √dₖ
      ↓
   Softmax
      ↓
Attention weights
      ↓
     × V
      ↓
Attention output
```

Mathematically:

$$  
Q = XW_Q  
$$

$$  
K = XW_K  
$$

$$  
V = XW_V  
$$

Then:

$$  
S =  
\frac{QK^T}{\sqrt{d_k}}  
$$

Then:

$$  
A = \operatorname{softmax}(S)  
$$

Finally:

$$  
O = AV  
$$

Combining everything:

$$  
\boxed{  
O =  
\operatorname{softmax}  
\left(  
\frac{(XW_Q)(XW_K)^T}  
{\sqrt{d_k}}  
\right)  
(XW_V)  
}  
$$

## Contextual Representations

One of the most important properties of self-attention is that the output representation of a token can contain information from other tokens.

Consider:

```
"The cat drank the milk."
```

The representation of **"cat"** can incorporate information from:

```
The
drank
milk
```

Similarly, the representation of **"milk"** can incorporate information from:

```
cat
drank
```

Therefore, the output representations are **contextualized**.

Instead of:

```
cat → fixed representation
```

we get something closer to:

```
cat + surrounding context → contextual representation
```

This is one of the fundamental ideas behind Transformer models.

##  Self-Attention Example

Consider:

```
"The animal crossed the street because it was scared."
```

Suppose we are processing:

```
"it"
```

The Query associated with `"it"` is compared against the Keys of all tokens.

Conceptually:

```
The       → low relevance
animal    → high relevance
crossed   → medium relevance
the       → low relevance
street    → low relevance
because   → medium relevance
it        → some relevance
was       → some relevance
scared    → medium relevance
```

After softmax, the model obtains attention weights.

The Value vectors are then combined according to these weights.

The resulting representation for `"it"` therefore contains information gathered from the surrounding context.

This allows the model to represent relationships such as:

```
"it" → "animal"
```

without requiring the two words to be adjacent.

##  Self-Attention Is Computed for Every Token

An important point is that we do not calculate attention only for one token.

We calculate it for **every token simultaneously**.

If there are $n$ tokens:

```
Token 1 → attends to all tokens
Token 2 → attends to all tokens
Token 3 → attends to all tokens
...
Token n → attends to all tokens
```

This is why:

$$  
QK^T  
$$

produces an:

$$  
n \times n  
$$

matrix.

Every row represents the attention distribution for one token.

##  20. Why Matrix Multiplication Is Useful

Instead of calculating every Query-Key comparison individually, matrix multiplication computes all pairwise comparisons at once.

Instead of:

```
Q₁ · K₁
Q₁ · K₂
Q₁ · K₃
...
Q₂ · K₁
Q₂ · K₂
...
```

we perform:

$$  
QK^T  
$$

This produces all Query-Key scores simultaneously.

This makes self-attention highly suitable for parallel computation on GPUs.

