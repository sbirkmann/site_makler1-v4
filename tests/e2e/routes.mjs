/** Routeninventar nach INVENTORY.md §1.2 / §1.5 sowie der Sitemap. */

export const publicRoutes = [
  "/",
  "/immobilien",
  "/immobilie-verkaufen",
  "/immobilie-verkaufen/ablauf",
  "/immobilie-verkaufen/unterlagen",
  "/immobilie-verkaufen/immobilienwert",
  "/immobilie-verkaufen/maklerprovision",
  "/immobilie-verkaufen/immobilie-geerbt",
  "/immobilie-verkaufen/energieausweis",
  "/immobilienbewertung",
  "/suchprofil",
  "/ueber-uns",
  "/bewertungen",
  "/ratgeber",
  "/kontakt",
  "/impressum",
  "/datenschutz",
  "/widerruf",
];

export const assetRoutes = ["/sitemap.xml", "/robots.txt"];

/** INVENTORY.md §1.5 – sechs permanente Redirects aus `sellTopics[].legacySlug`. */
export const legacyRedirects = [
  ["/ratgeber/immobilie-verkaufen-ablauf", "/immobilie-verkaufen/ablauf"],
  ["/ratgeber/unterlagen-immobilienverkauf", "/immobilie-verkaufen/unterlagen"],
  ["/ratgeber/was-ist-meine-immobilie-wert", "/immobilie-verkaufen/immobilienwert"],
  ["/ratgeber/maklerprovision-erklaert", "/immobilie-verkaufen/maklerprovision"],
  ["/ratgeber/immobilie-geerbt-was-tun", "/immobilie-verkaufen/immobilie-geerbt"],
  ["/ratgeber/energieausweis-verstehen", "/immobilie-verkaufen/energieausweis"],
];

/** Ein Vertreter je Seitentyp – fuer Viewport- und Struktur-Pruefungen. */
export const pageTypes = {
  Startseite: "/",
  Suche: "/immobilien",
  Objektdetail: "/immobilien/villa-marienburg-rheinblick",
  Verkaufshub: "/immobilie-verkaufen",
  Verkaufsunterseite: "/immobilie-verkaufen/ablauf",
  Funnel: "/immobilienbewertung",
  Suchprofil: "/suchprofil",
  Ratgeberliste: "/ratgeber",
  Ratgeberartikel: "/ratgeber/kaufnebenkosten-rheinland",
  Kontakt: "/kontakt",
  "Über uns": "/ueber-uns",
  Bewertungen: "/bewertungen",
  Recht: "/impressum",
};

export const viewportsNoScroll = [390, 768, 1280, 1920];

/** Der kritische Bereich: zwischen `lg` und `2xl` war das Mobilmenü tot. */
export const viewportsNav = [390, 768, 1024, 1280, 1440, 1536, 1920];

/** Liest die oeffentlichen URLs aus der Sitemap (Objekte + Ratgeber inklusive). */
export async function sitemapPaths(base) {
  const res = await fetch(`${base}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}
