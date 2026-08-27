---
title: Conditional Probability, Bayes, MLE & MAP    
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - Proability
  -
---
# Conditional Probability, Bayes, MLE & MAP

## Conditional Probability

Conditional probability calculates the likelihood of an event occurring, given that another event has already occurred.

$$\boxed{ P(A \mid B) = \frac{P(A \cap B)}{P(B)} }$$

where:
* $P(A \mid B)$ is the **conditional probability** of event $A$ occurring given that event $B$ has already occurred.
* $\mid$ represents the conditional "given that" structural barrier.
* $\cap$ represents the **intersection** operator (meaning both event $A$ and event $B$ occur simultaneously).
* $P(A \cap B)$ is the joint probability of both events happening.
* $P(B)$ is the marginal probability of event $B$, acting as the new reduced sample space ($P(B) > 0$).



### Product Rule

Derived by rearranging the conditional probability formula, the product rule calculates the joint probability of two events:

$$\boxed{ P(A \cap B) = P(A \mid B) \cdot P(B) }$$

$$\boxed{ P(A \cap B) = P(B \mid A) \cdot P(A) }$$

where:
* $P(A \cap B)$ is the joint probability that events $A$ and $B$ both happen.
* $P(A \mid B)$ is the probability of $A$ given $B$.
* $P(B \mid A)$ is the probability of $B$ given $A$.
* $\cdot$ represents the standard multiplication operator.



### Independence

If events $A$ and $B$ are completely independent, the occurrence of $B$ provides zero new information about the likelihood of $A$:

$$\boxed{ P(A \mid B) = P(A) }$$

where:
* $P(A \mid B)$ is the conditional probability of $A$ given $B$.
* $P(A)$ is the baseline, unconditioned marginal probability of event $A$.



## Bayes' Theorem

Bayes' theorem allows us to invert conditional probabilities, updating our beliefs about a hypothesis as new evidence arrives.

$$\boxed{ P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)} }$$

where:
* $P(A \mid B)$ is the **Posterior probability** (the updated probability of hypothesis $A$ after observing evidence $B$).
* $P(B \mid A)$ is the **Likelihood** (the probability of observing evidence $B$ if hypothesis $A$ is true).
* $P(A)$ is the **Prior probability** (our baseline belief about hypothesis $A$ before seeing any evidence).
* $P(B)$ is the **Evidence** (the total marginal probability of observing evidence $B$ across all possible hypotheses, acting as a normalizing constant).

### Key Proportional Idea

Since the evidence term $P(B)$ is a constant scale factor, Bayes' theorem can be expressed as a clean geometric proportion:

$$\boxed{ \text{Posterior} \propto \text{Likelihood} \times \text{Prior} }$$

where:
* $\propto$ is the mathematical symbol for "is proportional to".

### AI Applications

Bayes' theorem forms the structural core of:
* Naive Bayes Classification
* Spam filtering algorithms
* Dynamic Bayesian networks
* Hyperparameter optimization (Bayesian Optimization)
* Medical diagnostic systems

## Maximum Likelihood Estimation (MLE)

MLE is a frequentist parameter estimation method that selects the parameter values that maximize the probability of observing the collected dataset.

$$\boxed{ \hat{\theta}_{\text{MLE}} = \operatorname*{\arg\max}_{\theta} P(D \mid \theta) }$$

where:
* $\hat{\theta}_{\text{MLE}}$ is the final **maximum likelihood estimate** for the unknown parameters.
* $\operatorname*{\arg\max}$ (argument of the maximum) is the operator that outputs the specific parameter value $\theta$ that maximizes the target function.
* $\theta$ represents the parameter vector being optimized.
* $D$ represents the observed dataset.
* $P(D \mid \theta)$ is the **Likelihood function**, measuring how probable the observed data is under different parameter setups.

### Log-Likelihood Optimization

In practice, we maximize the natural logarithm of the likelihood function to convert products into sums, preventing numerical underflow:

$$\boxed{ \hat{\theta}_{\text{MLE}} = \operatorname*{\arg\max}_{\theta} \ln P(D \mid \theta) }$$

where:
* $\ln$ (or $\log$) represents the natural logarithm operator.
* $\ln P(D \mid \theta)$ is the **log-likelihood function**.

### Intuition

> Find the parameters that best explain the observed data.

MLE is directly connected to many common machine learning loss functions, such as Mean Squared Error (under a Gaussian noise assumption) and Cross-Entropy Loss (under a Bernoulli/Categorical assumption).


## Maximum A Posteriori (MAP)

MAP is a Bayesian parameter estimation method that calculates the optimal parameters by combining the observed data likelihood with an explicit prior belief about the parameter distribution.

$$\boxed{ \hat{\theta}_{\text{MAP}} = \operatorname*{\arg\max}_{\theta} P(\theta \mid D) }$$

where:
* $\hat{\theta}_{\text{MAP}}$ is the final **maximum a posteriori estimate** for the parameters.
* $P(\theta \mid D)$ is the **posterior distribution** of the parameters given the observed data.

### Expansion via Bayes' Theorem

Applying Bayes' theorem and dropping the constant denominator $P(D)$ yields:

$$\boxed{ \hat{\theta}_{\text{MAP}} = \operatorname*{\arg\max}_{\theta} P(D \mid \theta) \cdot P(\theta) }$$

where:
* $P(D \mid \theta)$ is the data likelihood.
* $P(\theta)$ is the **Prior distribution** representing our assumptions about the parameters before observing data.

### Log-MAP Optimization

Applying logarithms transforms the product into a clear, separate additive optimization statement:

$$\boxed{ \hat{\theta}_{\text{MAP}} = \operatorname*{\arg\max}_{\theta} \left[ \ln P(D \mid \theta) + \ln P(\theta) \right] }$$

where:
* $\ln P(D \mid \theta)$ is the data log-likelihood block.
* $\ln P(\theta)$ is the parameter log-prior block (this term acts mathematically as a **regularization term**, such as L2/Ridge regularization when using a Gaussian prior).


## MLE vs MAP Summary

### MLE Objective
$$\boxed{ \operatorname*{\arg\max}_{\theta} \ln P(D \mid \theta) }$$
* **Core Constraint:** relies entirely on the collected data sample.

### MAP Objective
$$\boxed{ \operatorname*{\arg\max}_{\theta} \left[ \ln P(D \mid \theta) + \ln P(\theta) \right] }$$
* **Core Constraint:** blends the collected data sample with an external prior constraint.

### Key Takeaway

* **MLE asks:** *"What parameter values make my collected dataset look as likely as possible?"*
* **MAP asks:** *"What parameter values best explain my dataset while remaining consistent with my prior real-world beliefs?"*
