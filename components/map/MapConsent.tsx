"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconLocation, IconShield } from "@/components/icons";

/**
 * Einwilligungsschranke vor der Karte.
 *
 * Die Kacheln kommen von openstreetmap.org. Beim Laden geht die IP-Adresse
 * des Besuchers dorthin – das ist eine Datenuebermittlung an einen Dritten
 * und braucht eine Einwilligung. Erst nach dem Klick wird die Karte
 * eingebunden; die Entscheidung gilt fuer die laufende Sitzung.
 *
 * Bewusst ohne Cookie: `sessionStorage` reicht, ist nicht
 * einwilligungspflichtig und verschwindet mit dem Tab.
 */
const STORAGE_KEY = "wohnwert:karte-einwilligung";

export function MapConsent({
  children,
  className,
  height = "h-[22rem]",
}: {
  children: ReactNode;
  className?: string;
  height?: string;
}) {
  const [accepted, setAccepted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === "ja";
    } catch {
      // Privater Modus oder blockierter Speicher: dann eben jedes Mal fragen.
      return false;
    }
  });

  function accept() {
    setAccepted(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "ja");
    } catch {
      // Nicht speichern zu koennen ist kein Grund, die Karte zu verweigern.
    }
  }

  if (accepted) return <>{children}</>;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 border border-line bg-surface-muted px-6 py-10 text-center",
        height,
        className,
      )}
    >
      <IconLocation size={26} className="text-primary-600" />
      <div className="max-w-md">
        <p className="text-[0.9375rem] font-medium text-primary-900">
          Karte von OpenStreetMap
        </p>
        <p className="mt-2 text-[0.875rem] font-light leading-relaxed text-ink-muted">
          Beim Laden der Karte wird Ihre IP-Adresse an openstreetmap.org
          übertragen. Die Karte wird erst nach Ihrer Zustimmung geladen.
        </p>
      </div>
      <button
        type="button"
        onClick={accept}
        className="bg-[var(--color-accent-onwhite)] px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-700"
      >
        Karte laden
      </button>
      <p className="flex items-center gap-2 text-[0.75rem] text-ink-subtle">
        <IconShield size={14} />
        Gilt für diesen Besuch
      </p>
    </div>
  );
}
