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
| ~~T-01~~ | ~~Split-View-Suche mit Karte (MapLibre), Cluster, bidirektionales Highlighting~~ – erledigt | – |
| T-02 | Datenschutzerklärung um den Kartendienst ergänzen (Kacheln laden bereits nur nach Einwilligung, `MapConsent`) | P1 |
| ~~T-03~~ | ~~Suche ohne JavaScript bedienbar machen~~ – Filterleiste und Sheet sind echte GET-Formulare, Liste serverseitig gerendert | – |
| T-04 | `Review.isDemo` und `isDemoSite` im UI auswerten; `AggregateRating` nur bei echten Bewertungen ausliefern | **P0 – Recht** |
| T-05 | `BlogApiSettings.allowUnauthenticated` entfernen oder absichern – hebt die Schlüsselprüfung von `POST /api/blog-import` auf | **P0 – Sicherheit** |
| T-06 | `og:image` je Seitentyp | P2 |
| T-07 | Umkreissuche paginiert bei aktivem Radius im Speicher – bei großen Beständen auf PostGIS umstellen | P2 |
| T-08 | Ungenutzte Komponenten prüfen: `Card`, `TrustBar` | P3 |
| T-09 | `public/` enthält nur die ungenutzten `create-next-app`-SVGs; Logo existiert nur als Inline-SVG | P3 |
| T-10 | `pnpm start` verdeckt Fehler des abgekoppelten Geocoding-Backfills (`&`) | P2 |
| T-11 | Zwei Kartenstapel: `SearchMap` nutzt MapLibre, `PropertyMap` (Objektdetail, `/kontakt`) weiter Leaflet. Nach dem Umbau der Detailkarte kann `leaflet` entfallen (siehe E-08) | P2 |
| T-12 | Objekte ohne Koordinaten fehlen auf der Karte – die Trefferliste zeigt sie, die Karte nicht. Erst mit echten Objektdaten (K-07) zu beheben; ein Fallback auf den Ortsmittelpunkt setzt Pins an falsche Stellen und wäre irreführender als eine Lücke | P2 |
| T-13 | Das Ortssuchfeld auf der Karte fragt Nominatim direkt aus dem Browser ab. Nach der Einwilligung in den Kartendienst vertretbar, sauberer wäre der Umweg über den Server (`lookupPlaceCenter`) | P2 |
| T-14 | Clustering läuft im Browser über alle geladenen Punkte (max. 300, siehe E-12). Bei deutlich größerem Bestand auf Quellen-Clusterung bzw. Supercluster wechseln | P2 |
