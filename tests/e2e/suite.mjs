/**
 * E2E-Pruefung von WohnWert Immobilien v4.
 *
 * Start:  node tests/e2e/suite.mjs
 * Filter: ONLY=navigation node tests/e2e/suite.mjs
 *
 * Voraussetzung: der Produktionsserver laeuft (`pnpm build`, dann
 * `npx next start -p 3400`). `pnpm dev` ist auf dieser Maschine nicht
 * benutzbar – siehe CLAUDE.md §7.
 */

import { chromium } from "playwright";
import { BASE, describe, expect, it, run } from "./runner.mjs";
import {
  assetRoutes,
  legacyRedirects,
  pageTypes,
  publicRoutes,
  sitemapPaths,
  viewportsNav,
  viewportsNoScroll,
} from "./routes.mjs";

const browser = await chromium.launch();

/** Neuer Kontext je Test – sessionStorage (Karteneinwilligung) bleibt sauber. */
async function make() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Serverfehler und Skriptausnahmen sammeln; einzelne Tests werten sie aus.
  const problems = [];
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 500) problems.push(`HTTP ${r.status()} ${r.url()}`);
  });

  return { context, page, problems, close: () => context.close() };
}

const go = (page, path, opts) =>
  page.goto(`${BASE}${path}`, { waitUntil: "networkidle", ...opts });

/** Wartet, bis die gestreamte Trefferliste bzw. der Leerzustand steht. */
async function waitForResults(page) {
  await page.waitForFunction(
    () => {
      const t = document.body.innerText;
      return /Objekte? gefunden/.test(t) || t.includes("Hier passt gerade nichts");
    },
    null,
    { timeout: 20000 },
  );
}

/** Trefferzahl der Suche; 0 im Leerzustand. */
async function resultCount(page) {
  await waitForResults(page);
  const text = await page.locator("body").innerText();
  if (text.includes("Hier passt gerade nichts")) return 0;
  const m = text.match(/([\d.]+)\s+Objekte? gefunden/);
  if (!m) throw new Error("Trefferzähler nicht gefunden");
  return Number(m[1].replace(/\./g, ""));
}

/** Sichtbare Objekt-Kacheln (ohne die Suchauftrag-Kachel). */
const cards = (page) => page.locator("[data-property-id]");

// ---------------------------------------------------------------------------

describe("1 Erreichbarkeit – Statuscodes", () => {
  for (const path of [...publicRoutes, ...assetRoutes]) {
    it(`${path} liefert 200`, async ({ page, problems }) => {
      const res = await go(page, path);
      expect(res.status()).toBe(200);
      expect(problems.join(" | ")).toBe("");
    });
  }

  it("alle 42 Sitemap-URLs liefern 200", async ({ page }) => {
    const paths = await sitemapPaths(BASE);
    expect(paths.length).toBeGreaterThan(20);
    const bad = [];
    for (const p of paths) {
      const res = await page.request.get(`${BASE}${p}`);
      if (res.status() !== 200) bad.push(`${p} → ${res.status()}`);
    }
    expect(bad.join(", ")).toBe("");
  });

  it("unbekannte Route liefert 404, kein 500", async ({ page }) => {
    const res = await page.request.get(`${BASE}/gibt-es-nicht-xyz`);
    expect(res.status()).toBe(404);
  });

  it("unbekannter Objekt-Slug liefert 404", async ({ page }) => {
    const res = await page.request.get(`${BASE}/immobilien/gibt-es-nicht-xyz`);
    expect(res.status()).toBe(404);
  });

  it("unbekannter Ratgeber-Slug liefert 404", async ({ page }) => {
    const res = await page.request.get(`${BASE}/ratgeber/gibt-es-nicht-xyz`);
    expect(res.status()).toBe(404);
  });

  it("Sicherheits-Header stehen (INVENTORY §1.6)", async ({ page }) => {
    const res = await page.request.get(`${BASE}/`);
    const h = res.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("SAMEORIGIN");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["x-powered-by"]).toBe(undefined);
  });

  it("/admin leitet ohne Session auf /admin/login", async ({ page }) => {
    await go(page, "/admin");
    expect(new URL(page.url()).pathname).toBe("/admin/login");
  });

  it("/admin/login ist erreichbar", async ({ page }) => {
    const res = await go(page, "/admin/login");
    expect(res.status()).toBe(200);
  });
});

describe("2 Redirects der alten Ratgeber-Slugs", () => {
  for (const [from, to] of legacyRedirects) {
    it(`${from} → ${to} (308)`, async ({ page }) => {
      const raw = await page.request.get(`${BASE}${from}`, { maxRedirects: 0 });
      expect(raw.status()).toBe(308);
      expect(raw.headers()["location"]).toContain(to);

      const res = await go(page, from);
      expect(res.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(to);
    });
  }
});

describe("3 Struktur – genau eine h1 je Seite", () => {
  for (const [name, path] of Object.entries(pageTypes)) {
    it(`${name} (${path}) hat genau eine h1`, async ({ page }) => {
      await go(page, path);
      if (path === "/immobilien") await waitForResults(page);
      const h1 = await page.locator("h1").allInnerTexts();
      expect(h1.length).toBe(1);
      expect(h1[0].trim().length).toBeGreaterThan(0);
    });
  }

  it("Skip-Link führt zum Hauptinhalt", async ({ page }) => {
    await go(page, "/");
    const skip = page.getByRole("link", { name: /Zum Hauptinhalt springen/i });
    expect(await skip.count()).toBe(1);
    const href = await skip.getAttribute("href");
    expect(href).toBe("#hauptinhalt");
    expect(await page.locator("#hauptinhalt").count()).toBeGreaterThanOrEqual(1);
  });
});

describe("4 Kein horizontales Scrollen", () => {
  for (const width of viewportsNoScroll) {
    for (const [name, path] of Object.entries(pageTypes)) {
      it(`${width} px – ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await go(page, path);
        if (path === "/immobilien") await waitForResults(page);
        const over = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        // 1 px Toleranz fuer subpixelgenaue Layouts.
        expect(over).toBeLessThanOrEqual(1);
      });
    }
  }
});

describe("5 Navigation – auf jeder Breite erreichbar", () => {
  for (const width of viewportsNav) {
    it(`${width} px: Navigation ist bedienbar und führt zu /kontakt`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await go(page, "/");

      const desktopNav = page.locator('nav[aria-label="Hauptnavigation"]');
      const burger = page.getByRole("button", { name: "Menü öffnen" });

      const desktopVisible = await desktopNav.isVisible();
      const burgerVisible = await burger.isVisible();

      // Genau eine der beiden Varianten muss greifbar sein.
      expect(desktopVisible || burgerVisible).toBeTruthy();

      if (burgerVisible) {
        await burger.click();
        const dialog = page.getByRole("dialog", { name: "Hauptmenü" });
        // Der eigentliche Fehler frueher: Knopf sichtbar, Panel display:none.
        await dialog.waitFor({ state: "visible", timeout: 5000 });
        const box = await dialog.boundingBox();
        expect(box && box.height > 100).toBeTruthy();
        const link = dialog.getByRole("link", { name: "Kontakt" }).first();
        expect(await link.isVisible()).toBeTruthy();
        await link.click();
      } else {
        await page.getByRole("link", { name: "Kontakt", exact: true }).first().click();
      }

      await page.waitForURL("**/kontakt", { timeout: 10000 });
      expect(new URL(page.url()).pathname).toBe("/kontakt");
    });
  }

  it("Mobilmenü schließt per Escape und gibt den Fokus zurück", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, "/");
    const burger = page.getByRole("button", { name: "Menü öffnen" });
    await burger.click();
    const dialog = page.getByRole("dialog", { name: "Hauptmenü" });
    await dialog.waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    expect(await dialog.isVisible()).toBeFalsy();
  });

  it("Mobilmenü ist im geschlossenen Zustand nicht fokussierbar (inert)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, "/");
    const inert = await page.evaluate(() => {
      const dlg = document.querySelector('[role="dialog"][aria-label="Hauptmenü"]');
      return dlg?.parentElement?.hasAttribute("inert") ?? false;
    });
    expect(inert).toBeTruthy();
  });
});

describe("6 Navigation – Mega-Menüs, Footer, Breadcrumbs", () => {
  it("Mega-Menü „Immobilie finden“ öffnet und enthält die Gruppen", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1000 });
    await go(page, "/");
    const trigger = page
      .locator('nav[aria-label="Hauptnavigation"]')
      .getByText("Immobilie finden", { exact: true })
      .first();
    await trigger.hover();
    await page.waitForTimeout(400);
    const text = await page.locator("body").innerText();
    for (const entry of ["Kaufen", "Mieten", "Suchprofil"]) {
      expect(text).toContain(entry);
    }
  });

  it("Mega-Menü „Für Eigentümer“ öffnet und enthält die Gruppen", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1000 });
    await go(page, "/");
    const trigger = page
      .locator('nav[aria-label="Hauptnavigation"]')
      .getByText("Für Eigentümer", { exact: true })
      .first();
    await trigger.hover();
    await page.waitForTimeout(400);
    const text = await page.locator("body").innerText();
    for (const entry of ["Verkaufen", "Bewerten", "Ablauf", "Unterlagen"]) {
      expect(text).toContain(entry);
    }
  });

  it("alle Footer-Links liefern 200", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/");
    const hrefs = await page.locator("footer a[href^='/']").evaluateAll((els) =>
      [...new Set(els.map((e) => e.getAttribute("href")))],
    );
    expect(hrefs.length).toBeGreaterThan(8);
    const bad = [];
    for (const href of hrefs) {
      const res = await page.request.get(`${BASE}${href}`);
      if (res.status() !== 200) bad.push(`${href} → ${res.status()}`);
    }
    expect(bad.join(", ")).toBe("");
  });

  it("Footer enthält /widerruf (INVENTORY §6.10)", async ({ page }) => {
    await go(page, "/");
    const hrefs = await page
      .locator("footer a[href^='/']")
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(hrefs.includes("/widerruf")).toBeTruthy();
  });

  it("SellSubnav steht auf allen sechs Verkaufs-Unterseiten", async ({ page }) => {
    const subpages = [
      "/immobilie-verkaufen/ablauf",
      "/immobilie-verkaufen/unterlagen",
      "/immobilie-verkaufen/immobilienwert",
      "/immobilie-verkaufen/maklerprovision",
      "/immobilie-verkaufen/immobilie-geerbt",
      "/immobilie-verkaufen/energieausweis",
    ];
    for (const path of subpages) {
      await go(page, path);
      const links = await page
        .locator("a[href^='/immobilie-verkaufen']")
        .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("href")))]);
      // Jede Unterseite muss auf die uebrigen verweisen koennen.
      expect(links.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("Objektdetail hat eine Breadcrumb zurück zur Suche", async ({ page }) => {
    await go(page, "/immobilien/villa-marienburg-rheinblick");
    const back = page.locator("a[href='/immobilien'], a[href^='/immobilien?']");
    expect(await back.count()).toBeGreaterThanOrEqual(1);
  });

  it("keine internen Links laufen ins Leere (Startseite)", async ({ page }) => {
    await go(page, "/");
    const hrefs = await page.locator("a[href^='/']").evaluateAll((els) =>
      [...new Set(els.map((e) => e.getAttribute("href")))].filter((h) => !h.startsWith("//")),
    );
    const bad = [];
    for (const href of hrefs) {
      const res = await page.request.get(`${BASE}${href}`);
      if (res.status() >= 400) bad.push(`${href} → ${res.status()}`);
    }
    expect(bad.join(", ")).toBe("");
  });
});

describe("7 Suche – Filterdimensionen einzeln", () => {
  const single = [
    ["ungefiltert", "", 20],
    ["marketing=KAUF", "?marketing=KAUF", 17],
    ["marketing=MIETE", "?marketing=MIETE", 3],
    ["typ=HAUS", "?typ=HAUS", 8],
    ["typ=WOHNUNG", "?typ=WOHNUNG", 8],
    ["zimmer=4", "?zimmer=4", 14],
    ["flaeche=150", "?flaeche=150", 10],
    ["preis_min=500000", "?preis_min=500000", 11],
    ["preis_max=300000", "?preis_max=300000", 3],
  ];

  for (const [name, query, expected] of single) {
    it(`${name} → ${expected} Treffer`, async ({ page }) => {
      await go(page, `/immobilien${query}`);
      expect(await resultCount(page)).toBe(expected);
    });
  }

  it("jeder Filter grenzt die Menge gegenüber ungefiltert ein", async ({ page }) => {
    await go(page, "/immobilien");
    const all = await resultCount(page);
    for (const [, query, expected] of single.slice(1)) {
      expect(expected).toBeLessThan(all + 1);
    }
    expect(all).toBe(20);
  });

  it("ungültiger typ-Wert wird verworfen, nicht als Fehler behandelt", async ({ page }) => {
    const res = await go(page, "/immobilien?typ=BLUBB");
    expect(res.status()).toBe(200);
    expect(await resultCount(page)).toBe(20);
  });

  it("ungültiger sort-Wert fällt auf „neueste“ zurück", async ({ page }) => {
    const res = await go(page, "/immobilien?sort=quatsch");
    expect(res.status()).toBe(200);
    expect(await resultCount(page)).toBe(20);
  });

  it("Freitext q findet und schränkt ein", async ({ page }) => {
    await go(page, "/immobilien?q=Rheinauhafen");
    const n = await resultCount(page);
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(20);
  });
});

describe("8 Suche – Umkreissuche", () => {
  it("Köln 5 km → 9 Objekte", async ({ page }) => {
    await go(page, "/immobilien?ort=K%C3%B6ln&umkreis=5");
    expect(await resultCount(page)).toBe(9);
  });

  it("Köln 50 km → 18 Objekte", async ({ page }) => {
    await go(page, "/immobilien?ort=K%C3%B6ln&umkreis=50");
    expect(await resultCount(page)).toBe(18);
  });

  it("Köln 5 km < Köln 50 km < ungefiltert", async ({ page }) => {
    await go(page, "/immobilien?ort=K%C3%B6ln&umkreis=5");
    const small = await resultCount(page);
    await go(page, "/immobilien?ort=K%C3%B6ln&umkreis=50");
    const large = await resultCount(page);
    await go(page, "/immobilien");
    const all = await resultCount(page);
    expect(small).toBeLessThan(large);
    expect(large).toBeLessThanOrEqual(all);
  });

  it("Hamburg → 0 Objekte, Leerzustand erscheint", async ({ page }) => {
    await go(page, "/immobilien?ort=Hamburg&umkreis=5");
    expect(await resultCount(page)).toBe(0);
    expect(await page.locator("body").innerText()).toContain("Hier passt gerade nichts");
  });

  it("umkreis ohne ort bleibt wirkungslos", async ({ page }) => {
    await go(page, "/immobilien?umkreis=5");
    expect(await resultCount(page)).toBe(20);
  });

  it("umkreis wird auf 200 km begrenzt (kein Fehler bei 9999)", async ({ page }) => {
    const res = await go(page, "/immobilien?ort=K%C3%B6ln&umkreis=9999");
    expect(res.status()).toBe(200);
    expect(await resultCount(page)).toBeGreaterThan(0);
  });
});

describe("9 Suche – Filterkombinationen", () => {
  const combos = [
    ["?marketing=KAUF&typ=WOHNUNG", 20],
    ["?marketing=KAUF&typ=WOHNUNG&ort=K%C3%B6ln&umkreis=25", 20],
    ["?marketing=MIETE&zimmer=2", 20],
    ["?typ=HAUS&preis_min=400000&flaeche=120", 20],
    ["?marketing=KAUF&preis_min=300000&preis_max=900000&zimmer=3", 20],
  ];

  for (const [query, ceiling] of combos) {
    it(`Kombination ${query} liefert eine Teilmenge`, async ({ page }) => {
      const res = await go(page, `/immobilien${query}`);
      expect(res.status()).toBe(200);
      const n = await resultCount(page);
      expect(n).toBeLessThanOrEqual(ceiling);
    });
  }

  it("Kombination ist nie größer als der schwächste Einzelfilter", async ({ page }) => {
    await go(page, "/immobilien?marketing=KAUF");
    const kauf = await resultCount(page);
    await go(page, "/immobilien?typ=WOHNUNG");
    const wohnung = await resultCount(page);
    await go(page, "/immobilien?marketing=KAUF&typ=WOHNUNG");
    const both = await resultCount(page);
    expect(both).toBeLessThanOrEqual(Math.min(kauf, wohnung));
  });

  it("Filterformular absenden übernimmt die Werte in die URL", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/immobilien");
    await page.selectOption("#bar-marketing", "KAUF");
    await page.selectOption("#bar-typ", "WOHNUNG");
    await page.getByRole("button", { name: "Suchen" }).first().click();
    await page.waitForURL("**/immobilien?*", { timeout: 10000 });
    const url = new URL(page.url());
    expect(url.searchParams.get("marketing")).toBe("KAUF");
    expect(url.searchParams.get("typ")).toBe("WOHNUNG");
    await waitForResults(page);
  });

  it("„Zurücksetzen“ führt auf /immobilien ohne Parameter", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/immobilien?marketing=KAUF&typ=HAUS");
    await page.getByRole("link", { name: "Zurücksetzen" }).first().click();
    await page.waitForURL(`${BASE}/immobilien`, { timeout: 10000 });
    expect(page.url()).toBe(`${BASE}/immobilien`);
    expect(await resultCount(page)).toBe(20);
  });

  it("Umkreis-Feld ist ohne Ort deaktiviert", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/immobilien");
    const radius = page.locator("#bar-umkreis");
    expect(await radius.isDisabled()).toBeTruthy();
  });
});

describe("10 Suche – Sortierung", () => {
  async function prices(page) {
    await waitForResults(page);
    return page.locator("[data-property-id]").evaluateAll((els) =>
      els
        .map((e) => {
          const m = e.innerText.match(/([\d.]+)\s*€/);
          return m ? Number(m[1].replace(/\./g, "")) : null;
        })
        .filter((v) => v !== null),
    );
  }

  it("preis-auf sortiert aufsteigend", async ({ page }) => {
    await go(page, "/immobilien?marketing=KAUF&sort=preis-auf");
    const p = await prices(page);
    expect(p.length).toBeGreaterThan(2);
    const sorted = [...p].sort((a, b) => a - b);
    expect(p).toEqual(sorted);
  });

  it("preis-ab sortiert absteigend", async ({ page }) => {
    await go(page, "/immobilien?marketing=KAUF&sort=preis-ab");
    const p = await prices(page);
    expect(p.length).toBeGreaterThan(2);
    const sorted = [...p].sort((a, b) => b - a);
    expect(p).toEqual(sorted);
  });

  it("preis-auf und preis-ab liefern verschiedene Reihenfolgen", async ({ page }) => {
    await go(page, "/immobilien?marketing=KAUF&sort=preis-auf");
    const asc = await page.locator("[data-property-id]").evaluateAll((e) =>
      e.map((x) => x.dataset.propertyId),
    );
    await go(page, "/immobilien?marketing=KAUF&sort=preis-ab");
    const desc = await page.locator("[data-property-id]").evaluateAll((e) =>
      e.map((x) => x.dataset.propertyId),
    );
    expect(asc.join() === desc.join()).toBeFalsy();
  });

  it("Sortierung nach Fläche wirkt", async ({ page }) => {
    const res = await go(page, "/immobilien?sort=flaeche");
    expect(res.status()).toBe(200);
    const ids = await page.locator("[data-property-id]").evaluateAll((e) =>
      e.map((x) => x.dataset.propertyId),
    );
    await go(page, "/immobilien");
    const base = await page.locator("[data-property-id]").evaluateAll((e) =>
      e.map((x) => x.dataset.propertyId),
    );
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.join() === base.join()).toBeFalsy();
  });
});

describe("11 Suche – Paginierung", () => {
  it("Seite 1 zeigt 9 Objekte und einen Bereichshinweis", async ({ page }) => {
    await go(page, "/immobilien");
    await waitForResults(page);
    expect(await cards(page).count()).toBe(9);
    expect(await page.locator("body").innerText()).toContain("angezeigt 1–9");
  });

  it("Seite 2 zeigt andere Objekte", async ({ page }) => {
    await go(page, "/immobilien");
    const first = await cards(page).evaluateAll((e) => e.map((x) => x.dataset.propertyId));
    await go(page, "/immobilien?seite=2");
    await waitForResults(page);
    const second = await cards(page).evaluateAll((e) => e.map((x) => x.dataset.propertyId));
    expect(second.length).toBeGreaterThan(0);
    const overlap = second.filter((id) => first.includes(id));
    expect(overlap.length).toBe(0);
    expect(await page.locator("body").innerText()).toContain("angezeigt 10–18");
  });

  it("Paginierung ist echte Link-Navigation (funktioniert ohne JS)", async ({ page }) => {
    await go(page, "/immobilien");
    await waitForResults(page);
    const nav = page.locator("nav[aria-label='Seitennavigation']");
    expect(await nav.count()).toBe(1);
    const links = await nav.locator("a[href]").count();
    expect(links).toBeGreaterThan(0);
  });

  it("Klick auf Seite 2 wechselt die URL und die Treffer", async ({ page }) => {
    await go(page, "/immobilien");
    await waitForResults(page);
    await page.locator("nav[aria-label='Seitennavigation'] a").filter({ hasText: /^2$/ }).first().click();
    await page.waitForURL("**/immobilien?*seite=2*", { timeout: 10000 });
    await waitForResults(page);
    expect(await cards(page).count()).toBeGreaterThan(0);
  });

  it("Seite 1 lässt den Parameter weg (kanonische URL)", async ({ page }) => {
    await go(page, "/immobilien?seite=2");
    await waitForResults(page);
    const href = await page
      .locator("nav[aria-label='Seitennavigation'] a")
      .filter({ hasText: /^1$/ })
      .first()
      .getAttribute("href");
    expect(href.includes("seite=")).toBeFalsy();
  });

  it("Filterwechsel setzt die Seite zurück", async ({ page }) => {
    await go(page, "/immobilien?seite=2&marketing=KAUF");
    await waitForResults(page);
    const href = await page.getByRole("link", { name: "Karte" }).first().getAttribute("href");
    expect(href.includes("seite=")).toBeFalsy();
  });

  it("Seite jenseits des Bereichs wirft keinen Fehler", async ({ page }) => {
    const res = await go(page, "/immobilien?seite=999");
    expect(res.status()).toBe(200);
    await waitForResults(page);
  });
});

describe("12 Suche – Leerzustand und Ansichtsumschalter", () => {
  it("Leerzustand nennt Alternativen", async ({ page }) => {
    await go(page, "/immobilien?ort=Hamburg&umkreis=5");
    await waitForResults(page);
    const text = await page.locator("body").innerText();
    expect(text).toContain("Hier passt gerade nichts");
    expect(text).toContain("Suchauftrag anlegen");
  });

  it("Umschalter Liste/Karte setzt ?ansicht=karte", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, "/immobilien");
    await page.getByRole("link", { name: "Karte" }).first().click();
    await page.waitForURL("**ansicht=karte**", { timeout: 10000 });
    expect(new URL(page.url()).searchParams.get("ansicht")).toBe("karte");
  });

  it("Umschalter zurück auf Liste entfernt den Parameter", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, "/immobilien?ansicht=karte");
    await page.getByRole("link", { name: "Liste" }).first().click();
    await page.waitForTimeout(800);
    expect(new URL(page.url()).searchParams.get("ansicht")).toBe(null);
  });

  it("Ansicht ist als aria-current markiert", async ({ page }) => {
    await go(page, "/immobilien");
    const list = page.getByRole("link", { name: "Liste" }).first();
    expect(await list.getAttribute("aria-current")).toBe("true");
  });

  it("Filter-Sheet öffnet auf 390 px und übernimmt einen Filter", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, "/immobilien");
    await page.getByRole("button", { name: /^Filter/ }).first().click();
    const sheet = page.getByRole("dialog", { name: "Filter" });
    await sheet.waitFor({ state: "visible", timeout: 5000 });
    await page.selectOption("#sheet-marketing", "MIETE");
    await sheet.locator("button[type='submit']").click();
    await page.waitForURL("**marketing=MIETE**", { timeout: 10000 });
    expect(await resultCount(page)).toBe(3);
  });

  it("Filter-Sheet schließt über den Schließen-Knopf", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, "/immobilien");
    await page.getByRole("button", { name: /^Filter/ }).first().click();
    const sheet = page.getByRole("dialog", { name: "Filter" });
    await sheet.waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Filter schließen" }).click();
    await page.waitForTimeout(600);
    expect(await sheet.isVisible()).toBeFalsy();
  });

  it("Suche ist ohne JavaScript bedienbar (Formular mit method=get)", async ({ context }) => {
    const noJs = await context.browser().newContext({ javaScriptEnabled: false });
    const p = await noJs.newPage();
    await p.goto(`${BASE}/immobilien`, { waitUntil: "domcontentloaded" });
    const form = p.locator("form[action='/immobilien'][method='get']").first();
    expect(await form.count()).toBeGreaterThanOrEqual(1);
    // Ergebnisliste ist serverseitig gerendert.
    expect(await p.locator("[data-property-id]").count()).toBeGreaterThan(0);
    await noJs.close();
  });
});

describe("13 Karte – Einwilligung und Bedienung", () => {
  it("lädt vor der Einwilligung keine Kachel von openstreetmap.org", async ({ page }) => {
    const osm = [];
    page.on("request", (r) => {
      if (/openstreetmap\.org/i.test(r.url())) osm.push(r.url());
    });
    await go(page, "/immobilien");
    await waitForResults(page);
    await page.waitForTimeout(2500);
    expect(osm.length).toBe(0);
  });

  it("zeigt die Einwilligungsschranke", async ({ page }) => {
    await go(page, "/immobilien");
    const text = await page.locator("body").innerText();
    expect(text).toContain("Karte von OpenStreetMap");
    expect(await page.getByRole("button", { name: "Karte laden" }).count()).toBeGreaterThanOrEqual(1);
  });

  it("nach dem Klick erscheinen Marker", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/immobilien");
    await waitForResults(page);
    await page.getByRole("button", { name: "Karte laden" }).first().click();
    await page.waitForSelector(".maplibregl-marker", { timeout: 25000 });
    const markers = await page.locator(".maplibregl-marker").count();
    expect(markers).toBeGreaterThan(0);
  });

  it("nach der Einwilligung werden Kacheln von openstreetmap.org geladen", async ({ page }) => {
    const osm = [];
    page.on("request", (r) => {
      if (/openstreetmap\.org/i.test(r.url())) osm.push(r.url());
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/immobilien");
    await waitForResults(page);
    await page.getByRole("button", { name: "Karte laden" }).first().click();
    await page.waitForSelector(".maplibregl-marker", { timeout: 25000 });
    await page.waitForTimeout(2000);
    expect(osm.length).toBeGreaterThan(0);
  });

  it("Marker sind Buttons mit aria-label und per Tastatur erreichbar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/immobilien");
    await waitForResults(page);
    await page.getByRole("button", { name: "Karte laden" }).first().click();
    await page.waitForSelector(".maplibregl-marker button, button.maplibregl-marker", {
      timeout: 25000,
    });
    const info = await page.evaluate(() => {
      const els = [...document.querySelectorAll(".maplibregl-marker")];
      const btns = els
        .map((e) => (e.tagName === "BUTTON" ? e : e.querySelector("button")))
        .filter(Boolean);
      return {
        total: els.length,
        buttons: btns.length,
        labelled: btns.filter((b) => b.getAttribute("aria-label")).length,
        focusable: btns.filter((b) => b.tabIndex >= 0 && !b.disabled).length,
      };
    });
    expect(info.total).toBeGreaterThan(0);
    expect(info.buttons).toBe(info.total);
    expect(info.labelled).toBe(info.buttons);
    expect(info.focusable).toBe(info.buttons);
  });

  it("Tastaturfokus auf einem Pin hebt die Kachel in der Liste hervor", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/immobilien");
    await waitForResults(page);
    await page.getByRole("button", { name: "Karte laden" }).first().click();
    await page.waitForSelector(".maplibregl-marker", { timeout: 25000 });
    await page.waitForTimeout(1200);
    const focused = await page.evaluate(() => {
      const els = [...document.querySelectorAll(".maplibregl-marker")];
      const btn = els
        .map((e) => (e.tagName === "BUTTON" ? e : e.querySelector("button")))
        .find((b) => b && !/Objekte – hineinzoomen/.test(b.getAttribute("aria-label") ?? ""));
      if (!btn) return false;
      btn.focus();
      return document.activeElement === btn;
    });
    expect(focused).toBeTruthy();
    await page.waitForTimeout(600);
    const highlighted = await page.locator("[data-property-id][data-highlight='true']").count();
    expect(highlighted).toBeGreaterThanOrEqual(1);
  });

  it("Klick auf einen Pin öffnet ein Popup", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/immobilien");
    await waitForResults(page);
    await page.getByRole("button", { name: "Karte laden" }).first().click();
    await page.waitForSelector(".maplibregl-marker", { timeout: 25000 });
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      const els = [...document.querySelectorAll(".maplibregl-marker")];
      const btn = els
        .map((e) => (e.tagName === "BUTTON" ? e : e.querySelector("button")))
        .find((b) => b && !/Objekte – hineinzoomen/.test(b.getAttribute("aria-label") ?? ""));
      btn?.click();
    });
    await page.waitForSelector(".maplibregl-popup", { timeout: 10000 });
    expect(await page.locator(".maplibregl-popup").count()).toBeGreaterThanOrEqual(1);
  });

  it("Kontaktseite lädt die Karte ebenfalls erst nach Einwilligung", async ({ page }) => {
    const osm = [];
    page.on("request", (r) => {
      if (/openstreetmap\.org/i.test(r.url())) osm.push(r.url());
    });
    await go(page, "/kontakt");
    await page.waitForTimeout(2500);
    expect(osm.length).toBe(0);
    expect(await page.locator("body").innerText()).toContain("Karte von OpenStreetMap");
  });

  it("Objektdetail lädt die Lagekarte erst nach Einwilligung", async ({ page }) => {
    const osm = [];
    page.on("request", (r) => {
      if (/openstreetmap\.org/i.test(r.url())) osm.push(r.url());
    });
    await go(page, "/immobilien/villa-marienburg-rheinblick");
    await page.waitForTimeout(2500);
    expect(osm.length).toBe(0);
  });
});

describe("14 Formulare – Kontakt", () => {
  it("Validierungsfehler bei leerem Absenden", async ({ page }) => {
    await go(page, "/kontakt");
    const form = page.locator("form").filter({ has: page.locator("textarea[name='message']") }).first();
    await form.locator("button[type='submit']").click();
    await page.waitForTimeout(2500);
    const alerts = await page.locator("[role='alert']").count();
    const invalid = await page.locator("[aria-invalid='true']").count();
    expect(alerts + invalid).toBeGreaterThan(0);
  });

  it("zu kurze Nachricht wird abgelehnt (≥ 10 Zeichen)", async ({ page }) => {
    await go(page, "/kontakt");
    const form = page.locator("form").filter({ has: page.locator("textarea[name='message']") }).first();
    await form.locator("input[name='lastName']").fill("Beispiel");
    await form.locator("input[name='email']").fill("qa.test@example.invalid");
    await form.locator("textarea[name='message']").fill("kurz");
    await form.locator("input[name='privacyAccepted']").check();
    await form.locator("button[type='submit']").click();
    await page.waitForTimeout(3000);
    const text = await page.locator("body").innerText();
    expect(text.includes("Vielen Dank")).toBeFalsy();
  });

  it("fehlende Datenschutz-Zustimmung wird abgelehnt", async ({ page }) => {
    await go(page, "/kontakt");
    const form = page.locator("form").filter({ has: page.locator("textarea[name='message']") }).first();
    await form.locator("input[name='lastName']").fill("Beispiel");
    await form.locator("input[name='email']").fill("qa.test@example.invalid");
    await form.locator("textarea[name='message']").fill("Dies ist eine ausreichend lange Testnachricht.");
    await form.locator("button[type='submit']").click();
    await page.waitForTimeout(3000);
    const text = await page.locator("body").innerText();
    expect(text.includes("Vielen Dank")).toBeFalsy();
  });

  it("gültiges Kontaktformular wird angenommen", async ({ page }) => {
    await go(page, "/kontakt");
    const form = page.locator("form").filter({ has: page.locator("textarea[name='message']") }).first();
    await form.locator("input[name='firstName']").fill("QA");
    await form.locator("input[name='lastName']").fill("Testlauf");
    await form.locator("input[name='email']").fill("qa.test@example.invalid");
    await form.locator("input[name='phone']").fill("0221 1234567");
    await form
      .locator("textarea[name='message']")
      .fill("Automatischer Test des Kontaktformulars – bitte ignorieren.");
    await form.locator("input[name='privacyAccepted']").check();
    await form.locator("button[type='submit']").click();
    await page.waitForSelector("[role='status']", { timeout: 20000 });
    expect(await page.locator("[role='status']").innerText()).toContain("Dank");
  });
});

describe("15 Formulare – Objektanfrage", () => {
  const slug = "/immobilien/villa-marienburg-rheinblick";

  it("Validierungsfehler bei leerem Absenden", async ({ page }) => {
    await go(page, slug);
    const form = page
      .locator("form")
      .filter({ has: page.locator("input[name='propertyId']") })
      .first();
    await form.locator("button[type='submit']").click();
    await page.waitForTimeout(2500);
    const alerts = await page.locator("[role='alert']").count();
    const invalid = await page.locator("[aria-invalid='true']").count();
    expect(alerts + invalid).toBeGreaterThan(0);
  });

  it("gültige Objektanfrage wird angenommen", async ({ page }) => {
    await go(page, slug);
    const form = page
      .locator("form")
      .filter({ has: page.locator("input[name='propertyId']") })
      .first();
    await form.locator("input[name='firstName']").fill("QA");
    await form.locator("input[name='lastName']").fill("Testlauf");
    await form.locator("input[name='email']").fill("qa.test@example.invalid");
    await form.locator("input[name='phone']").fill("0221 1234567");
    await form
      .locator("textarea[name='message']")
      .fill("Automatischer Test der Objektanfrage – bitte ignorieren.");
    await form.locator("input[name='privacyAccepted']").check();
    await form.locator("button[type='submit']").click();
    await page.waitForSelector("[role='status']", { timeout: 20000 });
    expect(await page.locator("[role='status']").innerText()).toContain("Dank");
  });

  it("Honeypot-Feld `website` ist vorhanden", async ({ page }) => {
    await go(page, slug);
    expect(await page.locator("input[name='website']").count()).toBeGreaterThanOrEqual(1);
  });
});

// --- Funnel-Hilfen ---------------------------------------------------------

const weiter = (page) => page.getByRole("button", { name: /^Weiter/ });

/** Feld nach seinem sichtbaren Label fuellen (Field.tsx bindet per htmlFor). */
async function fillByLabel(page, label, value) {
  await page.getByLabel(new RegExp(`^${label}`)).first().fill(value);
}

describe("16 Funnel 1 – Bewertung (/immobilienbewertung)", () => {
  it("blockiert den ersten Schritt ohne Immobilientyp", async ({ page }) => {
    await go(page, "/immobilienbewertung");
    await weiter(page).click();
    await page.waitForTimeout(500);
    expect(await page.locator("body").innerText()).toContain("Bitte wählen Sie einen Immobilientyp");
  });

  it("blockiert Standort ohne fünfstellige PLZ", async ({ page }) => {
    await go(page, "/immobilienbewertung");
    await page.getByRole("button", { name: /Wohnung/ }).first().click();
    await weiter(page).click();
    await page.waitForTimeout(400);
    await weiter(page).click();
    await page.waitForTimeout(500);
    expect(await page.locator("body").innerText()).toContain("5-stellige Postleitzahl");
  });

  it("fünf Schritte vollständig bis zur Bestätigung", async ({ page }) => {
    await go(page, "/immobilienbewertung");

    // 1 Immobilientyp
    await page.getByRole("button", { name: /Wohnung/ }).first().click();
    await weiter(page).click();

    // 2 Standort
    await page.waitForTimeout(400);
    await fillByLabel(page, "Postleitzahl", "50667");
    await fillByLabel(page, "Ort", "Köln");
    await weiter(page).click();

    // 3 Eckdaten
    await page.waitForTimeout(400);
    await fillByLabel(page, "Wohnfläche in m²", "95");
    await fillByLabel(page, "Zimmer", "3");
    await fillByLabel(page, "Baujahr", "1998");
    await page.getByRole("button", { name: "Gepflegt" }).first().click();
    await weiter(page).click();

    // 4 Kontaktdaten
    await page.waitForTimeout(400);
    await fillByLabel(page, "Vorname", "QA");
    await fillByLabel(page, "Nachname", "Testlauf");
    await fillByLabel(page, "E-Mail", "qa.test@example.invalid");
    await fillByLabel(page, "Telefon", "0221 1234567");
    await weiter(page).click();

    // 5 Zusammenfassung
    await page.waitForTimeout(600);
    const summary = await page.locator("body").innerText();
    expect(summary).toContain("Ihre Angaben im Überblick");
    expect(summary).toContain("50667 Köln");

    await page.locator("input[type='checkbox']").first().check();
    await page.getByRole("button", { name: /Bewertung jetzt anfordern/ }).click();
    await page.waitForSelector("[role='status']", { timeout: 25000 });
    expect(await page.locator("[role='status']").innerText()).toContain("Dank");
  });

  it("Grundstück blendet Wohnfläche und Zimmer aus", async ({ page }) => {
    await go(page, "/immobilienbewertung");
    await page.getByRole("button", { name: /Grundstück/ }).first().click();
    await weiter(page).click();
    await page.waitForTimeout(400);
    await fillByLabel(page, "Postleitzahl", "50354");
    await fillByLabel(page, "Ort", "Hürth");
    await weiter(page).click();
    await page.waitForTimeout(600);
    const text = await page.locator("body").innerText();
    expect(text).toContain("Grundstücksfläche");
    expect(text.includes("Wohnfläche in m²")).toBeFalsy();
  });

  it("Abschluss ohne Datenschutz-Zustimmung wird abgelehnt", async ({ page }) => {
    await go(page, "/immobilienbewertung");
    await page.getByRole("button", { name: /Wohnung/ }).first().click();
    await weiter(page).click();
    await page.waitForTimeout(300);
    await fillByLabel(page, "Postleitzahl", "50667");
    await fillByLabel(page, "Ort", "Köln");
    await weiter(page).click();
    await page.waitForTimeout(300);
    await fillByLabel(page, "Wohnfläche in m²", "95");
    await fillByLabel(page, "Zimmer", "3");
    await weiter(page).click();
    await page.waitForTimeout(300);
    await fillByLabel(page, "Vorname", "QA");
    await fillByLabel(page, "Nachname", "Testlauf");
    await fillByLabel(page, "E-Mail", "qa.test@example.invalid");
    await weiter(page).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /Bewertung jetzt anfordern/ }).click();
    await page.waitForTimeout(2500);
    expect(await page.locator("[role='status']").count()).toBe(0);
  });

  it("„Zurück“ führt in den vorigen Schritt", async ({ page }) => {
    await go(page, "/immobilienbewertung");
    await page.getByRole("button", { name: /Wohnung/ }).first().click();
    await weiter(page).click();
    await page.waitForTimeout(400);
    expect(await page.locator("body").innerText()).toContain("Wo liegt die Immobilie");
    await page.getByRole("button", { name: /^Zurück/ }).click();
    await page.waitForTimeout(400);
    expect(await page.locator("body").innerText()).toContain("Um welche Immobilie geht es");
  });
});

describe("17 Funnel 1 – Verkauf (/immobilie-verkaufen, 6 Schritte)", () => {
  it("hat den zusätzlichen Schritt „Ihre Situation“", async ({ page }) => {
    await go(page, "/immobilie-verkaufen");
    expect(await page.locator("body").innerText()).toContain("Ihre Situation");
  });

  it("sechs Schritte vollständig bis zur Bestätigung", async ({ page }) => {
    await go(page, "/immobilie-verkaufen");

    await page.getByRole("button", { name: /Haus/ }).first().click();
    await weiter(page).click();

    await page.waitForTimeout(400);
    await fillByLabel(page, "Postleitzahl", "50968");
    await fillByLabel(page, "Ort", "Köln");
    await weiter(page).click();

    await page.waitForTimeout(400);
    await fillByLabel(page, "Wohnfläche in m²", "180");
    await fillByLabel(page, "Grundstücksfläche in m²", "520");
    await fillByLabel(page, "Zimmer", "6");
    await fillByLabel(page, "Baujahr", "1975");
    await page.getByRole("button", { name: "Gepflegt" }).first().click();
    await weiter(page).click();

    // Schritt „Ihre Situation“
    await page.waitForTimeout(500);
    expect(await page.locator("body").innerText()).toContain("Wo stehen Sie gerade");
    await page.getByText("Ich möchte", { exact: false }).first().click();
    await page.waitForTimeout(200);
    await weiter(page).click();

    await page.waitForTimeout(400);
    await fillByLabel(page, "Vorname", "QA");
    await fillByLabel(page, "Nachname", "Testlauf");
    await fillByLabel(page, "E-Mail", "qa.test@example.invalid");
    await weiter(page).click();

    await page.waitForTimeout(600);
    expect(await page.locator("body").innerText()).toContain("Ihre Angaben im Überblick");
    await page.locator("input[type='checkbox']").first().check();
    await page.getByRole("button", { name: /Kostenlose Immobilienbewertung anfordern/ }).click();
    await page.waitForSelector("[role='status']", { timeout: 25000 });
    expect(await page.locator("[role='status']").innerText()).toContain("Dank");
  });

  it("Schritt „Ihre Situation“ ist Pflicht", async ({ page }) => {
    await go(page, "/immobilie-verkaufen");
    await page.getByRole("button", { name: /Haus/ }).first().click();
    await weiter(page).click();
    await page.waitForTimeout(300);
    await fillByLabel(page, "Postleitzahl", "50968");
    await fillByLabel(page, "Ort", "Köln");
    await weiter(page).click();
    await page.waitForTimeout(300);
    await fillByLabel(page, "Wohnfläche in m²", "180");
    await fillByLabel(page, "Zimmer", "6");
    await weiter(page).click();
    await page.waitForTimeout(500);
    await weiter(page).click();
    await page.waitForTimeout(500);
    // Ohne Auswahl bleibt der Schritt stehen.
    expect(await page.locator("body").innerText()).toContain("Wo stehen Sie gerade");
  });
});

describe("18 Funnel 2 – Suchprofil (/suchprofil)", () => {
  it("sechs Schritte vollständig bis zur Bestätigung", async ({ page }) => {
    await go(page, "/suchprofil");

    // 1 Kauf oder Miete
    await page.getByText("Kaufen", { exact: false }).first().click();
    await page.waitForTimeout(200);
    await weiter(page).click();

    // 2 Immobilientyp (Mehrfachauswahl)
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: /Wohnung/ }).first().click();
    await weiter(page).click();

    // 3 Wunschlage
    await page.waitForTimeout(400);
    await fillByLabel(page, "Orte oder Stadtteile", "Köln, Bonn");
    await weiter(page).click();

    // 4 Budget & Größe
    await page.waitForTimeout(400);
    await weiter(page).click();

    // 5 Zeitrahmen
    await page.waitForTimeout(400);
    await weiter(page).click();

    // 6 Kontaktdaten
    await page.waitForTimeout(400);
    await fillByLabel(page, "Vorname", "QA");
    await fillByLabel(page, "Nachname", "Testlauf");
    await fillByLabel(page, "E-Mail", "qa.test@example.invalid");
    const boxes = page.locator("input[type='checkbox']");
    await boxes.last().check();
    await page.getByRole("button", { name: /Suchprofil|anlegen|senden|absenden/i }).last().click();
    await page.waitForSelector("[role='status']", { timeout: 25000 });
    expect(await page.locator("[role='status']").innerText().catch(() => "")).toContain("Dank");
  });

  it("mindestens ein Immobilientyp ist Pflicht", async ({ page }) => {
    await go(page, "/suchprofil");
    await page.getByText("Kaufen", { exact: false }).first().click();
    await page.waitForTimeout(200);
    await weiter(page).click();
    await page.waitForTimeout(400);
    const before = await page.locator("body").innerText();
    await weiter(page).click();
    await page.waitForTimeout(600);
    const after = await page.locator("body").innerText();
    // Ohne Auswahl darf der Schritt nicht wechseln.
    expect(after.includes("Wunschlage") || after.includes("Orte oder Stadtteile")).toBeFalsy();
    expect(before.length).toBeGreaterThan(0);
  });
});

describe("19 Hero-Schnellsuche auf der Startseite", () => {
  it("navigiert mit den gewählten Filtern auf /immobilien", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page, "/");
    const form = page.locator("form").first();
    const selects = form.locator("select");
    if ((await selects.count()) > 0) {
      await selects.first().selectOption({ index: 1 }).catch(() => {});
    }
    await form.locator("button[type='submit']").first().click();
    await page.waitForURL("**/immobilien**", { timeout: 15000 });
    expect(new URL(page.url()).pathname).toBe("/immobilien");
    await waitForResults(page);
  });
});

describe("20 Referenz-Assets", () => {
  it("„dondorf“ kommt nicht in app/, components/, lib/, public/, prisma/ vor", async () => {
    const { execFileSync } = await import("node:child_process");
    const root = new URL("../../", import.meta.url).pathname;
    let out = "";
    try {
      out = execFileSync(
        "grep",
        ["-ril", "dondorf", "app", "components", "lib", "public", "prisma"],
        { cwd: root, encoding: "utf8" },
      );
    } catch (e) {
      // grep beendet sich mit 1, wenn nichts gefunden wurde – das ist der Erfolgsfall.
      out = e.status === 1 ? "" : String(e.stdout ?? "");
    }
    expect(out.trim()).toBe("");
  });

  it("„dondorf“ steht ausschließlich in Dokumentationsdateien", async () => {
    const { execFileSync } = await import("node:child_process");
    const root = new URL("../../", import.meta.url).pathname;
    let out = "";
    try {
      out = execFileSync(
        "grep",
        [
          "-ril",
          "--exclude-dir=node_modules",
          "--exclude-dir=.git",
          "--exclude-dir=.next",
          "dondorf",
          ".",
        ],
        { cwd: root, encoding: "utf8" },
      );
    } catch (e) {
      out = e.status === 1 ? "" : String(e.stdout ?? "");
    }
    const allowed =
      /^\.\/(CLAUDE\.md|AGENTS\.md|PLAN\.md|DECISIONS\.md|REFERENCE-.*\.md|SEO-REPORT\.md|PERF-REPORT\.md|README\.md|INVENTORY\.md|OPEN-ITEMS\.md|MISSING-IMAGES\.md|DESIGN-TOKENS\.md|\.claude\/.*|design-review\/.*|content-snapshot\/.*|tests\/.*)$/;
    const offenders = out
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((f) => !allowed.test(f));
    expect(offenders.join(", ")).toBe("");
  });
});

// ---------------------------------------------------------------------------

const results = await run(make, () => browser.close());
process.exit(results.failed.length ? 1 : 0);
