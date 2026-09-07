import { Container } from "@/components/ui/Container";
import { propertyTypeLabels } from "@/lib/labels";

/**
 * Zweiter Sucheinstieg im Seitenfuss, als olivgruenes Vollbreiten-Band.
 *
 * Bewusst ein echtes GET-Formular ohne Client-Zustand: es schreibt dieselben
 * URL-Parameter wie die Suche selbst und funktioniert deshalb auch ohne
 * JavaScript. Der Ort ist ein Freitextfeld, weil der Mittelpunkt fuer die
 * Umkreissuche serverseitig geokodiert wird.
 */
export function SearchBandOlive({ cities }: { cities: string[] }) {
  return (
    <section className="bg-primary-800 py-10 sm:py-12">
      <Container size="wide">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
          <div className="lg:w-[16rem] lg:shrink-0">
            <h2 className="display-3 text-white">Immobilie finden</h2>
            <p className="mt-2 text-[0.9375rem] font-light text-white/75">
              Nach Ort, Art und Vermarktung – oder im Umkreis.
            </p>
          </div>

          <form action="/immobilien" method="get" className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="band-marketing"
                className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/70"
              >
                Kauf oder Miete
              </label>
              <select
                id="band-marketing"
                name="marketing"
                className="select-field h-11 w-full border border-white/25 bg-primary-900 px-3.5 text-[0.875rem] text-white focus:border-accent-500 focus:outline-none"
              >
                <option value="">Alle</option>
                <option value="kauf">Kaufen</option>
                <option value="miete">Mieten</option>
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="band-typ"
                className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/70"
              >
                Objektart
              </label>
              <select
                id="band-typ"
                name="typ"
                className="select-field h-11 w-full border border-white/25 bg-primary-900 px-3.5 text-[0.875rem] text-white focus:border-accent-500 focus:outline-none"
              >
                <option value="">Alle Arten</option>
                {Object.entries(propertyTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="band-ort"
                className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/70"
              >
                Ort oder PLZ
              </label>
              <input
                id="band-ort"
                name="ort"
                type="text"
                list="band-ort-vorschlaege"
                placeholder="z. B. Köln"
                autoComplete="postal-code"
                className="h-11 w-full border border-white/25 bg-primary-900 px-3.5 text-[0.875rem] text-white placeholder:text-white/45 focus:border-accent-500 focus:outline-none"
              />
              <datalist id="band-ort-vorschlaege">
                {cities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <button
              type="submit"
              className="h-11 shrink-0 bg-[var(--color-accent-onwhite)] px-8 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-700"
            >
              Suchen
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
