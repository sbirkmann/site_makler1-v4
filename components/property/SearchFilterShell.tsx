"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { IconClose, IconFilter, IconSliders } from "@/components/icons";

/**
 * „Weitere Filter" in der Desktop-Leiste.
 *
 * Ohne JavaScript ist das Popover schlicht aufgeklappt sichtbar (die
 * Felder liegen im selben Formular und werden mit abgesendet); mit
 * JavaScript klappt es zu und oeffnet sich per Klick. Deshalb steuert der
 * Zustand `mounted`, ob ueberhaupt eingeklappt wird – sonst waeren die
 * Felder ohne JS unerreichbar.
 */
/**
 * Ist die Seite schon hydriert? Serverseitig und im ersten Render `false`,
 * danach `true`. Ohne JavaScript bleibt es dauerhaft `false` – daran
 * haengt, ob die Felder eingeklappt werden duerfen.
 *
 * `useSyncExternalStore` statt eines Effekts: es liefert genau diese
 * Server-/Client-Unterscheidung, ohne im Effekt Zustand zu setzen.
 */
const noopSubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function FilterOverflow({
  children,
  activeCount,
}: {
  children: ReactNode;
  activeCount: number;
}) {
  const mounted = useHydrated();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted) {
    // Serverzustand und erster Render ohne JS: Felder offen zeigen.
    return <div className="min-w-[12rem]">{children}</div>;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex h-9 items-center gap-2 border px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors",
          open
            ? "border-[var(--color-accent-onwhite)] text-[var(--color-accent-onwhite)]"
            : "border-line-strong text-ink-muted hover:border-primary-400 hover:text-primary-800",
        )}
      >
        <IconSliders size={15} />
        Weitere Filter
        {activeCount > 0 ? (
          <span className="flex h-4 min-w-4 items-center justify-center bg-[var(--color-accent-onwhite)] px-1 text-[0.625rem] leading-none text-white">
            {activeCount}
          </span>
        ) : null}
      </button>

      <div
        hidden={!open}
        className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 border border-line bg-surface p-5 shadow-[var(--shadow-float)]"
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Vollbild-Sheet mit den Filtern auf schmalen Viewports.
 *
 * Ohne JavaScript sind die Filter direkt sichtbar (kein `hidden`), damit
 * die Suche bedienbar bleibt; erst nach dem Hydrieren wird daraus ein
 * Sheet mit Ausloeser.
 */
export function FilterSheet({
  children,
  total,
  activeCount,
}: {
  children: ReactNode;
  total: number;
  activeCount: number;
}) {
  const mounted = useHydrated();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted) {
    return (
      <details className="w-full">
        <summary className="flex cursor-pointer items-center gap-2 border border-line-strong px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-muted">
          <IconFilter size={15} />
          Filter
        </summary>
        <div className="mt-3 border border-line bg-surface">{children}</div>
      </details>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-line-strong px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-muted transition-colors hover:border-primary-400 hover:text-primary-800"
      >
        <IconFilter size={15} />
        Filter
        {activeCount > 0 ? (
          <span className="flex h-4 min-w-4 items-center justify-center bg-[var(--color-accent-onwhite)] px-1 text-[0.625rem] leading-none text-white">
            {activeCount}
          </span>
        ) : null}
      </button>

      <div
        className={cn("fixed inset-0 z-100", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-primary-950/45 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-sheet-titel"
          className={cn(
            "absolute inset-0 flex flex-col overflow-y-auto bg-surface",
            "transition-transform duration-300 [transition-timing-function:var(--ease-out-quint)]",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface px-5 py-4">
            <h2
              id="filter-sheet-titel"
              className="flex items-center gap-2 text-[0.9375rem] font-semibold uppercase tracking-[0.04em] text-primary-800"
            >
              <IconSliders size={18} className="text-[var(--color-accent-onwhite)]" />
              Filter
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Filter schließen"
              className="flex h-9 w-9 items-center justify-center border border-line-strong text-ink-muted"
            >
              <IconClose size={17} />
            </button>
          </div>
          {children}
          <p className="sr-only">{total} Treffer mit den aktuellen Filtern</p>
        </div>
      </div>
    </>
  );
}
