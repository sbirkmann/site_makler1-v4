# Fehlende Bilder

Alle aktuell eingesetzten Motive sind **Platzhalter von Unsplash** aus den
Beispieldaten. Für den Produktivbetrieb werden eigene Aufnahmen gebraucht:
Stockfotos sind als Maklermarke sofort erkennbar und schwächen die Glaubwürdigkeit.

Zieldateiname und Pfad stehen fest – das spätere Einsetzen ist ein Austausch
ohne Codeänderung.

| ID | Route | Position | Motiv | Format | Verhältnis | Stil | Alt-Text | Zieldatei | Prio |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IMG-001 | `/` | `Hero` | Zwei Personen des Teams, halbnah, leicht seitlich in einem hellen Kölner Altbaubüro mit bodentiefen Fenstern; Seitenlicht am späten Nachmittag, ruhige Mimik, Blick in die Kamera; linke Bildhälfte ruhig für die Headline. Kein Anzugklischee, keine verschränkten Arme, keine Hochglanzretusche | WebP 2560×1440 | 16:9 | dokumentarisch, warme Töne, geringe Tiefenschärfe | „Das Team von WohnWert Immobilien im Kölner Büro" | `public/images/hero/team-buero-koeln.webp` | P0 |
| IMG-002 | `/` | `ChoiceTiles` 1 | Wohnhaus im Rheinland von außen, Tageslicht, Straßenperspektive, keine Menschen | WebP 1600×1200 | 4:3 | ruhig, natürliche Farben | „Wohnhaus in Köln" | `public/images/kacheln/kaufen.webp` | P0 |
| IMG-003 | `/` | `ChoiceTiles` 2 | Bewohnter Innenraum einer Mietwohnung, hell, aufgeräumt aber nicht steril | WebP 1600×1200 | 4:3 | warm, bewohnt | „Wohnzimmer einer Mietwohnung" | `public/images/kacheln/mieten.webp` | P0 |
| IMG-004 | `/` | `ChoiceTiles` 3 | Schreibtischsituation mit Grundriss und Maßband, Ausschnitt Hände | WebP 1600×1200 | 4:3 | sachlich | „Unterlagen zur Immobilienbewertung" | `public/images/kacheln/bewerten.webp` | P0 |
| IMG-005 | `/` | `StatsCounter` Hintergrund | Rheinpanorama Köln aus erhöhter Position, blaue Stunde, Dom angeschnitten | WebP 2560×1200 | 21:9 | ruhig, dunkel genug für weiße Schrift | „Blick über Köln am Rhein" | `public/images/baender/koeln-rhein.webp` | P1 |
| IMG-006 | `/` | `OfficeInvite` | Kaffee auf dem Besprechungstisch im eigenen Büro, Ausschnitt, Tageslicht | WebP 1600×1600 | 1:1 | warm, nah | „Kaffee auf dem Besprechungstisch im Maklerbüro" | `public/images/buero/kaffee.webp` | P1 |
| IMG-007 | `/immobilien` | `PageHero` | Straßenzug mit Wohnbebauung im Rheinland, leicht erhöht | WebP 2560×1200 | 21:9 | dokumentarisch | „Wohnstraße im Rheinland" | `public/images/hero/immobilien.webp` | P1 |
| IMG-008 | `/immobilienbewertung` | Funnel-Hero | Beratungsgespräch am Tisch, zwei Personen, Unterlagen sichtbar, Gesichter angeschnitten | WebP 2000×1000 | 2:1 | dokumentarisch | „Beratungsgespräch zur Immobilienbewertung" | `public/images/hero/bewertung.webp` | P1 |
| IMG-009 | `/immobilie-verkaufen` | Funnel-Hero | Schlüsselübergabe vor einem Wohnhaus, Hände im Vordergrund | WebP 2000×1000 | 2:1 | dokumentarisch | „Schlüsselübergabe vor einem Wohnhaus" | `public/images/hero/verkaufen.webp` | P1 |
| IMG-010 | `/suchprofil` | Funnel-Hero | Heller Wohnraum mit Blick in den Garten | WebP 2000×1000 | 2:1 | ruhig | „Wohnraum mit Blick in den Garten" | `public/images/hero/suchprofil.webp` | P1 |
| IMG-011 | `/bewertungen` | `PageHero` | Zwei Personen im Gespräch über einen Tisch, Ausschnitt | WebP 2000×1000 | 2:1 | dokumentarisch | „Gespräch im Maklerbüro" | `public/images/hero/bewertungen.webp` | P2 |
| IMG-012 | `/ueber-uns` | Team | Porträts aller Mitarbeitenden, gleiche Perspektive, gleicher Hintergrund, natürliches Licht | WebP 1200×1500 je | 4:5 | einheitlich, freundlich, nicht gestellt | Name und Rolle je Person | `public/images/team/<nachname>.webp` | P1 |
| IMG-013 | `/immobilie-verkaufen/*` | Sechs Unterseiten-Heros | Je Thema ein passendes Motiv: Ablauf (Schlüssel), Unterlagen (Dokumente), Immobilienwert (Berechnung), Maklerprovision (Vertragsunterschrift), Immobilie geerbt (Altbau), Energieausweis (moderne Fassade) | WebP 1800×900 | 2:1 | einheitliche Bildsprache | je Thema | `public/images/verkaufen/<slug>.webp` | P2 |
| IMG-014 | Objektdetail | Galerie | Je Objekt 8–15 Aufnahmen: Außen, alle Wohnräume, Bad, Küche, Ausblick, Grundriss | WebP ≥ 2000 px Breite | 3:2 | Architekturfotografie, Stativ, keine Weitwinkelverzerrung | je Raum | über den OpenImmo-Import | P0 |
| IMG-015 | Alle | `og:image` | Markenbild mit Wortmarke auf Olivfläche, Motiv je Seitentyp | PNG 1200×630 | 1,91:1 | Marke | – | `public/images/og/<seitentyp>.png` | P2 |

## Nach Motivgruppen (für die Shooting-Planung)

- **Team und Porträts:** IMG-001, IMG-012
- **Büro und Innenräume:** IMG-006, IMG-008, IMG-011
- **Objektfotos:** IMG-002, IMG-003, IMG-014
- **Stadt und Region:** IMG-005, IMG-007
- **Beratungssituationen:** IMG-004, IMG-009, IMG-013
