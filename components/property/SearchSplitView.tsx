"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MapConsent } from "@/components/map/MapConsent";

/**
 * MapLibre greift beim Import auf `window` zu und ist gross – die Karte
 * wird deshalb erst im Browser geladen und belastet den LCP der
 * serverseitig gerenderten Trefferliste nicht.
 */
const SearchMap = dynamic(
  () => import("@/components/map/SearchMap").then((m) => m.SearchMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-surface-sunken" /> },
);

/**
 * Split-View: links die eigenstaendig scrollende Ergebnisspalte, rechts
 * die fixierte Karte.
 *
 * Die Liste wird als `children` vom Server hereingereicht – sie ist
 * fertig gerendertes HTML und bleibt ohne JavaScript vollstaendig
 * sichtbar. Diese Komponente steuert nur Karte und Highlighting.
 */
export function SearchSplitView({
  children,
  query,
  contextLabel,
  view,
}: {
  children: ReactNode;
  query: string;
  contextLabel?: string;
  /** Auf schmalen Viewports: Karte statt Liste zeigen (`?ansicht=karte`). */
  /** "geteilt" zeigt beide Spalten, "liste" und "karte" jeweils nur eine. */
  view: "geteilt" | "liste" | "karte";
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Karte → Liste: die entsprechende Kachel markieren und in den Blick
  // holen. Das Attribut wird direkt gesetzt, damit die serverseitig
  // gerenderten Kacheln nicht erst zu Client-Komponenten werden muessen.
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>("[data-property-id]");
    for (const card of cards) {
      const on = card.dataset.propertyId === activeId;
      if (on) {
        card.dataset.highlight = "true";
        card.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        delete card.dataset.highlight;
      }
    }
  }, [activeId]);

  // Liste → Karte: ein Zeiger über einer Kachel hebt den Pin hervor.
  const onPointer = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>("[data-property-id]");
    setActiveId(card?.dataset.propertyId ?? null);
  }, []);

  return (
    <div
      className={cn(
        "lg:grid lg:h-[calc(100dvh-var(--header-height)-4.25rem)]",
        // Der Umschalter wirkt auf jeder Breite: bei "liste" bzw. "karte"
        // bekommt die sichtbare Spalte die volle Breite.
        view === "geteilt" && "lg:grid-cols-[minmax(0,40%)_minmax(0,60%)]",
        view !== "geteilt" && "lg:grid-cols-1",
      )}
    >
      {/* Ergebnisspalte: eigener Scrollcontainer ab Desktop, darunter
          scrollt sie schlicht mit der Seite. */}
      <div
        ref={listRef}
        onPointerOver={onPointer}
        onPointerLeave={() => setActiveId(null)}
        className={cn(
          "bg-surface lg:overflow-y-auto",
          view === "geteilt" && "lg:shadow-[4px_0_10px_0_rgba(0,0,0,0.14)]",
          view === "karte" && "hidden",
        )}
      >
        {children}
      </div>

      {/* Kartenspalte */}
      <div
        className={cn(
          "h-[26rem] sm:h-[32rem] lg:h-full",
          view === "karte" && "block h-[calc(100dvh-var(--header-height)-4.25rem)]",
          view === "liste" && "hidden",
          view === "geteilt" && "hidden lg:block",
        )}
      >
        <MapConsent height="h-full" className="h-full">
          <SearchMap
            query={query}
            className="h-full w-full"
            activeId={activeId}
            onHoverProperty={setActiveId}
            contextLabel={contextLabel}
          />
        </MapConsent>
      </div>
    </div>
  );
}
