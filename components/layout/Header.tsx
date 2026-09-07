"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/components/layout/nav";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { IconMenu, IconValuation } from "@/components/icons";

/**
 * Der Header liegt auf Seiten mit Bild-Hero transparent ueber dem Bild
 * (`overlay`) und wird beim Scrollen zu einer festen, hellen Leiste.
 */
export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ueber dem Bild wird hell gezeichnet, sobald die Leiste faellt dunkel.
  // Ueber dem Bild wird hell gezeichnet; sobald die Leiste faellt, dunkel.
  const onImage = overlay && !scrolled;

  return (
    <>
      <a
        href="#hauptinhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-200 focus:rounded-[var(--radius-sm)] focus:bg-primary-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Zum Hauptinhalt springen
      </a>

      <header
        className={cn(
          "z-90 transition-all duration-300",
          // Ueber dem Bild schwebt der Header im Freiraum oberhalb der Hero-Box.
          overlay && !scrolled && "absolute inset-x-0 top-8",
          !overlay && !scrolled && "sticky top-0 bg-surface",
          // Beim Scrollen wird daraus eine feste, helle Leiste.
          scrolled &&
            "fixed inset-x-0 top-0 bg-surface/92 backdrop-blur-xl shadow-[0_4px_24px_-14px_rgba(16,31,54,0.35)]",
        )}
      >
        <div className="mx-auto flex h-[var(--header-height)] w-full max-w-[1552px] items-center justify-between gap-3 pl-4 sm:pl-8">
          <Logo tone={onImage ? "light" : "dark"} className="min-w-0 flex-1 overflow-hidden 2xl:flex-none" />

          <nav aria-label="Hauptnavigation" className="hidden min-w-0 items-center gap-1 2xl:flex">
            {mainNav.map((item) => {
              const active =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              if (item.groups?.length) {
                return (
                  <NavDropdown key={item.href} item={item} active={active} onImage={onImage} />
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-[var(--radius-sm)] px-2.5 py-3 text-[0.9375rem] font-medium transition-colors 2xl:px-4 2xl:text-[1.0625rem]",
                    onImage
                      ? active
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                      : active
                        ? "text-primary-800"
                        : "text-ink-muted hover:text-primary-900",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px origin-left transition-transform duration-300",
                      onImage ? "bg-accent-300" : "bg-accent-400",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex min-w-0 shrink items-center gap-2 pr-4 sm:pr-0">
            {/* Kontakt steht als Textlink in der Zeile; der auffaellige Platz
                ganz rechts gehoert der Bewertung. */}
            <Link
              href="/kontakt"
              className={cn(
                "hidden items-center whitespace-nowrap px-2.5 py-3 text-[0.9375rem] font-medium transition-colors 2xl:flex 2xl:px-3",
                onImage ? "text-white/85 hover:text-white" : "text-ink-muted hover:text-primary-900",
              )}
            >
              Kontakt
            </Link>

            {/* Zwischen lg und 2xl reicht die Zeile fuer den breiten Block
                nicht; dort steht dieselbe Aktion kompakt. */}
            <Link
              href="/immobilienbewertung"
              className="hidden h-[var(--header-height)] shrink-0 items-center gap-2 bg-[var(--color-accent-onwhite)] px-4 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-700 lg:flex 2xl:hidden"
            >
              <IconValuation size={17} />
              Bewerten
            </Link>

            {/* Randloser oranger Block in voller Headerhoehe – der einzige
                Punkt im Header, der Farbe traegt. */}
            <Link
              href="/immobilienbewertung"
              className="hidden h-[var(--header-height)] shrink-0 flex-col justify-center gap-0.5 bg-[var(--color-accent-onwhite)] px-5 text-white transition-colors hover:bg-accent-700 2xl:flex"
            >
              <span className="text-[0.625rem] font-light uppercase tracking-[0.14em] opacity-90">
                Jetzt kostenfrei
              </span>
              <span className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.06em]">
                <IconValuation size={17} />
                Immobilie bewerten
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menü öffnen"
              aria-expanded={menuOpen}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border transition-colors 2xl:hidden",
                onImage
                  ? "border-white/30 text-white hover:border-white/60 hover:bg-white/10"
                  : "border-line-strong text-primary-900 hover:border-primary-400",
              )}
            >
              <IconMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
