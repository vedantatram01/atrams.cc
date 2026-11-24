/* Home hero graphic: a small 3D city of blocks with one clear route through it.
   A scarlet marker finds its way between the tall obstacles: the headline, drawn.
   Plain canvas, no libraries. Turns with the pointer and with scroll.
   Reduced motion draws one still frame. Pauses when off-screen. */
(function () {
  var wrap = document.querySelector(".iso"); if (!wrap) return;
  var cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var N = 7;
  /* heights: 0 = route, small = ground, tall = obstacles */
  var H = [
    [1.1, 0.3, 0.3, 1.3, 0.3, 0.3, 0.3],
    [0.3, 0.3, 0.3, 0.3, 0.3, 0.0, 0.0],
    [0.3, 1.2, 0.3, 0.0, 0.0, 0.0, 0.3],
    [0.3, 0.3, 0.0, 0.0, 1.1, 0.3, 0.3],
    [0.3, 0.0, 0.0, 0.3, 1.3, 0.3, 1.0],
    [0.0, 0.0, 0.3, 0.3, 0.3, 0.3, 0.3],
    [0.0, 0.3, 0.3, 0.3, 0.3, 1.0, 0.3]
  ];
  var ROUTE = [[6,0],[5,0],[5,1],[4,1],[4,2],[3,2],[3,3],[2,3],[2,4],[1,4],[1,5],[1,6]];
  var onRoute = {}; ROUTE.forEach(function (p) { onRoute[p[0] + "," + p[1]] = 1; });
  var C = {};
  function colors() {
    var st = getComputedStyle(document.documentElement), dark = document.documentElement.getAttribute("data-mode") === "dark";
    C = dark ? { top: [38, 40, 38], tall: [30, 31, 30], route: [255, 90, 85], line: "rgba(255,251,252,.08)", ball: [255, 251, 252], shadow: "rgba(0,0,0,.5)" }
             : { top: [244, 240, 241], tall: [22, 24, 22], route: [222, 26, 26], line: "rgba(1,4,0,.06)", ball: [1, 4, 0], shadow: "rgba(1,4,0,.18)" };
  }
  colors();
  new MutationObserver(colors).observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });

  var W = 0, Hh = 0, dpr = 1, S = 1;
  function size() {
    var r = wrap.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; Hh = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr);
    cv.style.width = W + "px"; cv.style.height = Hh + "px"; S = Math.min(W, Hh * 1.25) / 10.5;
  }
  size(); addEventListener("resize", function () { size(); if (rm) draw(0); });

  var BASE = -Math.PI * 0.75, yaw = BASE, tYaw = yaw, pitch = 0.82, tPitch = pitch, scrollYaw = 0;
  function proj(x, y, z) {
    var cx = x - N / 2, cy = y - N / 2;
    var rx = cx * Math.cos(yaw) - cy * Math.sin(yaw), ry = cx * Math.sin(yaw) + cy * Math.cos(yaw);
    var sx = rx, sy = ry * Math.sin(pitch) - z * Math.cos(pitch), d = ry * Math.cos(pitch) + z * Math.sin(pitch);
    return [W / 2 + sx * S, Hh * 0.6 + sy * S, d];
  }
  function shade(c, k) { return "rgb(" + Math.round(c[0] * k) + "," + Math.round(c[1] * k) + "," + Math.round(c[2] * k) + ")"; }
  function face(pts, fill) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke(); }
  function box(x, y, h, col, gap) {
    var g = gap, x0 = x + g, x1 = x + 1 - g, y0 = y + g, y1 = y + 1 - g, z = h;
    var b = [proj(x0, y0, 0), proj(x1, y0, 0), proj(x1, y1, 0), proj(x0, y1, 0)], t = [proj(x0, y0, z), proj(x1, y0, z), proj(x1, y1, z), proj(x0, y1, z)];
    var sides = [[0, 1, -Math.PI / 2], [1, 2, 0], [2, 3, Math.PI / 2], [3, 0, Math.PI]];
    sides.forEach(function (sd) {
      var nx = Math.cos(sd[2] + yaw); /* facing factor toward viewer */
      var vis = Math.sin(sd[2] + yaw); if (vis < -0.01) return;
      var k = 0.62 + 0.26 * (nx > 0 ? nx : nx * 0.4);
      face([b[sd[0]], b[sd[1]], t[sd[1]], t[sd[0]]], shade(col, k));
    });
    face(t, shade(col, 1));
  }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var t0 = performance.now(), running = false, visible = true;
  function draw(now) {
    yaw += (tYaw + scrollYaw - yaw) * 0.06; pitch += (tPitch - pitch) * 0.06;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, Hh);
    var t = rm ? 0.55 : Math.max(0, (now - t0) / 1000);
    /* route progress: walk, pause at the end, start again */
    var cyc = 9, u = rm ? 1 : Math.min(1, (t % cyc) / (cyc - 2)), seg = u * (ROUTE.length - 1), si = Math.max(0, Math.min(ROUTE.length - 2, Math.floor(seg))), f = ease(seg - si);
    var a = ROUTE[si], bpt = ROUTE[si + 1], bx = a[0] + (bpt[0] - a[0]) * f + .5, by = a[1] + (bpt[1] - a[1]) * f + .5;
    var lit = rm ? ROUTE.length : Math.floor(seg) + 1;
    /* draw order: back to front by rotated depth */
    var cells = [];
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
      var c = proj(i + .5, j + .5, 0); cells.push([c[2], i, j]);
    }
    cells.sort(function (p, q) { return p[0] - q[0]; });
    var ballDrawn = false, bp = proj(bx, by, 0);
    cells.forEach(function (cl) {
      if (!ballDrawn && cl[0] > bp[2] + 0.4) { ball(bx, by, t); ballDrawn = true; }
      var i = cl[1], j = cl[2], key = i + "," + j, h = H[j][i];
      var wave = rm ? 0 : Math.sin(t * 1.3 + (i + j) * 0.55) * 0.06;
      if (onRoute[key]) {
        var idx = 0; for (var r = 0; r < ROUTE.length; r++) if (ROUTE[r][0] === i && ROUTE[r][1] === j) idx = r;
        var on = idx < lit, k = on ? 1 : 0.0;
        var col = on ? C.route : C.top;
        box(i, j, on ? 0.32 : 0.2, col, 0.06);
      } else {
        box(i, j, Math.max(0.3, h + wave), h >= 0.9 ? C.tall : C.top, 0.06);
      }
    });
    if (!ballDrawn) ball(bx, by, t);
  }
  function ball(x, y, t) {
    var hop = rm ? 0 : Math.abs(Math.sin(t * Math.PI * 1.6)) * 0.35;
    var g = proj(x, y, 0.2), p = proj(x, y, 0.75 + hop), r = S * 0.32;
    ctx.beginPath(); ctx.ellipse(g[0], g[1], r * 0.9, r * 0.38, 0, 0, Math.PI * 2); ctx.fillStyle = C.shadow; ctx.fill();
    var gr = ctx.createRadialGradient(p[0] - r * .35, p[1] - r * .4, r * .1, p[0], p[1], r);
    gr.addColorStop(0, C.ball[0] > 200 ? "#FFFFFF" : "#6A6A6A"); gr.addColorStop(1, shade(C.ball, 1));
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
  }
  function loop(now) { if (!running) return; draw(now); requestAnimationFrame(loop); }
  function start() { if (rm || running || !visible) return; running = true; requestAnimationFrame(loop); }
  function stop() { running = false; }
  if (rm) { draw(0); return; }
  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0.05 }).observe(wrap);
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    addEventListener("pointermove", function (e) { var px = e.clientX / innerWidth - .5, py = e.clientY / innerHeight - .5; tYaw = BASE + px * 0.5; tPitch = 0.82 + py * 0.14; }, { passive: true });
  }
  addEventListener("scroll", function () { scrollYaw = Math.min(600, scrollY) / 600 * 0.6; }, { passive: true });
  start();
})();
