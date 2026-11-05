## Results at a glance

| Finding | Result |
|---|---|
| Plain model on imbalanced data | 85% accuracy, but **0% recall on prediabetes** |
| Best balanced accuracy (class-weighted Logistic Regression) | **~0.52**, matched but not beaten by tuned Random Forest and SVM |
| 5-question, no-lab feature subset | keeps **~96%** of performance |
| Binary framing: healthy vs. at-risk | **ROC-AUC 0.82** |

---

## Problem

Can we predict whether someone is **healthy, prediabetic or diabetic** from a health survey alone? The data is the CDC's **BRFSS 2015** survey: **253,680 records** and **21 features**, with a severe **46:1 class imbalance**.

---

## My role

Team of 2. I ran the EDA, preprocessing, the full modelling pipeline, the experiments and analysis, and built the presentation and its reasoning.

---

## Approach

- **Models:** Logistic Regression as the base model, then Random Forest and a kernel SVM
- **Validation:** stratified split and k-fold cross-validation
- **Tuning:** RandomizedSearchCV and GridSearchCV, run with cross-validation on the **training data only** so tuning never sees the test set
- **Imbalance:** class weighting
- **Metrics:** balanced accuracy, macro-F1 and per-class recall instead of plain accuracy

---

## The accuracy trap

A plain model scores **85% accuracy** but **never predicts prediabetes**: 0% recall on that class. Accuracy looks good only because most people in the data are healthy. That's why I reported balanced accuracy, macro-F1 and per-class recall instead.

---

## A well-argued negative result

Tuned Random Forest and SVM only **tied** a class-weighted Logistic Regression at about 0.52 balanced accuracy. The limit is the **data, not the model**.

Prediabetes is only 1.8% of the data, and it has **no distinct feature signature**: it sits between healthy and diabetic. No amount of model tuning can separate a class the features can't tell apart.

---

## Original contribution

- **A cheap screening subset:** just **5 survey questions**, with no lab tests, keep about **96%** of the full model's performance.
- **A more useful framing:** predicting **healthy vs. at-risk** (prediabetic or diabetic) reaches **ROC-AUC 0.82**.

---

## Stack

`Python` · `scikit-learn` · `pandas` · `NumPy` · `matplotlib`
