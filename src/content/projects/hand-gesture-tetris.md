<!--
  Starter page written from your CV only. HTML comments like this one are not shown on the site.
  Sections worth adding (only add a heading once it has content):
  ## Gestures        — table of gesture → Tetris move
  ## Data & model    — how you collected training data, model type, accuracy, latency
  ## Challenges      — e.g. repeated moves from one gesture, lighting, different hands
  ## Demo            — put a GIF in public/projects/ and add ![Demo](/projects/tetris-demo.gif)
-->

## How it works

1. Hand **landmarks** are extracted from each webcam frame and turned into **normalised** features.
2. A custom classifier maps the landmark features to a gesture.
3. Each recognised gesture is passed to the **Tetris game loop** as a low-latency control input, running at standard webcam frame rates.
