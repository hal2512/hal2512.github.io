<!--
  HTML comments like this one are not shown on the site.
  Your notes say: do NOT publish BSH data, code or BSH-branded material without professor/BSH approval.
  So this page has no repo link and leaves out fleet-level business figures. If BSH approves, you could add
  the aborted-program analysis (325k aborted programs, ~307,000 wrong-default events per year).
-->

## Results at a glance

| Metric | Result |
|---|---|
| Top-1 accuracy | **70%** |
| Top-3 accuracy (correct drink among the top 3 predictions) | **94%** |
| Current appliance default (repeat the last drink) | 60.0% top-1 · 76.5% top-3 |
| Improvement over the default | **+10.0 pp** top-1 · **+17.5 pp** top-3 |

<figure>
<img src="/projects/bsh/headline-results.png" alt="Bar chart of top-1 and top-3 accuracy on 4,875,828 test events. Last drink (machine today): 60.0% and 76.5%. 30-day counter with no model: 65.8% and 92.4%. LightGBM model: 70.0% and 94.0%. A dashed line marks the 95% target." loading="lazy" />
<figcaption>Top-1 and top-3 accuracy on 4,875,828 held-out test events, compared with what the machine does today.</figcaption>
</figure>

On machines with at least 100 cups of history (92.3% of traffic), top-3 accuracy reaches **94.4%**, and **98.5%** for habitual households. That clears the brief's 95% target for that group.

---

## Problem

Connected coffee machines currently pre-select whatever drink was made last time. The brief from BSH was to predict the **next** drink better than that default, so the right drink is already suggested when someone walks up to the machine.

The data: **83M+ real telemetry events** from **over 210k machines** in 60 countries, covering March 2025 to March 2026 (about 9.5 GB of Parquet).

---

## My role

Team project, presented at BSH in July 2026. I personally did:

- **Exploratory data analysis** and **device segmentation**
- **All feature engineering**
- The **modelling pipeline** and the **evaluation design**
- The **full-dataset runs** on a remote Linux workstation (125 GB RAM, via SSH and tmux)
- The internal **handover documentation** and the **technical presentation** at BSH

---

## Approach

### Feature engineering was the whole game

Most of the gain came from **causal per-device drink distributions**: each machine's drink mix over the previous 7 days, 30 days and its whole lifetime. They are computed only from **strictly earlier events** and keep updating through validation and test, exactly as a deployed system would.

<figure>
<img src="/projects/bsh/causal-distributions.png" alt="Timeline of one machine's past drinks as coloured dots, ending at the cup being predicted. Brackets mark the lifetime window and the last-30-days window. The count in a window is the cumulative count now, minus the cumulative count 30 days ago, minus the event itself, so only earlier events are used." loading="lazy" />
<figcaption>Each window only counts drinks made before the cup being predicted, so there is no leakage.</figcaption>
</figure>

I implemented them as differences of cumulative counts using an as-of join. 48 of the 84 features are these distributions, and they dominate the top 25 feature importances.

<figure>
<img src="/projects/bsh/feature-importance.png" alt="Horizontal bar chart of the top 25 features by LightGBM split gain. Almost all are 7-day and 30-day drink-share features; only two context features, log_gap_min and hour_cos, appear." loading="lazy" />
<figcaption>Top 25 features by split gain. Recent drink shares dominate; time of day barely appears.</figcaption>
</figure>

### Model

A **16-class LightGBM** gradient-boosting model, trained out-of-core with **Polars** (lazy and streaming) and **DuckDB** on the full dataset.

### Device segmentation

Before modelling, I segmented all machines hierarchically. Three rule-based steps separate cold-start, office and barista-mode machines. Then **k-means** splits the remaining households, with k chosen by a silhouette sweep. Results on a sample matched the full dataset within 1.7 pp for every segment.

---

## Evaluation

- **Strictly temporal** train / validation / test split, with no shuffling
- Early stopping on the validation month only, and **nothing tuned on the test set**
- Fixed random seeds throughout
- Results reported per segment and per history size
- Held-out test window of **4,875,828 events**

I also stated plainly that **more than 95% top-1 accuracy isn't achievable** on this data. The most common drink is only 27.9% of events, and one machine is often shared by several people. Since the machine can show three suggestions, **top-3 accuracy is the metric that matters** in practice.

### Accuracy by how much history a machine has

<figure>
<img src="/projects/bsh/accuracy-vs-history.png" alt="Line chart of accuracy against the number of events recorded on the machine before the prediction, from 1-5 up to 501 or more. Model top-3 rises from about 77% to about 95%. Model top-1 rises from about 55% to about 71% and stays above the last-drink default, which rises from about 52% to 60%." loading="lazy" />
<figcaption>The model beats the default even for brand-new machines, so it needs no warm-up period before switching on.</figcaption>
</figure>

### Accuracy by device segment

<figure>
<img src="/projects/bsh/per-segment.png" alt="Grouped bar chart of top-3 accuracy on machines with history, for four segments. Diverse occasional: default 66.1%, counter 88.3%, model 90.9%. Barista enthusiast: 77.3%, 93.2%, 94.7%. Office: 72.9%, 87.6%, 89.2%. Habitual routine: 89.0%, 98.0%, 98.5%." loading="lazy" />
<figcaption>The biggest gains come where the current default fails worst: households that drink a varied mix.</figcaption>
</figure>

---

## Key challenges

**A silent data bug.** My first implementation used a rolling-window function that returned rows in a different order. Every feature ended up attached to the wrong event, and top-3 accuracy fell to 40% without any error. I diagnosed it and replaced it with an order-preserving as-of join. I kept the broken run in the repo as evidence.

**Data leakage.** The earlier version picked the top 15 target classes using the whole dataset, including the test window. I changed it to select them from the training window only.

---

## Honest negative results

I deliberately reported what *didn't* work:

- **A simple 30-day counter**, with no machine learning, reaches 92.8% top-3 on machines with at least 100 cups of history, versus 94.4% for the model. So I recommended **shipping the counter on the device first**: it captures about 98% of the value with no cloud dependency.

<figure>
<img src="/projects/bsh/counter-vs-model.png" alt="Bar chart of top-3 accuracy on machines with history. Last drink: 76.76%. 30-day counter, about 20 lines of code running on the device: 92.78%. LightGBM model with 84 features in the cloud: 94.37%. The model adds only 1.59 percentage points over the counter." loading="lazy" />
<figcaption>A 20-line counter on the device gets within 1.59 pp of the full cloud model.</figcaption>
</figure>

- **A tuned blend of 4 predictors** ended up giving all its weight to the model alone at full scale.
- **Device segmentation doesn't raise accuracy.** I measured this. It helps explain and break down the results instead.
