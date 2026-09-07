import Link from "next/link";
import type { RawSearchParams } from "@/lib/search-params";
import { IconMail } from "@/components/icons";

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.trim() ? v.trim() : undefined;
}

function allOf(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : value.split(",");
  return arr.map((v) => v.trim()).filter(Boolean);
}

/**
 * Die aktuellen Filter als Startwerte fuer das Suchprofil weiterreichen.
 * Bewusst dieselben Parameternamen wie in der Suche – wer den Link
 * kopiert, sieht dieselben Kriterien wieder.
 */
export function searchProfileHref(params: RawSearchParams): string {
  const sp = new URLSearchParams();
  const keys = ["marketing", "ort", "umkreis", "preis_min", "preis_max", "zimmer", "flaeche"] as const;
  for (const key of keys) {
    const value = first(params[key]);
    if (value) sp.set(key, value);
  }
  for (const t of allOf(params.typ)) sp.append("typ", t);
  const qs = sp.toString();
  return qs ? `/suchprofil?${qs}` : "/suchprofil";
}

/**
 * Erste Kachel der Ergebnisliste. Muster aus der Referenz: weiche weisse
 * Karte mit einem halb eingesenkten dunklen Kreis ueber der Oberkante.
 */
export function SearchProfileTile({
  params,
  className,
}: {
  params: RawSearchParams;
  className?: string;
}) {
  return (
    <article
      className={
        "relative flex min-h-[15rem] flex-col items-center justify-center gap-3 bg-surface px-5 pb-5 pt-8 text-center shadow-[0_0_15px_2px_var(--color-surface-sunken)] " +
        (className ?? "")
      }
    >
      <span
        aria-hidden="true"
        className="absolute -top-px left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary-800 bg-primary-800 text-white"
      >
        <IconMail size={18} />
      </span>

      <h3 className="mt-4 text-[1rem] font-semibold uppercase tracking-[0.04em] text-primary-800">
        Suchauftrag anlegen
      </h3>
      <p className="max-w-[22rem] text-[0.8125rem] leading-relaxed text-ink-muted">
        Ein Teil unserer Objekte wechselt den Eigentümer, bevor eine Anzeige
        erscheint. Hinterlegen Sie Ihre Kriterien – wir melden uns, sobald
        etwas Passendes in die Vermarktung geht.
      </p>
      <Link
        href={searchProfileHref(params)}
        className="mt-1 bg-primary-800 px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-primary-700"
      >
        Suchprofil hinterlegen
      </Link>
    </article>
  );
}
