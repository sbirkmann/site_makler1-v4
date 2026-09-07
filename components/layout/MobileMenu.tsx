"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { mainNav } from "@/components/layout/nav";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconClose, IconMail, IconPhone } from "@/components/icons";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  // Merkt sich, wer das Menue geoeffnet hat, damit der Fokus beim Schliessen
  // genau dorthin zurueckkehrt statt auf <body> zu fallen.
  const openerRef = useRef<HTMLElement | null>(null);

  // Menue bei Navigation schliessen
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Scroll sperren, Escape abfangen und den Fokus im Dialog halten, solange
  // das Menue offen ist. Ohne die Fokusfuehrung bliebe der Fokus hinter dem
  // Overlay in der Seite stehen – mit der Tastatur waere das Menue dann nicht
  // bedienbar, obwohl es sichtbar ist.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const root = dialogRef.current;

    const focusables = () => {
      if (!root) return [] as HTMLElement[];
      return [
        ...root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);
    };

    // Erst nach der Einblendung fokussieren – vorher ist das Panel noch
    // transformiert und der Browser scrollt sonst an die falsche Stelle.
    const focusTimer = window.setTimeout(() => focusables()[0]?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !root?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      // Nur zuruecksetzen, wenn der Fokus noch im geschlossenen Dialog steht.
      // Bei einer Navigation aus dem Menue heraus gehoert der Fokus der
      // neuen Seite, nicht dem Menuebutton.
      if (root?.contains(document.activeElement)) {
        openerRef.current?.focus();
      }
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        // Muss zum Umschaltpunkt des Menuebuttons im Header passen (2xl).
        // Stand hier `lg:hidden`, war zwischen 1024 und 1536 px der Button
        // sichtbar, das Panel aber ausgeblendet – die Navigation damit
        // vollstaendig unerreichbar.
        "fixed inset-0 z-100 2xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-primary-950/45 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptmenü"
        className={cn(
          "absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto bg-surface",
          "rounded-b-[var(--radius-2xl)] shadow-[var(--shadow-float)]",
          "transition-transform duration-400 [transition-timing-function:var(--ease-out-quint)]",
          open ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Menü schließen"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-colors hover:border-primary-400 hover:text-primary-800"
          >
            <IconClose size={19} />
          </button>
        </div>

        <nav className="flex flex-col px-5 py-3">
          {mainNav.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between gap-4 border-b border-line py-4 last:border-0",
                  "transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out-quint)]",
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
                style={{ transitionDelay: open ? `${70 + i * 45}ms` : "0ms" }}
              >
                <span className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-[1.0625rem] font-medium",
                      active ? "text-primary-700" : "text-primary-950",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="text-[0.8125rem] text-ink-subtle">{item.description}</span>
                  ) : null}
                </span>
                <IconArrowRight
                  size={18}
                  className="shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 border-t border-line bg-surface-muted px-5 py-6">
          <ButtonLink href="/immobilienbewertung" size="lg" fullWidth variant="primary">
            Immobilie kostenlos bewerten
            <IconArrowRight size={18} />
          </ButtonLink>
          <div className="mt-1 grid grid-cols-2 gap-3">
            <a
              href={site.contact.phoneHref}
              className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-line-strong bg-surface py-3 text-[0.8125rem] font-medium text-primary-900"
            >
              <IconPhone size={16} /> Anrufen
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-line-strong bg-surface py-3 text-[0.8125rem] font-medium text-primary-900"
            >
              <IconMail size={16} /> E-Mail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
