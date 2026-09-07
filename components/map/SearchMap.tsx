"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  LngLatBoundsLike,
  Map as MapLibreMap,
} from "maplibre-gl";
import { cn } from "@/lib/utils";

/**
 * Karte der Suchergebnisse (MapLibre GL JS, OSM-Rasterkacheln).
 *
 * Die Marker kommen aus `/api/immobilien/geo` und tragen dieselben
 * URL-Parameter wie die Liste – Liste und Karte zeigen damit garantiert
 * dieselbe Ergebnismenge.
 *
 * Diese Komponente wird ausschliesslich innerhalb von `MapConsent`
 * eingebunden; ohne Einwilligung wird sie nie gerendert und es geht keine
 * Anfrage an openstreetmap.org.
 */

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>-Mitwirkende';

/** Rheinland als Startausschnitt, falls kein Treffer Koordinaten hat. */
const FALLBACK_BOUNDS: LngLatBoundsLike = [
  [6.0, 50.5],
  [7.6, 51.4],
];

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

interface FeatureProps {
  id: string;
  slug: string;
  title: string;
  city: string;
  zipCode: string;
  marketingType: "KAUF" | "MIETE";
  price: number | null;
  priceOnRequest: boolean;
  livingArea: number | null;
  rooms: number | null;
  image: string | null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function popupHtml(p: FeatureProps) {
  const price = p.priceOnRequest || p.price == null ? "Preis auf Anfrage" : eur.format(p.price);
  const facts = [
    p.livingArea != null ? `${p.livingArea} m²` : null,
    p.rooms != null ? `${p.rooms} Zi.` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const image = p.image
    ? `<img src="${escapeHtml(p.image)}" alt="" style="width:100%;height:110px;object-fit:cover;display:block" />`
    : "";

  return `
    <div style="width:250px;font:400 13px/1.45 inherit">
      ${image}
      <div style="padding:10px 12px 12px">
        <p style="margin:0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8a8878">
          ${escapeHtml(p.zipCode)} ${escapeHtml(p.city)}
        </p>
        <p style="margin:4px 0 0;font-weight:600;color:#3e4018">${escapeHtml(p.title)}</p>
        <p style="margin:6px 0 0;font-weight:600;color:#3e4018">${escapeHtml(price)}</p>
        ${facts ? `<p style="margin:2px 0 0;color:#565655">${escapeHtml(facts)}</p>` : ""}
        <a href="/immobilien/${escapeHtml(p.slug)}"
           style="display:block;margin-top:10px;background:#c85000;color:#fff;text-align:center;
                  padding:9px 12px;font-size:11px;font-weight:600;letter-spacing:.06em;
                  text-transform:uppercase;text-decoration:none">Objekt ansehen</a>
      </div>
    </div>`;
}

export function SearchMap({
  query,
  className,
  activeId,
  onHoverProperty,
  contextLabel,
}: {
  /** Query-String der aktuellen Filter (ohne führendes „?"). */
  query: string;
  className?: string;
  /** In der Liste gerade überfahrenes Objekt – wird hervorgehoben. */
  activeId?: string | null;
  /** Meldet das auf der Karte überfahrene Objekt zurück an die Liste. */
  onHoverProperty?: (id: string | null) => void;
  /** Oranger Kontext-Chip oben rechts, z. B. „Köln · 50 km". */
  contextLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const libRef = useRef<typeof import("maplibre-gl") | null>(null);
  const homeRef = useRef<LngLatBoundsLike | null>(null);
  const [failed, setFailed] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [place, setPlace] = useState("");
  const [placeBusy, setPlaceBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const resizeRef = useRef<ResizeObserver | null>(null);
  const markersRef = useRef<import("maplibre-gl").Marker[]>([]);
  const featuresRef = useRef<GeoJSON.Feature<GeoJSON.Point>[]>([]);
  const syncRef = useRef<(() => void) | null>(null);
  /** Das hervorgehobene Objekt – in einer Ref, damit die einmal
   *  registrierten Marker-Ereignisse den aktuellen Wert sehen. */
  const activeRef = useRef<string | null>(null);
  // Der Rueckmelder wird in Kartenereignissen aufgerufen, die nur einmal
  // registriert werden. Die Ref haelt die jeweils aktuelle Funktion, ohne
  // dass die Karte deshalb neu aufgebaut werden muss.
  const hoverRef = useRef(onHoverProperty);
  useEffect(() => {
    hoverRef.current = onHoverProperty;
  }, [onHoverProperty]);

  // --- Karte aufbauen ----------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let map: MapLibreMap | null = null;

    (async () => {
      try {
        const maplibre = await import("maplibre-gl");
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled || !containerRef.current) return;
        libRef.current = maplibre;

        map = new maplibre.Map({
          container: containerRef.current,
          style: {
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: [TILE_URL],
                tileSize: 256,
                maxzoom: 19,
                attribution: ATTRIBUTION,
              },
            },
            layers: [{ id: "osm", type: "raster", source: "osm" }],
          },
          bounds: FALLBACK_BOUNDS,
          fitBoundsOptions: { padding: 48 },
          attributionControl: false,
        });
        mapRef.current = map;

        // Die Karte wird erst nach der Einwilligung eingehaengt. In dem
        // Moment steht die endgueltige Hoehe der Spalte noch nicht fest,
        // und MapLibre misst zu frueh – die Leinwand bliebe zu klein.
        // Ein ResizeObserver zieht sie nach, sobald das Layout steht.
        const ro = new ResizeObserver(() => map?.resize());
        ro.observe(containerRef.current);
        resizeRef.current = ro;

        map.addControl(new maplibre.AttributionControl({ compact: true }), "bottom-left");
        map.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");
        map.keyboard.enable();

        map.on("load", async () => {
          if (!map) return;

          // Marker werden bei jeder Bewegung neu gesetzt.
          const sync = () =>
            syncMarkers(map!, maplibre, featuresRef, markersRef, hoverRef, activeRef);
          map.on("move", sync);
          map.on("moveend", sync);
          syncRef.current = sync;

          setReady(true);
        });

        map.on("error", (event) => {
          // Fehlende Kachel ist kein Grund, die Karte abzuschalten.
          console.error("Kartenfehler:", event.error);
        });
      } catch (error) {
        console.error("Karte konnte nicht geladen werden:", error);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
      resizeRef.current?.disconnect();
      resizeRef.current = null;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // --- Marker nachladen, sobald sich die Filter ändern --------------------
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/immobilien/geo${query ? `?${query}` : ""}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as GeoJSON.FeatureCollection;
        featuresRef.current = data.features.filter(
          (f): f is GeoJSON.Feature<GeoJSON.Point> => f.geometry.type === "Point",
        );
        setCount(data.features.length);
        syncRef.current?.();

        if (data.features.length === 0) return;
        const maplibre = libRef.current;
        if (!maplibre) return;
        const bounds = new maplibre.LngLatBounds();
        for (const f of data.features) {
          if (f.geometry.type === "Point") {
            bounds.extend(f.geometry.coordinates as [number, number]);
          }
        }
        homeRef.current = bounds.toArray() as LngLatBoundsLike;
        map.fitBounds(bounds, { padding: 64, maxZoom: 14, duration: 0 });
        syncRef.current?.();
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Marker konnten nicht geladen werden:", error);
        }
      }
    })();

    return () => controller.abort();
  }, [query, ready]);

  // --- Highlighting aus der Liste ----------------------------------------
  useEffect(() => {
    activeRef.current = activeId ?? null;
    if (ready) syncRef.current?.();
  }, [activeId, ready]);

  // --- Ortssuche auf der Karte -------------------------------------------
  const searchPlace = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const map = mapRef.current;
    const value = place.trim();
    if (!map || value.length < 2) return;
    setPlaceBusy(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=de&q=${encodeURIComponent(value)}`,
        { headers: { Accept: "application/json" } },
      );
      const hits = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (hits[0]) {
        map.flyTo({ center: [Number(hits[0].lon), Number(hits[0].lat)], zoom: 12 });
      }
    } catch (error) {
      console.error("Ort konnte nicht gefunden werden:", error);
    } finally {
      setPlaceBusy(false);
    }
  }, [place]);

  function goHome() {
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(homeRef.current ?? FALLBACK_BOUNDS, { padding: 64, maxZoom: 14 });
  }

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center border border-line bg-surface-sunken px-6 text-center text-[0.875rem] text-ink-muted",
          className,
        )}
      >
        Die Karte konnte nicht geladen werden. Die Trefferliste bleibt vollständig nutzbar.
      </div>
    );
  }

  return (
    <div className={cn("relative isolate", className)}>
      <div
        ref={containerRef}
        role="application"
        aria-label="Karte mit den Suchtreffern"
        // MapLibre setzt dem Container selbst `position: relative`. Mit
        // `absolute inset-0` faellt die Hoehe dadurch auf 0 zusammen –
        // deshalb hier eine echte Hoehenangabe statt Positionierung.
        className="h-full w-full bg-surface-sunken"
      />

      {/* Ortssuchfeld – das einzige gerundete Eingabefeld der Seite,
          dadurch liest es sich als Kartenwerkzeug, nicht als Formularfeld. */}
      <form
        onSubmit={searchPlace}
        className="absolute left-3 top-3 z-10 flex max-w-[min(24rem,calc(100%-6rem))] items-center gap-2"
      >
        <label className="sr-only" htmlFor="karte-ort">
          Ort auf der Karte suchen
        </label>
        <input
          id="karte-ort"
          type="search"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Ort auf der Karte suchen"
          className="h-10 w-full rounded-full border border-[#525252] bg-surface px-4 text-[0.8125rem] text-ink shadow-[var(--shadow-subtle)] focus:border-accent-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={placeBusy}
          className="h-10 shrink-0 rounded-full bg-primary-800 px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-white disabled:opacity-60"
        >
          Los
        </button>
      </form>

      {contextLabel ? (
        <p className="absolute right-0 top-3 z-10 max-w-[60%] truncate bg-[var(--color-accent-onwhite)] px-5 py-2.5 text-right text-[0.875rem] text-white">
          {contextLabel}
        </p>
      ) : null}

      <button
        type="button"
        onClick={goHome}
        aria-label="Kartenausschnitt zurücksetzen"
        className="absolute bottom-24 right-3 z-10 flex h-10 w-10 items-center justify-center bg-surface text-primary-800 shadow-[0_2px_7px_0_rgba(0,0,0,0.2)] transition-colors hover:bg-surface-muted"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11.2 12 4l9 7.2" />
          <path d="M5.5 9.8V20h13V9.8" />
        </svg>
      </button>

      {count === 0 ? (
        <p className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 bg-surface p-5 text-center text-[0.875rem] leading-relaxed text-ink shadow-[var(--shadow-float)]">
          In diesem Ausschnitt liegt kein Treffer mit hinterlegter Position.
          Erweitern Sie den Umkreis oder lockern Sie die Filter.
        </p>
      ) : null}
    </div>
  );
}

/**
 * Marker-Grafiken als Bilddaten registrieren: ein dunkles Quadrat fuer
 * Cluster, ein oranger Tropfen fuer Einzelobjekte, derselbe Tropfen in
 * Oliv fuer das hervorgehobene Objekt.
 */
/**
 * Cluster und Pins als HTML-Marker setzen.
 *
 * Symbol-Ebenen waeren der naheliegende Weg, verlangen in MapLibre aber
 * eine `glyphs`-Quelle im Style – also einen weiteren Drittanbieter, der
 * beim Rendern angefragt wuerde. Nach der Einwilligung in OpenStreetMap
 * waere das ein zusaetzlicher Empfaenger, und dafuer ist die Sache zu
 * klein: bei hoechstens 300 Objekten sind DOM-Marker unproblematisch und
 * bleiben vollstaendig lokal.
 */
function syncMarkers(
  map: MapLibreMap,
  maplibre: typeof import("maplibre-gl"),
  features: { current: GeoJSON.Feature<GeoJSON.Point>[] },
  store: { current: import("maplibre-gl").Marker[] },
  hover: { current: ((id: string | null) => void) | undefined },
  active: { current: string | null },
) {
  for (const marker of store.current) marker.remove();
  store.current = [];

  const bounds = map.getBounds();
  const visible = features.current.filter((f) =>
    bounds.contains(f.geometry.coordinates as [number, number]),
  );

  // Punkte, die auf dem Schirm dichter als `CLUSTER_PX` beieinander
  // liegen, werden zu einem Cluster zusammengefasst. Gerechnet wird in
  // Bildschirmpixeln, damit das Ergebnis bei jeder Zoomstufe stimmt.
  const CLUSTER_PX = 55;
  const groups: Array<{ items: GeoJSON.Feature<GeoJSON.Point>[]; x: number; y: number }> = [];

  for (const feature of visible) {
    const point = map.project(feature.geometry.coordinates as [number, number]);
    const near = groups.find(
      (g) => Math.hypot(g.x - point.x, g.y - point.y) <= CLUSTER_PX,
    );
    if (near) {
      near.items.push(feature);
      // Mittelpunkt nachfuehren, damit der Cluster nicht am ersten Punkt klebt.
      near.x = (near.x * (near.items.length - 1) + point.x) / near.items.length;
      near.y = (near.y * (near.items.length - 1) + point.y) / near.items.length;
    } else {
      groups.push({ items: [feature], x: point.x, y: point.y });
    }
  }

  for (const group of groups) {
    if (group.items.length > 1) {
      const el = document.createElement("button");
      el.type = "button";
      el.textContent = String(group.items.length);
      el.setAttribute("aria-label", `${group.items.length} Objekte – hineinzoomen`);
      el.style.cssText =
        "width:40px;height:40px;display:flex;align-items:center;justify-content:center;" +
        "background:#1c2006;border:2px solid #fff;color:#fff;font:600 13px/1 inherit;cursor:pointer";
      const center = map.unproject([group.x, group.y]);
      el.addEventListener("click", () => {
        const b = new maplibre.LngLatBounds();
        for (const item of group.items) {
          b.extend(item.geometry.coordinates as [number, number]);
        }
        map.fitBounds(b, { padding: 80, maxZoom: 16 });
      });
      store.current.push(
        new maplibre.Marker({ element: el, anchor: "center" }).setLngLat(center).addTo(map),
      );
      continue;
    }

    const feature = group.items[0];
    const props = feature.properties as unknown as FeatureProps;
    const id = String(props.id);
    const coords = feature.geometry.coordinates as [number, number];

    const el = document.createElement("button");
    el.type = "button";
    el.setAttribute("aria-label", props.title ?? "Objekt");
    el.innerHTML = dropSvg(id === active.current ? "#3e4018" : "#ff6d00");
    el.style.cssText = "background:none;border:0;padding:0;cursor:pointer;line-height:0";
    el.addEventListener("mouseenter", () => hover.current?.(id));
    el.addEventListener("mouseleave", () => hover.current?.(null));
    el.addEventListener("focus", () => hover.current?.(id));
    el.addEventListener("blur", () => hover.current?.(null));
    el.addEventListener("click", () => {
      new maplibre.Popup({ offset: 28, maxWidth: "260px" })
        .setLngLat(coords)
        .setHTML(popupHtml(props))
        .addTo(map);
    });

    store.current.push(
      new maplibre.Marker({ element: el, anchor: "bottom" }).setLngLat(coords).addTo(map),
    );
  }
}

function dropSvg(fill: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="33" viewBox="0 0 44 56" aria-hidden="true">
    <path d="M22 2C11.5 2 3 10.4 3 20.8 3 34.4 22 54 22 54s19-19.6 19-33.2C41 10.4 32.5 2 22 2Z"
          fill="${fill}" stroke="#ffffff" stroke-width="3"/>
    <circle cx="22" cy="20" r="6.5" fill="#ffffff"/>
  </svg>`;
}
