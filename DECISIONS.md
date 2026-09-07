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

## E-08 · Karte auf MapLibre GL JS umgestellt

E-02 hat den Wechsel bis zum Neubau der Suche zurückgestellt. Mit der
Split-View ist dieser Zeitpunkt erreicht, deshalb ist die Suchkarte jetzt
**MapLibre GL JS** (`components/map/SearchMap.tsx`).

Ausschlaggebend war nicht die Optik, sondern das Clustering. Leaflet kann
das nur über ein zusätzliches Plugin (`leaflet.markercluster`), also eine
zweite neue Abhängigkeit; MapLibre bringt Clustering in der GeoJSON-Quelle
mit (`cluster: true`) und liefert mit `setFeatureState` zugleich den
Mechanismus für das bidirektionale Highlighting zwischen Liste und Karte –
ohne dass für jedes Objekt ein DOM-Marker entsteht. Bei 300 Markern ist das
der Unterschied zwischen 300 DOM-Knoten und einem Canvas.

Die Kacheln bleiben **OSM-Raster** von `tile.openstreetmap.org`; es kommt
also kein neuer Drittanbieter und kein API-Schlüssel dazu. MapLibre wird
lediglich als Renderer benutzt, nicht als Vektorkachel-Dienst.

**Leaflet bleibt vorerst installiert**, weil `PropertyMap` (Objektdetail,
`/kontakt`) unverändert darauf läuft. Diese beiden Karten zeigen einen
einzelnen Standort – dort trägt MapLibre nichts bei, und ein Umbau ohne
Anlass wäre reiner Selbstzweck. Der zweite Kartenstapel ist bewusst
befristet und steht als T-11 in `OPEN-ITEMS.md`.

## E-09 · Umschalter Liste/Karte über `ansicht`, nicht über JavaScript

Unter 1024 px ersetzt ein Umschalter den Split-View. Er ist ein Paar echter
Links mit dem Parameter `ansicht=karte` – kein JS-Button. Damit funktioniert
er ohne JavaScript, ist verlinkbar und im Verlauf zurücknavigierbar.

`ansicht` ist ein reiner Darstellungsparameter: Er steuert nichts an der
Ergebnismenge, geht nicht an `parsePropertySearchParams()` und wird aus dem
Query-String für `/api/immobilien/geo` entfernt. Die bestehenden zehn
Filterparameter bleiben unverändert.

## E-10 · Objektart in der Leiste einfach, Mehrfachauswahl bleibt erhalten

Die alte Seitenleiste erlaubte mehrere Objektarten als Chips. In der
schmalen Filterleiste ist dafür kein Platz, dort steht ein einfaches
`<select>`.

Bestehende Links mit mehreren Typen (`?typ=HAUS&typ=WOHNUNG`) brechen
trotzdem nicht: Der Server wertet weiterhin alle Werte aus, und die
zusätzlich gewählten Typen reisen als versteckte Felder im Formular mit.
Ein solcher Link fällt beim Absenden also nicht auf einen Typ zusammen.

## E-11 · Marker als HTML-Elemente, nicht als Symbol-Ebenen

Der naheliegende Weg für Pins und Cluster wären MapLibre-Symbol-Ebenen mit
`icon-image`. Das scheitert hier an zwei Punkten:

1. Eine Symbol-Ebene lässt den Style erst dann fertig laden, wenn eine
   `glyphs`-Quelle vorhanden ist – auch ohne `text-field`. Ohne sie bleibt
   `isStyleLoaded()` dauerhaft `false` und **keine** Ebene zeichnet. Eine
   Glyphen-Quelle wäre ein weiterer Drittanbieter, der nach der
   Einwilligung in OpenStreetMap zusätzlich angefragt würde.
2. `icon-image` ist eine Layout-Eigenschaft und darf kein `feature-state`
   auswerten – das Hervorheben des überfahrenen Objekts ginge darüber
   ohnehin nicht.

Pins und Cluster sind deshalb `maplibregl.Marker` mit eigenem DOM-Element.
Bei höchstens 300 Objekten (`findPropertyMapMarkers`) ist das
unproblematisch, bleibt vollständig lokal und macht die Pins nebenbei
fokussierbar – ein `<button>` ist tastaturbedienbar, ein Canvas-Symbol
nicht.

## E-12 · Clustering im Browser statt in der GeoJSON-Quelle

MapLibre kann Punkte selbst clustern (`cluster: true`). Die Cluster sind
danach aber nur über `querySourceFeatures()` erreichbar, und das liefert
erst Ergebnisse, wenn die Quelle Kacheln erzeugt hat – für DOM-Marker ein
unzuverlässiger Zeitpunkt.

Die Suche gruppiert deshalb selbst: Punkte, die auf dem Schirm näher als
55 px beieinander liegen, werden zusammengefasst. Gerechnet wird in
Bildschirmpixeln, damit das Ergebnis auf jeder Zoomstufe stimmt. Bei der
gegebenen Obergrenze von 300 Objekten ist das eine Schleife über wenige
hundert Punkte pro Kartenbewegung.

Wächst der Bestand deutlich, ist der Wechsel auf die Quellen-Clusterung
(oder Supercluster) der richtige Schritt – vermerkt als T-14.
