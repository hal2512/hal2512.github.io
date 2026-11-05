## Results at a glance

| Finding | Result |
|---|---|
| Plain model on imbalanced data | 85% accuracy, but **0% recall on prediabetes** |
| Best balanced accuracy (class-weighted Logistic Regression) | **0.52**, matched but not beaten by tuned Random Forest and SVM |
| 5 free survey questions, no lab values | keep **96.5%** of performance |
| Binary framing: healthy vs. at-risk | balanced accuracy **0.74**, **ROC-AUC 0.82** |

---

## Problem

Can a short health questionnaire, with no lab tests, predict whether someone is **healthy, prediabetic or diabetic**, well enough to flag who should get a real clinical test?

The data is the CDC's **BRFSS 2015** survey: **253,680 respondents**, **21 features**, no missing values, and a severe **46:1 class imbalance**.

<figure>
<img src="/projects/diabetes/class-imbalance.png" alt="Bar chart of the three classes. Healthy: 213,703 people (84.2%). Prediabetic: 4,631 (1.8%). Diabetic: 35,346 (13.9%)." loading="lazy" />
<figcaption>84% of respondents are healthy and only 1.8% prediabetic. A model that always says "healthy" already scores 84% accuracy.</figcaption>
</figure>

---

## My role

Team of 2. I ran the EDA, preprocessing, the full modelling pipeline, the experiments and analysis, and built the presentation and its reasoning.

---

## Why prediabetes is the hard part

On every strong feature (general health, BMI, high blood pressure, age), the class averages rise in the same order: healthy, then prediabetic, then diabetic. Prediabetes always sits **between** the other two. It looks like "mild diabetes", with no region of its own that a model could learn.

<figure>
<img src="/projects/diabetes/prediabetes-in-between.png" alt="Grouped bar chart of average feature values per class. General health: healthy 2.37, prediabetic 2.98, diabetic 3.29. BMI: 27.7, 30.7, 31.9. High blood pressure: 0.37, 0.63, 0.75. Age group: 7.8, 9.1, 9.4. Prediabetic is always between the other two." loading="lazy" />
<figcaption>Prediabetic averages always fall between healthy and diabetic, so models tend to fold it into its neighbours.</figcaption>
</figure>

---

## Approach

1. **Preprocessing:** a stratified 80/20 split. Features are standardised for Logistic Regression and the SVM, fitted on the training data only; tree models use the raw features.
2. **Imbalance:** class weights, so every class counts equally in the loss without changing the data.
3. **Baseline:** Logistic Regression, a simple and transparent bar the other models have to beat.
4. **Advanced models:** Random Forest and a kernel (RBF) SVM, tuned with RandomizedSearchCV and GridSearchCV using cross-validation on the **training data only**, so tuning never sees the test set.
5. **Metrics:** balanced accuracy, macro-F1 and per-class recall instead of plain accuracy. A model that only ever predicts the majority class scores just 0.33 balanced accuracy, so it can't fake a good result.

---

## The accuracy trap

<figure>
<img src="/projects/diabetes/accuracy-trap.png" alt="Two confusion matrices. Left, plain Logistic Regression: it never predicts prediabetes, and 91% of prediabetics and 83% of diabetics are labelled healthy. Right, class-weighted Logistic Regression: 66% of healthy, 33% of prediabetic and 58% of diabetic people are classified correctly." loading="lazy" />
<figcaption>Left: the plain model scores 85% accuracy but never predicts prediabetes. Right: with class weights, accuracy drops to 65%, yet it now catches 33% of prediabetics and 58% of diabetics.</figcaption>
</figure>

Accuracy fell while the model got better. That's why I judged every model on balanced accuracy, macro-F1 and per-class recall.

---

## A well-argued negative result

| Model | Balanced accuracy | Macro-F1 | Recall: healthy / prediabetic / diabetic | Accuracy |
|---|---|---|---|---|
| Logistic Regression (class-weighted) | **0.52** | 0.43 | 0.66 / **0.33** / 0.58 | 0.65 |
| Random Forest (tuned) | 0.51 | 0.43 | 0.69 / 0.15 / 0.69 | 0.68 |
| Kernel SVM (tuned) | 0.49 | 0.42 | 0.70 / 0.15 / 0.61 | 0.68 |

<figure>
<img src="/projects/diabetes/model-comparison.png" alt="Grouped bar chart of balanced accuracy, macro-F1 and prediabetes recall for five models. Dummy: 0.33, 0.30, 0.00. Plain Logistic Regression: 0.38, 0.39, 0.00. Class-weighted Logistic Regression: 0.52, 0.43, 0.33. Random Forest: 0.51, 0.43, 0.15. SVM: 0.49, 0.42, 0.15." loading="lazy" />
<figcaption>The tuned Random Forest and SVM only tie the simple class-weighted Logistic Regression. Prediabetes recall never goes above 0.33. (The SVM was trained and evaluated on stratified subsamples.)</figcaption>
</figure>

More powerful models add nothing here, because the limit is **missing signal for prediabetes, not model complexity**.

To check that the pipeline itself works, I ran the same code with the target merged into two classes: healthy vs. prediabetic-or-diabetic. Balanced accuracy jumps from **0.52 to 0.74**, with **ROC-AUC 0.82**. So the difficulty is specifically the prediabetes split, exactly as the data exploration predicted.

---

## Original contribution: how little data is needed?

<figure>
<img src="/projects/diabetes/cheap-features.png" alt="Grouped bar chart for three feature sets. All 21 features: binary balanced accuracy 0.74, binary ROC-AUC 0.82, 3-class balanced accuracy 0.52. 18 features without lab-related values: 0.73, 0.80, 0.51. Top 5 cheap survey questions: 0.72, 0.79, 0.49." loading="lazy" />
<figcaption>Five free survey questions keep almost all the performance of the full 21-feature model.</figcaption>
</figure>

- **Dropping the 3 clinical features** related to blood pressure and cholesterol keeps **97.7%** of performance.
- **Just 5 free survey questions** keep **96.5%** (ROC-AUC 0.82 → 0.79).

For a screening tool, the expensive clinical inputs are almost redundant: the signal is in cheap, self-reported answers.

---

## Stack

`Python` · `scikit-learn` · `pandas` · `NumPy` · `matplotlib`
