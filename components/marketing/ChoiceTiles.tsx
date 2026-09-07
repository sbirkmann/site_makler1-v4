import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Drei grossflaechige Auswahlkacheln direkt unter dem Hero – der zentrale
 * Einstieg der Referenz: Kaufen, Mieten, Bewerten. Jede Kachel ist ein
 * ganzflaechiges Bild mit dunklem Verlauf und Titel in Versalien.
 */
const tiles = [
  {
    title: "Immobilie kaufen",
    subline: "Sie suchen Ihre Traumimmobilie?",
    href: "/immobilien?marketing=kauf",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Immobilie mieten",
    subline: "Wohnung oder Haus?",
    href: "/immobilien?marketing=miete",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Immobilie bewerten",
    subline: "Kostenfrei und unverbindlich",
    href: "/immobilienbewertung",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
];

export function ChoiceTiles() {
  return (
    <Section>
      <Container size="wide">
        <Reveal>
          <h2 className="display-2 max-w-4xl text-primary-800">
            Kaufen oder Mieten? Wir haben die passende Immobilie – wählen Sie aus.
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {tiles.map((tile, i) => (
            <Reveal key={tile.title} delay={i * 100}>
              <Link
                href={tile.href}
                className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-[var(--radius-xs)]"
              >
                <Image
                  src={tile.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.05]"
                />
                {/* Verlauf haelt die Schrift auf jedem Motiv lesbar. */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/25 to-transparent" />
                <div className="relative w-full p-6">
                  <h3 className="display-3 text-white">{tile.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] font-light text-white/85">
                    {tile.subline}
                  </p>
                  <span className="mt-4 inline-block h-[3px] w-10 bg-accent-500 transition-all duration-300 [transition-timing-function:var(--ease-out-quint)] group-hover:w-20" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
