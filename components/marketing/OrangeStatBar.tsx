import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { IconArrowRight } from "@/components/icons";

/**
 * Oranges Vollbreiten-Band unter dem Hero: links die Aussage in Versalien,
 * rechts die tatsaechliche Objektanzahl aus der Datenbank. Die Zahl kommt vom
 * Aufrufer, damit dieses Band eine reine Server-Komponente bleibt.
 */
export function OrangeStatBar({
  count,
  href = "/immobilien",
  label = "Hier geht es zum kompletten Immobilienangebot im Rheinland",
}: {
  count: number;
  href?: string;
  label?: string;
}) {
  return (
    <section className="bg-accent-500">
      <Container size="wide">
        <Link
          href={href}
          className="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
        >
          <p className="max-w-2xl text-[0.9375rem] font-semibold uppercase leading-snug tracking-[0.06em] text-white sm:text-[1.0625rem]">
            {label}
          </p>

          <p className="flex shrink-0 items-baseline gap-2.5 text-white">
            <span className="text-[0.6875rem] font-light uppercase tracking-[0.16em] opacity-80">
              Aktuell
            </span>
            <span className="font-[family-name:var(--font-display)] text-[2rem] font-semibold leading-none sm:text-[2.5rem]">
              {count.toLocaleString("de-DE")}
            </span>
            <span className="text-[0.9375rem] font-light">
              {count === 1 ? "Immobilie" : "Immobilien"}
            </span>
            <IconArrowRight
              size={20}
              className="ml-1 transition-transform duration-300 [transition-timing-function:var(--ease-out-quint)] group-hover:translate-x-1"
            />
          </p>
        </Link>
      </Container>
    </section>
  );
}
