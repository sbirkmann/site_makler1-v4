# Entscheidungen

Jede bewusste Abweichung vom Master-Prompt oder vom Bestand – mit Begründung.

## E-01 · Repo-Stand schlägt Master-Prompt

Der Master-Prompt nennt Next.js 15, einen `src/`-Ordner, Drizzle, MDX und eine
`tailwind.config.ts`. Nichts davon trifft zu: Es ist **Next.js 16.3.4**, die
Struktur ist `app/`/`components/`/`lib/`, das ORM ist **Prisma 6**, Inhalte
liegen in der Datenbank, und Tailwind v4 konfiguriert sein Theme in
`app/globals.css` unter `@theme`.

Ein Umbau auf die im Prompt genannte Struktur wäre reiner Selbstzweck und
gefährdet die Funktionsparität. Verbindlich ist der Repo-Stand.

## E-02 · Karte bleibt vorerst Leaflet

Der Prompt verlangt MapLibre GL JS. Der Bestand nutzt Leaflet mit
OSM-Kacheln (`components/map/`), funktionsfähig und eingebunden. Der Wechsel
erfolgt zusammen mit dem Neubau der Split-View-Suche, nicht davor – sonst
werden Kartenumbau und Suchumbau in einem Schritt vermischt und ein Fehler
ist nicht mehr zuzuordnen.

## E-03 · H1 auf Rechts- und Detailseiten bleibt dunkel

Die Referenz setzt H1 in Orange. Auf Impressum, Datenschutz, Widerruf sowie
den Artikel- und Objektdetailseiten bleibt sie anthrazit: Diese Titel sind
lang, und lange Versalienzeilen in Orange lesen sich schlecht. Marketing- und
Übersichtsseiten tragen das Orange.

## E-04 · Basis-Rahmenfarbe gehört in `@layer base`

Die Regel `* { border-color: var(--color-line) }` stand ungelayert in
`app/globals.css`. Ungelayerte Regeln schlagen in Tailwind v4 **jede**
Utility-Klasse – farbige Rahmen (`border-accent-500`) waren wirkungslos,
site-weit. Die Regel steht jetzt in `@layer base`.

## E-05 · Umkreissuche über Nominatim statt eigenem Geocoder

Der Ort ist ein Freitextfeld; der Mittelpunkt wird über Nominatim
(OpenStreetMap) aufgelöst – frei nutzbar, ohne Schlüssel. Der bestehende
Dienst in `lib/services/geocoding.ts` bringt Drosselung und Wiederholung
bereits mit; `lib/services/place-lookup.ts` legt einen prozessweiten Cache
davor, damit dieselbe Eingabe nur einmal nachgeschlagen wird.

Gefiltert wird zweistufig: eine Bounding-Box grenzt in SQL vor, die exakte
Distanz (Haversine) schneidet den Kreis zu. Ohne diesen zweiten Schritt wäre
das Ergebnis ein Quadrat, kein Umkreis.

## E-06 · Geplante Veröffentlichungen konsistent ausblenden

`findFeaturedProperties()`, `findLatestProperties()` und `countProperties()`
prüften nur `publishedAt != null`, während `buildWhere()` zusätzlich
`lte: now` setzt. Ein auf morgen datiertes Objekt war damit auf `/immobilien`
unsichtbar, erschien aber auf der Startseite – und wurde im orangen Band
mitgezählt. Alle vier Stellen nutzen jetzt dieselbe Bedingung.

## E-07 · Nur geprüfte Bildmotive

Unsplash-IDs sind nicht sprechend. Beim ersten Setzen der Hero-Bilder lagen
drei Motive thematisch daneben (ein Bücherregal für „Immobilie geerbt", ein
Solarpark für „Energieausweis"). Seitdem gilt: **jedes Motiv vor dem Einbau
ansehen.** Ein Platzhalter ist besser als ein falsches Bild.
