import Link from "next/link";
import type { RawSearchParams } from "@/lib/search-params";
import { buildPropertyHref } from "@/lib/search-params";
import { formatNumber } from "@/lib/utils";
import {
  AreaField,
  HiddenPassThrough,
  MarketingField,
  PlaceField,
  PriceField,
  RadiusField,
  RoomsField,
  SortField,
  TypeField,
} from "@/components/property/SearchFilterFields";
import { FilterOverflow, FilterSheet } from "@/components/property/SearchFilterShell";

/**
 * Sticky Filterleiste ueber die volle Breite.
 *
 * Es ist ein echtes `<form method="get" action="/immobilien">`: ohne
 * JavaScript sendet der Absenden-Knopf die Filter als URL-Parameter ab,
 * genau die, die der Server ohnehin liest. Die Client-Teile (Popover,
 * Sheet, Umschalter) haengen sich nur obendrauf.
 */
export function SearchFilterBar({
  params,
  cities,
  total,
  activeCount,
}: {
  params: RawSearchParams;
  cities: string[];
  total: number;
  activeCount: number;
}) {
  const view = Array.isArray(params.ansicht) ? params.ansicht[0] : params.ansicht;
  const mapView = view === "karte";

  const cell =
    "min-w-0 border-l border-line px-3 py-2 first:border-l-0";

  return (
    <section aria-labelledby="filterleiste-titel" className="sticky top-0 z-40 border-b border-line bg-surface">
      <h2 id="filterleiste-titel" className="sr-only">
        Filter
      </h2>
      <div className="mx-auto w-full max-w-[1552px] px-4">
        {/* Desktop: eine Zeile über die volle Breite */}
        <form
          method="get"
          action="/immobilien"
          className="hidden items-stretch gap-0 py-1.5 lg:flex"
        >
          <HiddenPassThrough params={params} />
          <div className={`${cell} flex-[1.1]`}>
            <MarketingField params={params} idPrefix="bar" />
          </div>
          <div className={`${cell} flex-[1.2]`}>
            <TypeField params={params} idPrefix="bar" />
          </div>
          <div className={`${cell} flex-[1.7]`}>
            <PriceField params={params} />
          </div>
          <div className={`${cell} flex-[0.8]`}>
            <RoomsField params={params} idPrefix="bar" />
          </div>
          <div className={`${cell} flex-[1.2]`}>
            <PlaceField params={params} idPrefix="bar" cities={cities} />
          </div>
          <div className={`${cell} flex-[0.9]`}>
            <RadiusField params={params} idPrefix="bar" />
          </div>

          {/* Wohnfläche und Sortierung wandern in das Popover, damit die
              Leiste bei 1024 px nicht umbricht. Beide Felder bleiben Teil
              desselben Formulars – ein Popover ist kein eigenes Formular. */}
          <div className={`${cell} flex items-end`}>
            <FilterOverflow activeCount={activeCount}>
              <div className="flex flex-col gap-4">
                <AreaField params={params} idPrefix="bar-more" />
                <SortField params={params} idPrefix="bar-more" />
              </div>
            </FilterOverflow>
          </div>

          <div className="flex items-end gap-2 border-l border-line px-3 py-2">
            <button
              type="submit"
              className="h-9 shrink-0 bg-[var(--color-accent-onwhite)] px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-700"
            >
              Suchen
            </button>
            {activeCount > 0 ? (
              <Link
                href="/immobilien"
                className="h-9 shrink-0 border border-line-strong px-3 text-[0.6875rem] font-semibold uppercase leading-9 tracking-[0.06em] text-ink-muted transition-colors hover:border-primary-400 hover:text-primary-800"
              >
                Zurücksetzen
              </Link>
            ) : null}
          </div>

          <div className="flex items-end py-2 pl-3">
            <ViewToggleLinks params={params} mapView={mapView} />
          </div>
        </form>

        {/* Unter 1024 px: Umschalter plus Filter-Sheet */}
        <div className="flex items-center gap-3 py-3 lg:hidden">
          <FilterSheet total={total} activeCount={activeCount}>
            <form method="get" action="/immobilien" className="contents">
              <HiddenPassThrough params={params} />
              {mapView ? <input type="hidden" name="ansicht" value="karte" /> : null}
              <div className="flex flex-col gap-5 px-5 py-6">
                <MarketingField params={params} idPrefix="sheet" />
                <TypeField params={params} idPrefix="sheet" />
                <PriceField params={params} />
                <RoomsField params={params} idPrefix="sheet" />
                <AreaField params={params} idPrefix="sheet" />
                <PlaceField params={params} idPrefix="sheet" cities={cities} />
                <RadiusField params={params} idPrefix="sheet" />
                <SortField params={params} idPrefix="sheet" />
              </div>
              <div className="sticky bottom-0 flex gap-3 border-t border-line bg-surface px-5 py-4">
                <Link
                  href="/immobilien"
                  className="shrink-0 border border-line-strong px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-muted"
                >
                  Zurücksetzen
                </Link>
                <button
                  type="submit"
                  className="flex-1 bg-[var(--color-accent-onwhite)] px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-700"
                >
                  {formatNumber(total)} {total === 1 ? "Objekt" : "Objekte"} anzeigen
                </button>
              </div>
            </form>
          </FilterSheet>

          <div className="ml-auto">
            <ViewToggleLinks params={params} mapView={mapView} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Liste/Karte als echte Links mit URL-Parameter – ohne JavaScript
 * bedienbar. Der Aktivzustand ist der gefuellte, dunkle Knopf.
 */
function ViewToggleLinks({
  params,
  mapView,
}: {
  params: RawSearchParams;
  mapView: boolean;
}) {
  const base =
    "px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors";
  const active = "bg-primary-800 text-white";
  const idle = "bg-surface text-ink-muted hover:text-primary-800";

  return (
    <div role="group" aria-label="Ansicht" className="flex border border-line-strong">
      <Link
        href={buildPropertyHref(params, { ansicht: undefined, seite: undefined })}
        aria-current={mapView ? undefined : "true"}
        className={`${base} ${mapView ? idle : active}`}
      >
        Liste
      </Link>
      <Link
        href={buildPropertyHref(params, { ansicht: "karte", seite: undefined })}
        aria-current={mapView ? "true" : undefined}
        className={`${base} border-l border-line-strong ${mapView ? active : idle}`}
      >
        Karte
      </Link>
    </div>
  );
}
