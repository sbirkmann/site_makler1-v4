# SEO-REPORT.md – Vorher/Nachher

Erhoben gegen `content-snapshot/` (= Vorher-Wahrheit) und den laufenden
Produktionsbuild auf `http://localhost:3400`.

**Geprüfte Routen: 26** (alle 26 Snapshot-Dateien). Zusätzlich geprüft:
`sitemap.xml`, `robots.txt`, 6 Redirects, 5 Filterkombinationen,
56 interne Linkziele.

> Nicht als Fund gemeldet (stehen in `OPEN-ITEMS.md`): fehlende `og:image` (T-06)
> und Canonicals auf `localhost:3000`, weil `NEXT_PUBLIC_SITE_URL` lokal auf diesen
> Wert gesetzt ist (K-08). Die Canonicals sind **relativ zueinander korrekt** –
> jede Route zeigt auf ihren eigenen Pfad, siehe Spalte Canonical.

---

## 1. Vorher/Nachher je Route

Title, Description, Canonical und H1 stammen aus dem laufenden Build; die Spalte
Status vergleicht sie **wörtlich** mit dem Snapshot.

| Route | Title | Description | H1 | Canonical | Schema-Typen (vorher → nachher) | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | WohnWert Immobilien – Immobilienmakler in Köln, Bonn und dem Rheinland \| WohnWert Immobilien | Persoenliche Immobilienberatung fuer Koeln, Bonn und das Rheinland. Verkauf, Vermietung und kostenlose Immobilienbewertung mit echter Marktkenntnis. | Werte erkennen. Chancen nutzen. Immobilien erfolgreich verkaufen. | `/` | FAQPage + RealEstateAgent → FAQPage + RealEstateAgent | abweichend¹ |
| `/immobilien` | Immobilienangebote in Köln, Bonn und dem Rheinland \| WohnWert Immobilien | Aktuelle Häuser, Wohnungen, Grundstücke und Gewerbeimmobilien zum Kauf und zur Miete – kuratiert und persönlich betreut von WohnWert Immobilien. | Immobilien im Rheinland | `/immobilien` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/immobilien?marketing=KAUF&typ=WOHNUNG&sort=preis-auf` | Immobilienangebote in Köln, Bonn und dem Rheinland \| WohnWert Immobilien | Aktuelle Häuser, Wohnungen, Grundstücke und Gewerbeimmobilien zum Kauf und zur Miete – kuratiert und persönlich betreut von WohnWert Immobilien. | Immobilien im Rheinland | `/immobilien` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/immobilien/penthouse-rheinauhafen` | Penthouse mit umlaufender Dachterrasse im Rheinauhafen \| WohnWert Immobilien | Oberste Etage, 96 m² Terrasse, Blick über Rhein und Dom. Eine Wohnung für Menschen, die Stadt lieben, aber Abstand brauchen. | Penthouse mit umlaufender Dachterrasse im Rheinauhafen | `/immobilien/penthouse-rheinauhafen` | RealEstateAgent + Residence → RealEstateAgent + Residence | abweichend¹ |
| `/immobilien/villa-marienburg-rheinblick` | Architektenvilla mit Rheinblick in Marienburg \| WohnWert Immobilien | Zurückgenommene Moderne auf 1.240 m² Grund: bodentiefe Verglasung, Wasserblick und ein Garten, der wie ein zweites Wohnzimmer wirkt. | Architektenvilla mit Rheinblick in Marienburg | `/immobilien/villa-marienburg-rheinblick` | RealEstateAgent + Residence → RealEstateAgent + Residence | abweichend¹ |
| `/immobilien/altbau-etage-suedstadt` | Altbauetage mit Stuck und Südbalkon in der Kölner Südstadt \| WohnWert Immobilien | 3,40 m Deckenhöhe, Fischgrätparkett, Flügeltüren – eine Wohnung, die ihre Herkunft zeigt und trotzdem heutigen Ansprüchen genügt. | Altbauetage mit Stuck und Südbalkon in der Kölner Südstadt | `/immobilien/altbau-etage-suedstadt` | RealEstateAgent + Residence → RealEstateAgent + Residence | abweichend¹ |
| `/immobilie-verkaufen` | Immobilie verkaufen in Köln, Bonn und dem Rheinland \| WohnWert Immobilien | In wenigen Schritten zur kostenlosen Ersteinschätzung: Wir begleiten Ihren Immobilienverkauf von der Bewertung bis zur Schlüsselübergabe – ehrlich und vollständig. | Was Ihre Immobilie heute wert ist – in fünf Minuten geklärt | `/immobilie-verkaufen` | FAQPage + RealEstateAgent → FAQPage + RealEstateAgent | abweichend¹ |
| `/immobilie-verkaufen/ablauf` | Immobilie verkaufen: Ablauf in 9 Schritten \| WohnWert Immobilien | Wie ein Immobilienverkauf tatsächlich abläuft: Vorbereitung, Unterlagen, Preisfindung, Vermarktung, Notartermin und Übergabe – Schritt für Schritt erklärt. | Der Verkauf in neun Schritten | `/immobilie-verkaufen/ablauf` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/immobilie-verkaufen/unterlagen` | Unterlagen für den Immobilienverkauf: Checkliste und Beschaffung \| WohnWert Immobilien | Alle Unterlagen für den Immobilienverkauf im Überblick: Grundbuchauszug, Flurkarte, Energieausweis, Teilungserklärung – mit Bezugsquelle und Dauer. | Unterlagen für den Verkauf | `/immobilie-verkaufen/unterlagen` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/immobilie-verkaufen/immobilienwert` | Immobilienwert ermitteln: Vergleichs-, Ertrags- und Sachwert \| WohnWert Immobilien | Wie der Wert einer Immobilie ermittelt wird: die drei anerkannten Verfahren, ihre Anwendungsfälle und die Grenzen von Online-Bewertungen. | Was Ihre Immobilie wert ist | `/immobilie-verkaufen/immobilienwert` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/immobilie-verkaufen/maklerprovision` | Maklerprovision beim Immobilienverkauf: Höhe, Teilung, Fälligkeit \| WohnWert Immobilien | Maklerprovision verständlich erklärt: gesetzliche Teilung seit 2020, übliche Sätze im Rheinland, Fälligkeit und was zur Leistung gehört. | Maklerprovision: Wer zahlt was | `/immobilie-verkaufen/maklerprovision` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/immobilie-verkaufen/immobilie-geerbt` | Immobilie geerbt: Fristen, Erbengemeinschaft, Steuern \| WohnWert Immobilien | Was nach dem Erbfall einer Immobilie zu tun ist: Erbschein, Grundbuchberichtigung, Erbschaftsteuer, Erbengemeinschaft und die Frage Verkauf oder Behalten. | Immobilie geerbt – was jetzt zu tun ist | `/immobilie-verkaufen/immobilie-geerbt` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/immobilie-verkaufen/energieausweis` | Energieausweis: Verbrauchs- vs. Bedarfsausweis, Klassen erklärt \| WohnWert Immobilien | Energieausweis verstehen: Unterschied zwischen Verbrauchs- und Bedarfsausweis, Bedeutung der Effizienzklassen A+ bis H und Auswirkung auf den Verkaufspreis. | Energieausweis verstehen | `/immobilie-verkaufen/energieausweis` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/immobilienbewertung` | Kostenlose Immobilienbewertung im Rheinland \| WohnWert Immobilien | Was ist Ihre Immobilie wert? Kostenlose und unverbindliche Bewertung auf Basis tatsächlich erzielter Kaufpreise – für Köln, Bonn und das Rheinland. | Was ist Ihre Immobilie wert? | `/immobilienbewertung` | FAQPage + RealEstateAgent → FAQPage + RealEstateAgent | abweichend¹ |
| `/suchprofil` | Suchprofil hinterlegen \| WohnWert Immobilien | Sagen Sie uns, was Sie suchen: Wir gleichen Ihre Kriterien laufend mit unserem Bestand ab – auch mit Objekten, die nicht öffentlich inseriert werden. | Sagen Sie uns, was Sie suchen | `/suchprofil` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/ueber-uns` | Über uns – das Team hinter WohnWert Immobilien \| WohnWert Immobilien | Wer wir sind, wie wir arbeiten und warum wir bewusst wenige Mandate annehmen. Das Team von WohnWert Immobilien in Köln, Bonn und dem Rheinland. | Immobilien sind selten nur eine Frage des Preises. | `/ueber-uns` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/bewertungen` | Erfahrungen unserer Kunden \| WohnWert Immobilien | Was Eigentümer und Käufer über die Zusammenarbeit mit WohnWert Immobilien berichten – Bewertungen aus Verkauf, Kauf, Vermietung und Bewertung. | Was Eigentümer über uns sagen | `/bewertungen` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/ratgeber` | Ratgeber für Eigentümer und Käufer \| WohnWert Immobilien | Verständlich erklärt: Ablauf des Immobilienverkaufs, Wertermittlung, Maklerprovision, Unterlagen, Erbfall und Energieausweis. | Wissen, das vor der Entscheidung hilft | `/ratgeber` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/ratgeber/kaufnebenkosten-rheinland` | Kaufnebenkosten in NRW: Grunderwerbsteuer, Notar, Provision \| WohnWert Immobilien | Alle Kaufnebenkosten beim Immobilienkauf in Nordrhein-Westfalen im Überblick: Grunderwerbsteuer 6,5 %, Notar und Grundbuch, Maklerprovision – mit Rechenbeispiel. | Kaufnebenkosten: Womit Käufer im Rheinland rechnen müssen | `/ratgeber/kaufnebenkosten-rheinland` | Article + RealEstateAgent → Article + RealEstateAgent | abweichend¹ |
| `/ratgeber/besichtigung-checkliste-kaeufer` | Besichtigung Checkliste: Worauf Immobilienkäufer achten müssen \| WohnWert Immobilien | Checkliste für die Immobilienbesichtigung: Bausubstanz, Feuchtigkeit, Haustechnik, Unterlagen und die Fragen, die Käufer stellen sollten. | Besichtigung: Worauf Käufer wirklich achten sollten | `/ratgeber/besichtigung-checkliste-kaeufer` | Article + RealEstateAgent → Article + RealEstateAgent | abweichend¹ |
| `/ratgeber/finanzierung-vorbereiten` | Immobilienfinanzierung vorbereiten: Eigenkapital, Rate, Zinsbindung \| WohnWert Immobilien | So bereiten Sie eine Baufinanzierung vor: Eigenkapitalquote, realistische Monatsrate, Zinsbindung, Tilgung und die Unterlagen für das Bankgespräch. | Finanzierung vorbereiten: Was vor dem ersten Bankgespräch zu klären ist | `/ratgeber/finanzierung-vorbereiten` | Article + RealEstateAgent → Article + RealEstateAgent | abweichend¹ |
| `/kontakt` | Kontakt \| WohnWert Immobilien | Sprechen Sie mit uns: Telefon, E-Mail oder Kontaktformular. WohnWert Immobilien in Köln – persönlich erreichbar von Montag bis Freitag. | Sprechen wir über Ihre Immobilie | `/kontakt` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/impressum` | Impressum \| WohnWert Immobilien | Impressum und Anbieterkennzeichnung von WohnWert Immobilien GmbH. | Impressum | `/impressum` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/datenschutz` | Datenschutzerklärung \| WohnWert Immobilien | Informationen zur Verarbeitung personenbezogener Daten bei WohnWert Immobilien GmbH. | Datenschutzerklärung | `/datenschutz` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/widerruf` | Widerrufsbelehrung \| WohnWert Immobilien | Widerrufsrecht für Verbraucher bei außerhalb von Geschäftsräumen geschlossenen Verträgen. | Widerrufsbelehrung | `/widerruf` | RealEstateAgent → RealEstateAgent | abweichend¹ |
| `/404-test-not-found` | WohnWert Immobilien – Immobilienmakler in Köln, Bonn und dem Rheinland | Persoenliche Immobilienberatung fuer Koeln, Bonn und das Rheinland. Verkauf, Vermietung und kostenlose Immobilienbewertung mit echter Marktkenntnis. | Diese Seite gibt es nicht | `/` | – → – | identisch |

¹ Title, Description, Canonical, H1 und Schema-**Typen** sind identisch; im
`RealEstateAgent`-Objekt fehlt gegenüber dem Snapshot der Block `aggregateRating`.
Das ist eine **beabsichtigte** Umsetzung von `OPEN-ITEMS.md` T-04 – siehe §5.

---

## 2. `<h1>` je Seite

Alle 26 geprüften Routen liefern **genau eine** `<h1>`. Der H1-Text ist auf jeder
Route wörtlich identisch mit dem Snapshot. Keine Abweichung.

---

## 3. `sitemap.xml` und `robots.txt`

**`sitemap.xml`: funktionsfähig, 42 URLs.** `/widerruf` ist enthalten (die
Ergänzung wirkt). Alle 20 statischen Marketing-Routen aus `app/(marketing)/`
sind vertreten, dazu 20 Objekt- und 4 Ratgeber-Detailseiten. Kein
`/admin`- oder `/api`-Pfad in der Sitemap. Gegenüber den 41 URLs in
`INVENTORY.md` ist der Zuwachs genau `/widerruf`.

**`robots.txt`: funktionsfähig.**

```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Host: http://localhost:3000
Sitemap: http://localhost:3000/sitemap.xml
```

`Host` und `Sitemap` erben die Domain aus `NEXT_PUBLIC_SITE_URL` und werden mit
der Produktionsdomain automatisch korrekt (K-08).

---

## 4. Redirects, interne Links, Filter-Canonicals

**Alle 6 Ratgeber-Altslugs leiten weiterhin permanent (308) und in genau einem
Sprung auf ihr Ziel:**

| Altslug | Ziel | Status |
| --- | --- | --- |
| `/ratgeber/immobilie-verkaufen-ablauf` | `/immobilie-verkaufen/ablauf` | 308, 1 Sprung |
| `/ratgeber/unterlagen-immobilienverkauf` | `/immobilie-verkaufen/unterlagen` | 308, 1 Sprung |
| `/ratgeber/was-ist-meine-immobilie-wert` | `/immobilie-verkaufen/immobilienwert` | 308, 1 Sprung |
| `/ratgeber/maklerprovision-erklaert` | `/immobilie-verkaufen/maklerprovision` | 308, 1 Sprung |
| `/ratgeber/immobilie-geerbt-was-tun` | `/immobilie-verkaufen/immobilie-geerbt` | 308, 1 Sprung |
| `/ratgeber/energieausweis-verstehen` | `/immobilie-verkaufen/energieausweis` | 308, 1 Sprung |

**Interne Links:** 56 eindeutige interne Linkziele über alle 24 gecrawlten
Seiten – **keine 404, keine Weiterleitungsketten**. Kein interner Link zeigt auf
einen Altslug (die Redirects sind reine Absicherung für externe Links).

**Filterkombinationen auf `/immobilien`** – Canonical zeigt in allen Fällen auf
`/immobilien`:

| Aufruf | Canonical |
| --- | --- |
| `?marketing=KAUF&typ=WOHNUNG&sort=preis-auf` | `/immobilien` |
| `?ort=Koeln` | `/immobilien` |
| `?page=2` | `/immobilien` |
| `?marketing=MIETE` | `/immobilien` |
| `?typ=HAUS&ort=Bonn&preisMax=500000` | `/immobilien` |

**Sicherheits-Header** (`next.config.ts`) unverändert vorhanden:
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`, `poweredByHeader: false`.

---

## 5. P0-Funde

### P0-1 · `aggregateRating` fehlt im `RealEstateAgent`-JSON-LD (25 Routen)

**Abweichung.** Der Snapshot enthält auf jeder öffentlichen Seite:

```json
"aggregateRating": {"@type":"AggregateRating","ratingValue":4.9,"bestRating":5,"ratingCount":12}
```

Im aktuellen Build fehlt dieser Block auf allen 25 öffentlichen Routen. Alle
übrigen Felder des `RealEstateAgent` (`name`, `legalName`, `description`, `url`,
`telephone`, `email`, `address`, `areaServed`) sind **wörtlich unverändert**.
Schema-Typen sind auf keiner Route verändert.

**Ursache:** `app/(marketing)/layout.tsx` gibt den Block seit dem Umbau nur noch
aus, wenn `isDemoSite === false` (`lib/site.ts:68` steht auf `true`).

**Bewertung: beabsichtigt und korrekt – kein Fix nötig.** Das ist exakt die
Umsetzung von `OPEN-ITEMS.md` **T-04** („`AggregateRating` nur bei echten
Bewertungen ausliefern", Priorität *P0 – Recht"). `Review.isDemo` ist `true`;
ein `AggregateRating` über erfundene Bewertungen wäre irreführende Werbung.
Die Regel „jede Abweichung ist P0" wird hier bewusst zugunsten der bereits
dokumentierten Rechtsentscheidung aufgelöst.

**Zu tun:** Sobald echte Bewertungen vorliegen (K-05), `isDemoSite` auf `false`
setzen – der Block kehrt dann unverändert zurück.

### P0-2 · `shortDescription` fehlt auf `/immobilien` (Trefferliste)

**Abweichung.** Im Snapshot trägt jede Ergebniskachel auf `/immobilien` ihren
Teaser, z. B.:

> „Oberste Etage, 96 m² Terrasse, Blick über Rhein und Dom. Eine Wohnung für
> Menschen, die Stadt lieben, aber Abstand brauchen."

Im aktuellen Build erscheinen diese Texte auf `/immobilien` **nicht mehr**
(11 Teaser auf `/immobilien`, 8 auf der geprüften Filterkombination). Titel,
Ort, Preis, Eckdaten und Trefferzahl sind vorhanden.

**Ursache:** `/immobilien` wurde auf die Split-View-Kartensuche umgebaut
(`OPEN-ITEMS.md` T-01). Die Liste rendert jetzt `components/property/SearchResultCard.tsx`
statt `components/property/PropertyCard.tsx`; die neue Kachel gibt
`shortDescription` nicht aus. Das Feld wird weiterhin geladen
(`lib/repositories/properties.ts:9`) und auf der Startseite sowie den
Detailseiten unverändert ausgegeben – die Daten sind also vollständig, nur die
Ausgabe auf dieser einen Route fehlt.

**Bewertung:** Verstoß gegen `CLAUDE.md` §2.2 („Kein Inhaltsverlust") auf der
Trefferliste. Ob der Teaser im neuen, kompakteren Kartenlayout bewusst entfallen
soll, ist eine Design-Entscheidung des Such-Umbaus.

**Konkreter Fix** (in `components/property/SearchResultCard.tsx`, im Textblock
unterhalb des Titels) – Ausgabe wie in `PropertyCard.tsx:77-79`:

```tsx
<p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-muted">
  {property.shortDescription}
</p>
```

**Nicht von mir umgesetzt:** `components/property/**` und
`app/(marketing)/immobilien/**` gehören zum Arbeitsbereich des parallel
laufenden Such-/Karten-Agenten. Wird der Teaser bewusst weggelassen, gehört die
Entscheidung nach `DECISIONS.md`.

---

## 6. Nachrichtliche Befunde (kein P0)

Rein additive Änderungen – **kein Text ging verloren**:

- **`/`** – neue Sektion „Immobilie finden" (`components/marketing/SearchBandOlive.tsx`)
  als zusätzliche `<h2>` vor dem Abschluss-CTA.
- **`/datenschutz`** – neue `<h2>` „7. Kartendarstellung (OpenStreetMap)",
  dadurch verschieben sich die Folgeabschnitte auf 8. und 9. Das setzt
  `OPEN-ITEMS.md` **T-02** um; der Punkt kann dort abgehakt werden.
- **Footer** – die Überschriften „Sprechen wir über Ihre Immobilie.",
  „Leistungen", „Unternehmen", „Rechtliches" erscheinen im Vergleich zusätzlich.
  Sie sind **kein neuer Inhalt**: das Snapshot-Werkzeug hat den Footer nicht
  erfasst, mein Abgleich schon.

---

## 7. Methodik und Einschränkungen

- Erhebung per HTTP gegen den Produktionsbuild; `<title>`, Meta-, Canonical- und
  OG-Tags sowie alle `application/ld+json`-Blöcke wurden geparst und die JSON-LD
  Objekte **feldweise tief** verglichen (Schlüssel sortiert, nicht nur der Typ).
- Für Routen mit `<Suspense>` (`/immobilien`, Detailseiten) reicht ein Blick in
  das gerenderte HTML nicht: der gestreamte Teil liegt als RSC-Flight-Payload in
  `self.__next_f.push(...)`. Der Textabgleich decodiert diesen Payload und
  vergleicht auf Wortfolgen, damit Tag- und Textknotengrenzen keine falschen
  Treffer erzeugen.
- Der Absatzabgleich meldet Restrauschen dort, wo das Snapshot-Werkzeug
  benachbarte Inline-Elemente ohne Trennzeichen zusammengezogen hat
  („GmbHMusterstraße 12", „02. September 20266 Min."). Diese Fälle wurden
  einzeln gegen die Seite geprüft: der Text ist vollständig vorhanden.
- **Während der Prüfung haben parallel arbeitende Agenten `.next` mehrfach neu
  gebaut.** Die berichteten Zahlen stammen aus einem vollständigen, sauberen
  Build (`rm -rf .next && pnpm build`) mit genau einem `next start`-Prozess.
  Ein stehengebliebener Altprozess auf einem neu gebauten `.next` liefert sonst
  `InvariantError: client reference manifest ... does not exist` – das ist der in
  `CLAUDE.md` §7 beschriebene Effekt, kein SEO-Befund.
- **Zum Berichtszeitpunkt ist `pnpm build` rot:**
  `components/map/SearchMap.tsx(196,11): error TS2304: Cannot find name 'syncRef'`.
  Die Datei gehört zum Karten-Agenten und war während meiner Prüfung in
  Bearbeitung; der Fehler stammt nicht aus dieser Prüfung. Ich habe **keine
  Quelldatei geändert** – siehe §8.

---

## 8. Was ich selbst behoben habe

**Nichts.** Beide P0-Funde liegen außerhalb meines Zuständigkeitsbereichs:

- P0-1 ist eine bereits dokumentierte, bewusste Rechtsentscheidung (T-04) und
  darf nicht zurückgedreht werden.
- P0-2 liegt in `components/property/**` bzw. `app/(marketing)/immobilien/**` –
  ausdrücklich gesperrte Dateien.

Ein Canonical oder ein sonstiger Metadaten-Fehler auf den Rechtstextseiten, den
ich hätte beheben dürfen, lag nicht vor: `/impressum`, `/datenschutz` und
`/widerruf` sind in Title, Description, Canonical, Robots und H1 wörtlich
identisch mit dem Snapshot.
