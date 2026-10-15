/* ==========================================================
   My Flash – Couleurs disponibles des produits
   Fichier : couleurs.js
   À mettre dans le même dossier que tes pages, puis ajouter
   <script src="couleurs.js"></script> avant </body>
   ========================================================== */
(function () {
  "use strict";

  // Numéro WhatsApp de la boutique (format international, sans +)
  var WHATSAPP = "221788740712";

  // Toutes les couleurs proposées dans l'espace gérant
  var PALETTE = [
    { nom: "Noir", hex: "#111111" },
    { nom: "Blanc", hex: "#ffffff" },
    { nom: "Gris", hex: "#8a8f98" },
    { nom: "Gris sidéral", hex: "#4a4d52" },
    { nom: "Argent", hex: "#c9ccd1" },
    { nom: "Titane", hex: "#a8a29a" },
    { nom: "Or", hex: "#d4b26a" },
    { nom: "Or rose", hex: "#e3b7a0" },
    { nom: "Marron", hex: "#6b3e26" },
    { nom: "Chocolat", hex: "#3e2418" },
    { nom: "Beige", hex: "#e3d3b8" },
    { nom: "Crème", hex: "#f6efdf" },
    { nom: "Bleu", hex: "#1f4fa3" },
    { nom: "Bleu marine", hex: "#0b1f4b" },
    { nom: "Bleu ciel", hex: "#8ec5ef" },
    { nom: "Turquoise", hex: "#1fb5ad" },
    { nom: "Vert", hex: "#2e7d4f" },
    { nom: "Vert olive", hex: "#6b7a3a" },
    { nom: "Kaki", hex: "#8a7f55" },
    { nom: "Menthe", hex: "#a8e0c5" },
    { nom: "Rouge", hex: "#c62828" },
    { nom: "Bordeaux", hex: "#6d1a2c" },
    { nom: "Rose", hex: "#f2a7bb" },
    { nom: "Fuchsia", hex: "#d81b78" },
    { nom: "Violet", hex: "#7a5ac8" },
    { nom: "Lavande", hex: "#c7b8ea" },
    { nom: "Orange", hex: "#f2811d" },
    { nom: "Jaune", hex: "#f4d03f" }
  ];

  /* ---------- Outils ---------- */
  function hexDe(nom) {
    var n = String(nom).trim().toLowerCase();
    for (var i = 0; i < PALETTE.length; i++) {
      if (PALETTE[i].nom.toLowerCase() === n) return PALETTE[i].hex;
    }
    return "#cccccc";
  }

  // "Noir / Or" -> montre bicolore (moitié noir, moitié or)
  function couleurDe(nom, hex, hex2) {
    nom = String(nom).trim();
    var parts = nom.split("/");
    if (parts.length === 2) {
      return {
        nom: parts[0].trim() + " / " + parts[1].trim(),
        hex: hex || hexDe(parts[0]),
        hex2: hex2 || hexDe(parts[1])
      };
    }
    var c = { nom: nom, hex: hex || hexDe(nom) };
    if (hex2) c.hex2 = hex2;
    return c;
  }

  function fond(c) {
    return c.hex2
      ? "linear-gradient(135deg," + c.hex + " 50%," + c.hex2 + " 50%)"
      : c.hex;
  }

  function memeNom(a, b) { return a.toLowerCase().replace(/\s+/g, "") === b.toLowerCase().replace(/\s+/g, ""); }

  // Accepte : tableau, texte JSON, ou "Noir, Blanc, Noir/Or"
  function lire(valeur) {
    if (!valeur) return [];
    if (typeof valeur === "string") {
      var t = valeur.trim();
      if (!t) return [];
      if (t.charAt(0) === "[") {
        try { valeur = JSON.parse(t); } catch (e) { return []; }
      } else {
        valeur = t.split(",");
      }
    }
    if (!Array.isArray(valeur)) return [];
    var res = [];
    valeur.forEach(function (c) {
      if (!c) return;
      if (typeof c === "string") {
        if (c.trim()) res.push(couleurDe(c));
      } else if (c.nom) {
        res.push(couleurDe(c.nom, c.hex, c.hex2));
      }
    });
    return res;
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
      ".mf-c-titre{font-weight:600;color:#0b1f4b;margin:0 0 8px;font-size:15px}" +
      ".mf-c-sous{font-size:13px;color:#555;margin:14px 0 6px;font-weight:600}" +
      ".mf-c-liste{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px}" +
      ".mf-c-item{display:flex;flex-direction:column;align-items:center;width:52px;font-size:10.5px;color:#444;text-align:center;line-height:1.2}" +
      ".mf-c-pastille{width:34px;height:34px;border-radius:50%;border:1px solid #cfd5e1;cursor:pointer;" +
      "position:relative;padding:0;outline:none;box-shadow:0 0 0 3px #fff;margin-bottom:4px}" +
      ".mf-c-pastille.actif{box-shadow:0 0 0 2px #fff,0 0 0 4px #0b1f4b}" +
      ".mf-c-pastille.actif::after{content:'✓';position:absolute;inset:0;display:flex;align-items:center;" +
      "justify-content:center;font-size:15px;font-weight:700;color:#fff;text-shadow:0 0 3px #000}" +
      ".mf-c-ligne{display:flex;gap:8px;align-items:center;flex-wrap:wrap}" +
      ".mf-c-ligne input[type=text],.mf-c-ligne select{flex:1;min-width:110px;padding:8px 10px;border:1px solid #cfd5e1;border-radius:8px;font-size:14px;background:#fff}" +
      ".mf-c-ligne input[type=color]{width:42px;height:38px;border:1px solid #cfd5e1;border-radius:8px;padding:2px;background:#fff}" +
      ".mf-c-btn{background:#0b1f4b;color:#fff;border:0;border-radius:8px;padding:9px 14px;font-size:14px;cursor:pointer}" +
      ".mf-c-apercu{width:34px;height:34px;border-radius:50%;border:1px solid #cfd5e1;flex:none}" +
      ".mf-c-choix{font-size:13px;color:#555;margin-top:10px}" +
      ".mf-c-label{font-size:15px;color:#222;margin-bottom:8px}" +
      ".mf-c-label b{color:#0b1f4b}";
    document.head.appendChild(s);
  }

  function pastille(c, actif, clic, avecNom) {
    var item = el("div", "mf-c-item");
    var b = el("button", "mf-c-pastille" + (actif ? " actif" : ""));
    b.type = "button";
    b.title = c.nom;
    b.setAttribute("aria-label", c.nom);
    b.style.background = fond(c);
    b.onclick = clic;
    item.appendChild(b);
    if (avecNom) item.appendChild(el("span", null, c.nom));
    return { item: item, bouton: b };
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
    var liste = PALETTE.slice();
    function ajouterALaListe(c) {
      if (!liste.some(function (p) { return memeNom(p.nom, c.nom); })) liste.push(c);
    }
    choisies.forEach(ajouterALaListe);

    var bloc = el("div", "mf-c-gerant");
    bloc.appendChild(el("p", "mf-c-titre", "Couleurs disponibles (touche pour cocher)"));
    var zone = el("div", "mf-c-liste");
    var resume = el("div", "mf-c-choix");
    bloc.appendChild(zone);

    function estChoisie(nom) {
      return choisies.some(function (c) { return memeNom(c.nom, nom); });
    }

    function maj() {
      champ.value = JSON.stringify(choisies);
      resume.textContent = choisies.length
        ? "Couleurs de cette publication : " + choisies.map(function (c) { return c.nom; }).join(", ")
        : "Aucune couleur (rien ne s'affichera pour les clients)";
      conteneur.dispatchEvent(new CustomEvent("mf-couleurs-change", { detail: choisies.slice() }));
    }

    function basculer(c) {
      if (estChoisie(c.nom)) {
        choisies = choisies.filter(function (x) { return !memeNom(x.nom, c.nom); });
      } else {
        choisies.push(c);
      }
      dessiner();
      maj();
    }

    function dessiner() {
      zone.innerHTML = "";
      liste.forEach(function (c) {
        zone.appendChild(pastille(c, estChoisie(c.nom), function () { basculer(c); }, true).item);
      });
    }

    function ajouterEtCocher(c) {
      ajouterALaListe(c);
      if (!estChoisie(c.nom)) choisies.push(c);
      dessiner();
      maj();
    }

    // --- Montre bicolore (2 couleurs) ---
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
    function majApercu() { apercu.style.background = fond(couleurDe(sel1.value + "/" + sel2.value)); }
    sel1.onchange = majApercu;
    sel2.onchange = majApercu;
    majApercu();
    var ajoutBi = el("button", "mf-c-btn", "Ajouter");
    ajoutBi.type = "button";
    ajoutBi.onclick = function () {
      if (sel1.value === sel2.value) return;
      ajouterEtCocher(couleurDe(sel1.value + "/" + sel2.value));
    };
    ligneBi.appendChild(sel1);
    ligneBi.appendChild(sel2);
    ligneBi.appendChild(apercu);
    ligneBi.appendChild(ajoutBi);
    bloc.appendChild(ligneBi);

    // --- Couleur qui n'est pas dans la liste ---
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
      ajouterEtCocher({ nom: nom, hex: hexInput.value });
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
     2) PAGE PRODUIT : le client choisit sa couleur
     ========================================================== */
  function afficherProduit(conteneur, couleurs, surChoix) {
    ajouterStyle();
    if (typeof conteneur === "string") conteneur = document.querySelector(conteneur);
    if (!conteneur) return null;
    var liste = lire(couleurs != null ? couleurs : conteneur.getAttribute("data-mf-couleurs"));
    conteneur.innerHTML = "";
    if (!liste.length) { conteneur.style.display = "none"; return null; }
    conteneur.style.display = "";

    var label = el("div", "mf-c-label");
    label.appendChild(document.createTextNode("Couleur : "));
    var nomChoisi = el("b");
    label.appendChild(nomChoisi);
    var zone = el("div", "mf-c-liste");
    conteneur.appendChild(label);
    conteneur.appendChild(zone);

    var actuelle = null;
    var boutons = [];
    function choisir(c, bouton) {
      actuelle = c;
      nomChoisi.textContent = c.nom;
      conteneur.setAttribute("data-couleur-choisie", c.nom);
      boutons.forEach(function (b) { b.classList.remove("actif"); });
      bouton.classList.add("actif");
      majLiensWhatsApp(conteneur);
      if (typeof surChoix === "function") surChoix(c);
    }

    liste.forEach(function (c, i) {
      var p = pastille(c, false, null, false);
      p.bouton.onclick = function () { choisir(c, p.bouton); };
      boutons.push(p.bouton);
      zone.appendChild(p.item);
      if (i === 0) choisir(c, p.bouton);
    });

    return { couleur: function () { return actuelle ? actuelle.nom : ""; } };
  }

  /* ==========================================================
     3) COMMANDE WHATSAPP avec la couleur choisie
     ========================================================== */
  function messageWhatsApp(produit, prix, couleur) {
    var txt = "Bonjour My Flash, je veux commander : " + produit;
    if (couleur) txt += "\nCouleur : " + couleur;
    if (prix) txt += "\nPrix : " + prix;
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(txt);
  }

  function majLiensWhatsApp(source) {
    var portee = (source && source.closest && source.closest("[data-mf-produit]")) || document;
    var couleur = "";
    var bloc = portee.querySelector("[data-couleur-choisie]");
    if (bloc) couleur = bloc.getAttribute("data-couleur-choisie");
    Array.prototype.forEach.call(portee.querySelectorAll("a[data-mf-whatsapp]"), function (a) {
      a.href = messageWhatsApp(a.getAttribute("data-produit") || "", a.getAttribute("data-prix") || "", couleur);
      a.target = "_blank";
    });
  }

  /* ---------- Démarrage automatique ---------- */
  function demarrer() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-mf-couleurs-gerant]"), function (c) {
      if (!c.__mf) c.__mf = selecteurGerant(c);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-mf-couleurs]"), function (c) {
      afficherProduit(c);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-mf-produit]"), function (p) {
      if (!p.querySelector("[data-couleur-choisie]")) majLiensWhatsApp(p);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

  window.MFCouleurs = {
    selecteurGerant: selecteurGerant,
    afficherProduit: afficherProduit,
    messageWhatsApp: messageWhatsApp,
    lire: lire,
    palette: PALETTE,
    rafraichir: demarrer
  };
})();
