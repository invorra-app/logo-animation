# Inoova logo animation · v2 in EffectCraft

The v2 reveal (`../index.html`) as an EffectCraft project for video: the same paths, timings and curves, with motion blur added (the app's CSS has none). `build.jsx` generates the whole project, so change the animation there and rebuild.

```sh
cd v2/effectcraft
effectcraft-cli script build.jsx --empty          # writes inoova-logo-v2.ecproj
effectcraft-cli render --project inoova-logo-v2.ecproj --comp "Lockup · light" --out renders/lockup-light.mp4
```

| Composition | Size | Length | Render |
| --- | --- | --- | --- |
| Lockup · light | 1920 × 1080 | 3 s (reveal ≈ 1.9 s, then held) | `renders/lockup-light.mp4` |
| Lockup · dark | 1920 × 1080 | 3 s | `renders/lockup-dark.mp4` |
| Mark · app open | 1080 × 1080 | 2 s (steps 1 and 2) | `renders/mark-app-open.mp4` |
| Loader · light | 1080 × 1080 | 14.4 s: six cycles, one full turn, loops | `renders/loader-light.mp4` |
| Loader · dark | 1080 × 1080 | 14.4 s, loops | `renders/loader-dark.mp4` |

All at 60 fps, with motion blur at a 180° shutter. Set `MOTION_BLUR = false` in `build.jsx` for frames that match the board exactly.

## How it is built

- **Placement** (a null) positions and sizes the logo: 70% in the lockups (1105 px wide) and 120% for the mark alone. Everything under it is in the SVG's units.
- **Mark** has one group per hook: the path, a 38-unit round stroke and Trim Paths. Each group's Position carries the flight in along the stem (48 units). The layer's Rotation is the turn, and its Position is the slide.
- **Wordmark** holds the letters in one group, *inoova*, whose Position slides the name out. The layer's mask, *Mark's edge*, is keyed with the mark's slide, so its left side rides on the mark's right side (x 344 at rest).
- **i dot** is its own layer, so the mask never touches it.
- The CSS curves become keyframe speed and influence, so values follow `cubic-bezier()` exactly, the dot's overshoot included. Keys sit on whole frames, so a few start up to 8 ms off the CSS times. Frames rendered without motion blur match the board in Chrome to anti-aliasing.
