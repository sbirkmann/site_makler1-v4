import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/lib/site";
import {
  distanceKm,
  findProperties,
  findPropertyCities,
  type PropertyCardData,
  type PropertyQuery,
} from "@/lib/repositories/properties";
import {
  buildPropertyHref,
  countActiveFilters,
  parsePropertySearchParams,
  type RawSearchParams,
} from "@/lib/search-params";
import { lookupPlaceCenter } from "@/lib/services/place-lookup";
import { formatNumber } from "@/lib/utils";
import { propertyTypeLabels } from "@/lib/labels";
import { SearchFilterBar } from "@/components/property/SearchFilterBar";
import { SearchSplitView } from "@/components/property/SearchSplitView";
import { SearchResultCard } from "@/components/property/SearchResultCard";
import { SearchProfileTile } from "@/components/property/SearchProfileTile";
import { SearchEmptyState } from "@/components/property/SearchEmptyState";
import { CTASection } from "@/components/marketing/CTASection";
import { Pagination } from "./Pagination";

export const metadata: Metadata = {
  title: "Immobilienangebote in Köln, Bonn und dem Rheinland",
  description:
    "Aktuelle Häuser, Wohnungen, Grundstücke und Gewerbeimmobilien zum Kauf und zur Miete – kuratiert und persönlich betreut von WohnWert Immobilien.",
  alternates: { canonical: "/immobilien" },
  openGraph: {
    title: "Immobilienangebote im Rheinland",
    description:
      "Aktuelle Häuser, Wohnungen und Gewerbeimmobilien zum Kauf und zur Miete im Rheinland.",
    url: `${site.url}/immobilien`,
  },
};

export const revalidate = 120;

const radiusSteps = [5, 10, 25, 50, 100, 200];

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.trim() ? v.trim() : undefined;
}

/**
 * Filter aus der URL lesen und – falls ein Umkreis gewaehlt ist – den
 * Ortsnamen in Koordinaten aufloesen. Unveraendert gegenueber dem
 * Bestand: Nominatim-Geocoding, Bounding-Box, Haversine.
 */
async function resolveQuery(searchParams: RawSearchParams): Promise<PropertyQuery> {
  const query = parsePropertySearchParams(searchParams);
  if (!query.radiusKm || !query.city) return query;

  const center = await lookupPlaceCenter(query.city);
  return center ? { ...query, center } : query;
}

/** Der aktive Suchkontext als Text – Grundlage des orangen Chips. */
function contextLabel(params: RawSearchParams): string | undefined {
  const parts: string[] = [];
  const marketing = first(params.marketing)?.toUpperCase();
  if (marketing === "KAUF") parts.push("Kauf");
  if (marketing === "MIETE") parts.push("Miete");

  const typ = first(params.typ)?.toUpperCase();
  if (typ && typ in propertyTypeLabels) {
    parts.push(propertyTypeLabels[typ as keyof typeof propertyTypeLabels]);
  }

  const ort = first(params.ort);
  const umkreis = first(params.umkreis);
  if (ort) parts.push(umkreis ? `${ort} + ${umkreis} km` : ort);

  return parts.length ? parts.join(" · ") : undefined;
}

/**
 * Naechstgelegene Objekte fuer den Leerzustand. Ohne Mittelpunkt wird
 * schlicht das Neueste gezeigt.
 */
async function nearestFallback(query: PropertyQuery): Promise<PropertyCardData[]> {
  const relaxed: PropertyQuery = {
    marketingType: query.marketingType,
    sort: "neueste",
    page: 1,
    perPage: 24,
  };
  const { items } = await findProperties(relaxed);
  const center = query.center;
  if (!center) return items.slice(0, 4);

  return [...items]
    .filter((i) => i.latitude != null && i.longitude != null)
    .sort(
      (a, b) =>
        distanceKm(center, { latitude: a.latitude!, longitude: a.longitude! }) -
        distanceKm(center, { latitude: b.latitude!, longitude: b.longitude! }),
    )
    .slice(0, 4);
}

/** Der naechstgroessere Umkreis samt Trefferzahl – nur wenn er mehr bringt. */
async function widerRadius(query: PropertyQuery) {
  if (!query.center || !query.radiusKm) return {};
  const next = radiusSteps.find((r) => r > query.radiusKm!);
  if (!next) return {};
  const { total } = await findProperties({ ...query, radiusKm: next, page: 1 });
  return total > 0 ? { nextRadius: next, totalWithNextRadius: total } : {};
}

async function SearchResults({ params }: { params: RawSearchParams }) {
  const query = await resolveQuery(params);
  const { items, total, page, pageCount, perPage } = await findProperties(query);

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  if (items.length === 0) {
    const [nearest, wider] = await Promise.all([nearestFallback(query), widerRadius(query)]);
    return (
      <div className="px-4 py-6">
        <SearchEmptyState params={params} nearest={nearest} {...wider} />
      </div>
    );
  }

  return (
    <div className="px-4 py-5">
      <p className="mb-4 text-[0.8125rem] text-ink-muted">
        <span className="font-semibold text-primary-800">{formatNumber(total)}</span>{" "}
        {total === 1 ? "Objekt" : "Objekte"} gefunden
        {total > perPage ? (
          <span className="text-ink-subtle">
            {" "}
            · angezeigt {from}–{to}
          </span>
        ) : null}
      </p>

      <div className="grid gap-3 [grid-auto-rows:1fr] sm:grid-cols-2">
        {/* Erste Kachel: Suchauftrag mit den aktuellen Filtern */}
        <SearchProfileTile params={params} />
        {items.map((property, i) => (
          <SearchResultCard key={property.id} property={property} priority={i < 2} />
        ))}
      </div>

      <div className="mt-8 pb-4">
        <Pagination page={page} pageCount={pageCount} searchParams={params} />
      </div>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-3 px-4 py-5 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[15rem] animate-pulse bg-surface-sunken" />
      ))}
    </div>
  );
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const [cities, query] = await Promise.all([findPropertyCities(), resolveQuery(params)]);
  const { total } = await findProperties({ ...query, page: 1 });
  const activeCount = countActiveFilters(params);

  const mapView = first(params.ansicht) === "karte";

  // Query-String fuer den GeoJSON-Endpunkt: dieselben Filter, ohne die
  // reinen Ansichtsparameter.
  const mapQuery = buildPropertyHref(params, { seite: undefined, ansicht: undefined })
    .split("?")[1] ?? "";

  const key = JSON.stringify(params);

  return (
    <>
      {/* Schmale Titelzeile statt Hero: die Split-View braucht die Hoehe
          fuer Liste und Karte. Genau eine h1 auf der Seite. */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-[1552px] flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-4">
          <h1 className="page-title">Immobilien im Rheinland</h1>
          <p className="text-[0.8125rem] text-ink-muted">
            Häuser, Wohnungen, Grundstücke und Gewerbeobjekte in Köln, Bonn, Düsseldorf
            und dem Umland.{" "}
            <span className="whitespace-nowrap">
              {formatNumber(total)} {total === 1 ? "Objekt" : "Objekte"}.
            </span>
          </p>
        </div>
      </div>

      <SearchFilterBar
        params={params}
        cities={cities}
        total={total}
        activeCount={activeCount}
      />

      <SearchSplitView query={mapQuery} contextLabel={contextLabel(params)} mapView={mapView}>
        <Suspense key={key} fallback={<ResultsSkeleton />}>
          <SearchResults params={params} />
        </Suspense>
      </SearchSplitView>

      <CTASection
        eyebrow="Noch nicht das Richtige gefunden?"
        title="Wir kennen Objekte, die nie öffentlich werden."
        description="Ein spürbarer Teil unserer Verkäufe findet ohne Portal statt. Sagen Sie uns, was Sie suchen – wir melden uns, sobald etwas Passendes in die Vermarktung geht."
        primaryLabel="Suchprofil hinterlegen"
        primaryHref="/suchprofil"
        secondaryLabel="Persönlich beraten lassen"
        secondaryHref="/kontakt"
      />
    </>
  );
}
