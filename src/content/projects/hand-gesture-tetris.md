<!--
  HTML comments like this one are not shown on the site.
  Worth adding later: a short demo GIF. Put it in public/projects/tetris/ and add ![Demo](/projects/tetris/demo.gif)
-->

<figure>
<img src="/projects/tetris/open-hand.jpg" alt="The game running: a Tetris board on the left and the live webcam view on the right, where the player's raised open hand is boxed in green and labelled Open." loading="lazy" />
<figcaption>The game in action: the webcam view on the right shows the detected hand and the recognised gesture in real time.</figcaption>
</figure>

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

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;">
<figure style="margin:0;">
<img src="/projects/tetris/index-finger-left.jpg" alt="Webcam view labelled Index Finger: the player points up with one index finger, and the falling I-piece is pushed to the left edge of the board." loading="lazy" />
<figcaption>Index finger: move left</figcaption>
</figure>
<figure style="margin:0;">
<img src="/projects/tetris/pinkies-right.jpg" alt="Webcam view labelled Pinkies: the player raises only the little finger, and the falling I-piece sits against the right edge of the board." loading="lazy" />
<figcaption>Pinkies: move right</figcaption>
</figure>
<figure style="margin:0;">
<img src="/projects/tetris/peace-rotate.jpg" alt="Webcam view labelled Peace: the player shows two fingers in a V, and the falling I-piece has been rotated to stand vertically." loading="lazy" />
<figcaption>Peace: rotate</figcaption>
</figure>
<figure style="margin:0;">
<img src="/projects/tetris/ok-drop.jpg" alt="Webcam view labelled OK: the player makes an OK sign with thumb and index finger, while the I-piece falls in the middle of the board." loading="lazy" />
<figcaption>OK: drop faster</figcaption>
</figure>
</div>

---

## My role

Team of 2. I was responsible for **all model development and training**:

- **Collecting the training data:** 5,940 labelled landmark samples across the 6 gestures, recorded with the data-collection mode described below
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

## Collecting more data

The project includes a **data-collection mode**, so the model can be given more samples, or new gestures, and retrained later. I used it to record the whole training set.

1. Run `python app.py`. It shows the webcam view with the detected hand.
2. Press **`k`** to switch on logging mode. The screen shows "MODE: Logging Key Point".
3. Hold a gesture in front of the camera and press its number key. Every frame the key is held saves the hand's normalised landmarks as one labelled sample in `keypoint.csv`.
4. Press **`n`** to switch back to normal mode, then retrain with the notebook.

| Key | Gesture |
|---|---|
| `0` | Open |
| `1` | Close |
| `2` | Index finger |
| `3` | OK |
| `4` | Peace |
| `5` | Pinkies |

Keys `6`–`9` are free, so a new gesture only needs a new label and a few hundred samples.

---

## Credits

The landmark pipeline, data logger and training notebook are adapted from the open-source [hand-gesture-recognition-using-mediapipe](https://github.com/Kazuhito00/hand-gesture-recognition-using-mediapipe) project (Apache-2.0). The gesture set, training data and trained model are this project's own.

## Stack

`Python` · `MediaPipe` · `OpenCV` · `TensorFlow` · `TensorFlow Lite` · `scikit-learn` · `pandas`
