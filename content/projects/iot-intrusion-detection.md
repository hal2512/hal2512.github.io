---
title: "IoT Network Intrusion Detection (RT-IoT2022)"
date: 2026-07-01
summary: "Built an MLP from scratch in PyTorch to detect network attacks in IoT traffic — 99.7% binary accuracy and 99.5% multi-class accuracy on 123K real network flow records with a 3,380:1 class imbalance."
tags: ["Python", "PyTorch", "Deep Learning", "Machine Learning", "scikit-learn", "SMOTE"]
---

## TL;DR

Trained a **Multi-Layer Perceptron built entirely from scratch in PyTorch** to classify IoT network traffic as normal or one of 9 attack types. The core challenge was a severe **3,380:1 class imbalance** — one attack class had only 28 samples in the entire dataset. Solved it with tuned SMOTE oversampling and careful evaluation using macro F1 (not accuracy).

| Task | Accuracy | Macro F1 |
|---|---|---|
| Binary (attack vs. normal) | **99.70%** | **0.9917** |
| 12-class (9 attacks + 3 normal) | **99.52%** | **0.9051** |

---

## Problem

IoT devices — smart bulbs, MQTT sensors, cloud-connected platforms — are low-powered and increasingly targeted by network attacks. Manual traffic monitoring doesn't scale to thousands of devices. The goal was to build a model that automatically classifies network flows as either benign or a specific attack type, fast enough to act as a real-time firewall layer.

**Two classification tasks:**
- **Task A — Binary:** is a flow an attack or not? (fast first-line filter)
- **Task B — Multi-class:** which of 12 categories does it belong to? (precise threat identification)

---

## Dataset: RT-IoT2022

The [RT-IoT2022 dataset](https://www.kaggle.com/datasets/rtiot2022/rt-iot2022) contains **123,117 real network flow records** from a controlled IoT testbed. Each record has 83 traffic features: two categorical (protocol, service) and 81 numerical (packet timing, sizes, TCP flag counts, etc.).

### The class imbalance problem

One class — `DOS_SYN_Hping` (a SYN flood attack) — makes up **76.9% of all records**. The rarest class, `NMAP_FIN_SCAN`, has just **28 samples**. A naive model that always predicts "SYN flood" would hit 77% accuracy while missing every other attack entirely.

<div style="margin: 1.5rem 0;">
<svg viewBox="0 0 680 430" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;font-family:system-ui,sans-serif;">
  <text x="340" y="22" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Class Distribution — RT-IoT2022 (linear scale)</text>

  <!-- legend -->
  <rect x="390" y="36" width="12" height="12" rx="2" fill="#e05c3a"/>
  <text x="406" y="47" font-size="11" fill="currentColor">Attack class</text>
  <rect x="510" y="36" width="12" height="12" rx="2" fill="#3a9bd5"/>
  <text x="526" y="47" font-size="11" fill="currentColor">Normal class</text>

  <!-- rows: label | bar | value -->
  <!-- row height 30, start y=60 -->

  <!-- DOS_SYN_Hping 76.9% → 420px -->
  <text x="188" y="80" text-anchor="end" font-size="11" fill="currentColor">DOS_SYN_Hping</text>
  <rect x="194" y="67" width="420" height="18" rx="3" fill="#e05c3a"/>
  <text x="618" y="80" font-size="11" fill="#e05c3a" font-weight="600">76.9%</text>

  <!-- Thing_Speak 6.6% → 36px -->
  <text x="188" y="110" text-anchor="end" font-size="11" fill="currentColor">Thing_Speak</text>
  <rect x="194" y="97" width="36" height="18" rx="3" fill="#3a9bd5"/>
  <text x="234" y="110" font-size="11" fill="currentColor" dx="4">6.6%</text>

  <!-- ARP_poisioning 6.3% → 34px -->
  <text x="188" y="140" text-anchor="end" font-size="11" fill="currentColor">ARP_poisioning</text>
  <rect x="194" y="127" width="34" height="18" rx="3" fill="#e05c3a"/>
  <text x="232" y="140" font-size="11" fill="currentColor" dx="4">6.3%</text>

  <!-- MQTT_Publish 3.4% → 19px -->
  <text x="188" y="170" text-anchor="end" font-size="11" fill="currentColor">MQTT_Publish</text>
  <rect x="194" y="157" width="19" height="18" rx="3" fill="#3a9bd5"/>
  <text x="217" y="170" font-size="11" fill="currentColor" dx="4">3.4%</text>

  <!-- NMAP_UDP_SCAN 2.1% → 12px -->
  <text x="188" y="200" text-anchor="end" font-size="11" fill="currentColor">NMAP_UDP_SCAN</text>
  <rect x="194" y="187" width="12" height="18" rx="3" fill="#e05c3a"/>
  <text x="210" y="200" font-size="11" fill="currentColor" dx="4">2.1%</text>

  <!-- NMAP_XMAS_TREE_SCAN 1.6% → 9px -->
  <text x="188" y="230" text-anchor="end" font-size="11" fill="currentColor">NMAP_XMAS_TREE</text>
  <rect x="194" y="217" width="9" height="18" rx="3" fill="#e05c3a"/>
  <text x="207" y="230" font-size="11" fill="currentColor" dx="4">1.6%</text>

  <!-- NMAP_OS_DETECTION 1.6% → 9px -->
  <text x="188" y="260" text-anchor="end" font-size="11" fill="currentColor">NMAP_OS_DETECTION</text>
  <rect x="194" y="247" width="9" height="18" rx="3" fill="#e05c3a"/>
  <text x="207" y="260" font-size="11" fill="currentColor" dx="4">1.6%</text>

  <!-- NMAP_TCP_scan 0.8% → 4px -->
  <text x="188" y="290" text-anchor="end" font-size="11" fill="currentColor">NMAP_TCP_scan</text>
  <rect x="194" y="277" width="4" height="18" rx="2" fill="#e05c3a"/>
  <text x="202" y="290" font-size="11" fill="currentColor" dx="4">0.8%</text>

  <!-- DDOS_Slowloris 0.4% → 2px -->
  <text x="188" y="320" text-anchor="end" font-size="11" fill="currentColor">DDOS_Slowloris</text>
  <rect x="194" y="307" width="3" height="18" rx="1" fill="#e05c3a"/>
  <text x="201" y="320" font-size="11" fill="currentColor" dx="4">0.4%</text>

  <!-- Wipro_bulb 0.2% → min visible -->
  <text x="188" y="350" text-anchor="end" font-size="11" fill="currentColor">Wipro_bulb</text>
  <rect x="194" y="337" width="3" height="18" rx="1" fill="#3a9bd5"/>
  <text x="201" y="350" font-size="11" fill="currentColor" dx="4">0.2%</text>

  <!-- Metasploit 0.03% -->
  <text x="188" y="380" text-anchor="end" font-size="11" fill="currentColor">Metasploit_BF_SSH</text>
  <rect x="194" y="367" width="2" height="18" rx="1" fill="#e05c3a"/>
  <text x="200" y="380" font-size="11" fill="currentColor" dx="4">0.03%</text>

  <!-- NMAP_FIN_SCAN 0.02% -->
  <text x="188" y="410" text-anchor="end" font-size="11" fill="currentColor">NMAP_FIN_SCAN</text>
  <rect x="194" y="397" width="2" height="18" rx="1" fill="#e05c3a"/>
  <text x="200" y="410" font-size="11" fill="currentColor" dx="4">0.02% — only 28 samples</text>
</svg>
</div>

*The linear scale is intentional — it makes the imbalance visible. The top bar alone represents 94,659 samples; the bottom represents 28.*

---

## My role

Group project (team of 3). I was personally responsible for:

- **Data pipeline** — writing `data_split.py` (stratified 60/20/20 split) and `data_preprocessing.py` (one-hot encoding, StandardScaler, SMOTE)
- **EDA & visualisation** — class distribution plots, feature variance, correlation heatmap
- **Model 1 (MLP)** — designing and training the full deep learning model from scratch in PyTorch, including custom training loop, DataLoaders, early stopping, and LR scheduling
- **Presentation** — presenting the dataset description and Model 1 results sections

---

## Preprocessing pipeline

```
Raw CSV (123,117 rows × 85 cols)
        │
        ▼
1. Stratified 60/20/20 split  ← fit nothing yet; split first to prevent leakage
        │
        ▼
2. One-Hot Encode (proto, service)  ← fit on TRAIN only → ~94 features
        │
        ▼
3. StandardScaler  ← fit on TRAIN only → zero mean, unit variance
        │
        ▼
4. SMOTE (k_neighbors=3)  ← applied to TRAIN only → balanced training set
        │
        ▼
   Train (SMOTE-balanced) │ Val (original dist.) │ Test (original dist.)
```

> **Why k=3 instead of the default 5?** `NMAP_FIN_SCAN` has only 28 total samples — after the 60/20/20 split that's ~17 training samples. SMOTE needs at least k neighbours per point, so we had to reduce k to 3 to synthesise new samples for the rarest class.

---

## Model 1 — MLP from scratch

Built without Keras or PyTorch Lightning — full custom training loop including gradient updates, early stopping on validation loss, and `ReduceLROnPlateau` scheduling.

### Architecture

<div style="margin: 1.5rem 0;">
<svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;font-family:system-ui,sans-serif;">

  <!-- Input -->
  <rect x="4" y="60" width="76" height="80" rx="6" fill="none" stroke="#888" stroke-width="1.5"/>
  <text x="42" y="95" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">Input</text>
  <text x="42" y="112" text-anchor="middle" font-size="11" fill="#888">94 features</text>

  <!-- arrow 1 -->
  <line x1="80" y1="100" x2="104" y2="100" stroke="#888" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Layer 1 -->
  <rect x="105" y="44" width="106" height="112" rx="6" fill="none" stroke="#e05c3a" stroke-width="1.5"/>
  <text x="158" y="66" text-anchor="middle" font-size="11" font-weight="600" fill="#e05c3a">Hidden 1</text>
  <text x="158" y="82" text-anchor="middle" font-size="10" fill="currentColor">Linear(94→128)</text>
  <text x="158" y="96" text-anchor="middle" font-size="10" fill="currentColor">BatchNorm</text>
  <text x="158" y="110" text-anchor="middle" font-size="10" fill="currentColor">ReLU</text>
  <text x="158" y="124" text-anchor="middle" font-size="10" fill="currentColor">Dropout(0.3)</text>
  <text x="158" y="141" text-anchor="middle" font-size="10" fill="#888">128 units</text>

  <!-- arrow 2 -->
  <line x1="211" y1="100" x2="235" y2="100" stroke="#888" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Layer 2 (widest) -->
  <rect x="236" y="30" width="106" height="140" rx="6" fill="none" stroke="#e05c3a" stroke-width="2"/>
  <text x="289" y="52" text-anchor="middle" font-size="11" font-weight="600" fill="#e05c3a">Hidden 2</text>
  <text x="289" y="68" text-anchor="middle" font-size="10" fill="currentColor">Linear(128→256)</text>
  <text x="289" y="82" text-anchor="middle" font-size="10" fill="currentColor">BatchNorm</text>
  <text x="289" y="96" text-anchor="middle" font-size="10" fill="currentColor">ReLU</text>
  <text x="289" y="110" text-anchor="middle" font-size="10" fill="currentColor">Dropout(0.3)</text>
  <text x="289" y="127" text-anchor="middle" font-size="10" fill="#888">256 units</text>
  <text x="289" y="141" text-anchor="middle" font-size="9" fill="#aaa">(widest layer)</text>
  <text x="289" y="155" text-anchor="middle" font-size="9" fill="#aaa">Kaiming init</text>

  <!-- arrow 3 -->
  <line x1="342" y1="100" x2="366" y2="100" stroke="#888" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Layer 3 -->
  <rect x="367" y="44" width="106" height="112" rx="6" fill="none" stroke="#e05c3a" stroke-width="1.5"/>
  <text x="420" y="66" text-anchor="middle" font-size="11" font-weight="600" fill="#e05c3a">Hidden 3</text>
  <text x="420" y="82" text-anchor="middle" font-size="10" fill="currentColor">Linear(256→128)</text>
  <text x="420" y="96" text-anchor="middle" font-size="10" fill="currentColor">BatchNorm</text>
  <text x="420" y="110" text-anchor="middle" font-size="10" fill="currentColor">ReLU</text>
  <text x="420" y="124" text-anchor="middle" font-size="10" fill="currentColor">Dropout(0.2)</text>
  <text x="420" y="141" text-anchor="middle" font-size="10" fill="#888">128 units</text>

  <!-- arrow 4 -->
  <line x1="473" y1="100" x2="497" y2="100" stroke="#888" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Layer 4 -->
  <rect x="498" y="58" width="106" height="84" rx="6" fill="none" stroke="#e05c3a" stroke-width="1.5"/>
  <text x="551" y="78" text-anchor="middle" font-size="11" font-weight="600" fill="#e05c3a">Hidden 4</text>
  <text x="551" y="94" text-anchor="middle" font-size="10" fill="currentColor">Linear(128→64)</text>
  <text x="551" y="108" text-anchor="middle" font-size="10" fill="currentColor">BatchNorm · ReLU</text>
  <text x="551" y="122" text-anchor="middle" font-size="10" fill="currentColor">Dropout(0.2)</text>

  <!-- arrow 5 -->
  <line x1="604" y1="100" x2="628" y2="100" stroke="#888" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Output -->
  <rect x="629" y="60" width="46" height="80" rx="6" fill="none" stroke="#3a9bd5" stroke-width="1.5"/>
  <text x="652" y="90" text-anchor="middle" font-size="11" font-weight="600" fill="#3a9bd5">Output</text>
  <text x="652" y="106" text-anchor="middle" font-size="10" fill="currentColor">12 / 1</text>
  <text x="652" y="120" text-anchor="middle" font-size="9" fill="#888">MC / Bin</text>

  <!-- caption -->
  <text x="340" y="192" text-anchor="middle" font-size="10" fill="#888">~88,000 trainable parameters · same architecture for both tasks, only output layer changes</text>

  <defs>
    <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#888"/>
    </marker>
  </defs>
</svg>
</div>

**Why these choices:**
- **MLP, not CNN/RNN** — the data is tabular (fixed-length feature vectors), so spatial/sequential architectures add no benefit
- **BatchNorm** — the 94 features span very different scales (packet counts, durations in seconds, byte sizes), so normalising within each layer stabilises training significantly
- **Dropout 0.3→0.2** — higher regularisation in the wider early layers, lower in the narrower compression layers
- **Kaiming (He) initialisation** — designed for ReLU activations, keeps signal variance stable through deep layers
- **Unweighted CrossEntropyLoss** — class imbalance is corrected upstream by SMOTE, so no need for weighted loss on top

---

## Results

<div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin:1.5rem 0;">

<div style="flex:1;min-width:240px;border:1px solid #e05c3a;border-radius:8px;padding:1.2rem;background:rgba(224,92,58,0.05);">
<div style="font-size:13px;font-weight:600;color:#e05c3a;margin-bottom:0.6rem;">⚡ Task A — Binary Classification</div>
<div style="font-size:2rem;font-weight:700;color:currentColor;">99.70%</div>
<div style="font-size:12px;color:#888;margin-bottom:0.8rem;">Accuracy on held-out test set</div>
<div style="font-size:1.2rem;font-weight:600;">Macro F1: 0.9917</div>
<div style="font-size:11px;color:#888;margin-top:0.4rem;">Attack: 1.00 / 1.00 precision/recall<br>Normal: 0.98 precision · 0.99 recall</div>
</div>

<div style="flex:1;min-width:240px;border:1px solid #3a9bd5;border-radius:8px;padding:1.2rem;background:rgba(58,155,213,0.05);">
<div style="font-size:13px;font-weight:600;color:#3a9bd5;margin-bottom:0.6rem;">🎯 Task B — 12-class Classification</div>
<div style="font-size:2rem;font-weight:700;color:currentColor;">99.52%</div>
<div style="font-size:12px;color:#888;margin-bottom:0.8rem;">Accuracy on held-out test set</div>
<div style="font-size:1.2rem;font-weight:600;">Macro F1: 0.9051</div>
<div style="font-size:11px;color:#888;margin-top:0.4rem;">Weighted F1: 1.00 (large classes perfect)<br>Macro lower = rare classes are hard</div>
</div>

</div>

> **Why macro F1 matters here:** accuracy would be misleadingly high even for a naive model. Macro F1 gives equal weight to all 12 classes — including rare attack types with only 6–7 test samples — which is the honest measure of performance on an imbalanced detection task.

---

## Key challenges & how I solved them

**3,380:1 class imbalance** → SMOTE with `k_neighbors=3` (tuned down from default 5 because the rarest class had only ~17 training samples after splitting). Applied to training set only to prevent synthetic data leakage into validation/test.

**Data leakage prevention** → all preprocessing steps (encoder, scaler, SMOTE) fitted exclusively on the training split and then applied to val/test. Splits were done first, preprocessing second.

**BatchNorm + small batches** → `drop_last=True` on the training DataLoader prevents a final batch of size 1 from crashing BatchNorm1d.

**Honest evaluation** → reported both macro and weighted F1 to separate majority-class performance from rare-class performance. The gap between them (0.9051 vs 1.00) directly quantifies how hard the rarest classes are.

---

## What I'd improve

- **Focal loss** instead of plain CrossEntropyLoss to further penalise confident wrong predictions on rare classes
- **Per-class SMOTE ratios** — rather than fully balancing all classes to the majority, a gentler oversampling might reduce synthetic noise for the very rare classes
- **Experiment tracking** with MLflow or Weights & Biases to properly log all runs instead of saving JSON results manually

---

## Stack

`Python` · `PyTorch` · `scikit-learn` · `imbalanced-learn (SMOTE)` · `pandas` · `NumPy` · `matplotlib` · `seaborn`

## Links

- Source code: *private (university group project, TH Deggendorf)*
- Dataset: [RT-IoT2022 on Kaggle](https://www.kaggle.com/datasets/rtiot2022/rt-iot2022)
