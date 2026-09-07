@AGENTS.md

# WohnWert Immobilien v4 – Projektregeln

Pflichtlektüre für jeden Agenten **vor** der ersten Codeänderung. Ergänzend
gelten `DESIGN-TOKENS.md`, `INVENTORY.md` und `REFERENCE-DONDORF.md`.

## 1. Was hier tatsächlich steht (nicht raten)

Der Master-Prompt nennt Next.js 15, `src/`-Ordner und Drizzle. **Das trifft auf
dieses Repo nicht zu.** Verbindlich ist der Repo-Stand:

| Punkt        | Tatsächlich                                              |
| ------------ | -------------------------------------------------------- |
| Framework    | **Next.js 16.3.4**, App Router, React 19.2               |
| Ordner       | `app/`, `components/`, `lib/`, `prisma/` – **kein `src/`** |
| ORM          | **Prisma 6** gegen PostgreSQL 16 – **kein Drizzle**       |
| Styling      | **Tailwind CSS v4** – Konfiguration in `app/globals.css` per `@theme`, **keine `tailwind.config.ts`** |
| Routen       | `app/(marketing)/…` (öffentlich), `app/admin/…` (Backend) |
| Inhalte      | Datenbank (Prisma) + `lib/content/sell-topics.ts` – **kein MDX** |
| Formulare    | React Server Actions in `lib/actions/` + Zod in `lib/validations/` |
| Paketmanager | pnpm 10                                                   |

Wo der Master-Prompt und das Repo sich widersprechen, gewinnt das Repo. Die
Abweichung wird in `DECISIONS.md` festgehalten, nicht stillschweigend
„korrigiert".

## 2. Harte Leitplanken

1. **Kein Funktionsverlust.** Jede Route, jedes Formular, jede Server Action,
   jeder Filter, jede Sortierung, jede API-Route, jedes JSON-LD, jeder Redirect
   bleibt erhalten. `INVENTORY.md` ist die Abnahmeliste.
2. **Kein Inhaltsverlust.** Kein Text wird gekürzt oder umformuliert. Passt er
   strukturell nicht mehr, wird er umgehängt – nie gelöscht. Prüfung gegen
   `content-snapshot/`.
3. **Nichts von dondorf.de übernehmen.** Keine Bilder, Texte, Logos, Namen,
   Zahlen, Objektdaten – auch nicht in Kommentaren oder Testdaten. Übernommen
   wird ausschließlich die *Gestaltungssprache*.
4. **Keine erfundenen Fakten.** Zahlen, Auszeichnungen und Kontaktdaten kommen
   aus dem Bestand. Unbelegtes wird `[[PRÜFEN: …]]` markiert und in
   `OPEN-ITEMS.md` eingetragen.

## 3. Marke

- **Firma:** WohnWert Immobilien · **Claim:** „Immobilien mit Haltung"
- **Farben** (bestehend, bleiben): Oliv `#3E4018` (Flächen, Footer, Navigation),
  Orange `#FF6D00` (CTA, Überschriften, Akzente), Beige `#F3ECE7` (ruhige
  Abschnitte), Weiß, Anthrazit `#313131`
- **Schrift:** Montserrat. Überschriften **versal**, Laufweite 0.02–0.06 em.
- Zentrale Marken- und Standortdaten stehen in `lib/site.ts` – dort ändern,
  nicht in einzelnen Seiten hartkodieren.

## 4. Tonalität

**Sie**-Anrede, sachlich-warm, konkret, keine Superlative. Maßstab ist der
Bestandston: „Wir arbeiten mit der Kaufpreissammlung des Gutachterausschusses
statt mit Angebotspreisen aus Portalen."

**Verboten:** maßgeschneidert, ganzheitlich, nahtlos, innovativ, hochwertig
(ohne Beleg), optimal, Rundum-Sorglos, Ihre Bedürfnisse, „egal ob … oder …",
„in der heutigen Zeit", „nicht nur …, sondern auch …", „Willkommen bei",
„Ihr Traumhaus wartet", „Immobilien sind Vertrauenssache", „Wir kennen den
Markt wie kein anderer", „Ihr starker Partner an Ihrer Seite", „Werte schaffen,
Werte erhalten", „Immobilien mit Herz und Verstand", „Lehnen Sie sich zurück".

**KI-Muster verboten:** jede Sektion endet mit einem CTA-Satz; rhetorische Frage
als Einstieg; drei parallel gebaute Adjektive; „Fazit"-Absätze ohne neuen
Inhalt; „Ob … – wir haben die Lösung".

**Schreibweisen:** WohnWert Immobilien, Köln, Bonn, Düsseldorf, Bergisch
Gladbach, Rheinauhafen, Agnesviertel, Belgisches Viertel, Gutachterausschuss,
Energieausweis, Grunderwerbsteuer, Maklerprovision, Kaufpreissammlung, m², €.

## 5. Technische Regeln

- **Server Components sind der Standard.** `"use client"` nur, wo es Zustand,
  Effekte oder Browser-APIs braucht (Suche, Karte, Karussells, Formulare).
- **Versalien ausschließlich per CSS** (`text-transform: uppercase`), nie im
  Markup – sonst buchstabieren Screenreader.
- **Rahmenfarben:** die Vorgabe steht in `@layer base` in `app/globals.css`.
  Ungelayerte Regeln würden jede Utility-Klasse schlagen – dort nichts einfügen.
- **Bilder:** `next/image` mit korrektem `sizes`, `priority` nur im Hero.
  Externe Hosts müssen in `next.config.ts` unter `remotePatterns` stehen.
- **Keine Stockfotos, keine KI-Bilder.** Fehlt ein Motiv: `<ImagePlaceholder>`
  einbauen und in `MISSING-IMAGES.md` erfassen.
- **Bilder immer visuell prüfen**, nie der Unsplash-ID vertrauen. Ein falsches
  Motiv ist schlimmer als ein Platzhalter.
- **Keine neuen Abhängigkeiten** außer für die Karte (MapLibre). Jede in
  `DECISIONS.md` begründen.

## 6. Barrierefreiheit & Recht

Semantisches HTML, sichtbarer Fokus, Alt-Texte, Kontrast AA, volle
Tastaturbedienung, Skip-Link. Genau **eine `<h1>` pro Seite**. Die Suche muss
ohne JavaScript bedienbar bleiben: Filter als echtes Formular mit
URL-Parametern, Ergebnisliste serverseitig gerendert. Kartendienste erst nach
Einwilligung laden.

## 7. Befehle

```bash
pnpm build          # Produktionsbuild (prisma generate + next build)
pnpm typecheck      # tsc --noEmit
pnpm lint           # ESLint
npx next start -p 3400   # lokal ansehen
pnpm db:seed        # Beispieldaten
```

**`pnpm dev` funktioniert auf dieser Maschine nicht** – die inotify-Instanzen
sind systemweit erschöpft (Limit 128). Stattdessen `pnpm build` und
`npx next start -p 3400`. Vor dem Neustart den alten Prozess beenden, sonst
serviert er einen gelöschten Build und wirft `ChunkLoadError`.

## 8. Definition of Done je Aufgabe

- `pnpm typecheck` und `pnpm build` grün
- Route erreichbar (HTTP 200), Formulare absendbar, Filter wirksam
- Inhalte gegen `content-snapshot/` geprüft – kein Absatz verloren
- Metadaten und JSON-LD unverändert
- Kein horizontales Scrollen von 360 bis 1920 px
- Genau eine `<h1>`, alle Bilder mit sinnvollem Alt-Text
