/* atrams.cc motion: small, hand-written effects in the spirit of Motion Primitives
   and PaceUI, with no libraries. Every effect is off for reduced motion, and the
   cursor effects run only with a fine pointer. Content stays readable without JS. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;
  root.classList.add("mo");
  if (reduce) root.classList.add("mo-reduce");

  /* 1. Text effect: the homepage headline arrives word by word with a soft blur */
  var h1 = document.querySelector(".hero h1, main > section:first-of-type h1, body > main h1");
  if (h1 && !reduce && document.body.contains(document.querySelector(".work"))) {
    var words = h1.textContent.trim().split(/\s+/);
    var full = h1.textContent.trim();
    h1.textContent = "";
    var hsr = document.createElement("span"); hsr.className = "vh"; hsr.textContent = full;
    words.forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "tx-w"; s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", i);
      s.textContent = w;
      h1.appendChild(s);
      if (i < words.length - 1) h1.appendChild(document.createTextNode(" "));
    });
    h1.appendChild(hsr);
    h1.classList.add("tx-in");
  }

  /* 2. Sliding numbers: big figures count up once, when they come into view */
  var nums = document.querySelectorAll(".m-num, .srcs li:not(.q) b, .tv-stats li b, .tv-src li b");
  function parse(t) {
    var m = t.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
    if (!m) return null;
    var raw = m[2].replace(/,/g, "");
    return { pre: m[1], val: parseFloat(raw), dec: (raw.split(".")[1] || "").length, comma: m[2].indexOf(",") > -1, post: m[3] };
  }
  function fmt(p, v) {
    var s = v.toFixed(p.dec);
    if (p.comma) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec });
    return p.pre + s + p.post;
  }
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, p = el._p, t0 = null, dur = 1100;
        function step(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - k, 3);
          el.firstChild.textContent = fmt(p, p.val * ease);
          if (k < 1) requestAnimationFrame(step); else el.firstChild.textContent = el._final;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) {
      if (el.children.length) return;
      var final = el.textContent, p = parse(final.trim());
      if (!p || isNaN(p.val)) return;
      el._p = p; el._final = final;
      var v = document.createElement("span");
      v.setAttribute("aria-hidden", "true");
      v.textContent = fmt(p, 0);
      var sr = document.createElement("span");
      sr.className = "vh"; sr.textContent = final.trim();
      el.textContent = ""; el.appendChild(v); el.appendChild(sr);
      io.observe(el);
    });
    /* never leave a figure at zero: settle any not yet counted when printing or after 8s off-screen */
    window.addEventListener("beforeprint", function () { nums.forEach(function (el) { if (el._final && el.firstChild) el.firstChild.textContent = el._final; }); });
  }

  /* 3. Spotlight + tilt on cards (fine pointers only) */
  if (fine && !reduce) {
    document.querySelectorAll(".wk, .card a").forEach(function (c) {
      c.classList.add("sp");
      var thumb = c.querySelector(".wk-thumb");
      c.addEventListener("pointermove", function (ev) {
        var r = c.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
        c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
        if (thumb) {
          var tr = thumb.getBoundingClientRect();
          var px = (ev.clientX - tr.left) / tr.width - 0.5, py = (ev.clientY - tr.top) / tr.height - 0.5;
          if (px >= -0.5 && px <= 0.5 && py >= -0.5 && py <= 0.5) thumb.style.setProperty("--tilt", "perspective(900px) rotateX(" + (-py * 4).toFixed(2) + "deg) rotateY(" + (px * 5).toFixed(2) + "deg)");
          else thumb.style.removeProperty("--tilt");
        }
      });
      c.addEventListener("pointerleave", function () { if (thumb) thumb.style.removeProperty("--tilt"); });
    });
  }

  /* 4. Animated tabs: one indicator slides to the selected tab */
  function wireTabs(list) {
    if (list._ind) return;
    var ind = document.createElement("span");
    ind.className = "vt-ind"; ind.setAttribute("aria-hidden", "true");
    list.appendChild(ind); list._ind = ind; list.classList.add("has-ind");
    function place() {
      var sel = list.querySelector('[aria-selected="true"]');
      if (!sel) return;
      ind.style.width = sel.offsetWidth + "px";
      ind.style.transform = "translateX(" + sel.offsetLeft + "px)";
    }
    place();
    new MutationObserver(place).observe(list, { attributes: true, subtree: true, attributeFilter: ["aria-selected"] });
    window.addEventListener("resize", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  }
  function scanTabs() { document.querySelectorAll(".vt-list").forEach(wireTabs); }
  scanTabs();
  window.addEventListener("load", scanTabs);

})();
