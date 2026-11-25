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
