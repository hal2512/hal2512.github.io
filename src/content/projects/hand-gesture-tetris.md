<!--
  HTML comments like this one are not shown on the site.
  Worth adding later: a short demo GIF. Put it in public/projects/ and add ![Demo](/projects/tetris-demo.gif)
-->

## Results at a glance

| | |
|---|---|
| Test accuracy | **95%** on 1,485 held-out samples |
| Macro F1 | **0.95** |
| Gestures recognised | 6 |
| Training data | **5,940** self-collected landmark samples |

---

## How it works

1. **MediaPipe Hands** finds 21 hand landmarks in each webcam frame.
2. The landmarks are converted to coordinates relative to the wrist and **normalised**, so the features don't depend on where the hand is in the frame or how far it is from the camera.
3. A custom classifier, exported to **TensorFlow Lite** for fast inference, maps the 42 features to a gesture.
4. Each recognised gesture is passed to the **Tetris game loop** as a low-latency control input, running at standard webcam frame rates. A short cooldown stops one gesture from triggering several moves.

---

## Gestures

| Gesture | Action in the game |
|---|---|
| Index finger | Move left |
| Pinkies | Move right |
| Peace | Rotate |
| OK | Drop faster |
| Any gesture | Start the game |

The model also recognises **Open** and **Close** hand poses.

---

## My role

Team of 2. I was responsible for **all model development and training**:

- **Collecting the training data:** 5,940 labelled landmark samples across the 6 gestures
- **Preprocessing:** wrist-relative, normalised landmark features
- **Training and evaluating** the classifier
- **Exporting** it to TensorFlow Lite for real-time use in the game

My teammate built the game UI in Pygame.

---

## Model

- **Architecture:** a small neural network (MLP): 42 inputs → 20 → 10 → 6 outputs, with dropout
- **Training:** 75% / 25% train / test split, early stopping on validation loss
- **Evaluation:** confusion matrix and per-class precision and recall
- **Weakest gesture:** "OK", at 0.84 precision. Class sizes were uneven, from 263 to 1,784 samples per gesture.

---

## Credits

The landmark pipeline, data logger and training notebook are adapted from the open-source [hand-gesture-recognition-using-mediapipe](https://github.com/Kazuhito00/hand-gesture-recognition-using-mediapipe) project (Apache-2.0). The gesture set, training data and trained model are this project's own.

## Stack

`Python` · `MediaPipe` · `OpenCV` · `TensorFlow` · `TensorFlow Lite` · `scikit-learn` · `pandas`
