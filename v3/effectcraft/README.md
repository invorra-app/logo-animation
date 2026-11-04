# Inoova logo animation · v3 in EffectCraft

The v3 reveal (`../index.html`) as an EffectCraft project for video: the same paths, timings and curves, with motion blur added (the board's CSS has none). `build.jsx` generates the whole project, so change the animation there and rebuild.

```sh
cd v3/effectcraft
effectcraft-cli script build.jsx --empty          # writes inoova-logo-v3.ecproj
effectcraft-cli render --project inoova-logo-v3.ecproj --comp "Lockup · light" --out renders/lockup-light.mp4
```

| Composition | Size | Length | Render |
| --- | --- | --- | --- |
| Lockup · light | 1920 × 1080 | 4.5 s (reveal ≈ 3.1 s, then held) | `renders/lockup-light.mp4` |
| Lockup · dark | 1920 × 1080 | 4.5 s | `renders/lockup-dark.mp4` |
| Mark · light | 1080 × 1080 | 3 s (steps 1–3, the circle closes at ≈ 2 s) | `renders/mark-light.mp4` |
| Mark · dark | 1080 × 1080 | 3 s | `renders/mark-dark.mp4` |

All at 60 fps, with motion blur at a 180° shutter. Set `MOTION_BLUR = false` in `build.jsx` for frames that match the board exactly. The loader is unchanged: use v2's.

## How it is built

- **Placement** (a null) positions and sizes the finished logo, as in v2: 70% in the lockups (1105 px wide) and 120% for the mark alone.
- **Camera** (a null under Placement) is the pull-back. Its anchor and position sit on the one point that stays put on screen, so its Scale alone takes the view from the ✓ (3.6 px a unit) to the mark. The scale is keyed on every frame, so the zoom is exponential: equal steps of the curve are equal ratios of size.
- **The ✓.** The tick alone follows the brief's reference: arms at a right angle, the long arm rising to the right at 45° and about 2.5 times the short one. The hook can't get there by turning, because its arms are only 45° apart (upright it reads as a J; turned 45° it reads as a ν). So each tick's Path is keyed from the hook with its short arm opened 45° about the curl's start and its stem 45 units longer (`OPEN`, `REACH`), back to the hook, while the view pulls back. `OPEN = 0, REACH = 0` gives the plain hook turned 45°.
- **Mark** draws only the top tick, reversed so it is written short arm first. The layer's Rotation turns 45° → 60° about the mark's centre (178.5, 182.448) as the view pulls back (`TILT`, `SLOT`): from 45° the nearest place is the next one clockwise, and six-fold, the mark lands on itself. *Tick 1* has Trim Paths. *Turn 2* to *Turn 6* are nested groups, each holding its tick and the next turn, each turning 0 → 60°, so each copy swings out of the one before it and the turns add up to 60°·i. *Turn 2*'s opacity keeps the copies hidden until the first split.
- Parenting a layer keeps it where it was, so every layer's anchor, position, scale and rotation are set again after it is parented.
- **Wordmark** and **i dot** are v2's: the name's group slides out, its mask *Mark's edge* rides on the mark's right side, and the dot is its own layer so the mask never touches it.
- The CSS curves become keyframe speed and influence, so values follow `cubic-bezier()` exactly. Keys sit on whole frames, so a few start up to 8 ms off the CSS times. Frames rendered without motion blur match the board in Chrome to anti-aliasing.
