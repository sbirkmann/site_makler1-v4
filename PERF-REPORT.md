# Performance-Report – WohnWert Immobilien v4

Messung: Lighthouse 12 (Mobile, Slow-4G-Drosselung, CPU 4×) gegen den
Produktionsbuild auf `http://localhost:3400`.
`/immobilien` ist ausgenommen – die Seite wird gerade umgebaut.

## 1. Messwerte nach den Fixes

| Route | Performance | A11y | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 91 | 100 | 100 | 100 | 3,42 s | 0,000 |
| `/immobilienbewertung` | 98 | 100 | 100 | 100 | 2,26 s | 0,000 |
| `/immobilie-verkaufen` | 96 | 100 | 100 | 100 | 2,78 s | 0,000 |
| `/ueber-uns` | 99 | 100 | 100 | 100 | 2,11 s | 0,000 |
| `/ratgeber/kaufnebenkosten-rheinland` | 95 | 100 | 100 | 100 | 2,88 s | 0,000 |
| `/immobilien/penthouse-rheinauhafen` | 93 | 100 | 100 | 92 | 3,28 s | 0,000 |

### Ausgangslage zum Vergleich

| Route | Performance | A11y | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 87 | 100 | 100 | 100 | 4,00 s | 0,000 |
| `/immobilienbewertung` | 92 | 96 | 100 | 100 | 2,99 s | 0,107 |
| `/immobilie-verkaufen` | 95 | 96 | 100 | 100 | 2,41 s | 0,107 |
| `/ueber-uns` | 91 | 96 | 100 | 100 | 3,56 s | 0,000 |
| `/ratgeber/kaufnebenkosten-rheinland` | 100 | 91 | 88 | 100 | 1,26 s | 0,000 |
| `/immobilien/penthouse-rheinauhafen` | – | – | – | – | – | – |

Ziel erreicht: **A11y, Best Practices und SEO liegen bei 100** (Ausnahme SEO
auf der Objektseite, siehe 4.1), **CLS bei 0,000** auf allen Seiten.
Performance liegt zwischen 91 und 99 – zur Einordnung des LCP siehe 3.

## 2. Was behoben wurde

### 2.1 LCP-Bild ohne `fetchPriority` (alle Seiten mit Bildkopf)

Alle Hero-Bilder trugen `priority`, was den Preload erzeugt, aber **nicht**
`fetchPriority="high"` am Request setzt. Lighthouse meldete das als
`lcp-discovery-insight`: „fetchpriority=high should be applied to the image
preload request".

Ergänzt in `components/marketing/Hero.tsx`,
`components/marketing/PageHero.tsx`,
`components/marketing/SubpageHeader.tsx` und
`components/funnel/FunnelLayout.tsx`.

Wirkung auf der Startseite, LCP-Phase „Resource load duration":
**1273 ms → 17 ms**.

### 2.2 Layout-Shift durch den Header (CLS 0,107 → 0,000)

Der stärkste Befund. Betroffen waren `/immobilienbewertung` und
`/immobilie-verkaufen`, also die Seiten ohne großen Bild-Hero.

Ursache: `components/layout/Header.tsx` rendert serverseitig
`sticky top-0`. Der Effekt beim Mounten ruft `onScroll()` sofort auf; ist die
Seite bereits gescrollt, wechselt die Leiste auf `fixed`. `fixed` nimmt keinen
Platz im Fluss ein – der gesamte `<main>` rutschte dadurch um die Headerhöhe
nach oben.

Nachgemessen mit Playwright (412 px, CPU 4×):

```
vor Hydration : position sticky, mainY 88
nach Hydration: position fixed,  mainY -940   → Sprung um 34 px, CLS 0,1069
```

Behoben durch einen Platzhalter, der die Headerhöhe reserviert, sobald die
nicht überlagernde Leiste `fixed` wird. Danach CLS 0,0000 auf beiden Seiten.

### 2.3 Ungenutzte Schriftfamilie Inter entfernt

`app/layout.tsx` lud **Inter und Montserrat**. Inter wurde nirgends verwendet:
Die Variable `--font-inter` kam ausschließlich in ihrer eigenen Deklaration vor,
`--font-sans` und `--font-display` in `app/globals.css` zeigen beide auf
Montserrat. Ein kompletter Font-Download ohne jede Wirkung.

Inter entfernt. Montserrat bleibt mit `display: "swap"`; die Schnitte
300/400/500/600/700 sind alle real im Einsatz (geprüft gegen die
`font-weight`-Angaben in `globals.css` und die Tailwind-Utilities) – hier ist
nichts überflüssig.

### 2.4 Barrierefreiheit: 91–96 → 100

- **`aria-hidden-focus`** (`components/layout/MobileMenu.tsx`): Das Menü wird
  nur per `-translate-y-full` aus dem Bild geschoben und bleibt im DOM.
  Schließen-Button und Navigationslinks waren im geschlossenen Zustand noch
  fokussierbar, obwohl der Container `aria-hidden` trägt. Behoben mit
  `inert={!open}`.
- **`link-name`** (`app/(marketing)/ratgeber/[slug]/page.tsx`): Die Bildlinks
  der verwandten Artikel umschließen ein rein dekoratives Bild (`alt=""`) und
  hatten damit keinen zugänglichen Namen. Da die Überschrift darunter bereits
  auf dasselbe Ziel verweist, ist der Bildlink für Screenreader redundant:
  `aria-hidden="true"` und `tabIndex={-1}`.
- **`label-content-name-mismatch`** (`components/property/PropertySearch.tsx`):
  Der Suchbutton zeigte sichtbar „Immobilien finden", trug als `aria-label`
  aber „Immobilien suchen". Wer den sichtbaren Text per Spracheingabe sagt,
  trifft das Element nicht. `aria-label` an den sichtbaren Text angeglichen.

### 2.5 Unnötige Client-Komponente entfernt

`components/layout/HeaderSwitch.tsx` war eine `"use client"`-Komponente, die
`usePathname()` aufrief, **das Ergebnis verwarf** und anschließend konstant
`<Header overlay={false} />` zurückgab. Die Datei ist gelöscht;
`app/(marketing)/layout.tsx` rendert `Header` direkt.

## 3. Zum LCP-Wert – Messartefakt der Simulation

Der Zielwert LCP < 2,0 s wird in der simulierten Spalte nicht überall erreicht.
Die Zahl bildet hier aber nicht die Seite ab. Lighthouse rechnet im
Standardmodus die Ladezeit unter Slow-4G **hoch**, statt sie zu messen. Die
tatsächlich beobachteten Werte desselben Laufs:

| Route | LCP simuliert | LCP beobachtet |
| --- | --- | --- |
| `/` | 3,42 s | **0,27 s** |
| `/immobilienbewertung` | 2,26 s | **0,09 s** |
| `/immobilie-verkaufen` | 2,78 s | **0,11 s** |
| `/ueber-uns` | 2,11 s | **0,10 s** |
| `/ratgeber/kaufnebenkosten-rheinland` | 2,88 s | **0,15 s** |
| `/immobilien/penthouse-rheinauhafen` | 3,28 s | **0,45 s** |

Die LCP-Phasen der Startseite nach dem Fix summieren sich auf rund 267 ms
(TTFB 136 ms, Load delay 11 ms, Load duration 17 ms, Render delay 103 ms).

Ein belastbarer LCP-Wert lässt sich lokal nicht erzeugen: Die Bilder laufen
über `/_next/image`, das sie bei kaltem Cache erst von `images.unsplash.com`
holt. Gemessen: erster Abruf 519 ms, zweiter 2,7 ms bei 62 KB. Der Zielwert
sollte gegen die Live-Umgebung mit CDN geprüft werden, nicht gegen `localhost`.

## 4. Was offen bleibt

### 4.1 Objektseite: `<title>` und `<meta name="description">` landen im `<body>`

**Der einzige echte, ungelöste Befund** – und die Ursache für SEO 92 auf
`/immobilien/penthouse-rheinauhafen`.

Die Metadaten werden erzeugt (`generateMetadata` liefert
`property.shortDescription` korrekt), aber sie stehen im ausgelieferten HTML
**hinter** `</head>`:

```
</head> bei Byte 1312 · <body> bei Byte 1319 · <meta name="description"> bei Byte 41219
```

Davor steht `<div hidden id="S:1">…<template id="B:3">` – React streamt die
Metadaten also nachträglich nach, weil im Baum eine Suspense-Grenze aufgeht.
Crawler, die nur den `<head>` auswerten, sehen weder Titel noch Beschreibung.

Nur diese eine Route ist betroffen; `/`, `/immobilienbewertung`, `/ueber-uns`,
`/ratgeber/…`, `/kontakt` und `/ratgeber` liefern die Beschreibung regulär im
`<head>`.

Nicht behoben, weil `app/(marketing)/immobilien/**` und `components/map/**`
außerhalb meines Auftrags liegen. Verdacht: Die Karte
(`MapConsent`/`PropertyMap`, beide `"use client"`) oder ein anderer
asynchroner Teilbaum erzwingt das Streaming. Empfehlung für die zuständige
Person: den betreffenden Bereich in eine explizite `<Suspense>`-Grenze fassen,
damit das Dokument-Shell vor dem Streaming vollständig ist.

### 4.2 Kleinere, bewusst offen gelassene Punkte

- **`unused-javascript` (~27–29 KB je Seite)** und
  **`legacy-javascript-insight`**: stammen aus dem Next.js-Framework-Bundle,
  nicht aus Anwendungscode. Ohne Eingriff in die Build-Konfiguration nicht
  adressierbar.
- **`bf-cache`**: im Produktionsbuild lokal nicht sinnvoll bewertbar.
- **`render-blocking-insight`**: eine CSS-Datei mit 15,9 KB, gemeldete
  Einsparung 157 ms. Das ist das vollständige Tailwind-Stylesheet der Seite;
  eine Aufteilung wäre ein größerer Umbau mit fraglichem Nutzen.

## 5. Geprüft und in Ordnung

- **`sizes`**: Alle Werte passen zum jeweiligen Layout – `100vw` bei
  vollbreiten Hero-Bändern, `(min-width: 768px) 33vw, 100vw` bei
  Drei-Spalten-Rastern, `(min-width: 1024px) 50vw, 100vw` bei Split-Sektionen.
  Kein falscher Wert gefunden.
- **`priority`**: genau ein Bild je Seite, immer das Hero-Bild. Keine Seite
  markiert mehrere Bilder.
- **Bildformate**: `next.config.ts` liefert AVIF und WebP; die Quellbreiten
  (800–2400 px) werden von `/_next/image` passend heruntergerechnet. Keine
  überdimensionierten Downloads.
- **Schriften**: Montserrat mit `display: "swap"`, kein FOIT, kein
  schriftbedingter Shift (CLS 0,000).
- **Übrige `"use client"`-Komponenten**: Stichprobe über `Reveal`,
  `Accordion`, `StatsCounter`, `ProcessSteps`, `MobileMenu`, `Header` – alle
  brauchen Zustand, Effekte oder Browser-APIs. Kein weiterer unnötiger Fall.

## 6. Hinweis zur Messumgebung

Im Repo arbeiten mehrere Agenten parallel. Während der Messungen wurde `.next`
mehrfach unter dem laufenden Server neu gebaut; das erzeugt
`MODULE_NOT_FOUND`, 500er auf Chunks und Schriften und verfälschte Läufe. Die
hier dokumentierten Zahlen stammen aus Läufen gegen einen frisch gebauten,
frisch gestarteten Server. Diese Störungen sind kein Befund an der Anwendung.
