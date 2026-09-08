---
title: Features & Level
type: Notes
level: Beginner
status:
tags:
  - Deep Learning
  - CNN
  - Computer Vision
  - Neural Networks
---
## 1. What is a Feature?
A **feature** is an individual measurable property or characteristic of a phenomenon being observed. In simpler terms, it is a column in your dataset used as an input variable for a machine learning model to make predictions.

---

## 2. Levels of Measurement (Data Types)
Data features are generally divided into two main categories: **Qualitative (Categorical)** and **Quantitative (Numerical)**. These are further broken down into four distinct levels of measurement:

### Qualitative / Categorical Data
* **Nominal Level**: Data that categorizes items without any inherent order or ranking.
  * *Examples*: Eye color (Blue, Brown, Green), Gender, Zip codes.
  * *ML Treatment*: Usually handled via **One-Hot Encoding**.
* **Ordinal Level**: Data that has a meaningful order or ranking, but the mathematical distance between values cannot be measured.
  * *Examples*: Customer satisfaction (Poor, Fair, Good, Excellent), Education level (High School, BSc, MSc, PhD).
  * *ML Treatment*: Handled via **Ordinal Encoding** to preserve the sequence.

### Quantitative / Numerical Data
* **Interval Level**: Data with a clear order and equal intervals between values, but it lacks a "true zero" point (zero does not mean the absence of the property).
  * *Examples*: Temperature in Celsius or Fahrenheit (0°C doesn't mean there is no temperature).
* **Ratio Level**: Data with equal intervals and a "true zero" point, meaning values can be meaningfully multiplied or divided.
  * *Examples*: Income, Weight, Age, Distance (0 dollars means no money).

---
