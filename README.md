# Inoova logo animation

The reveal of the Inoova mark and wordmark: the six hooks draw in while the mark turns a sixth of a turn, the mark slides to its place, and "inoova" rises out of the baseline, the i's dot last. Plain CSS (stroke drawing and transforms), no library.

Each version lives in its own folder and is never edited once pushed; the next change becomes the next folder (and tag).

| Version | Board | What it is |
| --- | --- | --- |
| [v1](v1/index.html) | `v1/index.html` | Lockup light and dark, the mark alone (app open), the loader, timing table, where it plays |
| [v2](v2/index.html) | `v2/index.html` | The hooks gather (fly in along their stems as they draw), the mark rests, then the name slides out from behind it; the loader no longer jumps. Videos in `v2/effectcraft/` |

## Viewing

Open a version's `index.html` in a browser. Click a stage to replay it; the board has Replay, Slow ×4, a reduced-motion preview and a slider to step through the reveal frame by frame.

The mark and letters are the same paths as the App's `src/components/icons/logo.jsx` and `wordmark.jsx`.
