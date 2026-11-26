/* Direction D helpers for inner pages: hide the side contents rail once the
   next-case card arrives, and respect reduced motion for hero video. */
(function () {
  var toc = document.getElementById("toc"), end = document.querySelector(".nextcs");
  if (toc && end && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { toc.classList.toggle("d-off", e.isIntersecting || e.boundingClientRect.top < 0); }); }).observe(end);
  }
  var v = document.querySelector(".d-media video");
  if (v && window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { v.pause(); v.removeAttribute("autoplay"); }
})();
/* Persona spectrum: keep participant dots from overlapping at any width.
   Dots closer than one dot apart form a cluster and are stacked around the line. */
(function () {
  var trks = document.querySelectorAll(".spec .trk");
  if (!trks.length) return;
  function lay() {
    trks.forEach(function (t) {
      var w = t.clientWidth, D = 28;
      var ds = Array.prototype.map.call(t.querySelectorAll(".sd"), function (d) { return { el: d, x: parseFloat(d.style.left) / 100 * w }; }).sort(function (a, b) { return a.x - b.x; });
      var groups = [], g = [];
      ds.forEach(function (d) { if (g.length && d.x - g[g.length - 1].x >= D) { groups.push(g); g = []; } g.push(d); });
      if (g.length) groups.push(g);
      groups.forEach(function (gr) { var n = gr.length; gr.forEach(function (d, i) { d.el.style.setProperty("--dy", ((i - (n - 1) / 2) * D) + "px"); }); });
      var max = 0; groups.forEach(function (gr) { max = Math.max(max, gr.length); });
      t.style.height = Math.max(76, max * D + 24) + "px";
    });
  }
  lay();
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(lay, 100); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lay);
})();
/* Section links: land each heading just below the bar, on every width.
   The browser's own jump added two offsets on top of each other (page padding and
   section margin) and then the section's top padding, so headings landed far down. */
(function () {
  var toc = document.getElementById("toc"), nav = document.querySelector(".nav");
  if (!toc || !nav) return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function offset() {
    var o = nav.getBoundingClientRect().bottom;
    if (getComputedStyle(toc).position === "sticky") o = Math.max(o, nav.offsetHeight + toc.offsetHeight);
    return o + 24;
  }
  function target(id) {
    var s = document.getElementById(id); if (!s) return null;
    return { s: s, h: s.querySelector("h2") || s };
  }
  function go(id, smooth) {
    var t = target(id); if (!t) return;
    t.s.classList.add("in");
    var abs = function (el) { var v = 0; while (el) { v += el.offsetTop; el = el.offsetParent; } return v; };
    var y = function () { return Math.max(0, abs(t.h) - offset()); };
    window.scrollTo({ top: y(), behavior: smooth && !reduce ? "smooth" : "auto" });
    var tries = 0, last = -1;
    (function settle() {
      // After the scroll ends, correct any drift from content that changed size on the way.
      if (Math.abs(window.scrollY - last) > 1 && tries++ < 60) { last = window.scrollY; return setTimeout(settle, 80); }
      if (Math.abs(window.scrollY - Math.min(y(), document.documentElement.scrollHeight - window.innerHeight)) > 3) window.scrollTo({ top: y(), behavior: "auto" });
    })();
  }
  toc.addEventListener("click", function (e) {
    var a = e.target.closest("a[href^='#']"); if (!a) return;
    e.preventDefault();
    var id = a.getAttribute("href").slice(1);
    go(id, true);
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  });
  if (location.hash && document.getElementById(location.hash.slice(1)) && toc.querySelector("a[href='" + location.hash + "']")) {
    var id0 = location.hash.slice(1);
    window.addEventListener("load", function () { go(id0, false); });
  }
})();
