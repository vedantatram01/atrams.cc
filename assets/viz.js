/* Small interactive views for the case studies. Everything works without JS:
   tabs show all panels, lists show all items, charts keep their data table. */
(function () {
  "use strict";
  var uid = 0;

  /* Tabs: <div class="vt" data-tabs="Label"><div class="vt-p" data-tab="Name">…</div>…</div> */
  Array.prototype.forEach.call(document.querySelectorAll(".vt[data-tabs]"), function (w) {
    var panels = Array.prototype.filter.call(w.children, function (c) { return c.hasAttribute("data-tab"); });
    if (panels.length < 2) return;
    var list = document.createElement("div"), tabs = [], n = ++uid;
    list.className = "vt-list"; list.setAttribute("role", "tablist"); list.setAttribute("aria-label", w.getAttribute("data-tabs"));
    panels.forEach(function (p, i) {
      var b = document.createElement("button"), id = "vt" + n + "-" + i;
      b.type = "button"; b.className = "vt-tab"; b.id = id; b.setAttribute("role", "tab");
      p.id = p.id || id + "-p"; b.setAttribute("aria-controls", p.id);
      b.innerHTML = "<span>" + p.getAttribute("data-tab") + "</span>" + (p.getAttribute("data-note") ? "<small><span class=\"vh\">, </span>" + p.getAttribute("data-note") + "</small>" : "");
      p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", id); p.tabIndex = 0;
      b.addEventListener("click", function () { sel(i); });
      b.addEventListener("keydown", function (e) {
        var k = e.key, j = k === "ArrowRight" ? i + 1 : k === "ArrowLeft" ? i - 1 : k === "Home" ? 0 : k === "End" ? tabs.length - 1 : null;
        if (j === null) return; e.preventDefault(); j = (j + tabs.length) % tabs.length; sel(j); tabs[j].focus();
      });
      tabs.push(b); list.appendChild(b);
    });
    function sel(i) {
      tabs.forEach(function (b, j) { var on = i === j; b.setAttribute("aria-selected", on ? "true" : "false"); b.tabIndex = on ? 0 : -1; panels[j].hidden = !on; });
    }
    w.insertBefore(list, w.firstChild); w.classList.add("vt-on"); sel(0);
  });

  /* Filter: <div class="vf" data-filter="Label" data-opts="k:Name|k2:Name2"><ul class="vf-list"><li data-k="k k2">… */
  Array.prototype.forEach.call(document.querySelectorAll(".vf[data-filter]"), function (w) {
    var items = Array.prototype.slice.call(w.querySelectorAll(".vf-list > li")), bar = document.createElement("div"), btns = [];
    var st = document.createElement("p"); st.className = "vf-st"; st.setAttribute("aria-live", "polite");
    bar.className = "vf-bar"; bar.setAttribute("role", "group"); bar.setAttribute("aria-label", w.getAttribute("data-filter"));
    var opts = [["", "All"]].concat(w.getAttribute("data-opts").split("|").map(function (o) { return o.split(":"); }));
    opts.forEach(function (o) {
      var c = o[0] ? items.filter(function (li) { return (" " + li.getAttribute("data-k") + " ").indexOf(" " + o[0] + " ") > -1; }).length : items.length;
      var b = document.createElement("button"); b.type = "button"; b.className = "vf-b";
      b.innerHTML = o[1] + " <span>" + c + "</span>";
      b.addEventListener("click", function () { go(o[0], b); });
      btns.push(b); bar.appendChild(b);
    });
    function go(k, on) {
      var shown = 0;
      btns.forEach(function (b) { b.setAttribute("aria-pressed", b === on ? "true" : "false"); });
      items.forEach(function (li) { var m = !k || (" " + li.getAttribute("data-k") + " ").indexOf(" " + k + " ") > -1; li.hidden = !m; if (m) shown++; });
      st.textContent = "Showing " + shown + " of " + items.length;
    }
    w.insertBefore(st, w.firstChild); w.insertBefore(bar, st); w.classList.add("vf-on"); go("", btns[0]);
  });

  /* Line chart: <figure class="lc" data-lc='{"x":[..],"s":[{"n":"","v":[..]}]}'><div class="lc-plot"></div>…table.vh… */
  var NS = "http://www.w3.org/2000/svg";
  function el(t, a, p) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  Array.prototype.forEach.call(document.querySelectorAll(".lc[data-lc]"), function (f) {
    var d = JSON.parse(f.getAttribute("data-lc")), plot = f.querySelector(".lc-plot"), keys = f.querySelector(".lc-keys");
    var groups = [];
    function draw() {
    plot.textContent = "";
    var W = Math.max(300, Math.round(plot.clientWidth || 640)), sm = W < 520, H = sm ? 260 : 300, L = 44, R = sm ? 28 : 150, T = 16, B = 40, iw = W - L - R, ih = H - T - B;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, "aria-hidden": "true", focusable: "false" }, plot);
    function X(i) { return L + (d.x.length === 1 ? 0 : i * iw / (d.x.length - 1)); }
    function Y(v) { return T + ih - v / 100 * ih; }
    [0, 25, 50, 75, 100].forEach(function (g) {
      el("line", { x1: L, x2: L + iw, y1: Y(g), y2: Y(g), class: "lc-g" }, svg);
      el("text", { x: L - 10, y: Y(g) + 4, class: "lc-t", "text-anchor": "end" }, svg).textContent = g + "%";
    });
    d.x.forEach(function (x, i) { el("text", { x: X(i), y: H - 12, class: "lc-t", "text-anchor": i === 0 && sm ? "start" : i === d.x.length - 1 && sm ? "end" : "middle" }, svg).textContent = x; });
    /* Place value labels above, or below when another series is close at the same x */
    var below = d.s.map(function () { return []; });
    d.x.forEach(function (_, i) {
      var pts = d.s.map(function (s, si) { return { si: si, v: s.v[i] }; }).sort(function (a, b) { return b.v - a.v; });
      var stack = 0;
      for (var k = 1; k < pts.length; k++) {
        if (pts[k - 1].v === pts[k].v) { below[pts[k].si][i] = "skip"; continue; }
        if (pts[k - 1].v - pts[k].v >= 10) { stack = 0; continue; }
        /* At the first point lines fan out below, so stack the label above instead */
        if (i === 0) { stack++; below[pts[k].si][i] = -stack; } else below[pts[k].si][i] = true;
      }
    });
    /* Spread end-of-line names so they never touch */
    var last = d.x.length - 1, ends = d.s.map(function (s, si) { return { si: si, y: Y(s.v[last]) + 4 }; }).sort(function (a, b) { return a.y - b.y; });
    for (var k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 18) ends[k].y = ends[k - 1].y + 18;
    var endY = []; ends.forEach(function (e) { endY[e.si] = e.y; });
    groups = d.s.map(function (s, si) {
      var g = el("g", { class: "lc-s lc-s" + si }, svg);
      el("polyline", { points: s.v.map(function (v, i) { return X(i) + "," + Y(v); }).join(" "), class: "lc-l" }, g);
      s.v.forEach(function (v, i) {
        el("circle", { cx: X(i), cy: Y(v), r: 5, class: "lc-p" }, g);
        var dn = below[si][i];
        /* A valley point takes its label underneath so the line never strikes through it */
        if (dn === undefined && i > 0 && i < last && v < s.v[i - 1] && v < s.v[i + 1]) dn = true;
        var dup = dn === "skip"; if (dup) dn = 0;
        var lab = el("text", { x: X(i) + (i === last ? -10 : i === 0 ? 10 : 0), y: Y(v) + (dn === true ? 22 : dn < 0 ? -12 + dn * 15 : -12), class: "lc-v", "text-anchor": i === last ? "end" : i === 0 ? "start" : "middle" }, g);
        lab.textContent = v + "%"; if (dup) lab.setAttribute("class", "lc-v lc-dup");
      });
      if (!sm) el("text", { x: X(last) + 14, y: endY[si], class: "lc-n" }, g).textContent = s.n;
      return g;
    });
    var sel = keys ? keys.querySelector('[aria-pressed="true"]') : null;
    if (sel) { var idx = Array.prototype.indexOf.call(keys.querySelectorAll("button"), sel); groups.forEach(function (g, j) { g.classList.toggle("on", j === idx); }); }
    }
    f.classList.add("lc-on");
    draw();
    var rw, lastW = plot.clientWidth;
    window.addEventListener("resize", function () { clearTimeout(rw); rw = setTimeout(function () { if (plot.clientWidth !== lastW) { lastW = plot.clientWidth; draw(); } }, 120); });
    if (keys) Array.prototype.forEach.call(keys.querySelectorAll("button"), function (b, i) {
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        Array.prototype.forEach.call(keys.querySelectorAll("button"), function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", on ? "true" : "false");
        f.classList.toggle("lc-focus", on);
        groups.forEach(function (g, j) { g.classList.toggle("on", on && j === i); });
        var note = f.querySelector(".lc-note");
        if (note) note.textContent = on ? b.getAttribute("data-note") : note.getAttribute("data-default");
      });
    });
  });

  /* Matrix: <div class="pmx" data-x="Low|Medium|High" data-y="Very high|High|Medium"><ul><li data-x="Low" data-y="High" data-t="…">…</li> */
  Array.prototype.forEach.call(document.querySelectorAll(".pmx"), function (w) {
    var xs = w.getAttribute("data-x").split("|"), ys = w.getAttribute("data-y").split("|");
    var items = Array.prototype.slice.call(w.querySelectorAll(".pmx-src > li"));
    var grid = document.createElement("div"), det = document.createElement("div"), btns = [];
    grid.className = "pmx-grid"; grid.style.setProperty("--cols", xs.length);
    det.className = "pmx-d"; det.setAttribute("aria-live", "polite");
    ys.forEach(function (y) {
      var yl = document.createElement("div"); yl.className = "pmx-yl"; yl.textContent = y; grid.appendChild(yl);
      xs.forEach(function (x) {
        var c = document.createElement("div"); c.className = "pmx-c";
        var z = w.getAttribute("data-zone-" + (xs.indexOf(x) + "" + ys.indexOf(y)));
        if (z) c.setAttribute("data-z", z);
        items.forEach(function (li) {
          if (li.getAttribute("data-x") !== x || li.getAttribute("data-y") !== y) return;
          var b = document.createElement("button"); b.type = "button"; b.className = "pmx-b"; b.textContent = li.getAttribute("data-t");
          b.setAttribute("aria-pressed", "false");
          b.setAttribute("aria-label", li.getAttribute("data-t") + ". Value " + y + ", effort " + x);
          b.addEventListener("click", function () { show(li, b); });
          b._li = li; btns.push(b); c.appendChild(b);
        });
        grid.appendChild(c);
      });
    });
    grid.appendChild(document.createElement("div"));
    xs.forEach(function (x) { var l = document.createElement("div"); l.className = "pmx-xl"; l.textContent = x; grid.appendChild(l); });
    function show(li, b) {
      btns.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
      det.innerHTML = li.innerHTML;
    }
    var src = w.querySelector(".pmx-src");
    w.insertBefore(grid, src); w.insertBefore(det, src); w.classList.add("pmx-on");
    var first = btns.filter(function (b) { return b._li === items[0]; })[0] || btns[0];
    show(first._li, first);
  });
})();
