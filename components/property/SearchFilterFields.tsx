import { propertyTypeLabels } from "@/lib/labels";
import type { RawSearchParams } from "@/lib/search-params";
import { SelectField } from "@/components/property/SelectField";

/**
 * Die Filterfelder der Suche – reines Server-Markup ohne Zustand.
 *
 * Alle Felder tragen die bestehenden URL-Parameternamen (`marketing`,
 * `typ`, `ort`, `umkreis`, `preis_min`, `preis_max`, `zimmer`, `flaeche`,
 * `sort`). Dadurch funktioniert das umgebende `<form method="get">` auch
 * ohne JavaScript: der Browser baut genau die URL, die der Server ohnehin
 * schon liest.
 *
 * Die Felder werden zweimal gerendert – in der Leiste am Desktop und im
 * Vollbild-Sheet auf schmalen Viewports. Damit `id`/`for` eindeutig
 * bleiben, bekommt jeder Aufruf ein eigenes `idPrefix`.
 */

export const radiusOptions = [
  { value: "5", label: "+ 5 km" },
  { value: "10", label: "+ 10 km" },
  { value: "25", label: "+ 25 km" },
  { value: "50", label: "+ 50 km" },
  { value: "100", label: "+ 100 km" },
];

const buyPriceOptions = ["100000", "200000", "300000", "400000", "500000", "750000", "1000000", "1500000", "2500000"];
const rentPriceOptions = ["400", "600", "800", "1000", "1200", "1600", "2200", "3000", "4000"];

const roomOptions = ["1", "2", "3", "4", "5", "6"];
const areaOptions = ["40", "60", "80", "100", "130", "160", "200", "300"];

export const sortOptions = [
  { value: "neueste", label: "Neueste zuerst" },
  { value: "preis-auf", label: "Preis aufsteigend" },
  { value: "preis-ab", label: "Preis absteigend" },
  { value: "flaeche", label: "Größte Wohnfläche" },
];

const money = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

function first(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return v?.trim() ?? "";
}

function allOf(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : value.split(",");
  return arr.map((v) => v.trim()).filter(Boolean);
}

/** Beschriftung einer Zelle in der Filterleiste. */
function CellLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-subtle"
    >
      {children}
    </label>
  );
}

/**
 * Feldrahmen wie in der Referenz: kein eigener Rahmen, nur die feine
 * Rille zwischen den Zellen; erst der Fokus setzt einen orangen Rahmen.
 */
const controlClass =
  "h-9 w-full border border-transparent bg-transparent px-0 text-[0.8125rem] text-ink " +
  "focus:border-accent-500 focus:bg-surface-muted focus:px-2 focus:outline-none";

const selectClass = `${controlClass} select-field pr-7 focus:pr-7`;

export interface FilterFieldsProps {
  params: RawSearchParams;
  cities: string[];
  idPrefix: string;
  /** Felder, die in der schmalen Leiste ins Popover wandern. */
  variant: "bar-primary" | "bar-overflow" | "sheet";
}

export function marketingOf(params: RawSearchParams): string {
  return first(params.marketing).toUpperCase();
}

/** Miete oder Kauf entscheidet über die Preisstufen. */
export function isRentSearch(params: RawSearchParams): boolean {
  return marketingOf(params) === "MIETE";
}

export function MarketingField({ params, idPrefix }: { params: RawSearchParams; idPrefix: string }) {
  const current = marketingOf(params);
  return (
    <div>
      <CellLabel htmlFor={`${idPrefix}-marketing`}>Erwerbsart</CellLabel>
      <SelectField
        id={`${idPrefix}-marketing`}
        name="marketing"
        defaultValue={current === "KAUF" || current === "MIETE" ? current.toLowerCase() : ""}
        className={selectClass}
        options={[
          { value: "", label: "Kauf und Miete" },
          { value: "kauf", label: "Kauf" },
          { value: "miete", label: "Miete" },
        ]}
      />
    </div>
  );
}

export function TypeField({ params, idPrefix }: { params: RawSearchParams; idPrefix: string }) {
  const selected = allOf(params.typ).map((t) => t.toUpperCase());
  return (
    <div>
      <CellLabel htmlFor={`${idPrefix}-typ`}>Objektart</CellLabel>
      <SelectField
        id={`${idPrefix}-typ`}
        name="typ"
        defaultValue={selected[0] ?? ""}
        className={selectClass}
        options={[
          { value: "", label: "Alle Objektarten" },
          ...Object.entries(propertyTypeLabels).map(([value, label]) => ({ value, label })),
        ]}
      />
      {/* Mehrfachauswahl bleibt erhalten: alle weiteren gewaehlten Typen
          reisen als versteckte Felder mit, damit ein geteilter Link mit
          `?typ=HAUS&typ=WOHNUNG` beim Absenden nicht auf einen Typ
          zusammenfaellt. */}
      {selected.slice(1).map((t) => (
        <input key={t} type="hidden" name="typ" value={t} />
      ))}
    </div>
  );
}

export function PriceField({ params, idPrefix }: { params: RawSearchParams; idPrefix: string }) {
  const rent = isRentSearch(params);
  const steps = rent ? rentPriceOptions : buyPriceOptions;
  return (
    <div>
      <CellLabel>{rent ? "Kaltmiete" : "Kaufpreis"}</CellLabel>
      <div className="flex items-center gap-1">
        <SelectField
          id={`${idPrefix}-preis-min`}
          name="preis_min"
          defaultValue={first(params.preis_min)}
          className={selectClass}
          options={[
            { value: "", label: "von" },
            ...steps.map((v) => ({ value: v, label: `ab ${money.format(Number(v))} €` })),
          ]}
        />
        <span aria-hidden="true" className="text-ink-subtle">
          –
        </span>
        <SelectField
          id={`${idPrefix}-preis-max`}
          name="preis_max"
          defaultValue={first(params.preis_max)}
          className={selectClass}
          options={[
            { value: "", label: "bis" },
            ...steps.map((v) => ({ value: v, label: `bis ${money.format(Number(v))} €` })),
          ]}
        />
      </div>
    </div>
  );
}

export function RoomsField({ params, idPrefix }: { params: RawSearchParams; idPrefix: string }) {
  return (
    <div>
      <CellLabel htmlFor={`${idPrefix}-zimmer`}>Zimmer</CellLabel>
      <SelectField
        id={`${idPrefix}-zimmer`}
        name="zimmer"
        defaultValue={first(params.zimmer)}
        className={selectClass}
        options={[
          { value: "", label: "beliebig" },
          ...roomOptions.map((v) => ({ value: v, label: `ab ${v}` })),
        ]}
      />
    </div>
  );
}

export function AreaField({ params, idPrefix }: { params: RawSearchParams; idPrefix: string }) {
  return (
    <div>
      <CellLabel htmlFor={`${idPrefix}-flaeche`}>Wohnfläche</CellLabel>
      <SelectField
        id={`${idPrefix}-flaeche`}
        name="flaeche"
        defaultValue={first(params.flaeche)}
        className={selectClass}
        options={[
          { value: "", label: "beliebig" },
          ...areaOptions.map((v) => ({ value: v, label: `ab ${v} m²` })),
        ]}
      />
    </div>
  );
}

export function PlaceField({
  params,
  idPrefix,
  cities,
}: {
  params: RawSearchParams;
  idPrefix: string;
  cities: string[];
}) {
  return (
    <div>
      <CellLabel htmlFor={`${idPrefix}-ort`}>Ort / PLZ</CellLabel>
      <input
        id={`${idPrefix}-ort`}
        name="ort"
        type="text"
        defaultValue={first(params.ort)}
        list={`${idPrefix}-orte`}
        placeholder="z. B. Köln oder 50667"
        autoComplete="address-level2"
        className={controlClass}
      />
      <datalist id={`${idPrefix}-orte`}>
        {cities.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
  );
}

export function RadiusField({ params, idPrefix }: { params: RawSearchParams; idPrefix: string }) {
  return (
    <div>
      <CellLabel htmlFor={`${idPrefix}-umkreis`}>Umkreis</CellLabel>
      <SelectField
        id={`${idPrefix}-umkreis`}
        name="umkreis"
        defaultValue={first(params.umkreis)}
        className={selectClass}
        options={[{ value: "", label: "genauer Ort" }, ...radiusOptions]}
      />
    </div>
  );
}

export function SortField({ params, idPrefix }: { params: RawSearchParams; idPrefix: string }) {
  const current = first(params.sort) || "neueste";
  return (
    <div>
      <CellLabel htmlFor={`${idPrefix}-sort`}>Sortierung</CellLabel>
      <SelectField
        id={`${idPrefix}-sort`}
        name="sort"
        defaultValue={current}
        className={selectClass}
        options={[...sortOptions]}
      />
    </div>
  );
}

/** Freitext `q` bleibt als Parameter erhalten, auch wenn kein Feld ihn zeigt. */
export function HiddenPassThrough({ params }: { params: RawSearchParams }) {
  const q = first(params.q);
  if (!q) return null;
  return <input type="hidden" name="q" value={q} />;
}
