# REFERENCE-DONDORF.md — Gestaltungsreferenz

Analyse von `https://dondorf.de` als **Gestaltungsreferenz** für WohnWert
Immobilien v4.

> **Rechtlicher Rahmen.** Dieses Dokument beschreibt ausschließlich
> *Gestaltungsmerkmale*: Farbwerte, Schriftgrößen, Raster, Abstände, Radien,
> Übergangszeiten und Aufbaumuster. Es enthält **keine** Bilder, Texte, Logos,
> Namen, Kennzahlen oder Objektdaten der Referenzseite. Übernommen wird die
> Gestaltungssprache, nicht der Inhalt.

## 0. Methode

| Schritt | Vorgehen |
| ------- | -------- |
| HTML | `curl` mit realistischem Chrome-User-Agent, max. 1 Anfrage / 4 s (sonst 403 durch Cloudflare) |
| CSS | Vier Quelldateien geladen und ausgewertet: die dynamische Theme-Datei (`dynamic_avia/enfold.css`, 402 KB, enthält alle Farb- und Typo-Tokens der Instanz), `grid.min.css`, sowie die beiden Such-Plugin-Stylesheets |
| **Berechnete Werte** | **Playwright (Chromium, UA wie oben) lief ohne Cloudflare-Challenge.** Alle mit „gemessen" markierten Zahlen sind `getComputedStyle`-Werte bei 1440 px Viewport, keine gelesenen Deklarationen. |
| Screenshots | `design-review/reference/dondorf-{home,suche}-{360,768,1280,1920}.png` — nur interne Analyse |

Technischer Unterbau der Referenz: WordPress mit Enfold/Avia-Theme (7.1.6) und
drei Immobilien-Plugins. Das ist für den Nachbau irrelevant — die Maße unten
sind das, was zählt.

## 1. Farbtokens

Gemessen aus den CSS-Variablen der Instanz und per `getComputedStyle` bestätigt.

| Rolle | Hex | Gemessen als | Einsatz |
| ----- | --- | ------------ | ------- |
| **Oliv (Primär)** | `#3E4018` | `rgb(62, 64, 24)` | Flächenbänder, Footer-Sockel, Navigations-Hover, Sekundärbuttons, Icon-Kreise |
| **Orange (CTA/Akzent)** | `#FF6F00` | `rgb(255, 111, 0)` | Primär-Buttons, **alle H1/H2**, oranges Band, Fokusring, Statusbanner |
| **Beige (Fläche)** | `#F3ECE7` | — | Header-Grundton, ruhige Abschnitte, Hero-Textplatte |
| **Anthrazit (Text)** | `#313131` | — | Fließtext-Alternative, dunkle Überschriften |
| **Textgrau** | `#525252` | — | Sekundärtext, H4/H5, Untertitel |
| **Fließtext-Grau** | `#444444` | `rgb(68, 68, 68)` | **Gemessener `body`-Textwert** |
| **Meta-/Ortsgrau** | `#777777` | — | Ortsangaben, Metazeilen in Karten |
| **Grau (Sekundärfläche)** | `#6A6A6A` | — | Alternatives Band statt Oliv, Umschalter-Aktivzustand |
| **Rahmen hell** | `#E1E1E1` | — | Trennlinien, Formularunterkanten |
| **Rahmen Karte** | `#DFDFDF` | — | Unterkante Kartentitel in der Ergebnisliste |
| **Oliv dunkel (Button-Rand)** | `#1C2006` | — | Rand/Prellkante an Olivbuttons |
| **Oliv Streifen** | `#5F623A` / `#4F5129` | — | Hover-/Streifenvarianten auf Oliv |

**Abweichung von den Vorabwerten:** Das CTA-Orange ist **`#FF6F00`**, nicht
`#FF6D00`. Belegt zweifach: CSS-Variable `--mw-det-secundary-color: #ff6f00` im
HTML und `getComputedStyle` eines Buttons → `rgb(255, 111, 0)`. `#FF6D00` wäre
`rgb(255, 109, 0)`. Die anderen Vorabwerte (`#3E4018`, `#F3ECE7`, `#565655`/
`#313131`) bestätigen sich; `#525252` ist der häufiger vorkommende Grauton als
`#565655`.

### Deckkraft der Bild-Overlays

| Kontext | Wert |
| ------- | ---- |
| Hero-Bild Unterseiten | `opacity: 0.6` auf dem `<img>`, Grund `#000` |
| Hero-Bild Startseite | `opacity: 0.8` auf dem `<img>`, Grund `#000` |
| Dreier-Kachel Ruhezustand | `rgba(0, 0, 0, 0.65)` als `::before`-Schleier |
| Dreier-Kachel Hover | `rgba(62, 64, 24, 0.4)` — Schwarz weicht Oliv |
| Standort-Bildunterschrift | `rgba(62, 64, 24, 0.8)` |
| Trennstreifen im Split | `rgba(255, 255, 255, 0.6)` |

## 2. Typografie

Eine Familie: **Montserrat**, Fallback `Helvetica, Arial, sans-serif`. Gewichte
300/400/500/600/700 (700+ nur vereinzelt). Selbst gehostet, kein
Google-Fonts-Link.

Alle Zeilen unten sind **gemessene** `getComputedStyle`-Werte bei 1440 px.

| Ebene | Größe | Gewicht | Zeilenhöhe | Laufweite | Versal | Farbe |
| ----- | ----- | ------- | ---------- | --------- | ------ | ----- |
| **H1** | **28 px** | **600** | **39.2 px** (1.4 em) | **1 px** (≈0.036 em) | **ja** | **`#FF6F00`** |
| **H2** | **28 px** | **600** | **39.2 px** (1.4 em) | **1 px** | **ja** | **`#FF6F00`** |
| H3 | 18 px | 600 | 28.8 px (1.6 em) | normal | nein | `#FF6F00` |
| H4 | 16 px | 600 | 1.5 em | normal | **ja** | `#525252` |
| H5 | 21 px | normal | 1.4 em | normal | nein | `#525252` |
| **Body** | **16 px** | **400** | **26.4 px** (1.65) | normal | nein | **`#444444`** |
| Navigation | 13 px | 600 | — | normal | nein | `#3E4018` |
| Button | 16 px | 400 | normal | normal | nein | `#FFFFFF` |
| Karten-H2 (Ergebnisliste) | 16 px | 600 | 24 px | normal | nein | `#3E4018` |
| Kachel-Überschrift | 24 px | 600 | 1.4 em | normal | **ja** | `#FFFFFF` |
| Kachel-Unterzeile | 16 px | 400 | 28 px | normal | nein | `#FFFFFF` |
| Hero-Textplatte (Start) | 60 px | 600 | normal | normal | **ja** | `#FFFFFF` |
| Hero-Textplatte (Unterseite) | 35 px | 600 | normal | normal | **ja** | `#3E4018` auf `#F3ECE7` |
| Preis in Ergebniskarte | 15 px | 600 | — | 0 px | nein | `#3E4018` |
| Ortszeile in Karte | 13 px | 400 | — | normal | nein | `#777777` |

**Abweichungen von den Vorabwerten:**

- H1 stimmt (28 px / 600 / uppercase / Orange). ✔
- **H2 weicht ab:** gemessen **28 px, Gewicht 600, uppercase, Farbe `#FF6F00`** —
  nicht 24 px / 700 / gemischt / `#313131`. H1 und H2 sind auf dieser Seite
  typografisch **identisch**. Die Regel lautet wörtlich
  `#top #wrap_all .all_colors h1, …h2 { font-size:28px; line-height:1.4em;
  font-weight:600; text-transform:uppercase }`. Der Vorabwert 24 px / 700 /
  `#313131` gehört zu einer Sonderseite (Geolagen-Template mit
  `font-size:24px; text-transform:uppercase; color:#3E4018`), nicht zur
  Regelseite.
- Body 16 px stimmt ✔ — mit der Ergänzung, dass die Zeilenhöhe **1.65**
  (26.4 px) ist, was den ruhigen Textsatz ausmacht.
- Laufweite: Versalüberschriften tragen **1 px auf 28 px ≈ 0.036 em** — passt
  in den Projektkorridor 0.02–0.06 em aus `CLAUDE.md`.

**Regel für den Nachbau:** eine einzige Versal-Überschriftenstufe (28 px / 600 /
1 px Sperrung / Orange) trägt Hero, Sektions- und Bandüberschriften. Die
Hierarchie darunter kippt bewusst auf gemischte Schreibung und Grau (H3 18 px,
H4 16 px versal grau). Kein Größensprung auf 40 px oder mehr — die Wirkung
kommt aus Versalien, Sperrung und Orange, nicht aus Schriftgröße.

## 3. Raster, Container, Abstände

Gemessene Werte, 1440 px Viewport.

| Größe | Wert |
| ----- | ---- |
| **Container max.** | **1310 px** (`.responsive .container { max-width: 1310px }`) |
| Container-Breite | `90%` der Bühne; gemessen **1224 px** bei 1440 px Viewport |
| Container-Innenabstand | `0 50px` im Grundraster; auf 0 gesetzt, wo Sektionen volle Breite tragen |
| Header-Container | **85 %** der Bühne (`.av_header_stretch .container`) — breiter als der Inhalt |
| Ergebnisliste (Vollbreite) | `max-width: 1470px`, `padding: 0 50px` |
| Spaltenabstand (Grundraster) | 50 px (`.units { margin-left: 50px }`) |
| Schmale Inhaltsspalte | 70 % der Containerbreite |

### Breakpoints

Die tragenden drei, absteigend zu lesen:

| Breite | Bedeutung |
| ------ | --------- |
| **≤ 1400 px** | Hero schrumpft (Start 750 → 650 px), Split-Innenabstände 18 % → 9 % |
| **≤ 1100 / 1050 px** | Hero 650 → 500 px, Kachelraster bricht |
| **≤ 989 px** | **Tablet-Bruch** — Spalten werden 100 % breit und stapeln (`av-break-at-tablet`); Filterleiste 3 → 2 Spalten |
| **≤ 767 px** | **Mobil** — Splits stapeln vollständig, Kacheln einspaltig, Karte 400 px hoch |
| **≤ 480 px** | Feinjustage: Hero 300 px, Hero-Text 20 px |

Zwischen 768 und 989 px gilt ein fester Container von **782 px**.

### Vertikale Sektionsabstände

Die Seite arbeitet **nicht** mit einem globalen Sektions-Padding — jede Sektion
setzt ihr eigenes. Die wiederkehrenden Werte:

| Kontext | Abstand |
| ------- | ------- |
| Großes Sektionspaar | `margin: 80px 0` **plus** `padding: 80px 0` |
| Split-Zelle innen | `padding: 50px 0` vertikal, 18 % horizontal (≥1400 px) bzw. 9 % (<1400 px) |
| Karte in Ergebnisliste, Abstand unten | 50 px |
| Kachelraster, Zeilenabstand | 1 % der Containerbreite (`margin: 1% 1%`) |
| Kartenbox (Objektbox) unten | 55 px |
| Trennlinie unter Kartentitel | `padding-bottom: 15px`, dann 1 px `#DFDFDF` |

**Für den Nachbau:** eine Skala `50 / 80 px` deckt praktisch alle vertikalen
Sektionsabstände ab; auf Mobil halbieren sich diese Werte durch die
Stapelregeln von selbst.

### Radien und Schatten

| Element | Wert |
| ------- | ---- |
| **Buttons** | `border-radius: 0` — **überall eckig**, das ist prägend |
| Karten, Kacheln, Bilder | `border-radius: 0` |
| Kreis-Elemente (Icon-Kreise, Pins) | `border-radius: 100%` / `200px` |
| Pill-Umschalter (neue Variante) | `border-radius: 100px` |
| Objektkarte | `box-shadow: 0 0 3px 0 rgba(0,0,0,0.18)` — sehr flach |
| Ergebnisliste (Scrollspalte) | `box-shadow: 4px 0 10px 0 rgba(0,0,0,0.4)` — nach rechts, trennt von der Karte |
| Filterleiste | `box-shadow: 0 4px 10px 0 rgba(0,0,0,0.4)` — nach unten |
| Weicher Kastenschatten | `box-shadow: 0 0 15px 2px #EBE8EB` |

Eckig plus flacher Schatten. Keine abgerundeten Karten, keine tiefen Schatten.

### Buttonmaße (gemessen)

| Eigenschaft | Wert |
| ----------- | ---- |
| Padding | **15 px / 22 px** |
| Höhe (gemessen) | **50 px** |
| Schriftgröße | 16 px, Gewicht 400, gemischte Schreibung |
| Radius | 0 |
| Grund (primär) | `#FF6F00`, Text `#FFFFFF` |
| Grund (auf Bild/Oliv) | `#FFFFFF`, Text `#3E4018` |
| **Hover / Fokus** | Grund **`#3E4018`**, Text `#FFFFFF`, kein Unterstrich |
| Umschalt-Button | `padding: 12px 20px`, Höhe **42 px** |

## 4. Verhalten

| Verhalten | Gemessener Wert |
| --------- | --------------- |
| **Header** | `position: fixed`, **Höhe 90 px**, Grund `#F3ECE7`, dazu `backdrop-filter: blur(3px)`. Über dem Hero läuft er transparent, weil das Hero-Bild negativ hochgezogen wird. Er **schrumpft nicht** beim Scrollen. |
| Logo | 244 × 90 px Rahmen, `padding: 23px 0` — das setzt die 90 px Headerhöhe |
| Navigation | 13 px / 600, `padding: 0 13px`; Hover **volles Feld** `#3E4018` mit weißer Schrift, nicht nur Textfarbwechsel |
| **Standard-Übergang** | **`0.273 s ease-in-out`** — der charakteristische Wert der Seite |
| Kachel-Schleier | **`transition: 1s`** — bewusst langsam, Schwarz → Oliv |
| Listen/Karten-Umschaltung | `transition: 1s` auf Breite |
| Ein-/Ausfahren der Liste | `2 s`, `ease-in-out`, `animation-delay: 10s` |
| Bildzoom | `transition: background-image 0.5s linear` |
| Sonstige Zustände | `0.4 s` an Pill-Buttons |
| **Fokusring** | `border: 4px solid #FF6F00` an Kacheln und Ergebniskarten; Formularfelder `border: 1px solid #FF6F00` mit Grund `#F1F1F1` |
| Fokus auf Buttons | Grund `#3E4018`, weiß — identisch zum Hover |
| Logo-Fokus | `opacity: 0.5` |
| Quick-Action-Leiste | rechts fixiert, vertikal mittig |

**Kernaussage zum Bewegungsbild:** zwei Geschwindigkeiten. Alles Funktionale
(Buttons, Links, Zustände) läuft in **0.273 s**; alles Atmosphärische
(Bildschleier, Layout-Umschaltung) in **1 s**. Wer das mischt, verliert den
Charakter.

## 5. Die zwölf Muster

Maße gemessen bei 1440 px, sofern nicht anders angegeben.

### 5.1 Header

- Fixiert, **90 px** hoch, Grund `#F3ECE7`, `backdrop-filter: blur(3px)`.
- Container **85 %** der Bühne — breiter als der Inhaltscontainer (90 %/1310 px),
  Logo und Nav laufen also weiter außen.
- Logo links (Rahmen 244 × 90 px, `padding: 23px 0`), Hauptnavigation rechts,
  ganz rechts ein **abgesetztes CTA-Feld in Orange** über die volle Headerhöhe.
- Nav-Elemente 13 px / 600, `padding: 0 13px`, gemischte Schreibung (nicht versal
  — im Gegensatz zu den Überschriften).
- Hover/Fokus: **ganzes Nav-Feld** wird `#3E4018` mit weißer Schrift.
- Kein Schrumpfen beim Scrollen. Unter 989 px Burger-Menü.

### 5.2 Hero

- Startseite: **750 px** hoch (≥1400 px), 650 px unter 1400 px, 500 px unter
  1100 px, 300 px unter 767 px.
- Unterseiten: **550 px**, gestuft 450 → 350 px → auto.
- Aufbau: Bildschicht mit `background: #000`, Bild `object-fit: cover` und
  `opacity: 0.8` (Start) bzw. `0.6` (Unterseiten). Darüber eine
  Inhaltsschicht, die per **negativem `margin-top` in exakter Hero-Höhe**
  hochgezogen wird (`margin-top: -750px; height: 750px`) und vertikal mittig
  ausrichtet.
- Startseite: Text als **freistehende Versalzeile**, 60 px / 600 / weiß, zentriert,
  `padding: 10px 20px`, ohne Kasten. Buttons 20 px darunter.
- Unterseiten: Text als **Platte auf `#F3ECE7`**, 35 px / 600 / versal /
  `#3E4018`, `padding: 10px 20px`, linksbündig.
- Mobil (<767 px) kippt das Muster: statt Overlay ein **eigenes Olivband**
  (`background: #3E4018`) unter dem Bild, Text 20 px, zentriert, weiß.

### 5.3 Oranges Band

- Vollbreites Band, Grund **`#FF6F00`**, keine Radien, keine Ränder.
- Zweiteilig: links die Versalüberschrift (28 px / 600 / weiß, zweizeilig
  umbrechend), rechts eine Kennzahl mit Label.
- Sitzt direkt unter dem Hero, ohne Zwischenabstand — das Band schließt die
  Bildschicht ab.

### 5.4 Intro

- Weiße Sektion, Textspalte auf **70 %** der Containerbreite.
- Versalüberschrift 28 px / 600 / Orange, darunter Fließtext 16 px / 1.65.
- Kein Rahmen, kein Schatten — reine Weißfläche als Atempause zwischen den
  farbigen Bändern.

### 5.5 Dreier-Kacheln

Das prägendste Muster der Seite.

| Eigenschaft | Wert |
| ----------- | ---- |
| Container | volle Breite (`max-width: 100%`, `padding: 0`) |
| Spaltenbreite | **31.333 %**, Abstand **1 % rundum** (`margin: 1% 1%`) |
| Höhe | **375 px** (Grundwert; 350 px in einer Variante) |
| Bild | Hintergrundbild, `overflow: hidden` |
| Schleier (Ruhe) | `::before` mit `rgba(0, 0, 0, 0.65)`, volle Fläche |
| Schleier (Hover) | `rgba(62, 64, 24, 0.4)` — **Schwarz weicht Oliv und wird heller** |
| Übergang | **`1s`** in beide Richtungen |
| Überschrift | 24 px / 600 / **versal** / weiß, vertikal mittig (`display: table-cell`) |
| Unterzeile | 16 px / Zeilenhöhe 28 px / weiß, `padding: 0 7%` |
| Fokus | `border: 4px solid #FF6F00` |
| Silbentrennung | `hyphens: auto` — nötig bei langen Versalwörtern |

Die vertikale Zentrierung läuft über `display: table` / `table-cell`. Im
Nachbau ist das ein Flex-Container mit `align-items: center`.

### 5.6 Kennzahlen-Kreise

- Kreise über `border-radius: 200px` (bzw. `100%`), **40 px** Durchmesser in der
  kleinen Variante, `border: 2px solid #3E4018` auf `background: #3E4018`.
- Das Icon sitzt **halb über dem Kreisrand** (`margin-top: -7px`, `left: -7px`,
  weiß), der Kreis selbst überlappt den Textkasten nach oben (`top: -3px`).
- Der Textblock darunter zieht sich mit **`margin-top: -20px`** unter den Kreis —
  so entsteht der halb eingesenkte Kreis über der Karte.
- Zahl/Titel 21 px / 600 / versal / `#3E4018`, Unterzeile 14 px / Zeilenhöhe
  1.65.
- Umrahmt von `box-shadow: 0 0 15px 2px #EBE8EB` auf weißem Grund.

### 5.7 Split-Bewertung (Bild/Text nebeneinander)

| Eigenschaft | Wert |
| ----------- | ---- |
| Grund | **`#3E4018`**, Text weiß (Variante: `#6A6A6A`) |
| Aufbau | zwei Zellen, eine trägt Text, eine das Bild |
| Zellenpadding | `50px 0` vertikal; horizontal **18 %** außen / **3 %** innen (≥1400 px), **9 %** / 3 % darunter |
| **Trennstreifen** | `::before` an der ersten Zelle: **20 px breit**, volle Höhe, `rgba(255,255,255,0.6)`, an der Kante zwischen den Zellen — das optische Erkennungsmerkmal |
| Überschrift | 28 px / 600 / versal / **weiß** (nicht orange, da auf Oliv) |
| Button | weiß mit `#3E4018` Text und weißem Rand — Umkehrung des Normalbuttons |
| `.reverse` | spiegelt die Innenabstände und verschiebt den Streifen um `-20px` |
| Mobil (<767 px) | Zellen stapeln, jede min. **400 px** hoch (250 px unter 480 px); der Streifen kippt in die Waagerechte: 100 % breit, **20 px hoch** |

### 5.8 Split-Kaffee

Dieselbe Mechanik wie 5.7 mit `.reverse`: Bild und Text tauschen die Seite, die
Innenabstände spiegeln (`padding-left: 3%` / `padding-right: 18%`), der
Trennstreifen wandert um `-20px`. Zusätzlich existiert eine **graue Variante**
(`.grey`) mit Grund `#6A6A6A`; dort trägt der weiße Button die Textfarbe
`#6A6A6A` bzw. `#222`.

Die Wechselwirkung ist das Muster: aufeinanderfolgende Splits alternieren
zwischen Normal und `.reverse` und zwischen Oliv und Grau.

### 5.9 Ratgeber-Dreier

- Drei Karten in einer Reihe, `av-break-at-tablet` → einspaltig ab 989 px, dort
  je 40 px Abstand.
- Bild oben, dann Überschrift, Text, Button.
- **Überschrift 17 px, `min-height: 46px`** — hält die Grundlinien der drei
  Karten bündig, auch wenn eine Überschrift einzeilig bleibt.
- **Text `min-height`/`height: 182px` mit `-webkit-line-clamp: 7`** — harte
  Kürzung auf 7 Zeilen mit Auslassungspunkten. Das ist der Trick, der die drei
  Karten exakt gleich hoch macht.
- Button darunter zentriert (`display: table; margin: 0 auto`).
- Mobil verfallen alle `min-height`-Werte auf `auto`, Text zentriert,
  Bild `margin: 0 auto 30px; padding-bottom: 30px`.

**Zum Nachbau:** die Zeilenbegrenzung ist Absicht, aber sie verliert Inhalt.
In v4 gilt „kein Inhaltsverlust" — dort statt `line-clamp` besser echte
Anrisstexte mit gleicher Länge setzen oder die Karten per Grid gleich hoch
ziehen (`grid-auto-rows: 1fr`).

### 5.10 Olivgrünes Such-Band („Suchauftrag")

- Weiße Karte auf `box-shadow: 0 0 15px 2px #EBE8EB`, zentriert.
- Oben ein **40 px Kreis** in `#3E4018` (`border: 2px solid #3E4018`,
  `border-radius: 200px`), der halb über die Kartenkante ragt; darin ein weißes
  Lupen-Icon (`margin-left: 50%`, `top: -7px`, `left: -7px`).
- Titelzeile **21 px / 600 / versal / `#3E4018`**, `margin-top: -20px`,
  `padding: 0 22px`, `margin-bottom: 15px`.
- Unterzeile 14 px, Zeilenhöhe **1.65 em**, Breite **80 %**, zentriert.
- Button `#3E4018`, weiß, `padding: 15px 22px`, 16 px, Radius 0,
  `margin-bottom: 25px`.

### 5.11 Team-Karussell

- Horizontaler Slider, Bahn **140 px** hoch, **90 %** Breite, zentriert.
- Bilder `width: 80%`, **`height: 200px`**, `object-fit: contain`.
- Pfeile: 40 × 60 px, `font-size: 23px`, weiß, absolut positioniert,
  `top: 50%`, `margin: -30px 15px 0`.
- Punkte-Navigation: `border-width: 0`, `border-radius: 0` (**eckige Punkte**),
  `margin: 0 5px`, aktiv/Hover `#3E4018`, Abstand nach oben 10 px.
- Kacheln je **33 %** breit (≥ Tablet), **50 %** darunter.

### 5.12 Quick-Action-Leiste

- Rechts am Rand **fixiert**, vertikal mittig, gestapelte Felder (Kontakt,
  Bewertung, Ratgeber, Suche, Login).
- Jedes Feld: Icon oben, Kurzlabel darunter, eckig, Trennkanten zwischen den
  Feldern.
- Das unterste Feld ist in **`#FF6F00`** abgesetzt.
- Auf Mobil wandert das Muster nach unten: ein vollbreites Band
  (`.pd_…-mobilebanner`) mit `background: #FF6F00`, Button `width: 100%`,
  `transition: 0.273s all ease-in-out`, Hover **`#323414`** (abgedunkeltes Oliv).
- Ebenfalls fixiert: der Cookie-Einstellungs-Knopf unten links (`left: 35px`,
  `border-radius: 100%`, `box-shadow: 0 0 15px 0 rgba(0,0,0,0.3)`,
  Grund = Primärfarbe, weißer 2-px-Innenring) — auf Mobil `bottom: 80px`.

## 6. Zusammengefasste Tokenliste für v4

```
/* Farbe */
--olive:        #3E4018;   --olive-dark:  #1C2006;   --olive-stripe: #5F623A;
--orange:       #FF6F00;   --orange-dark: #323414;   /* Hover-Gegenfarbe */
--beige:        #F3ECE7;
--ink:          #313131;   --body:        #444444;
--muted:        #525252;   --meta:        #777777;
--grey-band:    #6A6A6A;
--line:         #E1E1E1;   --line-card:   #DFDFDF;

/* Typografie — Montserrat 300/400/500/600/700 */
--h1:  28px/1.4  600 uppercase 0.036em   /* = 1px auf 28px */
--h2:  28px/1.4  600 uppercase 0.036em   /* identisch zu H1 */
--h3:  18px/1.6  600 none
--h4:  16px/1.5  600 uppercase
--body-text: 16px/1.65 400
--nav: 13px 600 none

/* Maß */
--container-max: 1310px;   --container-w: 90%;   --header-container: 85%;
--list-max:      1470px;   --gutter: 50px;
--header-h: 90px;
--space-section: 80px;     --space-block: 50px;

/* Form */
--radius: 0;               --radius-round: 100%;   --radius-pill: 100px;
--btn-pad: 15px 22px;      --btn-h: 50px;
--shadow-card: 0 0 3px 0 rgba(0,0,0,.18);
--shadow-soft: 0 0 15px 2px #EBE8EB;
--shadow-rail: 4px 0 10px 0 rgba(0,0,0,.4);

/* Bewegung */
--t-ui:  .273s ease-in-out;   /* Buttons, Links, Zustände */
--t-mood: 1s;                 /* Bildschleier, Layoutwechsel */
--focus: 4px solid #FF6F00;

/* Breakpoints */
1400px · 1100px · 989px (Tablet-Bruch) · 767px (Mobil) · 480px
```

## 7. Was die Gestaltungssprache ausmacht

Fünf Entscheidungen tragen den Charakter — wer sie einhält, trifft den Ton
auch ohne die Originalseite:

1. **Alles ist eckig.** `border-radius: 0` an Buttons, Karten, Bildern, sogar an
   den Slider-Punkten. Rund ist ausschließlich, was semantisch ein Kreis ist.
2. **Eine Überschriftenstufe trägt alles.** 28 px, Gewicht 600, versal, 1 px
   gesperrt, Orange — für Hero, Sektion und Band gleichermaßen. Die Wirkung
   kommt aus Versalien und Farbe, nicht aus Größe.
3. **Vollbreite Farbbänder rhythmisieren.** Weiß (Ruhe) → Orange (Zäsur) →
   Oliv (Substanz) → Weiß. Ein Band füllt die Bühne randlos.
4. **Zwei Geschwindigkeiten.** Funktion in 0.273 s, Atmosphäre in 1 s.
5. **Overlays statt Rahmen.** Bilder werden über Schleier und Deckkraft
   eingebunden (0.6/0.8 auf Schwarz, 0.65 → Oliv 0.4 im Hover), nicht über
   Rahmen oder Schatten.
