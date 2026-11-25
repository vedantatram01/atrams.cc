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
