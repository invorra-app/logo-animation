// Inoova logo animation · v2 in EffectCraft: the hooks gather, the name unfolds.
// The paths, timings and curves are the ones in ../index.html (the v2 board); this script
// turns them into layers and keyframes.
//
//   cd v2/effectcraft && effectcraft-cli script build.jsx --empty
//
// writes inoova-logo-v2.ecproj next to this file, with five compositions:
//   Lockup · light, Lockup · dark   the full reveal (≈ 1.9 s, then held), 1920 × 1080
//   Mark · app open                 steps 1 and 2 only, 1080 × 1080
//   Loader · light, Loader · dark   six 2.4 s cycles (one full turn), loops seamlessly, 1080 × 1080

var OUT = "inoova-logo-v2.ecproj";
var FPS = 60;
var MOTION_BLUR = true; // video only: the app's CSS has none

// The CSS curves, as cubic-bezier(x1, y1, x2, y2)
var EASE_OUT_STRONG = [0.23, 1, 0.32, 1];     // --ease-out-strong (already in the app)
var EASE_IN_OUT_STRONG = [0.77, 0, 0.175, 1]; // --ease-in-out-strong
var EASE_BACK = [0.34, 1.56, 0.64, 1];        // --ease-back
var LINEAR = "linear";
var HOLD = "hold";

var LIGHT = { paper: "#ffffff", ink: "#18181b" };
var DARK = { paper: "#18181b", ink: "#fafafa" };

// ───────── Geometry (the App's logo.jsx and wordmark.jsx) ─────────
var HOOKS = [
  "M169.366 19V90.5849C169.366 116.151 155.731 129.786 136.13 110.186L104.599 78.6541",
  "M315.482 92.8138L253.488 128.606C231.347 141.389 212.721 136.398 219.895 109.623L231.437 66.5507",
  "M324.616 256.262L262.622 220.47C240.481 207.687 235.49 189.06 262.265 181.886L305.338 170.345",
  "M187.632 345.896V274.311C187.632 248.745 201.267 235.109 220.868 254.71L252.399 286.241",
  "M41.5177 272.083L103.512 236.29C125.653 223.507 144.279 228.498 137.105 255.273L125.563 298.346",
  "M32.3836 108.634L94.378 144.426C116.519 157.209 121.51 175.835 94.7347 183.009L51.662 194.551"
];
var LETTERS = [
  ["i", "M489.602 123.801H439V319.838H489.602V123.801Z", false],
  ["n", "M517.603 123.442H567.728V143.063C583.482 127.309 604.964 118.716 629.311 118.716C675.14 118.716 700.919 150.223 700.919 201.781V320.221H649.361V208.942C649.361 180.299 635.04 167.409 612.125 167.409C586.346 167.409 567.728 186.027 567.728 211.806V320.221H517.603V123.442Z", false],
  ["o", "M830.087 118.716C773.117 118.716 726.92 164.879 726.92 221.832C726.92 278.784 773.117 324.947 830.087 324.947C887.057 324.947 933.249 278.784 933.249 221.832C933.249 164.879 887.08 118.716 830.087 118.716ZM829.904 276.344C799.684 276.344 775.171 251.848 775.171 221.65C775.171 191.451 799.684 166.955 829.904 166.955C860.124 166.955 884.616 191.428 884.616 221.65C884.616 251.87 860.124 276.344 829.904 276.344Z", true],
  ["o 2", "M1056.42 118.716C999.446 118.716 953.249 164.879 953.249 221.832C953.249 278.784 999.446 324.947 1056.42 324.947C1113.39 324.947 1159.58 278.784 1159.58 221.832C1159.58 164.879 1113.41 118.716 1056.42 118.716ZM1056.23 276.344C1026.01 276.344 1001.5 251.848 1001.5 221.65C1001.5 191.451 1026.01 166.955 1056.23 166.955C1086.45 166.955 1110.94 191.428 1110.94 221.65C1110.94 251.87 1086.45 276.344 1056.23 276.344Z", true],
  ["v", "M1173.58 123.442H1228L1265.24 250.905L1302.47 123.442H1356.89L1291.02 320.222H1239.46L1173.58 123.442Z", false],
  ["a", "M1528.57 123.414V134.294C1512.75 124.441 1494.08 118.716 1474.06 118.716C1417.09 118.716 1370.89 164.879 1370.89 221.832C1370.89 278.784 1417.09 324.947 1474.06 324.947C1494.08 324.947 1512.75 319.245 1528.57 309.37V320.249H1578.78V123.414H1528.57ZM1473.88 276.344C1443.66 276.344 1419.15 251.848 1419.15 221.65C1419.15 191.451 1443.66 166.955 1473.88 166.955C1504.1 166.955 1528.09 190.949 1528.57 220.737V222.538C1528.09 252.327 1503.8 276.32 1473.88 276.32V276.344Z", true]
];
var DOT = "M489.409 39.9473H439.194V90.1253H489.409V39.9473Z";

var MARK_CENTRE = [178.5, 182.448]; // centre of the hooks: what the turn pivots on
var LOCKUP_CENTRE = [789.5, 182.5]; // centre of the lockup's 1579 × 365 viewBox
var SLIDE = 611;                    // the mark starts this far right: the middle of the lockup
var UNFOLD = 625;                   // the name starts this far left: wholly behind the mark's edge
var EDGE = 344;                     // the mark's right side at rest (hook tips at 324.6 + half the 38 stroke)
var GATHER = 48;                    // how far out along its stem each hook starts

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

// ───────── Drawing a hook ─────────
// CSS draws a hook with stroke-dasharray 100 120 on pathLength 100 and moves the dash offset
// 101 → 0 to draw it, 0 → −101 to erase it. Going to 101 rather than 100 keeps the round caps'
// dot hidden until the dash has some length. In Trim Paths terms, End = 101·e − 1 while it
// draws and Start = 101·e while it erases (e: the curve's progress), clipped to 0–100. So the
// curve is cut where that clip bites, and the keys hold just the part that shows.
function bez(c, u) { // a point of cubic-bezier(c) at parameter u: [x (time), y (progress)]
  var a = 3 * (1 - u) * (1 - u) * u, b = 3 * (1 - u) * u * u, d = u * u * u;
  return [a * c[0] + b * c[2] + d, a * c[1] + b * c[3] + d];
}
function solveY(c, y) { // u where the progress reaches y (these curves only rise)
  var lo = 0, hi = 1;
  for (var n = 0; n < 60; n++) { var m = (lo + hi) / 2; if (bez(c, m)[1] < y) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
function lerp(p, q, u) { return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u]; }
function split(c, u) { // de Casteljau: the curve's control points either side of u
  var p0 = [0, 0], p1 = [c[0], c[1]], p2 = [c[2], c[3]], p3 = [1, 1];
  var p01 = lerp(p0, p1, u), p12 = lerp(p1, p2, u), p23 = lerp(p2, p3, u);
  var p012 = lerp(p01, p12, u), p123 = lerp(p12, p23, u), m = lerp(p012, p123, u);
  return { m: m, left: [p01, p012], right: [p123, p23] };
}
// End 0 → 100, starting when 101·e − 1 passes 0
function drawKeys(at, ms, c) {
  var e0 = 1 / 101, s = split(c, solveY(c, e0)), x0 = s.m[0];
  var n = function (p) { return [(p[0] - x0) / (1 - x0), (p[1] - e0) / (1 - e0)]; };
  var p1 = n(s.right[0]), p2 = n(s.right[1]);
  return { keys: [[at + x0 * ms, 0], [at + ms, 100]], curve: [p1[0], p1[1], p2[0], p2[1]] };
}
// Start 0 → 100, done when 101·e passes 100
function eraseKeys(at, ms, c) {
  var e1 = 100 / 101, s = split(c, solveY(c, e1)), x1 = s.m[0];
  var p1 = s.left[0], p2 = s.left[1];
  return { keys: [[at, 0], [at + x1 * ms, 100]], curve: [p1[0] / x1, p1[1] / e1, p2[0] / x1, p2[1] / e1] };
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

// A null that places and sizes the logo; everything under it is in the SVG's units
function addPlacement(comp, size) {
  var place = comp.layers.addNull();
  place.name = "Placement";
  tr(place, "ADBE Anchor Point").setValue([0, 0, 0]);
  tr(place, "ADBE Position").setValue([comp.width / 2, comp.height / 2, 0]);
  tr(place, "ADBE Scale").setValue([size, size, 100]);
  return place;
}

function newShapeLayer(comp, name, parent, anchor) {
  var layer = comp.layers.addShape();
  layer.name = name;
  layer.parent = parent;
  layer.motionBlur = MOTION_BLUR;
  tr(layer, "ADBE Anchor Point").setValue([anchor[0], anchor[1], 0]);
  tr(layer, "ADBE Position").setValue([0, 0, 0]);
  tr(layer, "ADBE Scale").setValue([100, 100, 100]);
  return layer;
}

// The six hooks: one group each, a 38-unit round stroke drawn by Trim Paths
function addMark(comp, palette, parent) {
  var layer = newShapeLayer(comp, "Mark", parent, MARK_CENTRE);
  var contents = layer.property("ADBE Root Vectors Group");
  var hooks = [];
  for (var i = 0; i < HOOKS.length; i++) {
    var g = contents.addProperty("ADBE Vector Group");
    g.name = "Hook " + (i + 1);
    addPaths(g, HOOKS[i]);
    var items = g.property("ADBE Vectors Group");
    var st = items.addProperty("ADBE Vector Graphic - Stroke");
    st.property("ADBE Vector Stroke Color").setValue(hex(palette.ink));
    st.property("ADBE Vector Stroke Width").setValue(38);
    st.property("ADBE Vector Stroke Line Cap").setValue(2);  // round
    st.property("ADBE Vector Stroke Line Join").setValue(2); // round
    var trim = items.addProperty("ADBE Vector Filter - Trim");
    hooks.push({ group: g, start: trim.property("ADBE Vector Trim Start"), end: trim.property("ADBE Vector Trim End") });
  }
  return { layer: layer, hooks: hooks };
}

// ───────── The reveal ─────────
// 1 · gather: the six hooks draw from their outer tip, clockwise from the top, 50 ms apart, and fly
//     48 units in along their stems while they draw, each fading in over its first 120 ms
// 2 · the mark turns −60° → 0 as they land, and rests
function animateGather(mark) {
  for (var i = 0; i < mark.hooks.length; i++) {
    var at = 40 + i * 50, draw = drawKeys(at, 600, EASE_OUT_STRONG);
    var out = [GATHER * Math.sin(i * Math.PI / 3), -GATHER * Math.cos(i * Math.PI / 3)];
    animate(mark.hooks[i].end, draw.keys, [draw.curve]);
    animate(groupTr(mark.hooks[i].group, "ADBE Vector Position"), [[at, out], [at + 600, [0, 0]]], [EASE_OUT_STRONG]);
    animate(groupTr(mark.hooks[i].group, "ADBE Vector Group Opacity"), [[at, 0], [at + 120, 100]], [LINEAR]);
  }
  animate(tr(mark.layer, "ADBE Rotate Z"), [[0, -60], [850, 0]], [EASE_OUT_STRONG]);
}

// 3 · unfold: the mark slides left and the name slides out from behind it; the name's mask edge
//     rides on the mark's right side, so the slide is what reveals the name
// 4 · the i's dot drops in as the name settles
function buildLockup(name, palette) {
  var comp = newComp(name, 1920, 1080, 3, palette);
  var place = addPlacement(comp, 70); // the lockup is 1105 px wide

  var dot = newShapeLayer(comp, "i dot", place, LOCKUP_CENTRE);
  var dotGroup = dot.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  dotGroup.name = "i dot";
  addPaths(dotGroup, DOT);
  addFill(dotGroup, palette, false);

  var word = newShapeLayer(comp, "Wordmark", place, LOCKUP_CENTRE);
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

  var mark = addMark(comp, palette, place);
  animateGather(mark);

  var dx = MARK_CENTRE[0] - LOCKUP_CENTRE[0], dy = MARK_CENTRE[1] - LOCKUP_CENTRE[1];
  animate(tr(mark.layer, "ADBE Position"), [[850, [dx + SLIDE, dy, 0]], [1650, [dx, dy, 0]]], [EASE_IN_OUT_STRONG]);
  animate(mask.property("ADBE Mask Shape"), [[850, rect(EDGE + SLIDE, -400, 1300, 1165)], [1650, rect(EDGE, -400, 1300, 1165)]], [EASE_IN_OUT_STRONG]);
  animate(groupTr(nameGroup, "ADBE Vector Position"), [[850, [-UNFOLD, 0]], [1650, [0, 0]]], [EASE_IN_OUT_STRONG]);

  animate(groupTr(dotGroup, "ADBE Vector Position"), [[1420, [0, -60]], [1920, [0, 0]]], [EASE_BACK]);
  animate(groupTr(dotGroup, "ADBE Vector Group Opacity"), [[1420, 0], [1560, 100]], [LINEAR]);
  return comp;
}

// The mark alone (app open): steps 1 and 2, then still
function buildMarkIntro(name, palette) {
  var comp = newComp(name, 1080, 1080, 2, palette);
  var place = addPlacement(comp, 120);
  animateGather(addMark(comp, palette, place));
  return comp;
}

// The loader: each hook draws (0–42% of a 2.4 s cycle), holds (–62%) and erases from its start
// (–100%), 70 ms after the one before. The mark turns a sixth per cycle, a full turn per six, so
// the comp is six cycles in their steady state and loops without a seam.
function buildLoader(name, palette) {
  var P = 2400, CYCLES = 6;
  var comp = newComp(name, 1080, 1080, CYCLES * P / 1000, palette);
  var place = addPlacement(comp, 120);
  var mark = addMark(comp, palette, place);
  for (var i = 0; i < mark.hooks.length; i++) {
    var endKeys = [], endCurves = [], startKeys = [], startCurves = [];
    for (var c = -1; c <= CYCLES; c++) {
      var b = c * P + i * 70;
      var draw = drawKeys(b, 1008, EASE_IN_OUT_STRONG), erase = eraseKeys(b + 1488, 912, EASE_IN_OUT_STRONG);
      // Start and End both drop back to 0 when a cycle begins (the stroke is gone by then)
      endKeys.push([b, 0], draw.keys[0], draw.keys[1]);
      endCurves.push(HOLD, draw.curve, HOLD);
      startKeys.push([b, 0], erase.keys[0], erase.keys[1]);
      startCurves.push(HOLD, erase.curve, HOLD);
    }
    endCurves.pop(); startCurves.pop();
    animate(mark.hooks[i].end, endKeys, endCurves);
    animate(mark.hooks[i].start, startKeys, startCurves);
  }
  animate(tr(mark.layer, "ADBE Rotate Z"), [[0, 0], [CYCLES * P, 360]], [LINEAR]);
  return comp;
}

buildLockup("Lockup · light", LIGHT);
buildLockup("Lockup · dark", DARK);
buildMarkIntro("Mark · app open", LIGHT);
buildLoader("Loader · light", LIGHT);
buildLoader("Loader · dark", DARK);
app.project.save(new File(OUT));
writeLn("saved " + OUT);
