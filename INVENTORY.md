# INVENTORY.md – Funktions- und Contentinventur

Erhoben am 2026-09-07 gegen den Repo-Stand und den laufenden Produktionsbuild
auf `http://localhost:3400`. Diese Datei ist die **Abnahmeliste** nach
`CLAUDE.md` §2.1: Jede hier abgehakte Zeile muss nach einem Umbau weiterhin
vorhanden und funktionsfähig sein.

Ergänzend gilt `content-snapshot/` als Wahrheit für die Texte.

**Kennzahlen:** 22 Routen (18 öffentlich + `/widerruf`, 2 dynamische Typen,
1 API-Route) · 10 Verwaltungsrouten · 51 Komponenten · 15 Server Actions ·
28 Repository-Funktionen · 26 Snapshot-Dateien.

---

## 1. Routenbaum

### 1.1 Wurzel (`app/`)

| Datei | Zweck | Rendering | Metadaten |
| --- | --- | --- | --- |
| - [ ] `app/layout.tsx` | Root-Layout, `<html lang="de">`, Montserrat, Skip-Link | Server | `export const metadata` (Title-Template, OpenGraph, `metadataBase`), `export const viewport` |
| - [ ] `app/globals.css` | Tailwind v4 `@theme` – **keine `tailwind.config.ts`** | – | – |
| - [ ] `app/not-found.tsx` | 404-Seite, HTTP 404 bestätigt | Server | – |
| - [ ] `app/error.tsx` | Globale Fehlergrenze | **Client** | – |
| - [ ] `app/sitemap.ts` | XML-Sitemap, 41 URLs | `revalidate = 3600`, `dynamic = "force-dynamic"` | – |
| - [ ] `app/robots.ts` | robots.txt, sperrt `/admin`, `/api/` | statisch | – |
| - [ ] `app/favicon.ico` | Favicon | – | – |

### 1.2 Öffentlich (`app/(marketing)/`)

| Route | Datei | Rendering | `generateMetadata` / `metadata` | JSON-LD |
| --- | --- | --- | --- | --- |
| - [ ] `/` | `page.tsx` | `revalidate = 300` + `dynamic = "force-dynamic"` | `metadata` | `RealEstateAgent` (Layout) + `FAQPage` |
| - [ ] `/immobilien` | `immobilien/page.tsx` | `revalidate = 120`, 2 × `Suspense` | `metadata` | `RealEstateAgent` |
| - [ ] `/immobilien` (Ladezustand) | `immobilien/loading.tsx` | Server | – | – |
| - [ ] `/immobilien/[slug]` | `immobilien/[slug]/page.tsx` | `revalidate = 300`, `dynamicParams = true`, **kein `generateStaticParams`** | `generateMetadata` | `RealEstateAgent` + `Residence`/`RentAction` mit `Offer`, `GeoCoordinates`, `QuantitativeValue`, `PostalAddress` |
| - [ ] `/immobilie-verkaufen` | `immobilie-verkaufen/page.tsx` | statisch | `metadata` | `RealEstateAgent` + `FAQPage` |
| - [ ] `/immobilie-verkaufen/ablauf` | `.../ablauf/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/immobilie-verkaufen/unterlagen` | `.../unterlagen/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/immobilie-verkaufen/immobilienwert` | `.../immobilienwert/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/immobilie-verkaufen/maklerprovision` | `.../maklerprovision/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/immobilie-verkaufen/immobilie-geerbt` | `.../immobilie-geerbt/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/immobilie-verkaufen/energieausweis` | `.../energieausweis/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/immobilienbewertung` | `immobilienbewertung/page.tsx` | statisch | `metadata` | `RealEstateAgent` + `FAQPage` |
| - [ ] `/suchprofil` | `suchprofil/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/ueber-uns` | `ueber-uns/page.tsx` | `revalidate = 600` + `dynamic = "force-dynamic"` | `metadata` | `RealEstateAgent` |
| - [ ] `/bewertungen` | `bewertungen/page.tsx` | `revalidate = 600` + `dynamic = "force-dynamic"` | `metadata` | `RealEstateAgent` |
| - [ ] `/ratgeber` | `ratgeber/page.tsx` | `revalidate = 600` | `metadata` | `RealEstateAgent` |
| - [ ] `/ratgeber/[slug]` | `ratgeber/[slug]/page.tsx` | `revalidate = 600`, `dynamicParams = true`, **kein `generateStaticParams`** | `generateMetadata` | `RealEstateAgent` + `Article` (`Person`/`Organization`) |
| - [ ] `/kontakt` | `kontakt/page.tsx` | `revalidate = 600` | `metadata` | `RealEstateAgent` |
| - [ ] `/impressum` | `impressum/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/datenschutz` | `datenschutz/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `/widerruf` | `widerruf/page.tsx` | statisch | `metadata` | `RealEstateAgent` |
| - [ ] `app/(marketing)/layout.tsx` | `HeaderSwitch` + `Footer` + globales `RealEstateAgent`-JSON-LD | Server | – | `RealEstateAgent` |

> `RealEstateAgent` liegt im Marketing-Layout und erscheint deshalb auf **jeder**
> öffentlichen Seite – inklusive `AggregateRating` (aus `site.stats`),
> `PostalAddress` und `areaServed` (`City` je Region).

### 1.3 Verwaltung (`app/admin/`)

| Route | Datei | Rendering | Schutz |
| --- | --- | --- | --- |
| - [ ] `/admin` | `admin/page.tsx` | `dynamic = "force-dynamic"` | `requireSession()` + Middleware |
| - [ ] `/admin/login` | `admin/login/page.tsx` | **Client** | offen (Ausnahme in Middleware) |
| - [ ] `/admin/immobilien` | `admin/immobilien/page.tsx` | `dynamic = "force-dynamic"` | Session |
| - [ ] `/admin/immobilien/neu` | `.../neu/page.tsx` | `dynamic = "force-dynamic"` | Session |
| - [ ] `/admin/immobilien/[id]` | `.../[id]/page.tsx` | `dynamic = "force-dynamic"` | Session |
| - [ ] `/admin/anfragen` | `admin/anfragen/page.tsx` | `dynamic = "force-dynamic"` | Session |
| - [ ] `/admin/blog` | `admin/blog/page.tsx` | `dynamic = "force-dynamic"` | Session |
| - [ ] `/admin/blog/neu` | `admin/blog/neu/page.tsx` | Server | Session |
| - [ ] `/admin/oeffnungszeiten` | `admin/oeffnungszeiten/page.tsx` | `dynamic = "force-dynamic"` | Session |
| - [ ] `/admin/schnittstellen` | `admin/schnittstellen/page.tsx` | `dynamic = "force-dynamic"` | Session |
| - [ ] `app/admin/layout.tsx` | Admin-Rahmen, `metadata` mit `robots: noindex` | Server | – |

### 1.4 API und Middleware

| Eintrag | Datei | Details |
| --- | --- | --- |
| - [ ] `POST /api/blog-import` | `app/api/blog-import/route.ts` | `runtime = "nodejs"`; API-Key-Prüfung per `timingSafeEqual`; **kann per `allowUnauthenticated` offen geschaltet werden** |
| - [ ] Admin-Middleware | `middleware.ts` | `matcher: ["/admin/:path*"]`, leitet ohne Cookie `makler_admin_session` auf `/admin/login` |

### 1.5 Redirects (`next.config.ts`)

Sechs permanente Redirects, generiert aus `sellTopics[].legacySlug`:

- [ ] `/ratgeber/immobilie-verkaufen-ablauf` → `/immobilie-verkaufen/ablauf`
- [ ] `/ratgeber/unterlagen-immobilienverkauf` → `/immobilie-verkaufen/unterlagen`
- [ ] `/ratgeber/was-ist-meine-immobilie-wert` → `/immobilie-verkaufen/immobilienwert`
- [ ] `/ratgeber/maklerprovision-erklaert` → `/immobilie-verkaufen/maklerprovision`
- [ ] `/ratgeber/immobilie-geerbt-was-tun` → `/immobilie-verkaufen/immobilie-geerbt`
- [ ] `/ratgeber/energieausweis-verstehen` → `/immobilie-verkaufen/energieausweis`

### 1.6 Sicherheits-Header (`next.config.ts`, für `/:path*`)

- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [ ] `poweredByHeader: false`

---

## 2. Komponenten

### 2.1 Layout (`components/layout/`)

| Komponente | Props | Modus | Verwendet in |
| --- | --- | --- | --- |
| - [ ] `Header` | `overlay?: boolean` | Client | `HeaderSwitch` |
| - [ ] `HeaderSwitch` | – | Client | `(marketing)/layout.tsx` – schaltet Overlay-Variante auf `/` |
| - [ ] `Footer` | – | Server | `(marketing)/layout.tsx` |
| - [ ] `Logo` | `variant`, `className` | Server | Header, Footer, MobileMenu, Admin-Layout, Admin-Login |
| - [ ] `MobileMenu` | `open: boolean`, `onClose: () => void` | Client | `Header` |
| - [ ] `NavDropdown` | Nav-Gruppen, Teaser | Client | `Header` |
| - [ ] `nav.ts` | `mainNav`, `footerNav`, Typen `NavItem`/`NavGroup` | Daten | Header, MobileMenu, Footer |

### 2.2 Marketing (`components/marketing/`)

| Komponente | Props | Modus | Verwendet in |
| --- | --- | --- | --- |
| - [ ] `Hero` | `cities: string[]` | Server | `/` |
| - [ ] `PageHero` | Titel, Text, Bild | Server | `/bewertungen`, `/immobilien` |
| - [ ] `SubpageHeader` | Titel, Teaser, Bild | Server | alle 6 Verkaufs-Unterseiten |
| - [ ] `SectionHeading` | `eyebrow`, `title`, `text` | Server | 7 Stellen |
| - [ ] `Services` | – | Server | `/` |
| - [ ] `ChoiceTiles` | – | Server | `/` |
| - [ ] `Credentials` | – | Server | `/` |
| - [ ] `GuideTeasers` | – | Server | `/` |
| - [ ] `OfficeInvite` | – | Server | `/` |
| - [ ] `StatsCounter` | – | **Client** (Zählanimation) | `/` |
| - [ ] `ProcessSteps` | – | **Client** | `/`, `/immobilie-verkaufen` |
| - [ ] `FAQ` + `generalFaq` | `items`, Titel | Server | `/`, `/immobilie-verkaufen`, `/immobilienbewertung` |
| - [ ] `CTASection` | Titel, Text, Buttons | Server | 13 Seiten |
| - [ ] `ContactForm` | `defaultSubject?: string` | **Client** | `/kontakt` |
| - [ ] `SellSubnav` | `current: string`, `className?` | Server | alle 6 Verkaufs-Unterseiten |
| - [ ] `SellTopicsGrid` | `exclude?`, Titel | Server | `/immobilie-verkaufen` + 6 Unterseiten |
| - [ ] `TrustBar` | – | Server | **nirgends verwendet** |
| - [ ] `OrangeStatBar` | Titel, Werte | Server | **nirgends verwendet, nicht versioniert** |

### 2.3 Immobilien (`components/property/`)

| Komponente | Props | Modus | Verwendet in |
| --- | --- | --- | --- |
| - [ ] `PropertySearch` | `cities: string[]`, `className?` | **Client** | `Hero` |
| - [ ] `PropertyFilters` | Suchparameter, Städte, Trefferzahl | **Client** | `/immobilien` |
| - [ ] `PropertyGrid` | `items`, `columns` | Server | `/immobilien`, Detailseite, `loading.tsx`, `/` |
| - [ ] `PropertyGridSkeleton` | `count = 6` | Server | Suspense-Fallback |
| - [ ] `PropertyEmptyState` | Titel, Text | Server | `/immobilien` |
| - [ ] `PropertyCarousel` | `items`, Titel | Server | `/` |
| - [ ] `PropertyCard` | `property: PropertyCardData` | Server | `PropertyGrid` |
| - [ ] `PropertyGallery` | `images: GalleryImage[]`, `title` | **Client** | Detailseite |
| - [ ] `PropertyFacts` + `FeatureList` | `facts: Fact[]` / `items: string[]` | Server | Detailseite |
| - [ ] `PropertyInquiryForm` | `propertyId`, `propertyTitle`, Berater | **Client** | Detailseite |

### 2.4 Funnel (`components/funnel/`)

| Komponente | Props | Modus | Verwendet in |
| --- | --- | --- | --- |
| - [ ] `FunnelLayout` | Titel, Teaser, Vorteile, `children` | Server | `/suchprofil`, `/immobilie-verkaufen`, `/immobilienbewertung` |
| - [ ] `FunnelProgress` | `steps: string[]`, `current`, `maxReached` | **Client** | beide Funnel |
| - [ ] `PropertyTypeSelector` | Auswahl + Callback | **Client** | `ValuationFunnel` |
| - [ ] `ValuationFunnel` | `variant: "BEWERTUNG" \| "VERKAUF"` | **Client** | `/immobilienbewertung`, `/immobilie-verkaufen` |
| - [ ] `SearchProfileFunnel` | – | **Client** | `/suchprofil`, `/kontakt` |

### 2.5 Karte, Bewertungen, UI

| Komponente | Props | Modus | Verwendet in |
| --- | --- | --- | --- |
| - [ ] `PropertyMap` | `markers: MapMarker[]`, Zentrum, Zoom, Höhe | **Client** (Leaflet) | `/immobilien`, Detailseite, `/kontakt` |
| - [ ] `PropertyOverviewMap` | Marker aus aktueller Filterung | **Client** | `/immobilien` |
| - [ ] `RatingStars` | `rating`, `size` | Server | `/`, `ReviewSummary`, `ReviewCard` |
| - [ ] `ReviewCard` | `review: Review`, `className?` | Server | `/`, `/bewertungen` |
| - [ ] `ReviewSummary` | Durchschnitt, Anzahl, Verteilung | Server | `/bewertungen` |
| - [ ] `Accordion` + `AccordionItem` | `items`, `className?` | **Client** | `FAQ`, `/immobilie-verkaufen/ablauf` |
| - [ ] `Badge` | `tone`, `children` | Server | Karte, Detailseite, 3 Admin-Seiten |
| - [ ] `Button` / `ButtonLink` / `buttonClasses` | `variant`, `size`, `fullWidth` | Server | 21 Stellen |
| - [ ] `Card` / `CardBody` | `children`, `className?` | Server | **nirgends verwendet** |
| - [ ] `Container` / `Section` | `width`, `padding` | Server | 34 Stellen |
| - [ ] `Input` / `Textarea` / `Select` / `Checkbox` / `OptionCard` (`Field.tsx`) | Label, Fehler, Hinweis | **Client** | alle Formulare + Admin |
| - [ ] `SuccessPanel` / `ErrorNote` (`FormStatus.tsx`) | Titel, Text | Server | alle Formulare |
| - [ ] `Reveal` | `delay`, `children` | **Client** (Scroll-Animation) | 19 Stellen |
| - [ ] `SectionHeading` | s. o. | Server | – |
| - [ ] `icons/index.tsx` | ~20 Icon-Komponenten (`IconHouse`, `IconSearch`, `IconChevron*`, …) | Server | überall |

### 2.6 Seitenlokale Komponenten

- [ ] `app/(marketing)/immobilien/Pagination.tsx` – **Server**, echte `<Link>`-Seitenzahlen
- [ ] `app/(marketing)/immobilien/PropertySort.tsx` – **Client**, Sortier-`<select>`
- [ ] `app/admin/AdminNav.tsx` – Client
- [ ] `app/admin/anfragen/StatusSelect.tsx` – Client
- [ ] `app/admin/immobilien/PropertyForm.tsx` – Client

---

## 3. Datenmodell (`prisma/schema.prisma`)

Provider: PostgreSQL, `prisma-client-js`. Drei Migrationen unter
`prisma/migrations/`.

### 3.1 Enums

- [ ] `MarketingType` – `KAUF`, `MIETE`
- [ ] `PropertyType` – `HAUS`, `WOHNUNG`, `MEHRFAMILIENHAUS`, `GRUNDSTUECK`, `GEWERBE`
- [ ] `PropertyStatus` – `VERFUEGBAR`, `RESERVIERT`, `VERKAUFT`, `VERMIETET`, `IN_VORBEREITUNG`
- [ ] `EnergyCertificateType` – `VERBRAUCHSAUSWEIS`, `BEDARFSAUSWEIS`, `NICHT_ERFORDERLICH`
- [ ] `EnergyEfficiencyClass` – `A_PLUS`, `A`–`H`
- [ ] `HeatingType` – `GAS`, `OEL`, `FERNWAERME`, `WAERMEPUMPE`, `PELLET`, `SOLAR`, `BLOCKHEIZKRAFTWERK`, `ELEKTRO`
- [ ] `PropertyCondition` – `NEUWERTIG`, `SANIERT`, `GEPFLEGT`, `RENOVIERUNGSBEDUERFTIG`, `ABRISSOBJEKT`
- [ ] `SellingIntent` – `BALD_VERKAUFEN`, `INFORMIEREN`, `PROFESSIONELLE_BEWERTUNG`, `KONKRETES_OBJEKT`
- [ ] `RequestStatus` – `NEU`, `IN_BEARBEITUNG`, `KONTAKTIERT`, `ABGESCHLOSSEN`
- [ ] `LeadSource` – `OBJEKTANFRAGE`, `VERKAUFSFUNNEL`, `BEWERTUNGSFUNNEL`, `KONTAKTFORMULAR`, `SUCHPROFIL`

### 3.2 Modelle

| Modell | Kernfelder | Relationen | Indizes |
| --- | --- | --- | --- |
| - [ ] `Property` | `slug` (unique), `title`, `shortDescription`, `description`, `marketingType`, `propertyType`, `status`, `price`, `currency`, `priceOnRequest`, `serviceCharge`, `livingArea`, `plotArea`, `usableArea`, `rooms`, `bedrooms`, `bathrooms`, `yearBuilt`, `condition`, Energiefelder, Adresse + `latitude`/`longitude`, `highlights[]`, `features[]`, `locationDescription`, `featured`, `publishedAt`, `importSource`, `externalId` | `agent`, `images[]`, `documents[]`, `leads[]` | `@@unique([importSource, externalId])`, `[marketingType, propertyType]`, `[city]`, `[featured]`, `[publishedAt]` |
| - [ ] `PropertyImage` | `url`, `alt`, `sortOrder`, `isCover` | `property` (Cascade) | `[propertyId, sortOrder]` |
| - [ ] `PropertyDocument` | `title`, `url`, `kind` (EXPOSE/GRUNDRISS/ENERGIEAUSWEIS) | `property` (Cascade) | `[propertyId]` |
| - [ ] `Agent` | `slug` (unique), `firstName`, `lastName`, `role`, `email`, `phone`, `imageUrl`, `bio`, `focus[]`, `sortOrder`, `active` | `properties[]`, `leads[]`, `blogPosts[]`, `savedSearches[]` | – |
| - [ ] `Lead` | `source`, `status`, Kontaktfelder, `message`, `privacyAccepted`, `internalNote` | `property` (SetNull), `agent` (SetNull) | `[status, createdAt]`, `[source]` |
| - [ ] `ValuationRequest` | `funnel` (BEWERTUNG/VERKAUF), `propertyType`, Adresse, Eckdaten, `sellingIntent`, Kontakt, `estimatedValueMin/Max`, `valuationProvider` | – | `[status, createdAt]` |
| - [ ] `ContactRequest` | `subject`, Kontakt, `message`, `privacyAccepted` | – | `[status, createdAt]` |
| - [ ] `SavedSearch` | `label`, `query` (Json), `marketingType`, `propertyTypes[]`, `regions[]`, `zipCode`, `radiusKm`, Preis/Zimmer/Fläche-Untergrenzen, `timeframe`, `financing`, `ownUse`, Kontakt, `notifyByEmail` | `agent` (SetNull) | `[email]`, `[status, createdAt]` |
| - [ ] `Review` | `authorName`, `initials`, `rating`, `title`, `body`, `city`, `propertyType`, `serviceType`, `published`, **`isDemo` (Default `true`)**, `reviewedAt` | – | `[published, reviewedAt]` |
| - [ ] `BlogCategory` | `slug` (unique), `name`, `description` | `posts[]` | – |
| - [ ] `BlogPost` | `slug` (unique), `title`, `excerpt`, `content`, `coverImage`, `readingMinutes`, `seoTitle`, `seoDescription`, `published`, `publishedAt` | `category` (SetNull), `author` → `Agent` (SetNull) | `[published, publishedAt]` |
| - [ ] `OpeningHour` | `days`, `hours`, `closed`, `sortOrder` – leer ⇒ Vorgabe aus `lib/site.ts` | – | `[sortOrder]` |
| - [ ] `FtpAccount` | `username` (unique), `homeDir`, `enabled` – Passwort nur in SFTPGo | – | – |
| - [ ] `OpenImmoImport` | `fileName`, `checksum` (unique), `status`, `propertyCount`, `error` | – | – |
| - [ ] `LeadPushProvider` | `provider` (unique: ONOFFICE/PROPSTACK/FLOWFACT), `enabled`, `endpoint`, `apiKey` | – | – |
| - [ ] `BlogApiSettings` | Singleton `id = "default"`, `enabled`, `allowUnauthenticated`, `apiKey` | – | – |

---

## 4. Server Actions (`lib/actions/`)

### 4.1 Öffentliche Formular-Actions (`lib/actions/inquiries.ts`, `"use server"`)

| Action | Signatur | Schema | Wirkung |
| --- | --- | --- | --- |
| - [ ] `submitPropertyInquiry` | `(prev: FormState, fd: FormData) => Promise<FormState>` | `propertyInquirySchema` | `createPropertyLead`, `revalidatePath("/admin")` |
| - [ ] `submitValuationRequest` | `(prev, fd) => Promise<FormState>` | `valuationSchema` | `createValuationRequest` (Funnel BEWERTUNG/VERKAUF) |
| - [ ] `submitContactRequest` | `(prev, fd) => Promise<FormState>` | `contactSchema` | `createContactRequest` |
| - [ ] `submitSearchProfile` | `(prev, fd) => Promise<FormState>` | `searchProfileSchema` | `createSearchProfile` |

`lib/actions/form-state.ts`: `FormState` (`status`, `message`, `errors`) und
`initialFormState`.

### 4.2 Verwaltungs-Actions (`lib/actions/admin.ts`, `"use server"`)

- [ ] `loginAction(prev, fd)` – `adminLoginSchema`, `verifyCredentials`, `createSession`
- [ ] `logoutAction()` – `destroySession`
- [ ] `savePropertyAction(prev, fd)` – `adminPropertySchema`, Anlegen **und** Bearbeiten, Geocoding-Anstoß
- [ ] `deletePropertyAction(fd)`
- [ ] `updateRequestStatusAction(fd)` – Status auf Lead/Valuation/Contact/SavedSearch
- [ ] `createFtpAccountAction(fd)` – legt SFTPGo-Nutzer an
- [ ] `deleteFtpAccountAction(fd)`
- [ ] `saveLeadPushProvidersAction(fd)`
- [ ] `saveBlogAction(fd)`
- [ ] `saveBlogApiSettingsAction(fd)`
- [ ] `saveOpeningHoursAction(fd)` – `openingHourSchema`
- [ ] `resetOpeningHoursAction()`

### 4.3 Zod-Schemata (`lib/validations/forms.ts`)

- [ ] `privacySchema` – erzwingt Zustimmung
- [ ] `honeypotSchema` – Feld `website`, muss leer bleiben
- [ ] `propertyInquirySchema` – `propertyId`, `lastName`, `email` Pflicht
- [ ] `contactSchema` – `message` mind. 10 Zeichen
- [ ] `valuationSchema` – `funnel`, `propertyType`, PLZ `^\d{5}$`, `city`, optionale Eckdaten, `sellingIntent`, Kontakt
- [ ] `searchProfileSchema` – `propertyTypes` mind. 1, Kommalisten, Preisprüfung `priceMin <= priceMax`
- [ ] `openingHourSchema`, `adminLoginSchema`, `adminPropertySchema`
- [ ] Bausteine: `propertyTypeEnum`, `conditionEnum`, `sellingIntentEnum`, `searchTimeframeEnum` (`SOFORT`, `DREI_MONATE`, `SECHS_MONATE`, `JAHR`, `UNBESTIMMT`), `searchFinancingEnum` (`GESICHERT`, `IN_KLAERUNG`, `OFFEN`, `BERATUNG`)

---

## 5. Repositories (`lib/repositories/`)

### 5.1 `properties.ts` (11)

| Funktion | Signatur | Zweck |
| --- | --- | --- |
| - [ ] `propertyCardSelect` | Prisma-Select | Feldauswahl für Kacheln |
| - [ ] `distanceKm(a, b)` | `→ number` | Haversine-Distanz in km |
| - [ ] `findProperties(query)` | `PropertyQuery → { items, total, page, perPage, pageCount }` | Filter, Sortierung, Paginierung; bei Umkreissuche Bounding-Box + exakter Kreis |
| - [ ] `findFeaturedProperties(take = 6)` | | Hervorgehobene Objekte |
| - [ ] `findLatestProperties(take = 6)` | | Neueste Objekte |
| - [ ] `findPropertyBySlug(slug)` | | Detailseite inkl. Bilder, Dokumenten, Berater |
| - [ ] `findSimilarProperties(property)` | | Ähnliche Objekte auf der Detailseite |
| - [ ] `findAllPropertySlugs()` | | Sitemap |
| - [ ] `findPropertyCities()` | | Ortsauswahl in Suche und Filtern |
| - [ ] `countProperties()` | | Kennzahl |
| - [ ] `findPropertyMapMarkers(query, take = 300)` | | Marker für die Übersichtskarte |
| - [ ] `countPropertiesWithoutCoordinates()` | | Geocoding-Rückstand |

### 5.2 Weitere

- [ ] `blog.ts` (5): `findBlogPosts({category?, take?})`, `findBlogPostBySlug(slug)`, `findBlogCategories()`, `findRelatedPosts(postId, categoryId, take = 3)`, `findAllPostSlugs()`
- [ ] `agents.ts` (3): `findAgents()`, `findAgentBySlug(slug)`, `findPrimaryAgent()`
- [ ] `reviews.ts` (2): `findReviews(take?)`, `getReviewSummary()`
- [ ] `settings.ts` (2): `findOpeningHours()` (Fallback `site.openingHours`), `findOpeningHoursForAdmin()`
- [ ] `admin.ts` (5): `getDashboardStats()`, `getRecentActivity()`, `getAdminProperties()`, `getAdminProperty(id)`, `getAllRequests()`

### 5.3 Dienste (`lib/services/`)

- [ ] `auth.ts` – `verifyCredentials`, `createSession`, `destroySession`, `getSession`, `requireSession`, Cookie `makler_admin_session`
- [ ] `leads.ts` – `createPropertyLead`, `createValuationRequest`, `createContactRequest`, `createSearchProfile`
- [ ] `geocoding.ts` – `geocodeAddress`, `formatAddressQuery`, `addressChanged`
- [ ] `place-lookup.ts` – `lookupPlaceCenter(input)` für die Umkreissuche
- [ ] `valuation.ts` – `valuationService` mit austauschbarem `ValuationProvider`
- [ ] `lead-push.ts` – `pushLeadToConfiguredCrms(kind, payload)`
- [ ] `sftpgo.ts` – `createSftpGoUser`, `deleteSftpGoUser`
- [ ] `uploads.ts` – `uploadRoot`, `saveUploadedImage(file, "blog" | "openimmo")`

---

## 6. Interaktive Funktionen im Einzelnen

### 6.1 Hero-Schnellsuche (`components/property/PropertySearch.tsx`)

- [ ] Tabs `role="tablist"` mit `aria-selected`: **Alle** (`""`), **Kaufen** (`kauf`), **Mieten** (`miete`)
- [ ] Feld **Immobilientyp** – `<select>` aus `propertyTypeLabels`, setzt `typ`
- [ ] Feld **Ort** – `<select>` aus `findPropertyCities()`, setzt `ort`
- [ ] Feld **Umkreis** – setzt `umkreis`; **wird nur übernommen, wenn `ort` gesetzt ist**
- [ ] Aufklappbereich „mehr“ (`showMore`): **Preis max.** und **Zimmer**
- [ ] Preisstufen tab-abhängig: Miete `600/900/1200/1600/2200/4000`, sonst `300000/500000/750000/1000000/1500000/2500000`
- [ ] Absenden baut `/immobilien?…` und navigiert per `router.push` in einer `useTransition`
- [ ] **Kein `action`/`method`** – ohne JavaScript nicht bedienbar (siehe §11)

### 6.2 Filter auf `/immobilien` (`components/property/PropertyFilters.tsx`)

- [ ] Zustand aus der URL gelesen, Resynchronisierung über `syncedKey` bei Rück-/Vorwärtsnavigation
- [ ] Felder: `marketing`, `ort`, `typ` (Mehrfachauswahl), `preis_min`, `preis_max`, `zimmer`, `flaeche`, `umkreis`
- [ ] Umkreis-`<select>` ist deaktiviert, solange kein Ort gewählt ist
- [ ] Zwei Darstellungen: Seitenleiste ab Desktop, Schublade („`open`") auf schmalen Viewports
- [ ] „Zurücksetzen“ navigiert auf `/immobilien`
- [ ] Zähler aktiver Filter über `countActiveFilters()`
- [ ] Absenden per `router.push(..., { scroll: false })`

### 6.3 Sortierung (`app/(marketing)/immobilien/PropertySort.tsx`)

- [ ] `<select id="sortierung">` mit `sr-only`-Label
- [ ] Werte: `neueste` (Standard, entfernt den Parameter), `preis-auf`, `preis-ab`, `flaeche`
- [ ] Setzt `sort`, **löscht `seite`**, navigiert ohne Scroll
- [ ] Serverseitig: `buildOrderBy()` – Objekte ohne Preis landen bei Preissortierung stets am Ende (`nulls: "last"`)

### 6.4 Trefferzähler

- [ ] Text „**N** Objekt/Objekte gefunden“ aus `findProperties().total`, mit `formatNumber`
- [ ] Bei mehr Treffern als einer Seite zusätzlich der Bereich „von–bis“ (`from`/`to`)
- [ ] Korrekte Einzahl/Mehrzahl (`total === 1 ? "Objekt" : "Objekte"`)

### 6.5 Paginierung (`app/(marketing)/immobilien/Pagination.tsx`)

- [ ] 9 Objekte je Seite (`perPage: 9`, serverseitig auf 1–48 begrenzt)
- [ ] Server-Komponente mit echten `<Link>` – **funktioniert ohne JavaScript**
- [ ] Kompakte Liste: erste, letzte und Umgebung der aktuellen Seite, Lücken als „…“
- [ ] `rel="prev"`/`rel="next"`, `aria-current="page"`, `aria-label="Seitennavigation"`
- [ ] Seite 1 lässt `seite` weg (kanonische URL)

### 6.6 Karten (Leaflet)

- [ ] `PropertyMap` – Marker, Zentrum, Zoom, Höhe; Kacheln von `https://tile.openstreetmap.org/{z}/{x}/{y}.png`; Fehlerzustand `failed`
- [ ] `PropertyOverviewMap` auf `/immobilien` – Marker folgen der aktuellen Filterung (`findPropertyMapMarkers`, max. 300), eigene `Suspense`-Grenze
- [ ] Detailseite: Lagekarte des Objekts
- [ ] `/kontakt`: Bürostandort aus `site.address`
- [ ] **Ohne Einwilligungsabfrage** – siehe §11

### 6.7 Funnel 1 – Bewertung/Verkauf (`components/funnel/ValuationFunnel.tsx`)

- [ ] Variante `BEWERTUNG` (5 Schritte): Immobilientyp → Standort → Eckdaten → Kontaktdaten → Zusammenfassung
- [ ] Variante `VERKAUF` (6 Schritte): zusätzlich **Ihre Situation** zwischen Eckdaten und Kontaktdaten
- [ ] Schritt „Immobilientyp“ über `PropertyTypeSelector`
- [ ] Schritt „Standort“: PLZ (5 Ziffern), Ort, Straße (optional)
- [ ] Schritt „Eckdaten“: Wohnfläche, Grundstück, Zimmer, Baujahr, Zustand – **bei `GRUNDSTUECK` entfallen Wohnfläche und Zimmer** (`isLand()`)
- [ ] Schritt „Ihre Situation“: `SellingIntent` in fester Reihenfolge
- [ ] Schritt „Kontaktdaten“: Vorname, Nachname, E-Mail, Telefon, Nachricht, Datenschutz-Zustimmung
- [ ] Zusammenfassung mit `SummaryRow`, Absenden über `submitValuationRequest`
- [ ] Schrittweise Prüfung (`validate`), Vor/Zurück, `maxReached` erlaubt Sprünge nur zu bereits erreichten Schritten

### 6.8 Funnel 2 – Suchprofil (`components/funnel/SearchProfileFunnel.tsx`)

- [ ] 6 Schritte: Kauf oder Miete → Immobilientyp → Wunschlage → Budget & Größe → Zeitrahmen → Kontaktdaten
- [ ] Immobilientypen als Mehrfachauswahl (`toggleType`), mindestens einer Pflicht
- [ ] Wunschlage: Regionen (Kommaliste), PLZ, Umkreis
- [ ] Budget: `priceMin`, `priceMax`, `roomsMin`, `areaMin`, `plotAreaMin`; Eingaben wie „750.000“ werden per `toNumberString` normalisiert
- [ ] Zeitrahmen: `timeframe`, `financing`, `ownUse`
- [ ] Kontakt: Name, E-Mail, Telefon, Nachricht, `notifyByEmail`, Datenschutz
- [ ] Absenden über `submitSearchProfile`

### 6.9 Alle Formulare

| Formular | Ort | Action | Felder |
| --- | --- | --- | --- |
| - [ ] Objektanfrage | `/immobilien/[slug]` | `submitPropertyInquiry` | `propertyId` (hidden), Vorname, Nachname*, E-Mail*, Telefon, Nachricht, Datenschutz*, `website` (Honeypot) |
| - [ ] Kontaktformular | `/kontakt` | `submitContactRequest` | Betreff, Vorname, Nachname*, E-Mail*, Telefon, Nachricht* (≥10), Datenschutz*, Honeypot |
| - [ ] Bewertungsfunnel | `/immobilienbewertung` | `submitValuationRequest` | s. §6.7 |
| - [ ] Verkaufsfunnel | `/immobilie-verkaufen` | `submitValuationRequest` (`funnel=VERKAUF`) | s. §6.7 |
| - [ ] Suchprofil | `/suchprofil`, `/kontakt` | `submitSearchProfile` | s. §6.8 |
| - [ ] Hero-Schnellsuche | `/` | – (Navigation) | s. §6.1 |
| - [ ] Objektfilter | `/immobilien` | – (Navigation) | s. §6.2 |
| - [ ] Admin-Login | `/admin/login` | `loginAction` | E-Mail, Passwort |
| - [ ] Objektpflege | `/admin/immobilien/neu`, `/[id]` | `savePropertyAction` | vollständiges Objektformular |
| - [ ] Öffnungszeiten | `/admin/oeffnungszeiten` | `saveOpeningHoursAction`, `resetOpeningHoursAction` | Tage, Uhrzeit, geschlossen, Reihenfolge |
| - [ ] Schnittstellen | `/admin/schnittstellen` | `createFtpAccountAction`, `deleteFtpAccountAction`, `saveLeadPushProvidersAction`, `saveBlogApiSettingsAction` | FTP-Konten, CRM-Endpunkte, Blog-API |
| - [ ] Blogpflege | `/admin/blog`, `/admin/blog/neu` | `saveBlogAction` | Titel, Slug, Auszug, Inhalt, Bild, SEO |
| - [ ] Statuswechsel | `/admin/anfragen` | `updateRequestStatusAction` | `StatusSelect` |

Alle öffentlichen Formulare tragen ein Honeypot-Feld `website` und erzwingen
die Datenschutz-Zustimmung.

### 6.10 Navigation

- [ ] **Mega-Menü „Immobilie finden“** – 3 Gruppen (Kaufen: Wohnung, Haus, Kapitalanlage, Grundstück, Gewerbe · Mieten: Wohnung, Haus, Gewerbe · Überblick: Alle Immobilienangebote) + Teaser „Suchprofil hinterlegen“ → `/suchprofil`
- [ ] **Mega-Menü „Für Eigentümer“** – 3 Gruppen (Verkaufen: Immobilie verkaufen, Ablauf, Unterlagen · Bewerten: Kostenlose Bewertung, Wie ein Wert entsteht, Energieausweis · Besondere Situationen: Immobilie geerbt, Maklerprovision) + Teaser „Kostenlose Ersteinschätzung“ → `/immobilienbewertung`
- [ ] Einfache Punkte: Über uns, Ratgeber, Kontakt
- [ ] **Mobilmenü** (`MobileMenu`) – Vollbild-Schublade, `open`/`onClose`, gleiche Struktur
- [ ] **`HeaderSwitch`** – Overlay-Header auf `/`, sonst normal
- [ ] **Footer** – drei Spalten aus `footerNav`: Leistungen (5), Unternehmen (4), Rechtliches (3, inkl. `/widerruf`)
- [ ] **`SellSubnav`** – Unternavigation auf allen 6 Verkaufs-Unterseiten
- [ ] Skip-Link im Root-Layout

---

## 7. URL-Parameter der Suche (`lib/search-params.ts`)

| Parameter | Erlaubte Werte | Verarbeitung |
| --- | --- | --- |
| - [ ] `marketing` | `KAUF`, `MIETE` (Groß-/Kleinschreibung egal – wird uppercased) | sonst ignoriert |
| - [ ] `typ` | `HAUS`, `WOHNUNG`, `MEHRFAMILIENHAUS`, `GRUNDSTUECK`, `GEWERBE`; mehrfach oder kommasepariert | ungültige Werte werden verworfen |
| - [ ] `ort` | Freitext | Vergleich gegen `city`, `region`, `zipCode`-Präfix |
| - [ ] `umkreis` | Zahl in km, **auf 200 begrenzt**, nur `> 0` | nur mit geokodiertem `ort` wirksam |
| - [ ] `q` | Freitext | Suche in `title`, `shortDescription`, `city` |
| - [ ] `preis_min` / `preis_max` | Zahl (Nicht-Ziffern werden entfernt) | `price >= / <=` |
| - [ ] `zimmer` | Zahl | `rooms >=` |
| - [ ] `flaeche` | Zahl | `livingArea >=` |
| - [ ] `sort` | `neueste` (Standard), `preis-auf`, `preis-ab`, `flaeche` | ungültig ⇒ `neueste` |
| - [ ] `seite` | Zahl, Standard 1 | `perPage` fest 9 |

- [ ] `buildPropertyHref(current, changes)` – **löscht `seite` automatisch**, sobald sich ein anderer Filter ändert
- [ ] `countActiveFilters(params)` – zählt über `marketing`, `typ`, `ort`, `umkreis`, `q`, `preis_min`, `preis_max`, `zimmer`, `flaeche`

---

## 8. Bildinventar

### 8.1 `public/`

Enthält **ausschließlich die fünf Vorlagen-SVGs von `create-next-app`**, von
denen keines im Code referenziert wird:

- [ ] `public/file.svg` – ungenutzt
- [ ] `public/globe.svg` – ungenutzt
- [ ] `public/next.svg` – ungenutzt
- [ ] `public/vercel.svg` – ungenutzt
- [ ] `public/window.svg` – ungenutzt

Es gibt **kein eigenes Logo als Datei** – `components/layout/Logo.tsx` zeichnet
die Marke als Schriftzug. Kein OG-Bild, kein `apple-touch-icon`.

### 8.2 Externe Bildquellen

Erlaubt in `next.config.ts` ist nur `images.unsplash.com`. Im Repo fest
verdrahtete Unsplash-IDs:

| ID | Verwendung |
| --- | --- |
| - [ ] `photo-1560518883-ce09059eeffa` | `sell-topics`: Ablauf |
| - [ ] `photo-1497366754035-f200968a6e72` | `sell-topics`: Unterlagen |
| - [ ] `photo-1554224155-6726b3ff858f` | `sell-topics`: Immobilienwert |
| - [ ] `photo-1450101499163-c8848c66ca85` | `sell-topics`: Maklerprovision |
| - [ ] `photo-1502672260266-1c1ef2d93688` | `sell-topics`: Immobilie geerbt |
| - [ ] `photo-1600585154340-be6161a56a0c` | `sell-topics`: Energieausweis |
| - [ ] `photo-1497935586351-b67a49e012bf` | Seitenkopf (Marketing-Seiten) |
| - [ ] `photo-1568605114967-8130f3a36994` | Seitenkopf |
| - [ ] `photo-1600607687939-ce8a6c25118c` | Seitenkopf |

Weitere Unsplash-URLs stehen in `prisma/seed.ts` / `prisma/seed-blog.ts` als
Objekt- und Artikelbilder in der Datenbank.

Zusätzlich lädt die Karte Kacheln von `https://tile.openstreetmap.org` (kein
`next/image`, deshalb nicht in `remotePatterns`).

### 8.3 Fehlende Bilder

- [ ] Kein Logo als Bilddatei, kein Favicon-Satz außer `app/favicon.ico`
- [ ] Kein OpenGraph-Bild – `og:image` fehlt auf allen Seiten
- [ ] Keine echten Team- und Objektfotos; alles Unsplash-Platzhalter
- [ ] `<ImagePlaceholder>` aus `CLAUDE.md` §5 **existiert nicht**, `MISSING-IMAGES.md` fehlt
- [ ] Positiv: Im Snapshot trägt **jedes** `<img>` ein `alt`-Attribut

---

## 9. JSON-LD / Schema.org

| Seite | Typen |
| --- | --- |
| - [ ] Alle öffentlichen Seiten (Layout) | `RealEstateAgent` mit `PostalAddress`, `AggregateRating`, `areaServed: City[]` |
| - [ ] `/` | zusätzlich `FAQPage` (`Question`/`Answer`) |
| - [ ] `/immobilie-verkaufen` | zusätzlich `FAQPage` |
| - [ ] `/immobilienbewertung` | zusätzlich `FAQPage` |
| - [ ] `/immobilien/[slug]` | zusätzlich `Residence` (Kauf) bzw. `RentAction` (Miete) mit `Offer`, `GeoCoordinates`, `QuantitativeValue`, `PostalAddress` |
| - [ ] `/ratgeber/[slug]` | zusätzlich `Article` mit `Person` (Autor) oder `Organization` |
| - [ ] `/404` | keines (korrekt) |

---

## 10. Content-Snapshot

`content-snapshot/` enthält **26 Dateien** (alle 18 statischen Routen aus der
Sitemap, `/widerruf`, je 3 Beispiele der beiden dynamischen Typen, eine
gefilterte Suchansicht, eine 404-Prüfung). Je Datei: HTTP-Status, `<title>`,
Meta-Description, Canonical, Robots, OpenGraph, H1-Anzahl, alle H1/H2/H3 in
Reihenfolge, Fließtextabsätze, Listenpunkte, Definitionslisten, CTA-Labels mit
Zielen, Bilder mit Alt-Text, Formularfelder und JSON-LD.

- [ ] Alle 26 Routen antworten mit dem erwarteten Status (25 × 200, 1 × 404)
- [ ] Alle 26 Seiten haben **genau eine `<h1>`**
- [ ] Alle 26 Seiten haben Titel, Meta-Description und Canonical

---

## 11. Widersprüche, Fehler und Risiken

Beim Lesen des Repos aufgefallen – **keine davon behoben**, nur erfasst:

### 11.1 Widerspruch zu `CLAUDE.md`

1. - [ ] **Karte nutzt Leaflet, nicht MapLibre.** `CLAUDE.md` §5 erlaubt als
   einzige neue Abhängigkeit MapLibre; `package.json` führt aber `leaflet` und
   `@types/leaflet`. `DECISIONS.md` existiert nicht.
2. - [ ] **Kartendienst lädt ohne Einwilligung.** `CLAUDE.md` §6 verlangt
   „Kartendienste erst nach Einwilligung laden". `PropertyMap.tsx` holt die
   Kacheln direkt von `tile.openstreetmap.org` – im Snapshot 55 Tile-Requests
   ohne jede Abfrage. Das ist zugleich ein datenschutzrechtliches Risiko (die
   IP-Adresse geht an einen Dritten).
3. - [ ] **Suche ist ohne JavaScript nicht bedienbar.** `CLAUDE.md` §6 verlangt
   „Filter als echtes Formular mit URL-Parametern". `PropertySearch`,
   `PropertyFilters` und `PropertySort` arbeiten alle mit `onSubmit`/`onChange`
   plus `router.push` und haben **kein `action`/`method`**. Ohne JavaScript
   lässt sich weder suchen noch filtern noch sortieren. (Die Ergebnisliste und
   die Paginierung sind dagegen korrekt serverseitig.)
4. - [ ] **Vier in `CLAUDE.md` §1 als verbindlich genannte Dateien fehlen:**
   `DESIGN-TOKENS.md`, `REFERENCE-DONDORF.md`, `DECISIONS.md`,
   `OPEN-ITEMS.md` – ebenso `MISSING-IMAGES.md` aus §5.

### 11.2 Fehler und Fundstellen im Code

5. - [ ] **`/widerruf` fehlt in der Sitemap.** Die Route existiert, ist im
   Footer verlinkt und liefert 200 – `app/sitemap.ts` führt sie nicht.
6. - [ ] **Zukünftig veröffentlichte Objekte erscheinen auf der Startseite.**
   `buildWhere()` filtert korrekt mit `publishedAt: { not: null, lte: new Date() }`.
   `findFeaturedProperties()` und `findLatestProperties()` prüfen dagegen nur
   `publishedAt: { not: null }` – ein Objekt mit Datum in der Zukunft ist über
   `/immobilien` unsichtbar, auf `/` aber sichtbar.
7. - [ ] **Blog-Import-API kann unauthentifiziert offen stehen.**
   `BlogApiSettings.allowUnauthenticated` hebt in
   `app/api/blog-import/route.ts` die Schlüsselprüfung vollständig auf. Dann
   kann jeder Blogbeiträge anlegen. Die Prüfung selbst ist mit
   `timingSafeEqual` sauber umgesetzt – die Schaltmöglichkeit ist das Risiko.
8. - [ ] **Demo-Bewertungen sind nicht als solche gekennzeichnet.**
   `Review.isDemo` hat den Default `true` und `lib/site.ts` exportiert
   `isDemoSite = true`; **beide werden nirgends im UI ausgewertet**. Auf `/`
   und `/bewertungen` erscheinen erfundene Bewertungen inklusive
   `AggregateRating`-JSON-LD wie echte. Das kollidiert mit `CLAUDE.md` §2.4
   („Keine erfundenen Fakten") und ist wettbewerbsrechtlich heikel.
9. - [ ] **`site.stats` speist ungeprüfte Zahlen ins JSON-LD.** 16 Jahre, 940
   verkaufte Objekte, 1180 Kunden, 4,9 Sterne stehen als Fakten im
   `AggregateRating` jeder Seite. Kandidaten für `[[PRÜFEN: …]]`.
10. - [ ] **Adress- und Kontaktdaten sind Platzhalter.** „Musterstraße 12",
    eine Beispielnummer der Bundesnetzagentur und eine `.example`-Domain
    stehen im Impressum und im JSON-LD.
11. - [ ] **Drei ungenutzte Komponenten:** `components/ui/Card.tsx`,
    `components/marketing/TrustBar.tsx` und
    `components/marketing/OrangeStatBar.tsx`. Letztere ist zusätzlich **nicht
    versioniert** (untracked) und taucht in keinem Import auf.
12. - [ ] **`public/` enthält nur die fünf ungenutzten `create-next-app`-SVGs.**
13. - [ ] **Kein `og:image` auf irgendeiner Seite** – beim Teilen erscheint
    eine leere Vorschau.
14. - [ ] **`sitemap.ts` liefert `http://localhost:3000`**, weil
    `NEXT_PUBLIC_SITE_URL` im laufenden Build nicht gesetzt ist. Dasselbe gilt
    für alle Canonicals und das JSON-LD. Vor dem Deployment zwingend setzen.
15. - [ ] **Umkreissuche lädt bei aktivem Radius alle Kandidaten in den
    Speicher.** `findProperties()` umgeht die Datenbank-Paginierung und filtert
    in JavaScript. Bei kleinem Bestand unkritisch, bei wachsendem Bestand ein
    Skalierungsproblem.
16. - [ ] **Keine `generateStaticParams`** auf beiden dynamischen Routen –
    bewusst und kommentiert („der Build-Container hat keine
    Datenbankverbindung"), aber jede Detailseite wird dadurch zur Laufzeit
    gerendert.
17. - [ ] **Nav-Links nutzen `marketing=kauf` in Kleinschreibung**, die
    Sitemap und `PropertySearch` aber `KAUF`. Funktional identisch (der Parser
    ruft `.toUpperCase()`), erzeugt aber zwei URL-Schreibweisen für dieselbe
    Ansicht – ohne Canonical auf der gefilterten Ansicht ein Duplicate-Content-Signal.
18. - [ ] **Der Startbefehl versteckt Nebenwirkungen.** `pnpm start` führt
    Migrationen aus, seedet bei leerer Datenbank, migriert Inhalte und startet
    ein Geocoding-Backfill im Hintergrund (`&`). Ein Fehler im
    abgekoppelten Backfill bleibt unbemerkt.
