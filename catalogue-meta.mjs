// Génère catalogue-meta.csv (flux produits Meta) à partir des mêmes sources que le site :
// 1) les produits de l'espace gérant (Firestore)  2) les produits Infinitech en direct.
// Lancé chaque jour par .github/workflows/catalogue-meta.yml — ne rien modifier ici normalement.
import fs from "node:fs";

const SITE = "https://diengmoustapha802-rgb.github.io/";
const SOURCE = "https://infinitech.sn";
const FIRESTORE = "https://firestore.googleapis.com/v1/projects/flashboutique-6c/databases/(default)/documents/produits";
const SORTIE = "catalogue-meta.csv";
const LIVRAISON = "Livraison 24–48 h à Dakar, paiement à la livraison, Wave ou Orange Money.";

const slugId = s => "inf-" + String(s || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 80);
const normN = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", hellip: "…", eacute: "é", egrave: "è", agrave: "à", ccedil: "ç" };
const unent = s => String(s || "")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const txt = h => unent(String(h || "")
  .replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|li|h[1-6]|div|tr)>/gi, "\n").replace(/<[^>]+>/g, ""))
  .replace(/[ \t]+/g, " ").replace(/\n\s*\n\s*\n+/g, "\n\n").trim();

// Même logique que le site pour la marque et les catégories
function devine(n, prix) {
  const l = n.toLowerCase();
  const b = /macbook|imac|iphone|ipad|apple/.test(l) ? "Apple" : /surface/.test(l) ? "Microsoft" : /dell/.test(l) ? "Dell" : /^hp|\bhp\b/.test(l) ? "HP" : /lenovo|thinkpad/.test(l) ? "Lenovo" : /asus|rog/.test(l) ? (/rog/.test(l) ? "ASUS ROG" : "ASUS") : /msi/.test(l) ? "MSI" : /samsung|galaxy/.test(l) ? "Samsung" : "";
  const c = [];
  if (/iphone/.test(l)) c.push("iphone");
  else if (/galaxy|xiaomi|redmi|tecno|infinix|pixel|smartphone/.test(l)) c.push("android");
  else if (/watch|montre/.test(l)) c.push("montre");
  else if (/souris|clavier|chargeur|sacoche|casque|écouteur|ecouteur|câble|cable|adaptateur|hub|disque|cl[ée] usb|ram\b|ssd externe|accessoire/.test(l) && !/ordinateur|laptop|core|ryzen|pentium|celeron|\bi[3579]\b|i[3579]-|macbook|latitude|xps|elitebook|probook|zbook|thinkpad|ideapad|surface|precision|vostro|inspiron|pavilion|spectre|envy|ultrabook/.test(l)) c.push("acc");
  else {
    if (b === "Apple") c.push("apple");
    if (/precision|zbook|rtx|m1 pro|m[2-5] pro|m5|radeon pro|p14s|quadro/.test(l)) c.push("graph");
    if (/gaming|rog|tuf|legion|omen|nitro|predator|rtx 40|rtx 30/.test(l)) c.push("gaming");
    if (/2-in-1|2-en-1|x360|yoga|x2 |surface pro|tactile|convertible/.test(l)) c.push("2en1");
    if (/elitebook|latitude|thinkpad|probook|precision|zbook/.test(l)) c.push("pro");
    if (prix && prix <= 200000) c.push("etud");
    if (!c.includes("graph") && !c.includes("gaming") && b !== "Apple") c.push("bureau");
  }
  return { b, c };
}

async function getJSON(url) {
  const r = await fetch(url, { headers: { "User-Agent": "MyFlash-catalogue/1.0", Accept: "application/json" } });
  if (!r.ok) throw new Error(url + " → HTTP " + r.status);
  return r.json();
}

async function infinitech() {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const list = await getJSON(`${SOURCE}/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
    all.push(...list);
    if (list.length < 100) break;
  }
  return all.filter(x => x.is_in_stock !== false && x.prices).map(x => {
    const u = Math.pow(10, +x.prices.currency_minor_unit || 0);
    const prix = Math.round(+x.prices.price / u), reg = Math.round(+x.prices.regular_price / u);
    const n = unent(x.name || "").replace(/^[^A-Za-z0-9]+/, "").trim(), g = devine(n, prix);
    return {
      id: slugId(x.slug), b: g.b, n, p: prix, o: reg > prix ? reg : 0, c: g.c,
      imgs: (x.images || []).map(i => i.src).filter(Boolean),
      d: (txt(x.short_description) + "\n\n" + txt(x.description)).trim(), r: !/\bneuf\b/i.test(n), h: false
    };
  }).filter(p => p.n && p.p);
}

const fv = v => !v ? undefined : "stringValue" in v ? v.stringValue : "integerValue" in v ? +v.integerValue : "doubleValue" in v ? +v.doubleValue : "booleanValue" in v ? v.booleanValue : "arrayValue" in v ? (v.arrayValue.values || []).map(fv) : "mapValue" in v ? Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, y]) => [k, fv(y)])) : null;

async function gerant() {
  const out = []; let token = "";
  do {
    const j = await getJSON(FIRESTORE + "?pageSize=300" + (token ? "&pageToken=" + encodeURIComponent(token) : ""));
    for (const doc of j.documents || []) {
      const x = Object.fromEntries(Object.entries(doc.fields || {}).map(([k, v]) => [k, fv(v)]));
      const id = doc.name.split("/").pop();
      out.push({
        id, b: x.marque || "", n: x.nom || "", p: +x.prix || 0, o: +x.ancienPrix || 0, c: x.categories || [],
        imgs: [x.image, ...(Array.isArray(x.autresImages) ? x.autresImages : [])].filter(u => u && /^https?:/.test(u)),
        d: x.description || "", r: x.etat === "reconditionne", h: !!x.masque
      });
    }
    token = j.nextPageToken || "";
  } while (token);
  return out;
}

const LAB = { graph: "Graphisme", bureau: "Bureautique", gaming: "Gaming", etud: "Étudiant", pro: "Professionnel", "2en1": "2 en 1", apple: "MacBook", iphone: "iPhone", android: "Android", montre: "Apple Watch", acc: "Accessoires" };
const famille = c => c.includes("iphone") || c.includes("android") ? "Téléphones" : c.includes("montre") ? "Montres" : c.includes("acc") ? "Accessoires" : "Ordinateurs";
const segment = c => famille(c) !== "Ordinateurs" ? famille(c) : c.includes("gaming") ? "Gaming" : c.includes("apple") ? "MacBook" : c.includes("graph") ? "Graphisme" : c.includes("etud") ? "Étudiant" : "Pro / Bureautique";
const tranche = p => p < 200000 ? "moins de 200 000" : p <= 400000 ? "200 000 - 400 000" : "plus de 400 000";
const csv = v => { const s = String(v ?? ""); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };

const [rMine, rLive] = await Promise.allSettled([gerant(), infinitech()]);
const MINE = rMine.status === "fulfilled" ? rMine.value : [];
const LIVE = rLive.status === "fulfilled" ? rLive.value : [];
if (rMine.status === "rejected") console.warn("Espace gérant indisponible :", rMine.reason.message);
if (rLive.status === "rejected") console.warn("Infinitech indisponible :", rLive.reason.message);

// Si une source est en panne, on garde le fichier d'hier pour ne pas vider les publicités
if (rLive.status === "rejected" || (!MINE.length && !LIVE.length)) {
  console.error("Source manquante : catalogue non modifié.");
  process.exit(0);
}

// Fusion identique au site : les produits du gérant priment, puis ceux d'Infinitech non doublonnés
const parId = new Map(LIVE.map(p => [p.id, p])), parNom = new Map(LIVE.map(p => [normN(p.n), p]));
const vus = MINE.map(m => {
  const l = parId.get(m.id) || parNom.get(normN(m.n)), x = { ...m };
  if (l && (!x.imgs.length || x.imgs.length < l.imgs.length)) x.imgs = [...new Set([...x.imgs, ...l.imgs])];
  if (l && !(x.d && x.d.trim())) x.d = l.d;
  return x;
});
const ids = new Set(MINE.map(p => p.id)), noms = new Set(MINE.map(p => normN(p.n)));
const P = [...vus.filter(p => !p.h), ...LIVE.filter(p => !ids.has(p.id) && !noms.has(normN(p.n)))]
  .filter(p => p.p > 0 && p.imgs.length);
P.forEach(p => { if (/\b(rtx|gtx)\b/i.test(p.n) && !p.c.includes("gaming")) p.c = [...p.c, "gaming"]; });

const COLS = ["id", "title", "description", "availability", "condition", "price", "sale_price", "link", "image_link", "additional_image_link", "brand", "google_product_category", "product_type", "custom_label_0", "custom_label_1", "custom_label_2"];
const lignes = [COLS.join(",")];
for (const p of P) {
  let t = p.n.replace(/\s+/g, " ").trim();
  if (p.b && !t.toLowerCase().startsWith(p.b.toLowerCase())) t = p.b + " " + t;
  const fam = famille(p.c), promo = p.o > p.p;
  const d = ((p.d || t).trim() + "\n\n" + (p.r ? "Reconditionné, garanti. " : "Neuf, garanti 12 mois. ") + LIVRAISON).slice(0, 4900);
  const row = {
    id: p.id, title: t.slice(0, 150), description: d, availability: "in stock", condition: p.r ? "refurbished" : "new",
    price: (promo ? p.o : p.p) + " XOF", sale_price: promo ? p.p + " XOF" : "",
    link: SITE + "#produit=" + encodeURIComponent(p.id), image_link: p.imgs[0], additional_image_link: p.imgs.slice(1, 11).join(","),
    brand: p.b || "My Flash",
    google_product_category: fam === "Ordinateurs" ? "Electronics > Computers > Laptops" : fam === "Téléphones" ? "Electronics > Communications > Telephony > Mobile Phones" : fam === "Montres" ? "Electronics > Electronics Accessories > Wearable Technology > Smart Watches" : "Electronics > Electronics Accessories",
    product_type: fam + " > " + (LAB[p.c[0]] || "Autres"),
    custom_label_0: segment(p.c), custom_label_1: tranche(p.p), custom_label_2: fam
  };
  lignes.push(COLS.map(k => csv(row[k])).join(","));
}
fs.writeFileSync(SORTIE, lignes.join("\n") + "\n");
console.log(`${P.length} produits écrits dans ${SORTIE} (gérant : ${MINE.length}, Infinitech : ${LIVE.length})`);
