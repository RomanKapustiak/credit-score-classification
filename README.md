# Credit Score Classification

An end-to-end machine learning project designed to predict client credit scores (`Good`, `Standard`, `Poor`). This repository contains the complete Data Science pipeline—from Exploratory Data Analysis (EDA) to advanced Modeling—and a Next.js web application for real-time model testing.

## Project Overview

This project addresses the financial challenge of credit scoring by balancing accuracy with risk management. Unlike standard classification approaches, this model implements a **"Risk-First" inference strategy** to minimize financial losses associated with false negatives (defaulting clients).

### Key Features
- **Comprehensive EDA**: In-depth analysis, outlier detection, and feature engineering.
- **Advanced Modeling**: Ensemble methods (XGBoost, CatBoost, Random Forest) tuned with Optuna.
- **Risk-First Logic**: A custom inference mechanism that prioritizes detecting "Poor" credit risks before classifying "Good" or "Standard" clients.
- **Interactive Web App**: A modern UI to input customer data and get instant predictions.

---

## Project Structure

- **`notebooks/credit-score-eda.ipynb`**
  Contains the data analysis pipeline:
  - Data cleaning (handling missing values, typos, and outliers).
  - Feature visualization (histograms, boxplots, correlation matrices).
  - Feature engineering and transformation.

- **`notebooks/credit-score-modeling.ipynb`**
  Contains the machine learning pipeline:
  - Data preprocessing (Scaling, Encoding, SMOTE/Undersampling).
  - Feature selection (RFE, Statistical testing).
  - Hyperparameter tuning using **Optuna**.
  - Final model training (XGBoost) and evaluation using the custom threshold logic.

- **`app/` (Web Application)**
  The frontend application built with Next.js to demonstrate the model.

---

## Getting Started

### Web Application (Next.js)

To run the interface for testing the model:

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, start the development server:

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to access the app.

---

## The "Risk-First" Approach
Standard models often use `argmax` to select the class with the highest probability. However, in credit scoring, missing a "Poor" client (False Negative) is significantly more expensive than rejecting a "Good" one (False Positive).

Our solution implements a hierarchical inference logic:

1.  **Stage 1: Risk Detection (One-vs-Rest)**
    The model checks: *"Is this client 'Poor'?"* using a custom probability threshold optimized for Recall/F1-Score on the minority class.
    If $P(Poor) \geq Threshold$, the client is classified as **Poor** regardless of other probabilities.

2.  **Stage 2: Standard Classification**
    If the client passes the risk check (i.e., is not classified as "Poor"), the model then decides between "Standard" and "Good" based on the highest probability.

---

