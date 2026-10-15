/* ==========================================================
   My Flash – Options et couleurs des produits
   Fichier : couleurs.js
   À mettre dans le même dossier que tes pages, puis ajouter
   <script src="couleurs.js"></script> avant </body>
   ========================================================== */
(function () {
  "use strict";

  // Numéro WhatsApp de la boutique (format international, sans +)
  var WHATSAPP = "221788740712";

  // Toutes les couleurs proposées (les couleurs métal ont un reflet)
  var PALETTE = [
    { nom: "Noir", hex: "#111111" },
    { nom: "Blanc", hex: "#f7f7f7" },
    { nom: "Gris", hex: "#8a8f98" },
    { nom: "Gris sidéral", hex: "#4a4d52" },
    { nom: "Gris foncé", hex: "#4b4e4a" },
    { nom: "Argent", hex: "#c9ccd1", grad: "linear-gradient(135deg,#8e9196 0%,#f4f5f7 45%,#a9acb1 60%,#e6e8eb 100%)" },
    { nom: "Titane", hex: "#a8a29a", grad: "linear-gradient(135deg,#7d776f 0%,#d9d4cc 45%,#968f86 60%,#c8c2b9 100%)" },
    { nom: "Or", hex: "#c9a85c", grad: "linear-gradient(135deg,#8a6d2f 0%,#efe0a8 45%,#b8954a 60%,#e6cf86 100%)" },
    { nom: "Or rose", hex: "#d9a88e", grad: "linear-gradient(135deg,#b07a60 0%,#f3d2bf 45%,#c9917a 60%,#ecc3ad 100%)" },
    { nom: "Marron", hex: "#4a3226" },
    { nom: "Chocolat", hex: "#3e2418" },
    { nom: "Beige", hex: "#d6cbb5" },
    { nom: "Crème", hex: "#f2ecdd" },
    { nom: "Bleu", hex: "#1f4fa3" },
    { nom: "Bleu marine", hex: "#1e2433" },
    { nom: "Bleu lavande", hex: "#5f6690" },
    { nom: "Bleu ciel", hex: "#86bcc6" },
    { nom: "Turquoise", hex: "#5fb6b8" },
    { nom: "Vert", hex: "#2e7d4f" },
    { nom: "Vert sapin", hex: "#284d42" },
    { nom: "Vert olive", hex: "#2f3324" },
    { nom: "Kaki", hex: "#837650" },
    { nom: "Menthe", hex: "#a8e0c5" },
    { nom: "Rouge", hex: "#cc3b3f" },
    { nom: "Bordeaux", hex: "#6d1a2c" },
    { nom: "Rose", hex: "#e8628f" },
    { nom: "Rose poudré", hex: "#cfc2c6" },
    { nom: "Fuchsia", hex: "#d81b78" },
    { nom: "Violet", hex: "#7a5ac8" },
    { nom: "Lavande", hex: "#c7b8ea" },
    { nom: "Orange", hex: "#c25a2c" },
    { nom: "Jaune", hex: "#f4d03f" }
  ];

  /* ---------- Outils ---------- */
  function trouver(nom) {
    var n = String(nom).trim().toLowerCase();
    for (var i = 0; i < PALETTE.length; i++) {
      if (PALETTE[i].nom.toLowerCase() === n) return PALETTE[i];
    }
    return null;
  }

  function memeNom(a, b) { return a.toLowerCase().replace(/\s+/g, "") === b.toLowerCase().replace(/\s+/g, ""); }

  function nombre(txt) {
    var n = parseInt(String(txt || "").replace(/[^\d]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  }

  function formatPrix(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  /* Lit une option : "Noir", "Noir/Or", "Or +5000", "Petal=#e8628f" */
  function option(texte, hex, hex2) {
    var t = String(texte).trim();
    var o = { nom: t, plus: 0 };
    var m = t.match(/\s*\+\s*([\d\s.]+)\s*(f|fcfa|f cfa)?\s*$/i);
    if (m) { o.plus = nombre(m[1]); t = t.slice(0, m.index).trim(); }
    var eg = t.split("=");
    if (eg.length === 2) { t = eg[0].trim(); hex = hex || eg[1].trim(); }
    var parts = t.split("/");
    if (parts.length === 2) {
      var a = trouver(parts[0]), b = trouver(parts[1]);
      o.nom = parts[0].trim() + " / " + parts[1].trim();
      o.hex = hex || (a ? a.hex : "#cccccc");
      o.hex2 = hex2 || (b ? b.hex : "#cccccc");
      o.couleur = !!(a || b || hex);
      return o;
    }
    o.nom = t;
    var p = trouver(t);
    if (hex) { o.hex = hex; o.couleur = true; }
    else if (p) { o.hex = p.hex; o.grad = p.grad; o.couleur = true; }
    if (hex2) o.hex2 = hex2;
    return o;
  }

  function fond(c) {
    if (c.hex2) return "linear-gradient(135deg," + c.hex + " 50%," + c.hex2 + " 50%)";
    return c.grad || c.hex || "#cccccc";
  }

  // Liste simple de couleurs (espace gérant) : tableau, JSON ou "Noir, Blanc"
  function lire(valeur) {
    if (!valeur) return [];
    if (typeof valeur === "string") {
      var t = valeur.trim();
      if (!t) return [];
      if (t.charAt(0) === "[") { try { valeur = JSON.parse(t); } catch (e) { return []; } }
      else valeur = t.split(",");
    }
    if (!Array.isArray(valeur)) return [];
    var res = [];
    valeur.forEach(function (c) {
      if (!c) return;
      if (typeof c === "string") { if (c.trim()) res.push(option(c)); }
      else if (c.nom) {
        var o = option(c.nom + (c.plus ? " +" + c.plus : ""), c.hex, c.hex2);
        if (c.grad) o.grad = c.grad;
        res.push(o);
      }
    });
    return res;
  }

  /* Groupes d'options pour la page produit :
     "Bracelet: Rose, Noir, Marron | Boucle: Noir, Or +5000 | Taille: S, M, L"
     Un groupe sans couleur connue s'affiche en boutons texte. */
  function lireGroupes(spec) {
    if (!spec) return [];
    spec = String(spec).trim();
    if (spec.charAt(0) === "[") return [{ nom: "Couleur", options: lire(spec), couleurs: true }];
    var groupes = [];
    spec.split("|").forEach(function (bloc) {
      bloc = bloc.trim();
      if (!bloc) return;
      var nom = "Couleur", contenu = bloc;
      var i = bloc.indexOf(":");
      if (i > -1) { nom = bloc.slice(0, i).trim(); contenu = bloc.slice(i + 1); }
      var opts = lire(contenu);
      if (!opts.length) return;
      groupes.push({ nom: nom, options: opts, couleurs: opts.some(function (o) { return o.couleur; }) });
    });
    return groupes;
  }

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function ajouterStyle() {
    if (document.getElementById("mf-couleurs-style")) return;
    var s = document.createElement("style");
    s.id = "mf-couleurs-style";
    s.textContent =
      /* page produit */
      ".mf-g{margin:0 0 22px}" +
      ".mf-g-label{font-size:17px;color:#111;margin:0 0 12px}" +
      ".mf-g-label b{font-weight:700;margin-right:8px}" +
      ".mf-g-plus{margin-left:6px}" +
      ".mf-ronds{display:flex;flex-wrap:wrap;gap:12px}" +
      ".mf-rond{width:40px;height:40px;border-radius:50%;border:0;padding:0;cursor:pointer;outline:none;" +
      "box-shadow:inset 0 0 0 1px rgba(0,0,0,.12),0 0 0 3px #fff;-webkit-tap-highlight-color:transparent}" +
      ".mf-rond.actif{box-shadow:inset 0 0 0 1px rgba(0,0,0,.12),0 0 0 3px #fff,0 0 0 6px #111}" +
      ".mf-btns{display:flex;flex-wrap:wrap;gap:10px}" +
      ".mf-btn{min-width:90px;padding:13px 20px;border:1.5px solid #bbb;border-radius:6px;background:#fff;color:#111;" +
      "font-size:16px;font-weight:700;cursor:pointer}" +
      ".mf-btn.actif{background:#111;border-color:#111;color:#fff}" +
      /* espace gérant */
      ".mf-c-titre{font-weight:600;color:#0b1f4b;margin:0 0 8px;font-size:15px}" +
      ".mf-c-sous{font-size:13px;color:#555;margin:14px 0 6px;font-weight:600}" +
      ".mf-c-liste{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px}" +
      ".mf-c-item{display:flex;flex-direction:column;align-items:center;width:54px;font-size:10.5px;color:#444;text-align:center;line-height:1.2}" +
      ".mf-c-pastille{width:36px;height:36px;border-radius:50%;border:0;cursor:pointer;position:relative;padding:0;outline:none;" +
      "box-shadow:inset 0 0 0 1px rgba(0,0,0,.12),0 0 0 3px #fff;margin-bottom:5px}" +
      ".mf-c-pastille.actif{box-shadow:inset 0 0 0 1px rgba(0,0,0,.12),0 0 0 3px #fff,0 0 0 5px #0b1f4b}" +
      ".mf-c-pastille.actif::after{content:'✓';position:absolute;inset:0;display:flex;align-items:center;" +
      "justify-content:center;font-size:15px;font-weight:700;color:#fff;text-shadow:0 0 3px #000}" +
      ".mf-c-ligne{display:flex;gap:8px;align-items:center;flex-wrap:wrap}" +
      ".mf-c-ligne input[type=text],.mf-c-ligne select{flex:1;min-width:110px;padding:8px 10px;border:1px solid #cfd5e1;border-radius:8px;font-size:14px;background:#fff}" +
      ".mf-c-ligne input[type=color]{width:42px;height:38px;border:1px solid #cfd5e1;border-radius:8px;padding:2px;background:#fff}" +
      ".mf-c-btn{background:#0b1f4b;color:#fff;border:0;border-radius:8px;padding:9px 14px;font-size:14px;cursor:pointer}" +
      ".mf-c-apercu{width:34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);flex:none}" +
      ".mf-c-choix{font-size:13px;color:#555;margin-top:10px}";
    document.head.appendChild(s);
  }

  /* ==========================================================
     1) ESPACE GÉRANT : choisir les couleurs d'une publication
     ========================================================== */
  function selecteurGerant(conteneur, initiales) {
    ajouterStyle();
    if (typeof conteneur === "string") conteneur = document.querySelector(conteneur);
    if (!conteneur) return null;

    var champ = conteneur.querySelector("input[name=couleurs]");
    if (!champ) {
      champ = document.createElement("input");
      champ.type = "hidden";
      champ.name = "couleurs";
      conteneur.appendChild(champ);
    }

    var choisies = lire(initiales != null ? initiales : champ.value);
    var liste = PALETTE.map(function (p) { return option(p.nom); });
    function ajouterALaListe(c) {
      if (!liste.some(function (p) { return memeNom(p.nom, c.nom); })) liste.push(c);
    }
    choisies.forEach(ajouterALaListe);

    var bloc = el("div", "mf-c-gerant");
    bloc.appendChild(el("p", "mf-c-titre", "Couleurs disponibles (touche pour cocher)"));
    var zone = el("div", "mf-c-liste");
    var resume = el("div", "mf-c-choix");
    bloc.appendChild(zone);

    function estChoisie(nom) { return choisies.some(function (c) { return memeNom(c.nom, nom); }); }

    function maj() {
      champ.value = JSON.stringify(choisies.map(function (c) {
        var o = { nom: c.nom, hex: c.hex };
        if (c.hex2) o.hex2 = c.hex2;
        if (c.grad) o.grad = c.grad;
        return o;
      }));
      resume.textContent = choisies.length
        ? "Couleurs de cette publication : " + choisies.map(function (c) { return c.nom; }).join(", ")
        : "Aucune couleur (rien ne s'affichera pour les clients)";
      conteneur.dispatchEvent(new CustomEvent("mf-couleurs-change", { detail: choisies.slice() }));
    }

    function dessiner() {
      zone.innerHTML = "";
      liste.forEach(function (c) {
        var item = el("div", "mf-c-item");
        var b = el("button", "mf-c-pastille" + (estChoisie(c.nom) ? " actif" : ""));
        b.type = "button";
        b.title = c.nom;
        b.setAttribute("aria-label", c.nom);
        b.style.background = fond(c);
        b.onclick = function () {
          if (estChoisie(c.nom)) choisies = choisies.filter(function (x) { return !memeNom(x.nom, c.nom); });
          else choisies.push(c);
          dessiner();
          maj();
        };
        item.appendChild(b);
        item.appendChild(el("span", null, c.nom));
        zone.appendChild(item);
      });
    }

    function ajouterEtCocher(c) {
      ajouterALaListe(c);
      if (!estChoisie(c.nom)) choisies.push(c);
      dessiner();
      maj();
    }

    // Produit à 2 couleurs
    bloc.appendChild(el("p", "mf-c-sous", "Produit à 2 couleurs (ex : montre noir et or)"));
    var ligneBi = el("div", "mf-c-ligne");
    function selectCouleurs(defaut) {
      var s = el("select");
      PALETTE.forEach(function (p) {
        var o = el("option", null, p.nom);
        o.value = p.nom;
        if (p.nom === defaut) o.selected = true;
        s.appendChild(o);
      });
      return s;
    }
    var sel1 = selectCouleurs("Noir");
    var sel2 = selectCouleurs("Or");
    var apercu = el("div", "mf-c-apercu");
    function majApercu() { apercu.style.background = fond(option(sel1.value + "/" + sel2.value)); }
    sel1.onchange = majApercu;
    sel2.onchange = majApercu;
    majApercu();
    var ajoutBi = el("button", "mf-c-btn", "Ajouter");
    ajoutBi.type = "button";
    ajoutBi.onclick = function () {
      if (sel1.value !== sel2.value) ajouterEtCocher(option(sel1.value + "/" + sel2.value));
    };
    ligneBi.appendChild(sel1);
    ligneBi.appendChild(sel2);
    ligneBi.appendChild(apercu);
    ligneBi.appendChild(ajoutBi);
    bloc.appendChild(ligneBi);

    // Autre couleur
    bloc.appendChild(el("p", "mf-c-sous", "Autre couleur"));
    var autre = el("div", "mf-c-ligne");
    var nomInput = el("input");
    nomInput.type = "text";
    nomInput.placeholder = "Nom (ex : Titane naturel)";
    var hexInput = el("input");
    hexInput.type = "color";
    hexInput.value = "#888888";
    var ajout = el("button", "mf-c-btn", "Ajouter");
    ajout.type = "button";
    ajout.onclick = function () {
      var nom = nomInput.value.trim();
      if (!nom) return;
      ajouterEtCocher(option(nom, hexInput.value));
      nomInput.value = "";
    };
    autre.appendChild(nomInput);
    autre.appendChild(hexInput);
    autre.appendChild(ajout);
    bloc.appendChild(autre);
    bloc.appendChild(resume);

    conteneur.insertBefore(bloc, conteneur.firstChild);
    dessiner();
    maj();

    return {
      valeur: function () { return choisies.slice(); },
      definir: function (v) { choisies = lire(v); choisies.forEach(ajouterALaListe); dessiner(); maj(); },
      vider: function () { choisies = []; dessiner(); maj(); }
    };
  }

  /* ==========================================================
     2) PAGE PRODUIT : le client choisit (style WHOOP)
     ========================================================== */
  function afficherProduit(conteneur, spec, surChoix) {
    ajouterStyle();
    if (typeof conteneur === "string") conteneur = document.querySelector(conteneur);
    if (!conteneur) return null;
    var groupes = lireGroupes(spec != null ? spec :
      (conteneur.getAttribute("data-mf-options") || conteneur.getAttribute("data-mf-couleurs")));
    conteneur.innerHTML = "";
    if (!groupes.length) { conteneur.style.display = "none"; return null; }
    conteneur.style.display = "";

    var choix = {};
    conteneur.__mfChoix = choix;

    groupes.forEach(function (g) {
      var bloc = el("div", "mf-g");
      var label = el("div", "mf-g-label");
      label.appendChild(el("b", null, g.nom));
      var val = el("span");
      var plus = el("span", "mf-g-plus");
      label.appendChild(val);
      label.appendChild(plus);
      var zone = el("div", g.couleurs ? "mf-ronds" : "mf-btns");
      bloc.appendChild(label);
      bloc.appendChild(zone);
      conteneur.appendChild(bloc);

      var boutons = [];
      function choisir(o, b) {
        choix[g.nom] = o;
        val.textContent = o.nom;
        plus.textContent = o.plus ? "+" + formatPrix(o.plus) + " F" : "";
        boutons.forEach(function (x) { x.classList.remove("actif"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("actif");
        b.setAttribute("aria-pressed", "true");
        majProduit(conteneur);
        if (typeof surChoix === "function") surChoix(g.nom, o, choix);
      }

      g.options.forEach(function (o, i) {
        var b;
        if (g.couleurs) {
          b = el("button", "mf-rond");
          b.style.background = fond(o);
          b.title = o.nom;
          b.setAttribute("aria-label", g.nom + " " + o.nom);
        } else {
          b = el("button", "mf-btn", o.nom);
        }
        b.type = "button";
        b.onclick = function () { choisir(o, b); };
        boutons.push(b);
        zone.appendChild(b);
        if (i === 0) choisir(o, b);
      });
    });

    return { choix: function () { return choix; } };
  }

  /* ==========================================================
     3) PRIX + COMMANDE WHATSAPP avec les choix du client
     ========================================================== */
  function messageWhatsApp(produit, prix, choix) {
    var txt = "Bonjour My Flash, je veux commander : " + produit;
    if (typeof choix === "string" && choix) txt += "\nCouleur : " + choix;
    else if (choix) Object.keys(choix).forEach(function (k) { txt += "\n" + k + " : " + choix[k].nom; });
    if (prix) txt += "\nPrix : " + prix;
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(txt);
  }

  function majProduit(source) {
    var portee = (source && source.closest && source.closest("[data-mf-produit]")) || document;
    var choix = {};
    Array.prototype.forEach.call(portee.querySelectorAll("[data-mf-options],[data-mf-couleurs]"), function (b) {
      if (b.__mfChoix) Object.keys(b.__mfChoix).forEach(function (k) { choix[k] = b.__mfChoix[k]; });
    });
    var supp = 0;
    Object.keys(choix).forEach(function (k) { supp += choix[k].plus || 0; });

    // Prix affiché (élément avec data-mf-prix)
    Array.prototype.forEach.call(portee.querySelectorAll("[data-mf-prix]"), function (p) {
      if (!p.hasAttribute("data-mf-prix-base")) p.setAttribute("data-mf-prix-base", p.textContent.trim());
      var base = p.getAttribute("data-mf-prix-base");
      var monnaie = base.replace(/^[\d\s.,]+/, "").trim() || "F CFA";
      p.textContent = supp && nombre(base) ? formatPrix(nombre(base) + supp) + " " + monnaie : base;
    });

    Array.prototype.forEach.call(portee.querySelectorAll("a[data-mf-whatsapp]"), function (a) {
      var prix = a.getAttribute("data-prix") || "";
      var monnaie = prix.replace(/^[\d\s.,]+/, "").trim() || "F CFA";
      if (supp && nombre(prix)) prix = formatPrix(nombre(prix) + supp) + " " + monnaie;
      a.href = messageWhatsApp(a.getAttribute("data-produit") || "", prix, choix);
      a.target = "_blank";
    });
  }

  /* ---------- Démarrage automatique ---------- */
  function demarrer() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-mf-couleurs-gerant]"), function (c) {
      if (!c.__mf) c.__mf = selecteurGerant(c);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-mf-options],[data-mf-couleurs]"), function (c) {
      afficherProduit(c);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-mf-produit]"), majProduit);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

  window.MFCouleurs = {
    selecteurGerant: selecteurGerant,
    afficherProduit: afficherProduit,
    messageWhatsApp: messageWhatsApp,
    lire: lire,
    lireGroupes: lireGroupes,
    palette: PALETTE,
    rafraichir: demarrer
  };
})();
