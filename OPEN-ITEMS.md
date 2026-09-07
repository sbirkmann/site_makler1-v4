# Offene Punkte

Was der Kunde liefern oder freigeben muss, plus geplante Arbeiten.

## Vom Kunden zu liefern

| ID | Punkt | Warum es blockiert |
| --- | --- | --- |
| K-01 | Echte Firmierung, Anschrift, Telefon, E-Mail, Öffnungszeiten | Bestand nutzt Beispieldaten (`willkommen@wohnwert-immobilien.example`, Rufnummernblock der Bundesnetzagentur). Impressumspflicht. |
| K-02 | Vollständige Impressumsangaben (Geschäftsführung, Registergericht, HRB, USt-IdNr., Aufsichtsbehörde nach § 34c GewO) | Rechtlich verpflichtend |
| K-03 | Belege für die Kennzahlen: seit 2009, 940 vermittelte Objekte, 1.180 Kundinnen und Kunden, 340 Mio. € Volumen, Bewertung 4,9 | Stehen im JSON-LD jeder Seite. Unbelegte Zahlen sind wettbewerbsrechtlich angreifbar. |
| K-04 | Belege für die vier Auszeichnungen | wie K-03 |
| K-05 | Echte Kundenbewertungen | `Review.isDemo` ist `true`; erfundene Bewertungen mit `AggregateRating` sind irreführende Werbung. Bis dahin darf das Schema nicht ausgeliefert werden. |
| K-06 | Team-Fotos und Bürofotos | siehe `MISSING-IMAGES.md` |
| K-07 | Echte Objektdaten samt Koordinaten | Beispieldaten aus dem Seed; ohne Koordinaten keine korrekte Kartendarstellung |
| K-08 | Produktionsdomain | `NEXT_PUBLIC_SITE_URL` ist nicht gesetzt – Canonicals und Sitemap zeigen sonst auf `localhost:3000` |

## Technisch offen

| ID | Punkt | Priorität |
| --- | --- | --- |
| T-01 | Split-View-Suche mit Karte (MapLibre), Cluster, bidirektionales Highlighting | P1 |
| T-02 | Kartenkacheln erst nach Einwilligung laden; Datenschutzerklärung ergänzen | **P0 – Datenschutz** |
| T-03 | Suche ohne JavaScript bedienbar machen (Filter als echtes GET-Formular) | P1 |
| T-04 | `Review.isDemo` und `isDemoSite` im UI auswerten; `AggregateRating` nur bei echten Bewertungen ausliefern | **P0 – Recht** |
| T-05 | `BlogApiSettings.allowUnauthenticated` entfernen oder absichern – hebt die Schlüsselprüfung von `POST /api/blog-import` auf | **P0 – Sicherheit** |
| T-06 | `og:image` je Seitentyp | P2 |
| T-07 | Umkreissuche paginiert bei aktivem Radius im Speicher – bei großen Beständen auf PostGIS umstellen | P2 |
| T-08 | Ungenutzte Komponenten prüfen: `Card`, `TrustBar` | P3 |
| T-09 | `public/` enthält nur die ungenutzten `create-next-app`-SVGs; Logo existiert nur als Inline-SVG | P3 |
| T-10 | `pnpm start` verdeckt Fehler des abgekoppelten Geocoding-Backfills (`&`) | P2 |
