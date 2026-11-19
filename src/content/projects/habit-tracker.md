## What it is

A **Streamlit habit tracker** built for the Assistance Systems course at TH Deggendorf. It logs a student's daily habits, flags days that look like burnout with an unsupervised anomaly detector ("The Guardian"), suggests specific recovery actions, and has a voice-enabled chatbot.

---

## How it works

1. **Data:** a generator simulates daily student logs (sleep, study, social time, screen time, water, exercise, skipped meals), with about 5% burnout-like days. Both datasets are **synthetic**: 90 days ("original") and 1,000 days ("augmented").
2. **Model:** a scikit-learn pipeline of `StandardScaler` → **Isolation Forest** (contamination 0.05), trained without labels on 7 features.
3. **Recommendations:** rule-based triggers (e.g. sleep < 6 h, study > 9 h, exercise < 15 min) pick tips from a small intervention library when a day is flagged.
4. **Chatbot:** keyword-based intents, microphone input via SpeechRecognition and spoken replies via pyttsx3.

---

## Results

Scored against the generator's hidden labels (a sanity check on synthetic data, not real-world performance):

| Model | Evaluated on | Precision | Recall |
|---|---|---|---|
| Trained on 90 days | 1,000-day set | 0.67 | 1.00 |
| Trained on 1,000 days | 90-day set | **1.00** | **1.00** |

More training data clearly cut the false alarms (69 → 50 flagged days on the 1,000-day set).

---

## Stack

`Python` · `scikit-learn` · `Streamlit` · `pandas` · `SpeechRecognition` · `pyttsx3`
