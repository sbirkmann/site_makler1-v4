# REFERENCE-SEARCH.md — Suchergebnisseite als Gestaltungsreferenz

Detailanalyse der Immobilien-Suchergebnisseite von `https://dondorf.de/kaufen/`.

> **Rechtlicher Rahmen.** Nur Gestaltungsmerkmale: Maße, Farben, Raster,
> Zustände, Reihenfolge der Bedienelemente. **Keine** Objektdaten, Bilder,
> Texte, Preise, Adressen oder Namen. Wo unten Feldnamen stehen, sind das
> generische Filterkategorien (Erwerbsart, Objektart, Status, Preis, Zimmer),
> keine übernommenen Inhalte.

Grundlagen und gemeinsame Tokens stehen in `REFERENCE-DONDORF.md`; hier nur
das, was die Suche zusätzlich ausmacht.

## 0. Methode

Alle Zahlen sind **gemessene** `getComputedStyle`- und
`getBoundingClientRect`-Werte, erhoben mit Playwright (Chromium, realistischer
Chrome-UA) bei **1440 × 1000 px** Viewport auf der Live-Seite. Die
Cloudflare-Challenge trat mit diesem User-Agent nicht auf. Ergänzt um die
Deklarationen aus den beiden Such-Stylesheets für Zustände, die sich nicht
statisch messen lassen (Hover, Ein-/Ausblendungen, Breakpoints).

Screenshots: `design-review/reference/dondorf-suche-{360,768,1280,1920}.png`.

## 1. Gesamtaufbau

Bei 1440 px, gemessen:

```
┌─ Header (fix, 90 px) ────────────────────────────────────────────┐
├─ Filterleiste  1440 × 105 px, z-index 100 ───────────────────────┤
├──────────────────────────────┬───────────────────────────────────┤
│ Ergebnisliste                │ Kartenfläche                      │
│ 576 px (40 %), z-index 90    │ 864 px (60 %)                     │
│ eigener Scrollcontainer      │ ganze Resthöhe                    │
│ box-shadow 4px 0 10px .4     │                                   │
└──────────────────────────────┴───────────────────────────────────┘
    Gesamtbühne: 1440 × 910 px, overflow: hidden, position: relative
```

| Maß | Wert (gemessen) |
| --- | --------------- |
| Bühne gesamt | **1440 × 910 px**, `position: relative`, `overflow: hidden` |
| Filterleiste | **1440 × 105 px**, `z-index: 100`, Grund **`#FFFFFF`**, `padding: 7px 0` |
| Ergebnisliste | **576 px** breit (= **40 %**), `float: left`, `z-index: 90` |
| Kartenfläche | **864 px** breit (= **60 %**), `float: right`, `z-index: 80` |
| Höhe beider Spalten | **`calc(100% - 58px)`**, gemessen **804 px** — die 58 px sind die Höhe der Umschaltzeile |
| Trennkante | `box-shadow: 4px 0 10px 0 rgba(0,0,0,0.4)` an der Liste nach rechts |

Die Kanten sind hart: **keine Radien, kein Abstand zwischen Liste und Karte**.
Die Schattenkante ersetzt den Rahmen.

## 2. Filterleiste

### Felder und Reihenfolge (gemessen)

Ein **`display: flex; flex-wrap: wrap`**-Raster auf weißem Grund. Sechs Zellen,
jede **`flex: 0 0 33%`**, gemessen **475 px** breit — also **drei Spalten,
zwei Zeilen**.

| # | Zelle | Steuerelement | Zeile |
| - | ----- | ------------- | ----- |
| 1 | Erwerbsart | `<select>` | 1 |
| 2 | Objektart | `<select>` | 1 |
| 3 | Status | `<select>` | 1 |
| 4 | Preis (von/bis) | 2 × `<input>` in verschachteltem `<ul>` | 2 |
| 5 | Zimmer (von/bis) | 2 × `<input>` in verschachteltem `<ul>` | 2 |
| 6 | **Listen-/Kartenumschalter** | zwei Buttons | 2 |

Die Von/Bis-Paare sitzen als **verschachtelte Liste** in einer Zelle: jedes
Kind `width: 49%`, das erste ohne linken, das letzte ohne rechten Rand
(`margin-right: -4px` schließt die Inline-Block-Lücke).

### Feldgestaltung

| Eigenschaft | Wert |
| ----------- | ---- |
| Zellrahmen | `border-right: 1px solid #FFFFFF`, `border-left: 1px solid #E7E7E7` — Doppelkante, die als feine Rille wirkt |
| Steuerelement | `background: transparent`, `border-color: transparent`, `padding-left: 18px`, **`font-size: 13px`** |
| Eingabefeld-Mindesthöhe | 44 px (Textfeld-Variante), 50 px in der Kompaktleiste |
| Radius | **0** |
| Platzhalter | `opacity: 1` — voll sichtbar, keine ausgegraute Andeutung |
| **Fokus** | `border: 1px solid #FF6F00`, `background: #F1F1F1` |
| Leiste gesamt | `padding: 7px 0`, Grund weiß, ursprünglich `#F2F2F2` mit `box-shadow: 0 4px 10px 0 rgba(0,0,0,0.4)` nach unten |

Die Felder haben **keine sichtbaren eigenen Rahmen** — nur die Zellkanten
gliedern. Erst der Fokus bringt einen orangen 1-px-Rahmen.

### Sticky-Verhalten

Die Leiste ist `position: relative` mit `top: 0` und **`z-index: 100`** — sie
sitzt fest über der Bühne, weil die Bühne selbst `overflow: hidden` hat und
nicht scrollt. Gescrollt wird ausschließlich **innerhalb** der Ergebnisliste.
Der Effekt entspricht einem Sticky-Header, ohne dass `position: sticky` nötig
ist.

### Listen-/Kartenumschalter

| Eigenschaft | Wert (gemessen) |
| ----------- | --------------- |
| Wrapper | **474 px** breit, zwei Buttons je **237 px** |
| Buttonhöhe | **42 px**, `padding: 12px 20px` |
| Schrift | 13.3 px, Gewicht 400 |
| Grund (inaktiv) | `#FFFFFF`, `border: 1px solid #D8D8D8`, Text schwarz |
| **Grund (aktiv)** | **`#6A6A6A`**, Text `#FFFFFF` |
| Radius | **0** — die Pill-Rundung (`100px`) des Plugins ist überschrieben |
| Fokus | `background: #3E4018`, Text weiß |

Zwei gleich breite, direkt aneinanderstoßende Rechtecke — der aktive ist grau
gefüllt.

**Alternative Variante** (neuere Filter-Ansicht, im Stylesheet vorhanden):
Pill-Umschalter, `background: #F7F7F7`, `padding: 7px`, `border-radius: 100px`,
`gap: 10px`; Buttons `#E1E1E1` / `border-radius: 100px` /
`padding: 13px 30px` / 16 px / 600, aktiv `#3E4018` weiß, `transition: .4s`.

## 3. Zweispaltiges Layout

### Linke Spalte — Ergebnisliste mit eigenem Scrollcontainer

| Eigenschaft | Wert |
| ----------- | ---- |
| Breite | **576 px** = 40 % (Karte 60 %) |
| Höhe | `calc(100% - 58px)`, gemessen 804 px |
| Scrollen | `overflow: auto` auf der `<ul>`, `height: 100%` — **nur dieser Kasten scrollt**, die Seite nicht |
| Schatten | `4px 0 10px 0 rgba(0,0,0,0.4)` nach rechts |
| Übergang bei Breitenwechsel | `transition: 1s` |
| Grund beim Ein-/Ausfahren | `#FFFFFF` |

### Rechte Spalte — fixierte Karte

| Eigenschaft | Wert |
| ----------- | ---- |
| Breite | **864 px** = 60 % |
| Höhe | volle Resthöhe, `position: relative`, `z-index: 80` |
| Verhalten | bleibt stehen, während links gescrollt wird |
| Übergang | `transition: 1s` bei Layoutwechsel |
| Vollbreite („nur Karte") | `width: 100%`, Höhe **600 px** (500 px unter 767 px, 400 px im Kompaktmodus) |

### Ein- und Ausfahren

Die Liste startet mit **`width: 0`** und fährt ein:
`animation-duration: 2s`, `ease-in-out`, **`animation-delay: 10s`**,
`animation-fill-mode: forwards`; die Karte gegenläufig mit 2.2 s.
Der Zwischenzustand ist **40 % / 60 %**.

Eine **Lasche** am rechten Rand der Liste holt sie zurück:
`45 × 50 px`, weiß, `border-radius: 0 10px 10px 0` (nur rechts),
`right: -45px`, `top: 45%`, `box-shadow: 5px 0 7px 0 rgba(0,0,0,0.2)`.
Das Icon darin ruckelt einmalig
(`animation: shake .82s cubic-bezier(.36,.07,.19,.97)`, `delay: 10s`,
Farbe `#777`).

## 4. Objektkarte in der Ergebnisliste

Zwei Darstellungsformen, je nach Modus.

### 4a. Overlay-Karte (neben der Karte, gemessen)

Bild füllt die Kachel, **alle Angaben liegen als weißer Text darauf**.

| Eigenschaft | Wert (gemessen) |
| ----------- | --------------- |
| Kachelgröße | **276 × 230 px**, `margin: 5.75px` (≈1 %) |
| Breite | **48 %** der Spalte, zweispaltig |
| Bild | Hintergrundbild, `background-size: cover`, `background-position: center`, `transition: background-image .5s linear` |
| Klickfläche | `width: 88%`, `position: absolute` |
| Titel | **16 px / 600 / weiß**, einzeilig mit Auslassungspunkten, `text-shadow: 0 2px 2px rgba(0,0,0,0.8)` |
| Ortszeile | **12 px / versal / weiß**, `margin-top: 20px`, gleicher Textschatten |
| Preis | **24 px / 600 / weiß**, `margin-top: 92px`, Textschatten |
| Preis-Label darüber | 12 px, `line-height: 12px`, **versal**, `letter-spacing: 0.5px`, Gewicht 400 |
| **Pin-Kreis** | **30 × 30 px**, `border-radius: 50%`, in **Orange** (`#FF6F00`), rechts unten, `margin-top: 80px`, weißes Icon 20 px |
| Statusbanner | `background: #FF6F00`, weiß, **18 px**, `letter-spacing: 1px`, `padding: 8px 33px`, versal, `margin-top: 92px`, links |
| **Fokus** | `border: 4px solid #FF6F00` am Bild |

Der Textschatten `0 2px 2px rgba(0,0,0,0.8)` ist das, was die weiße Schrift auf
beliebigen Fotos lesbar hält — ohne ihn bricht das Muster zusammen.

### 4b. Rasterkarte (Vollbreiten-Liste)

Ohne Karte daneben wechselt die Liste auf ein dreispaltiges Raster mit
**klassischen Karten unter dem Bild** — die Reihenfolge wird per Flexbox
`order` umgestellt.

| Eigenschaft | Wert |
| ----------- | ---- |
| Raster | `max-width: 1470px`, `padding: 0 50px`, `display: flex; flex-wrap: wrap` |
| Karte | **31.33 %** breit, `display: flex; flex-direction: column`, `margin-bottom: 50px` |
| Bild (`order: 1`) | `min-height: 300px`, `position: relative` |
| Ortszeile (`order: 2`) | `#777777`, `margin-top: 5px` |
| Titel (`order: 3`) | **16 px / Zeilenhöhe 24 px / `#3E4018`**, `height: 46px`, `-webkit-line-clamp: 2`, `padding-bottom: 15px`, `border-bottom: 1px solid #DFDFDF`, `min-height: 52px` |
| Preis (`order: 4`) | **15 px / 600 / `#3E4018`**, **rechtsbündig**, `letter-spacing: 0`, gemischte Schreibung |
| Status (`order: 4`) | **14 px / 600 / `#FF6F00`**, Grund **transparent**, rechtsbündig |
| Pin | ausgeblendet (`display: none`) |
| Mobil | `width: 100%`, `margin-bottom: 50px` |

Der Kontrast der beiden Formen ist das Prinzip: **auf der Karte weiße Schrift
im Bild, im Raster dunkle Schrift unter dem Bild.**

### Klassische Objektbox (Detail-/Archivraster)

| Eigenschaft | Wert |
| ----------- | ---- |
| Spalte | **33.33 %**, `margin-top: 1.6em`, `margin-bottom: 55px` |
| Innenkasten | `margin: 0 15px`, `min-height: 655px`, Grund weiß, `box-shadow: 0 0 3px 0 rgba(0,0,0,0.18)` |
| Bildbereich | **260 px** hoch, `overflow: hidden`; Bild `width: 175%`, `left: -40px`, `top: -40px`, `transform-origin: 175% 175%` (Ausschnittszoom) |
| Inhaltsbereich | `padding: 1em 2em 1.5em 2em` |
| Titel | 1.125 em, Zeilenhöhe 1.278 em, `min-height: 70px`, `margin-bottom: .95em` |
| Datentabelle | Zeilen `padding: 2% 0`, `border-bottom: 1px dashed rgba(0,0,0,0.2)`, links/rechts 50 %/50 % (mobil 43 %/57 %) |
| Fußbereich | `position: absolute`, `bottom: 30px`, `padding: 1em 2em 0 2em` |
| Preis | 24 px, Label 14 px |
| Detail-Button | `padding: .688em 1.388em`, `border-radius: 2px` |

Beachte: hier ist der Radius **2 px**, nicht 0 — der einzige Ort mit Rundung.

## 5. Kartendarstellung

### Marker und Cluster

| Element | Gestaltung |
| ------- | ---------- |
| **Einzel-Pin** | **oranger Tropfen** (`#FF6F00`), Breite **22 px**, `float: right` |
| **Cluster** | **dunkle Quadrate** mit zentrierter Zahl — eckig, passend zum Radius-0-Prinzip der Seite |
| Pin in der Listenkarte | 30 × 30 px Kreis, `#FF6F00`, weißes Icon 20 px |
| Info-Fenster (Hover/Klick) | Höhe **230 px** (`max-height: 230px`) |

### Info-Fenster

| Eigenschaft | Wert |
| ----------- | ---- |
| Breite (Desktop) | **340 px** |
| Aufbau | **zweispaltig**: links Bild **150 px**, `margin-right: 15px`; rechts Daten **150 px**, `line-height: 20px` |
| Bild | `width: 100%`, `min-height: 130px`, `object-fit: cover` (122 px auf kleinen Breiten) |
| Titel | **18 px / 600 / `#3E4018`**, einzeilig mit Auslassungspunkten (15 px in der Kompaktvariante) |
| Ortszeile | **13 px / 400 / `#777777`**, `margin-bottom: 15px` |
| Detail-Button | **`#FF6F00`**, `width: 100%`; **Hover `#3E4018`** |
| Mobil | einspaltig — Bild wird ausgeblendet (`display: none`), Daten 100 % |

### Ortssuchfeld

| Eigenschaft | Wert |
| ----------- | ---- |
| Position | `position: absolute`, `top: 10px`, `left: 15px`, `z-index: 5` — **auf der Karte schwebend** |
| Feld | **400 px** breit (300 px unter 1400 px), `padding: 10px`, **`border-radius: 20px`** |
| Rahmen | `1px solid #525252` |
| Fokus | `outline: none` (Rahmen übernimmt) |
| Position mobil | `top: 60px` bzw. `82px` — rutscht unter die gewachsene Filterleiste |

Das Pillenfeld ist die **einzige gerundete Eingabe** der ganzen Seite — dadurch
liest es sich als Karten-Werkzeug, nicht als Formularfeld.

### Kontext-Chip

| Eigenschaft | Wert (gemessen) |
| ----------- | --------------- |
| Position | `position: absolute`, **`top: 105px`**, `right: 0`, `z-index: 99` |
| Grund | **`#FF6F00`** |
| Padding | **`10px 20px`** |
| Breite | `max-width: 30%`, gemessen **418 × 51 px** |
| Schrift | **15 px / 400 / weiß, rechtsbündig, gemischte Schreibung** (`text-transform: none`) |
| Radius | 0 |
| Mobil | `top: 165px`, `width: 60%`, zentriert, einzeilig mit Auslassungspunkten (`line-clamp: 1`, `height: 31px`) |

Der Chip ist bewusst **nicht versal** — er benennt den aktiven Suchkontext, ist
also Zustandsanzeige, keine Überschrift. In einer Variante ist er weiß mit
`padding: 6px 25px` und olivfarbener Versalschrift 28 px.

### „Zum nächsten Treffer"-Hinweis

Erscheint mittig über der Karte, wenn im Ausschnitt nichts liegt:

| Eigenschaft | Wert |
| ----------- | ---- |
| Kasten | **400 px** breit, `padding: 20px`, zentriert über `top: 50%; left: 50%; transform: translate(-50%,-50%)` |
| Grund | `#FFFFFF`, `border-radius: 0` (Plugin-Standard 10 px ist überschrieben) |
| Schrift | 14 px, Zeilenhöhe 22 px, Gewicht 400 |
| Button | **`#3E4018`**, weiß, `padding: 15px 22px`, 16 px, `border-radius: 0` |

### Zoom und Home-Button

Standard-Kartensteuerung (Zoom +/−) rechts unten. Der **Home-Button** sitzt als
eigenes weißes Feld **auf der Trennkante zwischen Liste und Karte**, vertikal
mittig — dieselbe Position und Formensprache wie die Ausfahr-Lasche
(45 × 50 px, weiß, Schatten `5px 0 7px 0 rgba(0,0,0,0.2)`) und setzt den
Kartenausschnitt zurück.

### Ohne Karten-Einwilligung

Wird die Karte mangels Einwilligung nicht geladen, füllt ein **grauer Kasten**
mit Hinweistext und einem Button („Einstellungen") die Kartenfläche. Der Kasten
trägt links eine **olivfarbene Akzentkante**. Das ist für v4 direkt relevant:
`CLAUDE.md` verlangt, dass Kartendienste erst nach Einwilligung laden — dieser
Platzhalter ist das passende Muster (gleiche Fläche, gleiche Höhe, kein
Layoutsprung beim Nachladen).

## 6. Suchauftrag-Kachel

Sitzt **als erstes Element in der Ergebnisliste**, vor den Objektkarten, und
scrollt mit.

| Eigenschaft | Wert (gemessen) |
| ----------- | --------------- |
| Kasten | **536 × 270 px**, `min-height: 100px`, Grund weiß, zentriert |
| Schatten | **`0 0 15px 2px #EBE8EB`** — weich, farbig, kein Rahmen |
| Radius | 0 |
| **Kreis oben** | **40 × 40 px**, `border-radius: 200px`, `border: 2px solid #3E4018`, Grund **`#3E4018`**; ragt **über die Oberkante** (`top: -3px`) |
| Icon im Kreis | weiß, `margin-left: 50%`, `top: -7px`, `left: -7px` |
| Titel | **21 px / 600 / versal / `#3E4018`**, zentriert, **`margin-top: -20px`** (zieht sich unter den Kreis), `margin-bottom: 15px`, `padding: 0 22px` |
| Unterzeile | **14 px**, Zeilenhöhe **1.65 em**, Breite **80 %**, zentriert, Abstände 6 px |
| Button | **`#3E4018`**, weiß, `padding: 15px 22px`, **16 px**, `border-radius: 0`, `margin-bottom: 25px`; gemessen **181 × 49 px** |

Das Muster — halb eingesenkter Kreis über einer weichen weißen Karte — ist
identisch zu den Kennzahlen-Kreisen auf der Startseite (siehe
`REFERENCE-DONDORF.md` §5.6). Eine Formfamilie, zwei Einsätze.

## 7. Responsive Verhalten der Suche

| Breite | Verhalten |
| ------ | --------- |
| **≥ 1400 px** | 40/60-Split, Filter 3 Spalten, Ortssuchfeld 400 px, Chip `top: 105px` |
| **1100–1400 px** | Ortssuchfeld **300 px**, Chip `top: 115px`, Filterzellen bleiben 33 % |
| **989–1100 px** | Filter bricht auf **50 %**-Zellen (2 Spalten); Umschalter über volle Breite; Spaltenhöhe `calc(100% - 163px)` |
| **≤ 989 px** | Von/Bis-Paare 49 %, Umschalter `width: 100%` als eigener Block |
| **≤ 767 px** | **Split löst sich auf**: Karte `width: 100%`, Höhe **400 px**; Liste darunter `position: relative`, Karten `margin: 1% 0`, einspaltig; Chip `top: 165px`, `width: 60%`, zentriert; Ortssuchfeld `top: 60px` bzw. `82px`; Info-Fenster einspaltig ohne Bild |
| **≤ 480 px** | Filterzellen `flex: 100%`, Karte **500 px**, Statusbanner 13 px / `padding: 8px 18px` |

## 8. Konsequenzen für v4

`CLAUDE.md` verlangt: **die Suche muss ohne JavaScript bedienbar bleiben** —
Filter als echtes Formular mit URL-Parametern, Ergebnisliste serverseitig
gerendert. Die Referenz erfüllt das nicht (alles läuft über JS). Was sich
trotzdem übernehmen lässt und was nicht:

**Übernehmbar (reine Gestaltung):**

- Das 3-Spalten-Filterraster (`flex: 0 0 33%`) mit Von/Bis-Paaren zu 49 % — das
  funktioniert unverändert als `<form method="get">` mit `<select>`/`<input>`.
- Die rahmenlosen Felder mit Zellkanten (`#E7E7E7` links / `#FFFFFF` rechts)
  und dem orangen Fokusrahmen (`1px solid #FF6F00` auf `#F1F1F1`).
- 40/60-Split, harte Kanten, Schattenkante statt Rahmen.
- Beide Kartenformen (Overlay auf Bild / dunkler Text unter Bild) samt Maßen.
- Die Suchauftrag-Kachel mit halb eingesenktem Kreis.
- Der graue Karten-Platzhalter vor der Einwilligung — gleiche Fläche, kein
  Layoutsprung.

**Anzupassen:**

- Der Umschalter Liste/Karte muss ein Link mit URL-Parameter sein, kein
  JS-Button. Aktivzustand `#6A6A6A` weiß bleibt.
- Der eigene Scrollcontainer links darf **kein `overflow: hidden`** auf der
  Bühne erzwingen — sonst ist die Seite ohne JS unbenutzbar. Besser: Liste
  scrollt mit der Seite, Karte per `position: sticky` festgehalten. Das
  erzeugt dieselbe Wirkung mit weniger Bruchgefahr.
- `-webkit-line-clamp: 2` am Kartentitel verstößt gegen „kein Inhaltsverlust";
  stattdessen Titel voll setzen und Karten per `grid-auto-rows: 1fr` bündig
  halten.
- Der 10-Sekunden-Einfahr-Effekt der Liste (`animation-delay: 10s`) ist für ein
  Suchergebnis unbrauchbar — Liste sofort sichtbar rendern.
