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

## E-08 · Markenorange bleibt `#FF6D00`

Die Referenzanalyse hat gemessen, dass der Theme-Wert der Referenz
`#FF6F00` ist (`rgb(255,111,0)`), nicht `#FF6D00` (`rgb(255,109,0)`).

Beide Werte kommen dort tatsächlich vor: `#ff6f00` als Theme-Variable,
`#FF6D00` in nachträglich eingefügten Blöcken. Der Unterschied beträgt zwei
Punkte im Rotkanal und ist nebeneinander nicht unterscheidbar.

WohnWert behält `#FF6D00`. Das ist die bereits etablierte Markenfarbe; sie
einer fremden Instanz zuliebe um zwei Punkte zu verschieben, brächte keinen
Gewinn. Der Auftrag lautet ausdrücklich „Dondorf-Struktur mit WohnWert-Marke".

## E-09 · Überschriftenebenen bleiben unterscheidbar

Die Referenz setzt H1 und H2 identisch (28 px / 600 / versal / orange). Für
WohnWert bleiben die Ebenen unterschiedlich groß: Eine Seite, auf der jede
Überschrift gleich aussieht, hat keine Hierarchie mehr – der Leser kann
Abschnitt und Unterabschnitt nicht auseinanderhalten. Das ist ein
Bedienungsproblem, kein Geschmacksurteil.

Übernommen wird die *Behandlung* (versal, weite Laufweite, Orange auf
Marketingseiten), nicht die Gleichmacherei der Größen.

## E-10 · Keine Zeilenkappung, kein Einfahreffekt

Die Referenz kürzt Kartentitel (`-webkit-line-clamp: 2`) und Ratgebertexte
(`line-clamp: 7`). Das kollidiert mit der Leitplanke „kein Inhaltsverlust":
Ein Titel, der mitten im Wort abbricht, ist verlorener Inhalt. Stattdessen
gleichen Kartenhöhen über `grid-auto-rows: 1fr` aus.

Der zehn Sekunden lange Einfahreffekt der Ergebnisliste entfällt ersatzlos –
er verzögert die Nutzung ohne Gegenwert.

## E-11 · Suche bleibt ohne JavaScript bedienbar

Die Referenz-Suche ist vollständig JS-getrieben; die Bühne hat
`overflow: hidden`, gescrollt wird nur im Listencontainer. Wir weichen ab:
Filter bleiben ein echtes GET-Formular, die Ergebnisliste wird serverseitig
gerendert, die Karte hydriert danach. Die Karte liegt per `position: sticky`
statt in einem eigenen Scrollcontainer.

Grund: Eine Objektsuche, die ohne JavaScript nichts anzeigt, ist für
Suchmaschinen und für Nutzer mit eingeschränkter Umgebung wertlos.
