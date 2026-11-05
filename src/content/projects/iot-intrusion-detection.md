## Results at a glance

| Task | Accuracy | Macro F1 |
|---|---|---|
| Binary: attack vs. normal | **99.70%** | **0.9917** |
| 12 classes: 9 attack types + 3 normal | **99.52%** | **0.9051** |

Trained on **123,117 real network flows** with a **3,380:1 class imbalance**. All results are on a held-out test set.

---

## Problem

IoT devices such as smart bulbs, MQTT sensors and cloud-connected platforms are low-powered and increasingly targeted by network attacks, and nobody can watch the traffic of thousands of devices by hand. The goal was a model that automatically labels each network flow as normal or as a specific attack type.

There were two tasks:

- **Binary:** is a flow an attack or not? This works as a quick first filter.
- **12 classes:** which of 9 attack types or 3 normal behaviours is it? This identifies the exact threat.

---

## Dataset

The [RT-IoT2022 dataset](https://www.kaggle.com/datasets/rtiot2022/rt-iot2022) has **123,117 real network flows** recorded in a controlled IoT testbed. Each flow has 83 features: 2 categorical (protocol and service) and 81 numerical, such as packet timing, packet sizes and TCP flag counts.

### The class imbalance

One class, `DOS_SYN_Hping` (a SYN flood attack), makes up **76.9% of all flows**. The rarest, `NMAP_FIN_SCAN`, has only **28 samples**. A model that always answers "SYN flood" would already score 77% accuracy while missing every other attack.

<div style="margin: 1.5rem 0;">
<svg viewBox="0 0 680 430" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;font-family:system-ui,sans-serif;">
  <text x="340" y="22" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Class distribution in RT-IoT2022 (linear scale)</text>
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
  <text x="200" y="410" font-size="11" fill="currentColor" dx="4">0.02% (only 28 samples)</text>
</svg>
</div>

*The linear scale is intentional: it makes the imbalance visible. The top bar is 94,659 flows; the bottom one is 28.*

---

## My role

Team of 3, Deep Learning & Big Data course at TH Deggendorf. I was responsible for:

- **The data pipeline:** the stratified 60/20/20 split (`data_split.py`) and preprocessing (`data_preprocessing.py`): one-hot encoding, scaling and SMOTE
- **Exploratory analysis and charts:** class distribution, feature variance and the correlation heatmap
- **Model 1:** designing and training a **custom MLP with a hand-written PyTorch training loop**, including the DataLoaders, early stopping and learning-rate scheduling
- **Presenting** the dataset and the Model 1 results in the group presentation

---

## Approach

### Preprocessing pipeline

```
Raw CSV (123,117 rows × 85 columns)
        │
        ▼
1. Stratified 60/20/20 split      ← split first, so nothing leaks from val/test
        │
        ▼
2. One-hot encode protocol and service  ← fitted on train only → ~94 features
        │
        ▼
3. StandardScaler                 ← fitted on train only
        │
        ▼
4. SMOTE (k_neighbors=3)          ← applied to train only
        │
        ▼
   Train (balanced) │ Validation (original mix) │ Test (original mix)
```

> **Why k=3 instead of the default 5?** `NMAP_FIN_SCAN` has only 28 samples, so about 17 end up in the training split. SMOTE needs at least k neighbours for each point it oversamples, so I lowered k to 3 to create synthetic samples for the rarest class.

### Model

A **custom MLP** built with core PyTorch layers and a **hand-written training loop**, without high-level wrappers like Keras or PyTorch Lightning. The loop handles the gradient updates, early stopping on validation loss and `ReduceLROnPlateau` scheduling.

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
  <text x="340" y="192" text-anchor="middle" font-size="10" fill="#888">~88,000 trainable parameters · same network for both tasks, only the output layer changes</text>
  <defs>
    <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#888"/>
    </marker>
  </defs>
</svg>
</div>

**Why these choices:**

- **An MLP, not a CNN or RNN:** the data is tabular, with one fixed-length feature vector per flow, so convolutional or sequence models add nothing.
- **BatchNorm:** the 94 features have very different scales (packet counts, durations in seconds, byte sizes), and normalising inside each layer makes training much more stable.
- **Dropout from 0.3 to 0.2:** more regularisation in the wider early layers, less in the narrower later ones.
- **Kaiming (He) initialisation:** suited to ReLU activations, it keeps the signal from shrinking or exploding through the layers.
- **Plain CrossEntropyLoss:** SMOTE already balances the training data, so the loss doesn't need class weights on top.

---

## Results

| | Binary | 12 classes |
|---|---|---|
| Accuracy | **99.70%** | **99.52%** |
| Macro F1 | **0.9917** | **0.9051** |
| Details | Attack: 1.00 precision and recall · Normal: 0.98 precision, 0.99 recall | Weighted F1 1.00: the large classes are perfect, the rare ones are harder |

> **Why macro F1 matters here:** accuracy looks high even for a useless model. Macro F1 gives every one of the 12 classes equal weight, including rare attacks with only 6–7 test samples, so it's the honest measure on imbalanced data.

---

## Key challenges

**A 3,380:1 class imbalance.** I used SMOTE with `k_neighbors=3`, lowered from the default 5 because the rarest class had only about 17 training samples. It was applied to the training set only, so no synthetic data reached validation or test.

**Preventing data leakage.** I split the data first and fitted the encoder, the scaler and SMOTE on the training split only, then applied them to validation and test.

**BatchNorm with a tiny last batch.** Setting `drop_last=True` on the training DataLoader stops a final batch of size 1 from crashing `BatchNorm1d`.

**Honest evaluation.** I reported both macro and weighted F1. The gap between them (0.9051 vs. 1.00) shows exactly how much harder the rarest classes are.

---

## What I'd improve

- **Focal loss** instead of plain CrossEntropyLoss, to focus training on the rare classes the model gets wrong
- **Gentler SMOTE ratios per class**, instead of balancing every class fully, to add less synthetic noise for the very rare ones
- **Experiment tracking** with MLflow or Weights & Biases, instead of saving results to JSON files by hand

---

## Links

- Source code: private (university group project, TH Deggendorf)
- Dataset: [RT-IoT2022 on Kaggle](https://www.kaggle.com/datasets/rtiot2022/rt-iot2022)

## Stack

`Python` · `PyTorch` · `scikit-learn` · `imbalanced-learn (SMOTE)` · `pandas` · `NumPy` · `matplotlib` · `seaborn`
