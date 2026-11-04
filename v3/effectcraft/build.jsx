// Inoova logo animation · v3 in EffectCraft: one tick, turned six times.
// The paths, timings and curves are the ones in ../index.html (the v3 board); this script
// turns them into layers and keyframes.
//
//   cd v3/effectcraft && effectcraft-cli script build.jsx --empty
//
// writes inoova-logo-v3.ecproj next to this file, with four compositions:
//   Lockup · light, Lockup · dark   the full reveal (≈ 3.1 s, then held), 1920 × 1080
//   Mark · light, Mark · dark       the tick and the circle, no name (≈ 2 s, then held), 1080 × 1080

var OUT = "inoova-logo-v3.ecproj";
var FPS = 60;
var MOTION_BLUR = true; // video only: the app's CSS has none

// The CSS curves, as cubic-bezier(x1, y1, x2, y2)
var EASE_OUT_STRONG = [0.23, 1, 0.32, 1];     // --ease-out-strong (already in the app)
var EASE_IN_OUT_STRONG = [0.77, 0, 0.175, 1]; // --ease-in-out-strong
var EASE_BACK = [0.34, 1.56, 0.64, 1];        // --ease-back
var EASE_PEN = [0.55, 0, 0.25, 1];            // --ease-pen: a hand writing a tick
var LINEAR = "linear";
var HOLD = "hold";

var LIGHT = { paper: "#ffffff", ink: "#18181b" };
var DARK = { paper: "#18181b", ink: "#fafafa" };

// ───────── Geometry (the App's logo.jsx and wordmark.jsx) ─────────
// The mark is one tick turned six times around its centre: hook i of logo.jsx is the top hook
// turned 60°·i, to 0.002 units. So v3 draws only the top hook, the way a hand writes a tick:
// the short arm first, through the curl, then up the stem. (logo.jsx draws it stem first.)
var TICK = "M104.599 78.6541L136.13 110.186C155.731 129.786 169.366 116.151 169.366 90.5849V19";
// The tick alone is a ✓ as a check is drawn (the brief's reference): arms at a right angle, the long
// one rising to the right at 45° and about 2.5 times the short one. The hook's arms are 45° apart and
// its stem is shorter, so turning it alone reads as a "ν". Instead, while it is alone, its short arm
// is opened OPEN degrees about the curl's start and its stem is REACH units longer; both close back
// as the view pulls back, so the ✓ becomes the hook on its way into the mark.
var OPEN = 45, REACH = 45;
function tickGeometry(open, reach) { // the tick's points, short arm turned `open`° out, stem `reach` longer
  var B = [136.13, 110.186], c = Math.cos(-open * Math.PI / 180), s = Math.sin(-open * Math.PI / 180);
  function turn(v) { return [B[0] + c * v[0] - s * v[1], B[1] + s * v[0] + c * v[1]]; }
  return { A: turn([104.599 - B[0], 78.6541 - B[1]]), B: B, B1: turn([155.731 - B[0], 129.786 - B[1]]),
           C2: [169.366, 116.151], C: [169.366, 90.5849], D: [169.366, 19 - reach] };
}
function tickPath(open, reach) {
  var g = tickGeometry(open, reach), f = function (p) { return (+p[0].toFixed(4)) + " " + (+p[1].toFixed(4)); };
  return "M" + f(g.A) + "L" + f(g.B) + "C" + f(g.B1) + " " + f(g.C2) + " " + f(g.C) + "V" + (+g.D[1].toFixed(4));
}
var LETTERS = [
  ["i", "M489.602 123.801H439V319.838H489.602V123.801Z", false],
  ["n", "M517.603 123.442H567.728V143.063C583.482 127.309 604.964 118.716 629.311 118.716C675.14 118.716 700.919 150.223 700.919 201.781V320.221H649.361V208.942C649.361 180.299 635.04 167.409 612.125 167.409C586.346 167.409 567.728 186.027 567.728 211.806V320.221H517.603V123.442Z", false],
  ["o", "M830.087 118.716C773.117 118.716 726.92 164.879 726.92 221.832C726.92 278.784 773.117 324.947 830.087 324.947C887.057 324.947 933.249 278.784 933.249 221.832C933.249 164.879 887.08 118.716 830.087 118.716ZM829.904 276.344C799.684 276.344 775.171 251.848 775.171 221.65C775.171 191.451 799.684 166.955 829.904 166.955C860.124 166.955 884.616 191.428 884.616 221.65C884.616 251.87 860.124 276.344 829.904 276.344Z", true],
  ["o 2", "M1056.42 118.716C999.446 118.716 953.249 164.879 953.249 221.832C953.249 278.784 999.446 324.947 1056.42 324.947C1113.39 324.947 1159.58 278.784 1159.58 221.832C1159.58 164.879 1113.41 118.716 1056.42 118.716ZM1056.23 276.344C1026.01 276.344 1001.5 251.848 1001.5 221.65C1001.5 191.451 1026.01 166.955 1056.23 166.955C1086.45 166.955 1110.94 191.428 1110.94 221.65C1110.94 251.87 1086.45 276.344 1056.23 276.344Z", true],
  ["v", "M1173.58 123.442H1228L1265.24 250.905L1302.47 123.442H1356.89L1291.02 320.222H1239.46L1173.58 123.442Z", false],
  ["a", "M1528.57 123.414V134.294C1512.75 124.441 1494.08 118.716 1474.06 118.716C1417.09 118.716 1370.89 164.879 1370.89 221.832C1370.89 278.784 1417.09 324.947 1474.06 324.947C1494.08 324.947 1512.75 319.245 1528.57 309.37V320.249H1578.78V123.414H1528.57ZM1473.88 276.344C1443.66 276.344 1419.15 251.848 1419.15 221.65C1419.15 191.451 1443.66 166.955 1473.88 166.955C1504.1 166.955 1528.09 190.949 1528.57 220.737V222.538C1528.09 252.327 1503.8 276.32 1473.88 276.32V276.344Z", true]
];
var DOT = "M489.409 39.9473H439.194V90.1253H489.409V39.9473Z";

var MARK_CENTRE = [178.5, 182.448]; // centre of the six ticks: what the mark turns and the copies swing on
var LOCKUP_CENTRE = [789.5, 182.5]; // centre of the lockup's 1579 × 365 viewBox
var SLIDE = 611;                    // the mark starts this far right: the middle of the lockup
var UNFOLD = 625;                   // the name starts this far left: wholly behind the mark's edge
var EDGE = 344;                     // the mark's right side at rest (tick tips at 324.6 + half the 38 stroke)
var TICK_PX = 3.6;                  // the tick alone: 3.6 px a unit, 500 px tall in a 1080 frame
var TILT = 45;                      // the tick alone is turned 45° clockwise, so its stem rises to the right at
                                    // 45°, as the reference's long arm does (upright, at the top of the mark, it reads as a J)
var SLOT = 60;                      // from 45° the nearest place in the mark is the next one clockwise, so the
                                    // mark turns on 45° → 60° as the view pulls back; six-fold, it lands on itself

// ───────── Timing (ms), the same as the board ─────────
var T = {
  write: [150, 650],   // 1 · the tick is written, short arm first
  zoom: [1050, 1100],  // 2 · the view pulls back from the tick to the mark, which turns on into its place,
  close: [1050, 1000], //     and the ✓ closes into the hook: the short arm turns in 45°, the stem draws in
  split: [1250, 400],  // 3 · a copy swings 60° out of the tick, clockwise, then a copy out of
  stagger: 100,        //     that one, 100 ms later each, five times: the circle closes
  slide: [2050, 800],  // 4 · the mark slides to its place and the name slides out from behind it
  dot: [2620, 500]     // 5 · the i's dot drops in
};

// ───────── Helpers ─────────
function hex(h) {
  return [parseInt(h.substr(1, 2), 16) / 255, parseInt(h.substr(3, 2), 16) / 255, parseInt(h.substr(5, 2), 16) / 255];
}

// SVG path data (absolute M L H V C Z, as these paths use) → one Shape per subpath
function shapes(d) {
  var t = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g), i = 0, cmd = null, x = 0, y = 0, cur = null, out = [];
  function num() { return parseFloat(t[i++]); }
  function lineTo(px, py) { cur.v.push([px, py]); cur.it.push([0, 0]); cur.ot.push([0, 0]); }
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    if (cmd === "M") {
      x = num(); y = num();
      cur = { v: [[x, y]], it: [[0, 0]], ot: [[0, 0]], closed: false };
      out.push(cur);
      cmd = "L"; // coordinates after an M are line-tos
    } else if (cmd === "L") { x = num(); y = num(); lineTo(x, y); }
    else if (cmd === "H") { x = num(); lineTo(x, y); }
    else if (cmd === "V") { y = num(); lineTo(x, y); }
    else if (cmd === "C") {
      var x1 = num(), y1 = num(), x2 = num(), y2 = num(), n = cur.v.length - 1;
      x = num(); y = num();
      cur.ot[n] = [x1 - cur.v[n][0], y1 - cur.v[n][1]];
      cur.v.push([x, y]); cur.it.push([x2 - x, y2 - y]); cur.ot.push([0, 0]);
    } else if (cmd === "Z") {
      cur.closed = true;
      var a = cur.v[0], b = cur.v[cur.v.length - 1];
      if (cur.v.length > 1 && Math.abs(a[0] - b[0]) < 1e-3 && Math.abs(a[1] - b[1]) < 1e-3) {
        cur.it[0] = cur.it.pop(); cur.v.pop(); cur.ot.pop(); // the closing point repeats the first
      }
      x = a[0]; y = a[1]; cmd = null;
    } else {
      throw new Error("path command " + cmd + " is not handled");
    }
  }
  var result = [];
  for (var k = 0; k < out.length; k++) {
    var s = new Shape();
    s.vertices = out[k].v; s.inTangents = out[k].it; s.outTangents = out[k].ot; s.closed = out[k].closed;
    result.push(s);
  }
  return result;
}

function rect(x, y, w, h) {
  var r = new Shape();
  r.vertices = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  r.closed = true;
  return r;
}

function frame(ms) { return Math.round(ms * FPS / 1000) / FPS; } // keys sit on frames

// ───────── Curves ─────────
function bez(c, u) { // a point of cubic-bezier(c) at parameter u: [x (time), y (progress)]
  var a = 3 * (1 - u) * (1 - u) * u, b = 3 * (1 - u) * u * u, d = u * u * u;
  return [a * c[0] + b * c[2] + d, a * c[1] + b * c[3] + d];
}
function solveY(c, y) { // u where the progress reaches y (these curves only rise)
  var lo = 0, hi = 1;
  for (var n = 0; n < 60; n++) { var m = (lo + hi) / 2; if (bez(c, m)[1] < y) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
function progress(c, x) { // the curve's progress at time fraction x, as CSS computes it
  var lo = 0, hi = 1;
  for (var n = 0; n < 60; n++) { var m = (lo + hi) / 2; if (bez(c, m)[0] < x) lo = m; else hi = m; }
  return bez(c, (lo + hi) / 2)[1];
}
function lerp(p, q, u) { return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u]; }
function split(c, u) { // de Casteljau: the curve's control points either side of u
  var p0 = [0, 0], p1 = [c[0], c[1]], p2 = [c[2], c[3]], p3 = [1, 1];
  var p01 = lerp(p0, p1, u), p12 = lerp(p1, p2, u), p23 = lerp(p2, p3, u);
  var p012 = lerp(p01, p12, u), p123 = lerp(p12, p23, u), m = lerp(p012, p123, u);
  return { m: m, left: [p01, p012], right: [p123, p23] };
}

// ───────── Writing the tick ─────────
// CSS draws it with stroke-dasharray 100 120 on pathLength 100 and moves the dash offset 101 → 0.
// Going to 101 rather than 100 keeps the round cap's dot hidden until the dash has some length.
// In Trim Paths terms End = 101·e − 1 (e: the curve's progress), clipped to 0–100, so the curve
// is cut where that clip bites and the keys hold just the part that shows.
function drawKeys(at, ms, c) {
  var e0 = 1 / 101, s = split(c, solveY(c, e0)), x0 = s.m[0];
  var n = function (p) { return [(p[0] - x0) / (1 - x0), (p[1] - e0) / (1 - e0)]; };
  var p1 = n(s.right[0]), p2 = n(s.right[1]);
  return { keys: [[at + x0 * ms, 0], [at + ms, 100]], curve: [p1[0], p1[1], p2[0], p2[1]] };
}

// Keyframes [[ms, value], ...]; curves[k] shapes the move from key k to key k + 1:
// a cubic-bezier, LINEAR or HOLD. Bezier curves become each key's speed and influence,
// so the property follows the CSS curve exactly (overshoot included).
function animate(prop, keys, curves) {
  var times = [], idx = [], k;
  // two keys on one frame: keep the later one (and the move that leaves it)
  for (k = keys.length - 2; k >= 0; k--) {
    if (frame(keys[k][0]) === frame(keys[k + 1][0])) { keys.splice(k, 1); curves.splice(k, 1); }
  }
  for (k = 0; k < keys.length; k++) {
    times.push(frame(keys[k][0]));
    prop.setValueAtTime(times[k], keys[k][1]);
  }
  for (k = 0; k < keys.length; k++) idx.push(prop.nearestKeyIndex(times[k]));
  for (k = 0; k < keys.length; k++) {
    var before = k > 0 ? curves[k - 1] : null, after = k < keys.length - 1 ? curves[k] : null;
    if (before === null) before = after === HOLD ? LINEAR : after;
    if (after === null) after = before === HOLD ? LINEAR : before;
    var inEase = before instanceof Array ? ease(prop, keys[k - 1] || keys[k], keys[k], times[k] - (times[k - 1] || 0), before, "in") : null;
    var outEase = after instanceof Array ? ease(prop, keys[k], keys[k + 1] || keys[k], (times[k + 1] || 0) - times[k], after, "out") : null;
    if (inEase || outEase) {
      var dims = (inEase || outEase).length;
      prop.setTemporalEaseAtKey(idx[k], inEase || flat(dims), outEase || flat(dims));
    }
    prop.setInterpolationTypeAtKey(idx[k], kind(before), kind(after));
  }
}
function kind(curve) {
  if (curve === HOLD) return KeyframeInterpolationType.HOLD;
  if (curve === LINEAR) return KeyframeInterpolationType.LINEAR;
  return KeyframeInterpolationType.BEZIER;
}
function flat(dims) { var e = []; for (var d = 0; d < dims; d++) e.push(new KeyframeEase(0, 16.666667)); return e; }
// One side of a cubic-bezier segment as After Effects-style speed and influence
function ease(prop, from, to, seconds, c, side) {
  var a = from[1], b = to[1];
  var slope = side === "out" ? c[1] / c[0] : (1 - c[3]) / (1 - c[2]);
  var influence = Math.max(0.1, 100 * (side === "out" ? c[0] : 1 - c[2]));
  if (typeof a === "number") return [new KeyframeEase(seconds > 0 ? slope * (b - a) / seconds : 0, influence)];
  if (!(a instanceof Array)) { // a path: only curves that leave and land flat, which need no speed
    if (slope !== 0) throw new Error("a path can only take a curve with flat ends");
    return [new KeyframeEase(0, influence)];
  }
  if (prop.isSpatial) {
    var dist = 0;
    for (var d = 0; d < a.length; d++) dist += (b[d] - a[d]) * (b[d] - a[d]);
    return [new KeyframeEase(seconds > 0 ? slope * Math.sqrt(dist) / seconds : 0, influence)];
  }
  var e = [];
  for (var j = 0; j < a.length; j++) e.push(new KeyframeEase(seconds > 0 ? slope * (b[j] - a[j]) / seconds : 0, influence));
  return e;
}

function tr(layer, name) { return layer.property("ADBE Transform Group").property(name); }
function groupTr(group, name) { return group.property("ADBE Vector Transform Group").property(name); }

function addPaths(group, d) {
  var list = shapes(d), items = group.property("ADBE Vectors Group");
  for (var k = 0; k < list.length; k++) {
    var p = items.addProperty("ADBE Vector Shape - Group");
    p.name = list.length > 1 ? "Path " + (k + 1) : "Path";
    p.property("ADBE Vector Shape").setValue(list[k]);
  }
}
function addFill(group, palette, evenOdd) {
  var fill = group.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
  fill.property("ADBE Vector Fill Color").setValue(hex(palette.ink));
  if (evenOdd) fill.property("ADBE Vector Fill Rule").setValue(2); // even-odd: the counters
}

// ───────── Layers ─────────
function newComp(name, w, h, seconds, palette) {
  var comp = app.project.items.addComp(name, w, h, 1, seconds, FPS);
  comp.bgColor = hex(palette.paper);
  comp.motionBlur = MOTION_BLUR;
  return comp;
}

function newNull(comp, name, parent, anchor, position, scale) {
  var n = comp.layers.addNull();
  n.name = name;
  if (parent) n.parent = parent;
  tr(n, "ADBE Anchor Point").setValue([anchor[0], anchor[1], 0]);
  tr(n, "ADBE Position").setValue([position[0], position[1], 0]);
  tr(n, "ADBE Scale").setValue([scale, scale, 100]);
  return n;
}

function newShapeLayer(comp, name, parent, anchor) {
  var layer = comp.layers.addShape();
  layer.name = name;
  layer.parent = parent; // parenting keeps the layer where it was, so reset its transform after
  layer.motionBlur = MOTION_BLUR;
  tr(layer, "ADBE Anchor Point").setValue([anchor[0], anchor[1], 0]);
  tr(layer, "ADBE Position").setValue([0, 0, 0]);
  tr(layer, "ADBE Scale").setValue([100, 100, 100]);
  tr(layer, "ADBE Rotate Z").setValue(0);
  return layer;
}

// The centre of the tick (opened as tickGeometry says) turned `deg` clockwise about the mark's centre:
// the middle of the box round points along its centreline (the round stroke adds 19 units every
// way, so the middle stays)
function tickCentre(deg, open, reach) {
  var c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180), k, g = tickGeometry(open, reach);
  var P = [g.B, g.B1, g.C2, g.C]; // the curl
  var pts = [g.A, g.D];           // the two tips
  for (k = 0; k <= 200; k++) {
    var u = k / 200, w = [(1 - u) * (1 - u) * (1 - u), 3 * (1 - u) * (1 - u) * u, 3 * (1 - u) * u * u, u * u * u];
    pts.push([w[0] * P[0][0] + w[1] * P[1][0] + w[2] * P[2][0] + w[3] * P[3][0], w[0] * P[0][1] + w[1] * P[1][1] + w[2] * P[2][1] + w[3] * P[3][1]]);
  }
  var lo = [1e9, 1e9], hi = [-1e9, -1e9];
  for (k = 0; k < pts.length; k++) {
    var x = pts[k][0] - MARK_CENTRE[0], y = pts[k][1] - MARK_CENTRE[1];
    var q = [MARK_CENTRE[0] + c * x - s * y, MARK_CENTRE[1] + s * x + c * y];
    lo = [Math.min(lo[0], q[0]), Math.min(lo[1], q[1])]; hi = [Math.max(hi[0], q[0]), Math.max(hi[1], q[1])];
  }
  return [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2];
}

// Placement (as in v2) puts the finished logo in the frame, `size` % of the SVG's units.
// Camera, under it, is the pull-back: it scales the view about the one point that stays put on
// screen, so the tick fills the frame at the start and the mark sits where Placement says at the
// end. `tick` is where the tick's centre is in Placement's units (whose origin is the frame's
// centre) while it is alone.
function addCamera(comp, size, tick) {
  var place = newNull(comp, "Placement", null, [0, 0], [comp.width / 2, comp.height / 2], size);
  var k0 = TICK_PX * 100 / size;
  // the fixed point F puts the tick in the middle of the frame: F + k0·(tick − F) = 0
  var fixed = [k0 * tick[0] / (k0 - 1), k0 * tick[1] / (k0 - 1)];
  var cam = newNull(comp, "Camera", place, fixed, fixed, 100);
  // The zoom is exponential: equal steps of the curve's progress are equal ratios of size, so the
  // pull-back keeps one speed to the eye instead of rushing at its end. Keyed on every frame.
  var keys = [], curves = [], a = T.zoom[0], ms = T.zoom[1];
  for (var t = a; t <= a + ms + 1e-6; t += 1000 / FPS) {
    var k = Math.pow(k0, 1 - progress(EASE_IN_OUT_STRONG, (t - a) / ms)) * 100;
    keys.push([t, [k, k, 100]]); curves.push(LINEAR);
  }
  curves.pop();
  animate(tr(cam, "ADBE Scale"), keys, curves);
  return cam;
}

// The mark: the one tick six times, each a 38-unit round stroke. Tick 1 is written by Trim Paths,
// with the layer turned TILT, so it is written as a ✓; the layer turns on to SLOT as the view pulls back.
// Ticks 2–6 are nested: each one's group sits inside the one before and turns 0 → 60° about the
// mark's centre, so it swings out of the tick before it, wherever that one is, and the turns add
// up to 60°·i. Until the first split they lie under tick 1, hidden.
// Every tick closes on the same keys, so the copies stay the same shape as the tick they split from
function addTick(items, palette, name) {
  var g = items.addProperty("ADBE Vector Group");
  g.name = name;
  addPaths(g, TICK);
  var path = g.property("ADBE Vectors Group").property(1).property("ADBE Vector Shape");
  animate(path, [[T.close[0], shapes(tickPath(OPEN, REACH))[0]], [T.close[0] + T.close[1], shapes(TICK)[0]]], [EASE_IN_OUT_STRONG]);
  var st = g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
  st.property("ADBE Vector Stroke Color").setValue(hex(palette.ink));
  st.property("ADBE Vector Stroke Width").setValue(38);
  st.property("ADBE Vector Stroke Line Cap").setValue(2);  // round
  st.property("ADBE Vector Stroke Line Join").setValue(2); // round
  return g;
}
function addMark(comp, palette, parent) {
  var layer = newShapeLayer(comp, "Mark", parent, MARK_CENTRE);
  animate(tr(layer, "ADBE Rotate Z"), [[T.zoom[0], TILT], [T.zoom[0] + T.zoom[1], SLOT]], [EASE_IN_OUT_STRONG]);
  var items = layer.property("ADBE Root Vectors Group");
  var first = addTick(items, palette, "Tick 1");
  var trim = first.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Trim");
  var draw = drawKeys(T.write[0], T.write[1], EASE_PEN);
  animate(trim.property("ADBE Vector Trim End"), draw.keys, [draw.curve]);
  for (var i = 1; i < 6; i++) {
    var turn = items.addProperty("ADBE Vector Group");
    turn.name = "Turn " + (i + 1);
    groupTr(turn, "ADBE Vector Anchor").setValue(MARK_CENTRE);
    groupTr(turn, "ADBE Vector Position").setValue(MARK_CENTRE);
    var at = T.split[0] + (i - 1) * T.stagger;
    animate(groupTr(turn, "ADBE Vector Rotation"), [[at, 0], [at + T.split[1], 60]], [EASE_OUT_STRONG]);
    if (i === 1) animate(groupTr(turn, "ADBE Vector Group Opacity"), [[0, 0], [at, 100]], [HOLD]);
    items = turn.property("ADBE Vectors Group");
    addTick(items, palette, "Tick " + (i + 1));
  }
  return layer;
}

// ───────── Compositions ─────────
// The lockup: steps 1–3 with the mark in the middle, then v2's unfold. The mark slides left and
// the name slides out from behind it; the name's mask edge rides on the mark's right side, so the
// slide is what reveals the name. The i's dot drops in as the name settles.
function buildLockup(name, palette) {
  var comp = newComp(name, 1920, 1080, 4.5, palette);
  // In Placement's units (the lockup's, about its centre) the mark starts SLIDE to the right
  var centre = tickCentre(TILT, OPEN, REACH), tick = [centre[0] - LOCKUP_CENTRE[0] + SLIDE, centre[1] - LOCKUP_CENTRE[1]];
  var cam = addCamera(comp, 70, tick); // the lockup is 1105 px wide, as in v2

  var dot = newShapeLayer(comp, "i dot", cam, LOCKUP_CENTRE);
  var dotGroup = dot.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  dotGroup.name = "i dot";
  addPaths(dotGroup, DOT);
  addFill(dotGroup, palette, false);

  var word = newShapeLayer(comp, "Wordmark", cam, LOCKUP_CENTRE);
  var nameGroup = word.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  nameGroup.name = "inoova";
  for (var i = 0; i < LETTERS.length; i++) {
    var g = nameGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Group");
    g.name = LETTERS[i][0];
    addPaths(g, LETTERS[i][1]);
    addFill(g, palette, LETTERS[i][2]);
  }
  var mask = word.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
  mask.name = "Mark's edge";

  var mark = addMark(comp, palette, cam);

  var s = T.slide[0], e = T.slide[0] + T.slide[1];
  var dx = MARK_CENTRE[0] - LOCKUP_CENTRE[0], dy = MARK_CENTRE[1] - LOCKUP_CENTRE[1];
  animate(tr(mark, "ADBE Position"), [[s, [dx + SLIDE, dy, 0]], [e, [dx, dy, 0]]], [EASE_IN_OUT_STRONG]);
  animate(mask.property("ADBE Mask Shape"), [[s, rect(EDGE + SLIDE, -400, 1300, 1165)], [e, rect(EDGE, -400, 1300, 1165)]], [EASE_IN_OUT_STRONG]);
  animate(groupTr(nameGroup, "ADBE Vector Position"), [[s, [-UNFOLD, 0]], [e, [0, 0]]], [EASE_IN_OUT_STRONG]);

  animate(groupTr(dotGroup, "ADBE Vector Position"), [[T.dot[0], [0, -60]], [T.dot[0] + T.dot[1], [0, 0]]], [EASE_BACK]);
  animate(groupTr(dotGroup, "ADBE Vector Group Opacity"), [[T.dot[0], 0], [T.dot[0] + 140, 100]], [LINEAR]);
  return comp;
}

// The mark alone: steps 1–3, then still
function buildMark(name, palette) {
  var comp = newComp(name, 1080, 1080, 3, palette);
  var centre = tickCentre(TILT, OPEN, REACH), tick = [centre[0] - MARK_CENTRE[0], centre[1] - MARK_CENTRE[1]];
  var cam = addCamera(comp, 120, tick);
  var mark = addMark(comp, palette, cam);
  tr(mark, "ADBE Position").setValue([0, 0, 0]);
  return comp;
}

writeLn("closed: " + tickPath(0, 0) + "\nopen:   " + tickPath(OPEN, REACH) + "\ncentre: " + tickCentre(TILT, OPEN, REACH).join(", "));
buildLockup("Lockup · light", LIGHT);
buildLockup("Lockup · dark", DARK);
buildMark("Mark · light", LIGHT);
buildMark("Mark · dark", DARK);
app.project.save(new File(OUT));
writeLn("saved " + OUT);
