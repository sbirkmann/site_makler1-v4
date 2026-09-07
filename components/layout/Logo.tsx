import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Bildmarke im Stil der Referenz: ein kompaktes, olivfarbenes Quadrat mit
 * einer Dachsilhouette; der Giebel ist in Markenorange gesetzt und bildet
 * den einzigen Akzent. Daneben die Wortmarke in Versalien.
 */
export function Logo({
  className,
  tone = "dark",
  href = "/",
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string | null;
}) {
  const content = (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      <svg
        width="44"
        height="44"
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 sm:h-11 sm:w-11"
      >
        {/* Grundflaeche: oliv, kantig – ueber dem Bild eine helle Aufhellung. */}
        <rect
          width="34"
          height="34"
          rx="2"
          className={tone === "light" ? "fill-white/15" : "fill-primary-800"}
        />
        {/* Dach: der Giebel traegt den orangen Markenakzent. */}
        <path
          d="M6.6 16.8 17 8.4l10.4 8.4"
          stroke="#ff6d00"
          strokeWidth="2.4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Baukoerper als offene Kontur. */}
        <path
          d="M9.8 18.6v7h14.4v-7"
          stroke={tone === "light" ? "#ffffff" : "#ffffff"}
          strokeWidth="2.1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Fensteroeffnung – ruhiger Gegenpol zur Dachlinie. */}
        <rect x="15.2" y="20.4" width="3.6" height="5.2" fill="#ff6d00" />
      </svg>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "truncate font-[family-name:var(--font-display)] text-[1rem] font-semibold uppercase tracking-[0.02em] sm:text-[1.25rem]",
            tone === "light" ? "text-white" : "text-primary-950",
          )}
        >
          {site.name}
        </span>
        <span
          className={cn(
            "mt-[3px] hidden truncate text-[0.6875rem] font-light uppercase tracking-[0.14em] sm:block",
            tone === "light" ? "text-white/55" : "text-ink-subtle",
          )}
        >
          {site.claim}
        </span>
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${site.name} – Startseite`}
      className={cn("min-w-0 max-w-full rounded-[var(--radius-xs)]", className)}
    >
      {content}
    </Link>
  );
}
