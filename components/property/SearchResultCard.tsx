import Image from "next/image";
import Link from "next/link";
import type { PropertyCardData } from "@/lib/repositories/properties";
import { cn, formatArea, formatPrice, formatRooms } from "@/lib/utils";
import { marketingTypeLabels, propertyTypeLabels, statusLabels } from "@/lib/labels";

/**
 * Objektkarte der Suchergebnisliste.
 *
 * Overlay-Form nach der Referenz: das Foto fuellt die Kachel, ein dunkler
 * Verlauf von unten traegt die weisse Schrift. Der Textschatten haelt sie
 * auch auf hellen Motiven lesbar – ohne ihn bricht das Muster zusammen.
 *
 * Der Titel wird vollstaendig gesetzt (kein `line-clamp`): „kein
 * Inhaltsverlust" gilt auch hier.
 */
export function SearchResultCard({
  property,
  priority = false,
  className,
}: {
  property: PropertyCardData;
  priority?: boolean;
  className?: string;
}) {
  const cover = property.images[0];
  const isRent = property.marketingType === "MIETE";
  const showStatus = property.status !== "VERFUEGBAR";
  const place = property.region ? `${property.region}, ${property.city}` : property.city;

  return (
    <article
      id={`objekt-${property.id}`}
      data-property-id={property.id}
      className={cn(
        "group relative isolate flex min-h-[15rem] flex-col justify-end overflow-hidden bg-primary-900",
        "transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]",
        "focus-within:outline focus-within:outline-4 focus-within:outline-accent-500",
        // Bidirektionales Highlighting: die Karte setzt dieses Attribut,
        // die Liste reagiert allein per CSS.
        "data-[highlight=true]:outline data-[highlight=true]:outline-4 data-[highlight=true]:outline-accent-500",
        className,
      )}
    >
      {cover ? (
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
          priority={priority}
          className="-z-10 object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-surface-sunken" />
      )}

      {/* Dunkler Verlauf von unten – Traeger der weissen Schrift */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-primary-950/88 via-primary-950/45 to-primary-950/5"
      />

      {/* Ecken-Ribbons: Erwerbsart links oben, Empfehlung rechts oben */}
      <p className="pointer-events-none absolute left-0 top-0 bg-primary-800 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white">
        {marketingTypeLabels[property.marketingType]}
      </p>
      {property.featured ? (
        <p className="pointer-events-none absolute right-0 top-0 bg-[var(--color-accent-onwhite)] px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white">
          Empfehlung
        </p>
      ) : null}
      {showStatus ? (
        <p className="pointer-events-none absolute right-0 top-8 bg-primary-950/85 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white">
          {statusLabels[property.status]}
        </p>
      ) : null}

      <div className="relative px-4 pb-4 pt-12 [text-shadow:0_2px_2px_rgba(0,0,0,0.8)]">
        <h3 className="text-[0.9375rem] font-semibold uppercase leading-snug tracking-[0.02em] text-white">
          <Link href={`/immobilien/${property.slug}`} className="before:absolute before:inset-0">
            {property.title}
          </Link>
        </h3>

        <p className="mt-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-white/85">
          {place} · {propertyTypeLabels[property.propertyType]}
        </p>

        {/* Teaser vollstaendig – „kein Inhaltsverlust" (CLAUDE.md §2.2).
            Nicht gekuerzt; unterschiedlich hohe Kacheln gleicht das Raster
            ueber `grid-auto-rows: 1fr` aus. */}
        {property.shortDescription ? (
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/90">
            {property.shortDescription}
          </p>
        ) : null}

        <p className="mt-4 text-[0.625rem] font-medium uppercase tracking-[0.1em] text-white/80">
          {isRent ? "Kaltmiete" : "Kaufpreis"}
        </p>
        <p className="font-[family-name:var(--font-display)] text-[1.375rem] font-semibold leading-tight text-white">
          {property.priceOnRequest ? (
            <span className="text-[1rem]">Preis auf Anfrage</span>
          ) : (
            <>
              {formatPrice(property.price)}
              {isRent ? <span className="text-[0.75rem] font-normal"> / Monat</span> : null}
            </>
          )}
        </p>

        <dl className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-white/90">
          {property.livingArea || property.plotArea ? (
            <div className="flex gap-1">
              <dt className="sr-only">
                {property.livingArea ? "Wohnfläche" : "Grundstücksfläche"}
              </dt>
              <dd>{formatArea(property.livingArea ?? property.plotArea)}</dd>
            </div>
          ) : null}
          {property.rooms ? (
            <div className="flex gap-1">
              <dt className="sr-only">Zimmer</dt>
              <dd>{formatRooms(property.rooms)} Zimmer</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </article>
  );
}
