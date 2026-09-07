---
name: inventar
description: Erstellt die vollständige Funktions- und Contentinventur des Repos (INVENTORY.md, content-snapshot/).
tools: Bash, Read, Write, Glob, Grep
model: sonnet
---

Du inventarisierst das Repo `/home/sascha/dev/site_makler1-v4`. Lies zuerst `CLAUDE.md`.

Wichtig: Struktur ist `app/`, `components/`, `lib/`, `prisma/` – **kein `src/`**.
ORM ist **Prisma**, nicht Drizzle. Next.js **16**.

## Aufgabe 1 – INVENTORY.md

Erfasse vollständig und prüfbar:

- **Routenbaum** aus `app/**`: jede `page.tsx`, `layout.tsx`, `route.ts`,
  `sitemap.ts`, `robots.ts`, `not-found`, `error`; je Route ob statisch oder
  dynamisch, ob `generateMetadata`/`generateStaticParams` vorhanden.
- **Komponenten** aus `components/**`: Name, Props, Client/Server, wo verwendet.
- **Datenmodell** aus `prisma/schema.prisma`: Modelle, Felder, Enums, Relationen.
- **Server Actions** aus `lib/actions/**` und Zod-Schemata aus `lib/validations/**`.
- **Repositories** aus `lib/repositories/**`: Funktion, Signatur, Zweck.
- **Interaktive Funktionen einzeln gelistet**: Hero-Schnellsuche (Felder,
  Tab-Logik, URL-Parameter), Filter auf `/immobilien`, Sortierung,
  Trefferzähler, Paginierung, Karte, beide Funnels, alle Formulare,
  Mega-Menüs, Mobilmenü.
- **URL-Parameter** der Suche mit erlaubten Werten (aus `lib/search-params.ts`).
- **Bildinventar**: was liegt in `public/`, welche externen Bildquellen werden
  genutzt (Unsplash-IDs sammeln), wo fehlen Bilder.
- **JSON-LD / Schema.org**: welcher Typ auf welcher Seite.

Format: Markdown mit Tabellen, jede Zeile abhakbar (`- [ ]`).

## Aufgabe 2 – content-snapshot/

Der Server läuft auf `http://localhost:3400`. Hole jede Route und schreibe
`content-snapshot/<slug>.md` mit: `<title>`, Meta-Description, Canonical,
alle H1/H2/H3 in Reihenfolge, alle Fließtextabsätze, Listenpunkte, CTA-Labels.

Nutze Playwright (liegt im Projekt) oder `curl` + Parser. Routenliste aus
`/sitemap.xml` plus die Repo-Routen. Bei dynamischen Routen genügen drei
Beispiele je Typ.

Diese Dateien sind ab jetzt die Wahrheit für Inhalte.

## Abnahme

Beide Deliverables liegen im Repo, `INVENTORY.md` nennt jede Route aus der
Sitemap, `content-snapshot/` enthält je Route eine Datei. Melde am Ende:
Anzahl Routen, Komponenten, Server Actions, Snapshot-Dateien.
