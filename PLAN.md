# PLAN – Redesign WohnWert Immobilien im Look von dondorf.de

Stand: Welle 1 gestartet. Grundlagen (`CLAUDE.md`, Agent-Definitionen) liegen.

## Ausgangslage

Das Redesign ist **nicht bei null**. In dieser Session wurden bereits umgesetzt:
Palette (Oliv/Orange/Beige), Montserrat mit Versalien, Auswahlkacheln,
Kennzahlenband, „Auf einen Kaffee ins Maklerbüro", Ratgeber-Anrisse, Heros auf
Funnel- und Übersichtsseiten, Umkreissuche mit Geocoding, neues Logo.

Der Master-Prompt geht weiter. Offen sind vor allem:

1. **Split-View-Suche mit Karte** – das Kernstück, existiert noch nicht
2. **Header** mit orangem Vollhöhen-CTA-Block und Mega-Menüs
3. **QuickActionRail** (Desktop rechts) / Sticky-Bottom-Bar (Mobil)
4. **Oranges Band** mit Live-Objektzahl, **StatsCircles**, **SearchBandOlive**,
   **TeamCarousel**
5. Belege: `INVENTORY.md`, `content-snapshot/`, `REFERENCE-*.md`,
   `DESIGN-TOKENS.md`, `SEO-REPORT.md`, `/styleguide`

## Abhängigkeiten

```
Inventur + Referenzanalyse
        └─> DESIGN-TOKENS.md
                └─> Komponenten (Layout, Bänder, Karten)
                        ├─> Startseite
                        └─> Suche  ──> braucht zuvor Koordinaten im Datenmodell
                                └─> übrige Seiten
                                        └─> Audits ──> Loop
```

## Wellen

| Welle | Aufgaben | Parallel | Status |
| ----- | -------- | -------- | ------ |
| 1 | `inventar`, `referenz-analyst` | 2 | **läuft** |
| 2 | `DESIGN-TOKENS.md` (Orchestrator) | – | offen |
| 3 | Layout/Header/QuickRail · Komponenten-Set A · Set B | 3 | offen |
| 4 | Startseite · Split-View-Suche | 2 | offen |
| 5 | Seitengruppen in Batches (Verkaufen, Objektdetail, Ratgeber, Unternehmen) | 4–6 | offen |
| 6 | `content-guard` je Seite → `integrator` | 4 | offen |
| 7 | SEO · Performance · A11y · QA · Design-Kritik | 5 | offen |
| 8 | Verbesserungs-Loop bis Abbruchkriterium | – | offen |

## Regeln für die Delegation

- Ein Subagent schreibt nie an einer Datei, an der ein anderer arbeitet.
  Gemeinsame Dateien (`lib/site.ts`, `components/layout/nav.ts`,
  `app/globals.css`, `next.config.ts`) pflegt nur der Orchestrator.
- Jeder Auftrag ist in sich geschlossen: Kontext, exakte Pfade, Output-Format,
  Abnahmekriterien. Subagents kennen diese Sitzung nicht.
- Nach jedem Ergebnis: Review durch den Orchestrator (Build grün? Tokens
  eingehalten? Funktion erhalten? Inhalt vollständig?). Nicht Bestandenes geht
  mit konkretem Änderungsauftrag zurück.
- Parallelität auf 4–6 begrenzen.

## Abnahmekriterien je Welle

- **1:** `INVENTORY.md` listet alle Routen, Komponenten, Server Actions,
  Filter und Formulare; `content-snapshot/` je Route vorhanden;
  `REFERENCE-DONDORF.md` und `REFERENCE-SEARCH.md` mit gemessenen Werten.
- **2:** `DESIGN-TOKENS.md` deckt Farbe, Typo, Raster, Abstände, Radien,
  Schatten, Motion ab; Kontraste AA geprüft.
- **3–5:** `pnpm build` grün, Route 200, kein horizontales Scrollen,
  genau eine `<h1>`.
- **6:** `content-guard` meldet null Verluste.
- **7:** Lighthouse ≥ 95, axe-core 0 Violations, E2E grün, keine
  Metadaten-Regression.
- **8:** Abbruchkriterium nach Master-Prompt 10.2.
