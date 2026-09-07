# Design-Tokens – WohnWert Immobilien v4

Verbindliche Werte für alle Komponenten. Die Quelle steht in
`app/globals.css` unter `@theme` – Tailwind v4 braucht **keine**
`tailwind.config.ts`. Diese Datei erklärt die Werte und ihre Grenzen.

Gemessene Referenzwerte stehen in `REFERENCE-DONDORF.md`; wo WohnWert
abweicht, ist das in `DECISIONS.md` begründet.

## 1. Farbe

### Rollen

| Rolle | Token | Wert | Einsatz |
| --- | --- | --- | --- |
| Primär | `--color-primary-800` | `#3E4018` | Navigation, Kennzahlenband, Footer, Flächen |
| Akzent | `--color-accent-500` | `#FF6D00` | Akzentlinien, Ränder, Dekorflächen **ohne Text** |
| Akzent auf Weiß | `--color-accent-onwhite` | `#C85000` | jede orange Fläche, die **weiße Schrift** trägt |
| Fläche ruhig | `--color-surface-muted` | `#F3ECE7` | Abschnitte zwischen weißen Flächen |
| Text | `--color-ink` | `#313131` | Fließtext |
| Text zurückgenommen | `--color-ink-muted` | `#565655` | Beschreibungen, Sekundärtext |
| Linie | `--color-line` | `#E4E0D8` | Rahmen, Trennlinien |

Die vollen Skalen 50–950 liegen in `app/globals.css`.

### Kontrast – nachgerechnet, nicht geschätzt

| Kombination | Verhältnis | Bewertung |
| --- | --- | --- |
| `#313131` auf Weiß | 13,01 | AAA |
| `#565655` auf Weiß | 7,35 | AAA |
| `#313131` auf Beige `#F3ECE7` | 11,13 | AAA |
| Weiß auf Oliv `#3E4018` | 10,76 | AAA |
| Weiß auf `#C85000` | **4,56** | **AA** |
| Weiß auf `#FF6D00` | **2,82** | **fällt durch** |
| `#FF6D00` als Textfarbe auf Weiß | **2,82** | **fällt durch** |
| `#8A8878` auf Weiß | 3,58 | nur für großen Text |

**Zwei harte Regeln daraus:**

1. **Weiße Schrift auf Orange nur mit `--color-accent-onwhite`.**
   `#FF6D00` erreicht 2,82:1 – normaler Text braucht 4,5:1. Buttons,
   Bänder und der Header-CTA nutzen deshalb `#C85000`.
2. **Orange nie als Fließtextfarbe.** Für orange Überschriften gilt: Sie
   sind groß und fett genug (ab 24 px / 600), damit die 3:1-Schwelle für
   großen Text greift. Kleiner Text in Orange ist unzulässig – dort
   `--color-accent-700` (`#B84A00`, 5,23:1) verwenden.

**Keine Transparenz auf farbigen Flächen.** `opacity-80` auf weißem Text
über Orange drückt den Kontrast auf 2,85 und fällt durch. Text wird über
Größe und Laufweite zurückgenommen, nicht über Deckkraft.

## 2. Typografie

Montserrat durchgehend (`--font-sans` = `--font-display`), Schnitte 300–700.

| Klasse | Größe | Schnitt | Versal | Laufweite | Einsatz |
| --- | --- | --- | --- | --- | --- |
| `.hero-title` | clamp 1,625–2,875 rem | 600 | ja | 0,005 em | H1 im Bildhero |
| `.display-1` | clamp 1,75–3 rem | 600 | ja | 0,01 em | größte Überschrift ohne Bild |
| `.page-title` | clamp 1,375–1,875 rem | 600 | ja | 0,01 em | H1 der Inhaltsseiten, orange |
| `.display-2` | clamp 1,375–1,75 rem | 600 | ja | 0,01 em | Sektions-H2 |
| `.display-3` | clamp 1,125–1,375 rem | 600 | ja | 0,01 em | Karten-H3 |
| `.lead` | 1,125 rem | 300 | nein | – | Einleitungstext |
| `.eyebrow` | 0,75 rem | 600 | ja | 0,16 em | Rubrik über der Überschrift |
| Fließtext | 0,9375–1,0625 rem | 300–400 | nein | – | Zeilenhöhe 1,6–1,78 |

**Versalien ausschließlich per CSS** (`text-transform: uppercase`), nie im
Markup – Screenreader buchstabieren sonst.

**Zeilenlänge 45–75 Zeichen.** `.prose-editorial` begrenzt auf `68ch`.

Anders als die Referenz bleiben H1 und H2 unterschiedlich groß – siehe
`DECISIONS.md` E-09.

## 3. Raster und Abstände

| Token | Wert | Einsatz |
| --- | --- | --- |
| Container `wide`/`default` | max. 1552 px, Padding 16 px | Regelbreite |
| Container `narrow` | max. 68 rem | Lesespalten |
| `--header-height` | 5,5 rem (88 px) | Header, Sticky-Offsets |
| Sektionsabstand | `py-12 sm:py-16 lg:py-20` | vertikaler Rhythmus |

**Breakpoints:** Die Hauptnavigation erscheint erst ab `2xl` (1536 px).
Darunter übernimmt das Mobilmenü – bei 1280 px sprengten Logo, volle
Navigation und CTA sonst die Zeile.

## 4. Radien, Schatten, Bewegung

Kantig ist die Regel: `--radius-xs` (2 px) für Buttons und Flächen,
`--radius-md` (6 px) nur für Formularfelder. Nichts über 8 px.

Schatten sind flach und selten: `--shadow-subtle`, `--shadow-card`,
`--shadow-lift`, `--shadow-float`. Kein Schatten als Gestaltungsmittel auf
Flächen, die schon eine Farbkante haben.

**Zwei Geschwindigkeiten:** Funktionales (Hover, Fokus, Umschalter) in
200 ms; Atmosphärisches (Bildzoom, Scroll-Reveal) in 700 ms mit
`--ease-out-quint`. `prefers-reduced-motion` schaltet beides ab.

## 5. Rahmenfarben – eine Falle

Die Vorgabe `border-color: var(--color-line)` steht in **`@layer base`**.
Sie muss dort bleiben: Ungelayerte Regeln schlagen in Tailwind v4 jede
Utility-Klasse. Stand sie außerhalb, war `border-accent-500` site-weit
wirkungslos (siehe `DECISIONS.md` E-04).

## 6. Komponentenmuster

| Muster | Umsetzung |
| --- | --- |
| Bildhero | Foto, Verlauf `from-primary-950/85`, Rubrik + versale H1 in Weiß |
| Oranges Band | volle Breite, `--color-accent-onwhite`, versal, rechts eine Zahl |
| Kennzahlenband | Oliv, gleiche Zeilenstruktur je Kennzahl (Präfix/Zahl/Label) |
| Split-Sektion | halbes Bild, halbe Farbfläche, Text in Weiß |
| Karte/Kachel | Bild mit Verlauf, versaler Titel, orange Akzentlinie beim Hover |
| Button primär | `--color-accent-onwhite`, weiß, versal, 2 px Radius |
| Button outline | 2 px Rand in `--color-accent-onwhite`, füllt beim Hover |

## 7. Barrierefreiheit als Teil des Systems

- Genau eine `<h1>` je Seite
- Sichtbarer Fokus: 2 px Kontur, 2 px Abstand
- Touch-Ziele mindestens 44 px
- Alt-Texte beschreibend; dekorative Bilder `alt=""`
- Kein horizontales Scrollen von 360 bis 1920 px
