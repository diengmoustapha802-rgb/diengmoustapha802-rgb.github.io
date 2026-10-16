/* =========================================================
   EN-TÊTE MY FLASH (style infinitech.sn) — fichier autonome
   1. Mets ce fichier à la racine du dépôt (à côté de index.html)
   2. Dans index.html, juste avant </head>, ajoute :
        <script src="mf-header.js?v=2" defer></script>
   3. Supprime l'ancien en-tête et l'ancien bloc collé (s'il y en a un)
   Le script se réinstalle tout seul si ton code efface la page.
   ========================================================= */
(function () {
  /* ---- Réglages ---- */
  var LOGO = "logo.png";                 // chemin de ton logo (laisse tel quel si inconnu)
  var WHATSAPP = "221788740712";
  var MENU = [
    ["Accueil", "#"],
    ["Ordinateurs", "#categorie=ordinateurs"],
    ["Bureautique", "#categorie=bureautique"],
    ["Graphisme & montage vidéo", "#categorie=graphisme"],
    ["iPhone", "#categorie=iphone"],
    ["Android", "#categorie=android"],
    ["Apple Watch", "#categorie=apple-watch"],
    ["Accessoires", "#categorie=accessoires"],
    ["Mon panier", "#panier"]
  ];

  var CSS = [
    ":root{--mf-navy:#0b1f3a;--mf-blue:#1d4ed8;--mf-bd:#e5e7eb;--mf-h:64px}",
    "html body{padding-top:var(--mf-h)!important}",
    "#mf-header{position:fixed!important;top:0;left:0;right:0;z-index:2147483000;height:var(--mf-h);background:#fff;border-bottom:1px solid var(--mf-bd);box-shadow:0 2px 8px rgba(0,0,0,.06);font-family:inherit}",
    "#mf-header .in{max-width:1280px;height:100%;margin:0 auto;padding:0 14px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center}",
    "#mf-header .burger{justify-self:start;display:flex;align-items:center;gap:8px;background:none;border:0;cursor:pointer;padding:8px 4px;font-weight:700;font-size:14px;letter-spacing:.04em;color:var(--mf-navy)}",
    "#mf-header .bars{display:grid;gap:4px}#mf-header .bars i{display:block;width:20px;height:2px;background:var(--mf-navy);border-radius:2px}",
    "#mf-header .logo{justify-self:center;display:flex;align-items:center;gap:8px;text-decoration:none}",
    "#mf-header .logo img{height:38px;width:auto}#mf-header .logo b{font-weight:800;font-size:18px;color:var(--mf-navy)}",
    "#mf-header .cart{justify-self:end;position:relative;width:42px;height:42px;display:grid;place-items:center;border:2px solid var(--mf-navy);border-radius:6px;color:var(--mf-navy);text-decoration:none}",
    "#mf-header .cart svg{width:20px;height:20px}",
    "#mf-header .count{position:absolute;top:-8px;right:-8px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:var(--mf-blue);color:#fff;font:700 11px/20px system-ui,sans-serif;text-align:center}",
    "#mf-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483001;opacity:0;visibility:hidden;transition:.25s}",
    "#mf-drawer{position:fixed;top:0;left:0;bottom:0;width:min(84vw,340px);z-index:2147483002;background:#fff;transform:translateX(-100%);transition:transform .28s;display:flex;flex-direction:column;overflow-y:auto}",
    "html.mf-open #mf-overlay{opacity:1;visibility:visible}html.mf-open #mf-drawer{transform:none}html.mf-open body{overflow:hidden}",
    "#mf-drawer .top{display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid var(--mf-bd)}",
    "#mf-drawer .top b{color:var(--mf-navy);font-size:16px}#mf-drawer .x{background:none;border:0;font-size:28px;line-height:1;cursor:pointer;color:var(--mf-navy)}",
    "#mf-drawer .search{padding:14px 16px;border-bottom:1px solid var(--mf-bd)}",
    "#mf-drawer .search input{width:100%;box-sizing:border-box;padding:11px 12px;font-size:15px;border:1px solid var(--mf-bd);border-radius:6px}",
    "#mf-drawer nav a{display:flex;justify-content:space-between;padding:15px 16px;border-bottom:1px solid var(--mf-bd);text-decoration:none;color:#111;font-size:15px}",
    "#mf-drawer nav a:after{content:'\\203A';color:#9ca3af}",
    "#mf-drawer .wa{margin:16px;padding:13px;border-radius:6px;text-align:center;background:#25d366;color:#fff;font-weight:700;text-decoration:none}"
  ].join("\n");

  var HEADER =
    '<div class="in">' +
      '<button class="burger" type="button" aria-label="Ouvrir le menu"><span class="bars"><i></i><i></i><i></i></span>MENU</button>' +
      '<a class="logo" href="#"><img src="' + LOGO + '" alt="My Flash" onerror="this.remove()"><b>My Flash</b></a>' +
      '<a class="cart" href="#panier" aria-label="Panier"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><span class="count">0</span></a>' +
    '</div>';

  var DRAWER =
    '<div class="top"><b>Menu</b><button class="x" type="button" aria-label="Fermer">&times;</button></div>' +
    '<div class="search"><input type="search" placeholder="Rechercher un produit…"></div>' +
    '<nav>' + MENU.map(function (m) { return '<a href="' + m[1] + '">' + m[0] + '</a>'; }).join("") + '</nav>' +
    '<a class="wa" target="_blank" href="https://wa.me/' + WHATSAPP + '">Contactez-nous sur WhatsApp</a>';

  function open()  { document.documentElement.classList.add("mf-open"); }
  function close() { document.documentElement.classList.remove("mf-open"); }

  function install() {
    if (!document.body) return;
    if (!document.getElementById("mf-style")) {
      var s = document.createElement("style"); s.id = "mf-style"; s.textContent = CSS;
      document.head.appendChild(s);
    }
    if (!document.getElementById("mf-header")) {
      var h = document.createElement("header"); h.id = "mf-header"; h.innerHTML = HEADER;
      h.querySelector(".burger").onclick = open;
      document.body.insertBefore(h, document.body.firstChild);
    }
    if (!document.getElementById("mf-drawer")) {
      var o = document.createElement("div"); o.id = "mf-overlay"; o.onclick = close;
      var d = document.createElement("aside"); d.id = "mf-drawer"; d.innerHTML = DRAWER;
      d.querySelector(".x").onclick = close;
      d.querySelectorAll("nav a").forEach(function (a) { a.addEventListener("click", close); });
      d.querySelector("input").addEventListener("keydown", function (e) {
        if (e.key === "Enter" && this.value.trim()) {
          location.hash = "recherche=" + encodeURIComponent(this.value.trim()); close();
        }
      });
      document.body.appendChild(o); document.body.appendChild(d);
    }
    updateCount();
  }

  /* ---- Compteur panier ---- */
  var lastCount = 0;
  window.mfSetCartCount = function (n) {
    lastCount = n || 0;
    var c = document.querySelector("#mf-header .count");
    if (c) c.textContent = lastCount;
  };
  function updateCount() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!/cart|panier/i.test(k)) continue;
        var v = JSON.parse(localStorage.getItem(k));
        if (v && !Array.isArray(v) && typeof v === "object") v = v.items || v.produits || Object.values(v);
        if (Array.isArray(v)) {
          return mfSetCartCount(v.reduce(function (s, x) {
            return s + (+(x && (x.qty || x.quantite || x.quantity || x.qte)) || 1);
          }, 0));
        }
      }
    } catch (e) {}
    mfSetCartCount(lastCount);
  }

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  window.addEventListener("hashchange", function () { close(); install(); });
  window.addEventListener("storage", updateCount);
  setInterval(updateCount, 1500);

  function start() {
    install();
    /* Si ton code réécrit la page (fiche produit…), on remet l'en-tête */
    new MutationObserver(function () {
      if (!document.getElementById("mf-header") || !document.getElementById("mf-drawer")) install();
    }).observe(document.body, { childList: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
