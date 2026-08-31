---
title: Pandas 
type: Notes
level: Beginner 
status: 
tags:
  - programming  
  - data handliong
  -  python
  
---

# Pandas

Pandas is a Python library for **working with structured and tabular data**. It is widely used in AI and Machine Learning for loading, exploring, cleaning, transforming, and preparing datasets.

```python
import pandas as pd
```

## Creating DataFrames

| Code                                       | Description                          |
| ------------------------------------------ | ------------------------------------ |
| `pd.DataFrame({"a": [1, 2], "b": [3, 4]})` | Create a DataFrame from a dictionary |
| `pd.DataFrame([{"a": 1}, {"a": 2}])`       | Create from a list of dictionaries   |
| `pd.read_csv("data.csv")`                  | Load a CSV file                      |
| `pd.read_excel("data.xlsx")`               | Load an Excel file                   |

## Inspecting Data

| Code            | Description                             |
| --------------- | --------------------------------------- |
| `df.head()`     | Show first 5 rows                       |
| `df.tail()`     | Show last 5 rows                        |
| `df.shape`      | Get `(rows, columns)`                   |
| `df.info()`     | Show columns, types, and missing values |
| `df.describe()` | Show basic statistics                   |
| `df.columns`    | Get column names                        |
| `df.index`      | Get row index                           |
| `df.dtypes`     | Get column data types                   |

## Selecting Data

| Code                  | Description                 |
| --------------------- | --------------------------- |
| `df["name"]`          | Select one column           |
| `df[["name", "age"]]` | Select multiple columns     |
| `df.loc[0]`           | Select row by label         |
| `df.loc[:, "name"]`   | Select a column using `loc` |
| `df.iloc[0]`          | Select row by position      |
| `df.iloc[0, 1]`       | Select value by position    |
| `df[df["age"] > 20]`  | Filter rows by condition    |

## Cleaning Data

| Code                                | Description                     |
| ----------------------------------- | ------------------------------- |
| `df.isna().sum()`                   | Count missing values            |
| `df.dropna()`                       | Remove rows with missing values |
| `df.fillna(0)`                      | Fill missing values             |
| `df.drop_duplicates()`              | Remove duplicate rows           |
| `df.rename(columns={"old": "new"})` | Rename columns                  |
| `df.astype(int)`                    | Change data type                |

## Adding & Removing Data

| Code                              | Description                   |
| --------------------------------- | ----------------------------- |
| `df["total"] = df["a"] + df["b"]` | Create a new column           |
| `df.drop(columns=["a"])`          | Remove a column               |
| `df.insert(1, "new", data)`       | Insert a column at a position |

## Sorting

| Code                                       | Description              |
| ------------------------------------------ | ------------------------ |
| `df.sort_values("score")`                  | Sort by a column         |
| `df.sort_values("score", ascending=False)` | Sort in descending order |

## Aggregating Data

| Code                  | Description                  |
| --------------------- | ---------------------------- |
| `df["score"].sum()`   | Calculate the sum            |
| `df["score"].mean()`  | Calculate the mean           |
| `df["score"].count()` | Count values                 |
| `df["score"].min()`   | Find minimum                 |
| `df["score"].max()`   | Find maximum                 |
| `df["score"].std()`   | Calculate standard deviation |
| `df["score"].var()`   | Calculate variance           |

## Grouping Data

| Code                                     | Description                     |
| ---------------------------------------- | ------------------------------- |
| `df.groupby("category").mean()`          | Calculate mean for each group   |
| `df.groupby("category").sum()`           | Calculate sum for each group    |
| `df.groupby("category")["score"].mean()` | Mean of a column for each group |
| `df.groupby(["a", "b"]).count()`         | Group by multiple columns       |

## Combining Data

| Code                                            | Description                   |
| ----------------------------------------------- | ----------------------------- |
| `pd.concat([df1, df2])`                         | Combine DataFrames by rows    |
| `pd.concat([df1, df2], axis=1)`                 | Combine DataFrames by columns |
| `pd.merge(df1, df2, on="id")`                   | Merge using a common column   |
| `pd.merge(df1, df2, left_on="a", right_on="b")` | Merge using different columns |

## Applying Functions

| Code                                  | Description                         |
| ------------------------------------- | ----------------------------------- |
| `df["score"].apply(lambda x: x ** 2)` | Apply a function to a column        |
| `df["grade"].map({"A": 1, "B": 2})`   | Map values to new values            |
| `df["name"].str.lower()`              | Convert text to lowercase           |
| `df["name"].str.contains("a")`        | Check whether text contains a value |

## Working With Dates

| Code                         | Description         |
| ---------------------------- | ------------------- |
| `pd.to_datetime(df["date"])` | Convert to datetime |
| `df["date"].dt.year`         | Extract year        |
| `df["date"].dt.month`        | Extract month       |
| `df["date"].dt.day`          | Extract day         |

## Input & Output

| Code                                    | Description   |
| --------------------------------------- | ------------- |
| `pd.read_csv("data.csv")`               | Load CSV      |
| `df.to_csv("data.csv", index=False)`    | Save as CSV   |
| `pd.read_excel("data.xlsx")`            | Load Excel    |
| `df.to_excel("data.xlsx", index=False)` | Save as Excel |

## Pandas in AI & ML

Pandas is mainly used during the **data preparation stage**.

```text
Raw Dataset
    ↓
   Pandas
    ↓
Inspect → Clean → Transform
    ↓
NumPy / Scikit-learn / PyTorch
    ↓
Machine Learning Model
```
