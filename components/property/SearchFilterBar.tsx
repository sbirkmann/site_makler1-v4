import Link from "next/link";
import type { RawSearchParams } from "@/lib/search-params";
import { buildPropertyHref } from "@/lib/search-params";
import { cn, formatNumber } from "@/lib/utils";
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
  const roh = Array.isArray(params.ansicht) ? params.ansicht[0] : params.ansicht;
  const view: "geteilt" | "liste" | "karte" =
    roh === "karte" ? "karte" : roh === "liste" ? "liste" : "geteilt";

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
            <PriceField params={params} idPrefix="bar" />
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
            <ViewToggleLinks params={params} view={view} />
          </div>
        </form>

        {/* Unter 1024 px: Umschalter plus Filter-Sheet */}
        <div className="flex items-center gap-3 py-3 lg:hidden">
          <FilterSheet total={total} activeCount={activeCount}>
            <form method="get" action="/immobilien" className="contents">
              <HiddenPassThrough params={params} />
              {view !== "geteilt" ? <input type="hidden" name="ansicht" value={view} /> : null}
              <div className="flex flex-col gap-5 px-5 py-6">
                <MarketingField params={params} idPrefix="sheet" />
                <TypeField params={params} idPrefix="sheet" />
                <PriceField params={params} idPrefix="sheet" />
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
            <ViewToggleLinks params={params} view={view} />
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
  view,
}: {
  params: RawSearchParams;
  view: "geteilt" | "liste" | "karte";
}) {
  const base =
    "flex items-center gap-2 px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors";
  const an = "bg-primary-800 text-white";
  const aus = "bg-surface text-ink-muted hover:text-primary-800";

  // Zwei unabhaengige Schalter: jeder blendet seine Spalte ein oder aus.
  // Beide auszuschalten ergibt keine Ansicht, deshalb schaltet der letzte
  // aktive Schalter stattdessen auf "beides".
  const listeAn = view !== "karte";
  const karteAn = view !== "liste";

  const zielListe = listeAn ? "karte" : view === "karte" ? undefined : undefined;
  const zielKarte = karteAn ? "liste" : view === "liste" ? undefined : undefined;

  return (
    <div role="group" aria-label="Ansicht" className="flex border border-line-strong">
      <Link
        href={buildPropertyHref(params, { ansicht: zielListe, seite: undefined })}
        aria-pressed={listeAn}
        className={`${base} ${listeAn ? an : aus}`}
      >
        <Haken an={listeAn} />
        Liste
      </Link>
      <Link
        href={buildPropertyHref(params, { ansicht: zielKarte, seite: undefined })}
        aria-pressed={karteAn}
        className={`${base} border-l border-line-strong ${karteAn ? an : aus}`}
      >
        <Haken an={karteAn} />
        Karte
      </Link>
    </div>
  );
}

/** Kleines Kaestchen, das den Ein-/Aus-Zustand sichtbar macht. */
function Haken({ an }: { an: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-3.5 w-3.5 shrink-0 items-center justify-center border",
        an ? "border-white bg-white/20" : "border-line-strong",
      )}
    >
      {an ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 13 4 4L19 7" />
        </svg>
      ) : null}
    </span>
  );
}
