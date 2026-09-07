import Link from "next/link";
import { site } from "@/lib/site";
import { IconMail, IconPhone, IconSearch, IconValuation, IconDocument } from "@/components/icons";

/**
 * Schnellzugriff auf die vier Wege, die Interessenten tatsaechlich gehen.
 *
 * Auf dem Desktop als schmale, vertikal fixierte Leiste am rechten Rand; auf
 * schmalen Viewports als Leiste am unteren Bildschirmrand, weil eine seitliche
 * Leiste dort den Inhalt verdecken wuerde. Beide Varianten rendern dieselben
 * Eintraege, damit nichts nur auf einer Geraeteklasse erreichbar ist.
 */
const actions = [
  { href: "/kontakt", label: "Kontakt", icon: IconMail },
  { href: "/immobilienbewertung", label: "Bewertung", icon: IconValuation },
  { href: "/immobilien", label: "Suche", icon: IconSearch },
  { href: "/ratgeber", label: "Ratgeber", icon: IconDocument },
];

export function QuickActionRail() {
  return (
    <>
      {/* Desktop: rechte Randleiste, vertikal zentriert */}
      <nav
        aria-label="Schnellzugriff"
        className="fixed right-0 top-1/2 z-70 hidden -translate-y-1/2 flex-col xl:flex"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex w-[4.5rem] flex-col items-center gap-1.5 border-b border-white/15 bg-primary-800 px-2 py-4 text-white transition-colors last:border-b-0 hover:bg-accent-500"
            >
              <Icon size={20} />
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em]">
                {action.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobil: feste Leiste unten. Der Abstandhalter im Layout verhindert,
          dass sie den Seitenfuss ueberdeckt. */}
      <nav
        aria-label="Schnellzugriff"
        className="fixed inset-x-0 bottom-0 z-70 grid grid-cols-4 border-t border-white/15 bg-primary-800 xl:hidden"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1 px-1 py-2 text-white transition-colors active:bg-accent-500"
            >
              <Icon size={18} />
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.06em]">
                {action.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

/** Telefonnummer als direkter Draht – bewusst getrennt vom Raster oben. */
export function QuickCallLink() {
  return (
    <a
      href={site.contact.phoneHref}
      className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-primary-800 hover:text-accent-600"
    >
      <IconPhone size={17} />
      {site.contact.phone}
    </a>
  );
}
