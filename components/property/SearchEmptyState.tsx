import Link from "next/link";
import type { PropertyCardData } from "@/lib/repositories/properties";
import { buildPropertyHref, type RawSearchParams } from "@/lib/search-params";
import { formatNumber } from "@/lib/utils";
import { SearchResultCard } from "@/components/property/SearchResultCard";
import { searchProfileHref } from "@/components/property/SearchProfileTile";

/**
 * Leerzustand mit Ausweg statt Sackgasse: der naechstgroessere Umkreis,
 * die naechstgelegenen Objekte und der Suchauftrag.
 */
export function SearchEmptyState({
  params,
  nearest,
  nextRadius,
  totalWithNextRadius,
}: {
  params: RawSearchParams;
  nearest: PropertyCardData[];
  /** Naechstgroesserer Umkreis in km, falls es dort mehr zu sehen gibt. */
  nextRadius?: number;
  totalWithNextRadius?: number;
}) {
  const place = Array.isArray(params.ort) ? params.ort[0] : params.ort;

  return (
    <div className="flex flex-col gap-6">
      <div className="border-l-4 border-accent-500 bg-surface-muted px-5 py-6">
        <h2 className="text-[1rem] font-semibold uppercase tracking-[0.04em] text-primary-800">
          Hier passt gerade nichts
        </h2>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
          {place
            ? `Zu Ihren Kriterien in ${place} liegt derzeit kein Objekt vor.`
            : "Zu Ihren Kriterien liegt derzeit kein Objekt vor."}{" "}
          Das ändert sich laufend – ein Teil unserer Objekte wird zudem nicht
          öffentlich inseriert.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {nextRadius ? (
            <Link
              href={buildPropertyHref(params, { umkreis: nextRadius, seite: undefined })}
              className="bg-primary-800 px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-primary-700"
            >
              Umkreis auf {nextRadius} km erweitern
              {totalWithNextRadius
                ? ` · ${formatNumber(totalWithNextRadius)} ${totalWithNextRadius === 1 ? "Objekt" : "Objekte"}`
                : ""}
            </Link>
          ) : null}
          <Link
            href={searchProfileHref(params)}
            className="border border-primary-800 px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-primary-800 transition-colors hover:bg-primary-800 hover:text-white"
          >
            Suchauftrag anlegen
          </Link>
          <Link
            href="/immobilien"
            className="border border-line-strong px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-muted transition-colors hover:border-primary-400 hover:text-primary-800"
          >
            Filter zurücksetzen
          </Link>
        </div>
      </div>

      {nearest.length > 0 ? (
        <div>
          <h3 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
            {place ? `Am nächsten zu ${place}` : "Zuletzt aufgenommen"}
          </h3>
          <div className="grid gap-3 [grid-auto-rows:1fr] sm:grid-cols-2">
            {nearest.map((property) => (
              <SearchResultCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
