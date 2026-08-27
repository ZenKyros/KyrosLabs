---
title: Sampling & Hypothesis Testing    
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - Proability
  -
---
## Sampling

A **population** is the complete group we want to study.
A **sample** is a specific subset of that target population.

Example:
* **Population:** All system users
* **Sample:** 10,000 systematically selected users

### Important Terms

* **Population Parameter:** The true, fixed, but usually unknown numerical value describing a population.
* **Sample Statistic:** An estimated value calculated directly from sample data, used to estimate the population parameter.

**Core Notation Example:**

$$\boxed{ \mu = \text{population mean} } \qquad \boxed{ \bar{x} = \text{sample mean} }$$

where:
* $\mu$ (Mu) represents the true average value across the entire population.
* $\bar{x}$ (x-bar) represents the average value calculated exclusively from the collected sample dataset.

### Sampling Methods
* **Simple Random Sampling:** Every member has an entirely equal chance of selection.
* **Stratified Sampling:** The population is divided into subgroups (strata), and samples are taken from each subgroup proportionally.
* **Systematic Sampling:** Selecting every $k$-th individual from a ordered list.
* **Cluster Sampling:** The population is divided into naturally occurring groups (clusters), and whole clusters are randomly chosen.

### Sampling Bias
Sampling bias occurs when the collection methodology ensures that certain members of the population are systematically more or less likely to be chosen than others, making the sample unrepresentative.



## Hypothesis Testing

Hypothesis testing evaluates a statistical claim or assumption about a population parameter.

### Null Hypothesis ($H_0$)
The baseline assumption that there is no structural effect, no change, or no difference between the groups being tested.

### Alternative Hypothesis ($H_a$ or $H_1$)
The claim we want to find evidence for, stating that a significant structural effect, change, or difference does exist.

### The $p$-value

The $p$-value measures the probability of obtaining test results at least as extreme as the observed data, assuming the null hypothesis ($H_0$) is completely true.

We reject the null hypothesis if:

$$\boxed{ p < \alpha }$$

where:
* $p$ is the calculated **$p$-value** probability score.
* $\alpha$ (Alpha) is the **significance level**, acting as a pre-determined threshold for rejecting $H_0$.
* A standard baseline significance level used across research and data analytics is:

$$\boxed{ \alpha = 0.05 }$$

**Important:** A $p$-value is NOT the probability that the null hypothesis ($H_0$) is true.


## Confidence Intervals

A confidence interval provides a range of plausible values for an unknown population parameter based on a calculated sample statistic.

### General Form
$$\boxed{ \text{Confidence Interval} = \text{Estimate} \pm \text{Margin of Error} }$$

where:
* $\text{Estimate}$ is the sample statistic (point estimate).
* $\text{Margin of Error}$ is the distance threshold added to and subtracted from the estimate.
* $\pm$ dictates the lower and upper bounds of the interval range.

### Population Mean Interval (Known $\sigma$)
When calculating a confidence interval for a population mean with a known population standard deviation, the explicit formula is:

$$\boxed{ \bar{x} \pm z^* \cdot \frac{\sigma}{\sqrt{n}} }$$

where:
* $\bar{x}$ is the calculated sample mean (point estimate).
* $z^*$ (z-star) is the **critical value** corresponding to the desired confidence level (e.g., $z^* = 1.96$ for a $95\%$ confidence level).
* $\sigma$ (Sigma) is the known **population standard deviation**.
* $n$ is the total **sample size** (number of observations).
* $\dfrac{\sigma}{\sqrt{n}}$ is the **standard error** of the mean, measuring sample-to-sample variability.

### 95% Confidence Interval Interpretation
A 95% confidence interval procedure means that if we repeat the sampling process an infinite number of times, approximately 95% of the calculated intervals will successfully capture the true, hidden population parameter.


## Regression Statistics

Regression analyses model and quantify the underlying relationships between independent inputs and a dependent target.

### Simple Linear Regression
Simple linear regression maps a linear relationship using a single input variable:

$$\boxed{ \hat{y} = b_0 + b_1x }$$

where:
* $\hat{y}$ (y-hat) is the **predicted target value** computed by the model.
* $b_0$ is the **y-intercept** (the value of $\hat{y}$ when the input $x = 0$).
* $b_1$ is the **slope coefficient** (the change in $\hat{y}$ for every one-unit increase in the input $x$).
* $x$ is the independent input variable (predictor/feature).



### Residual
The residual measures the exact vertical error distance between an individual observed data point and the model's predicted value:

$$\boxed{ e_i = y_i - \hat{y}_i }$$

where:
* $e_i$ is the **residual error** of the $i$-th individual observation.
* $y_i$ is the **actual, observed value** recorded in the dataset.
* $\hat{y}_i$ is the **predicted value** generated by the regression model for that specific data point.



### Ordinary Least Squares (OLS)
OLS is the optimization objective used to find the optimal line parameters by minimizing the total sum of all squared residual errors:

$$\boxed{ \text{Objective} = \sum_{i=1}^{n} (y_i - \hat{y}_i)^2 }$$

where:
* $\sum_{i=1}^{n}$ is the summation operator counting from the $1$-st observation up to the final $n$-th data point.
* $(y_i - \hat{y}_i)^2$ is the squared residual error of an individual observation (squared to prevent positive and negative errors from canceling each other out).



### Coefficient of Determination ($R^2$)
The $R^2$ score measures the exact proportion of total variance present in the dependent target variable that can be successfully explained by the independent features in the regression model.

$$\boxed{ R^2 = 1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}} }$$

where:
* $R^2$ is the **coefficient of determination** score.
* $SS_{\text{res}}$ is the **Sum of Squared Residuals** ($\sum e_i^2$), measuring the error variance left unexplained by the model line.
* $SS_{\text{tot}}$ is the **Total Sum of Squares** ($\sum (y_i - \bar{y})^2$), measuring the total baseline variance present in the raw data around the simple target mean.
* $\dfrac{SS_{\text{res}}}{SS_{\text{tot}}}$ represents the fraction of variance the model failed to capture.

### Interpretation Warning
While a higher $R^2$ score generally indicates that the model captures a larger percentage of variance, **a high $R^2$ does not automatically mean the model is high-quality or specified correctly**. It can be falsely inflated by over-fitting or adding completely irrelevant features.
