/* Click-to-enlarge for detailed figures. Opt in with <img data-zoom>.
   Uses the native <dialog>: focus moves into it, Escape closes it,
   and focus returns to the image's button afterwards. */
(function () {
  "use strict";
  var imgs = document.querySelectorAll("img[data-zoom]");
  if (!imgs.length || typeof HTMLDialogElement !== "function") return;

  var dlg = document.createElement("dialog");
  dlg.className = "zv";
  dlg.setAttribute("aria-label", "Enlarged image");
  dlg.innerHTML =
    '<div class="zv-bar"><p class="zv-cap" id="zv-cap"></p>' +
    '<button type="button" class="zv-x">Close<span class="vh"> enlarged image</span></button></div>' +
    '<div class="zv-body"></div>';
  document.body.appendChild(dlg);
  var body = dlg.querySelector(".zv-body"), big = null, cap = dlg.querySelector(".zv-cap"), opener = null;

  function label(img) {
    var a = (img.getAttribute("alt") || "").split(/(?<=\.)\s/)[0];
    return a.length > 90 ? a.slice(0, 88).replace(/\s+\S*$/, "") + "…" : a;
  }
  function open(img, btn) {
    opener = btn;
    big = document.createElement("img");
    big.className = "zv-img";
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    var nw = img.naturalWidth || parseInt(img.getAttribute("width"), 10) || 0;
    if (nw) big.style.setProperty("--zw", Math.round(nw * 0.62) + "px"); else big.style.removeProperty("--zw");
    var fc = img.closest("figure") && img.closest("figure").querySelector("figcaption");
    body.appendChild(big);
    cap.textContent = fc ? fc.textContent.trim() : "";
    cap.hidden = false;
    document.documentElement.classList.add("zv-open");
    dlg.showModal();
    dlg.querySelector(".zv-x").focus();
  }
  function close() { if (dlg.open) dlg.close(); }
  dlg.addEventListener("close", function () {
    document.documentElement.classList.remove("zv-open");
    if (big) { big.remove(); big = null; }
    if (opener) opener.focus();
  });
  dlg.querySelector(".zv-x").addEventListener("click", close);
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.classList.contains("zv-body")) close(); });

  Array.prototype.forEach.call(imgs, function (img) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "zoom";
    btn.setAttribute("aria-label", "Enlarge image: " + label(img));
    img.parentNode.insertBefore(btn, img);
    btn.appendChild(img);
    var tag = document.createElement("span");
    tag.className = "zoom-tag";
    tag.setAttribute("aria-hidden", "true");
    tag.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9"/></svg>Enlarge';
    btn.appendChild(tag);
    btn.addEventListener("click", function () { open(img, btn); });
  });
})();
