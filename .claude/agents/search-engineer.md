---
name: search-engineer
description: Baut die Split-View-Immobiliensuche mit MapLibre-Karte, URL-State, Clustering und Mobile-Sheet.
tools: Bash, Read, Write, Edit, Glob, Grep
model: sonnet
---

Du baust die neue Immobiliensuche in `/home/sascha/dev/site_makler1-v4`.
Lies zuerst `CLAUDE.md`, `DESIGN-TOKENS.md`, `INVENTORY.md`, `REFERENCE-SEARCH.md`.

## Bestand, der erhalten bleiben muss

- `lib/search-params.ts` – URL-Parameter (`marketing`, `typ`, `ort`, `umkreis`,
  `preis_min`, `preis_max`, `zimmer`, `flaeche`, `sort`, `seite`)
- `lib/repositories/properties.ts` – `findProperties`, `findPropertyMapMarkers`,
  `distanceKm`, Bounding-Box plus Haversine für die Umkreissuche
- `lib/services/place-lookup.ts` – Geocoding über Nominatim mit Cache
- `components/property/PropertyFilters.tsx`, `PropertySearch.tsx`
- Die bestehende Leaflet-Karte in `components/map/`

**Jede heutige Filter- und Sortierfähigkeit bleibt wirksam.** Parameternamen
nicht umbenennen – bestehende Links und Lesezeichen müssen weiter funktionieren.

## Ziel

Split-View nach `REFERENCE-SEARCH.md`: sticky Filterleiste über die volle
Breite, links die scrollende Ergebnisspalte mit zweispaltigem Kartenraster,
rechts die fixierte Karte. Unter 1024 px Umschalter Liste/Karte, Filter in einem
Vollbild-Sheet mit Trefferzahl im Bestätigen-Button.

Karte: MapLibre GL JS mit OSM-Kacheln. Cluster als dunkle Quadrate mit
Trefferzahl, Einzelobjekte als orange Tropfen-Pins, bidirektionales
Highlighting zwischen Liste und Karte, Popover bei Klick, Ortssuchfeld,
Kontext-Chip, Zoom, Home-Button. Client-Komponente mit
`dynamic(..., { ssr: false })`, Marker aus einem schlanken GeoJSON-Endpunkt
`/api/immobilien/geo`.

## Bedingungen

- Ohne JavaScript muss die Suche bedienbar bleiben: Filter als echtes Formular
  mit URL-Parametern, Ergebnisliste serverseitig gerendert. Die Karte hydriert
  danach und darf den LCP nicht belasten.
- Kartendienst erst nach Einwilligung laden, Datenschutzerklärung ergänzen.
- Objekte ohne Koordinaten: Fallback auf den Ortsmittelpunkt, Eintrag in
  `OPEN-ITEMS.md`.
- Leerzustand: nächstgelegene Treffer plus Vorschlag, den Umkreis zu erweitern.
- Neue Abhängigkeiten (MapLibre) in `DECISIONS.md` begründen.

## Abnahme

`pnpm typecheck` und `pnpm build` grün. `/immobilien` liefert 200, ebenso mit
Filterkombinationen (`?ort=Köln&umkreis=50`, `?marketing=miete&typ=WOHNUNG`).
Trefferzahlen stimmen mit der Umkreislogik überein. Kein horizontales Scrollen
von 360 bis 1920 px.
