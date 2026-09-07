import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { IconArrowRight } from "@/components/icons";

/**
 * Drei Ratgeber-Anrisse zu den Lebenslagen, aus denen die meisten Verkaeufe
 * entstehen – in der Referenz der Block "Typische Verkaufsfehler?".
 */
const guides = [
  {
    title: "Verkauf bei Scheidung",
    text: "Was soll aus der Immobilie werden? Wer bleibt, wer geht? Übertragen, verkaufen oder vermieten?",
    href: "/ratgeber",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Zwei Personen am Tisch bei einem klärenden Gespräch",
  },
  {
    title: "Verkauf im Alter",
    text: "Was passiert mit der Immobilie? Verkaufen, vermieten, barrierefrei sanieren – welche Alternativen gibt es sonst?",
    href: "/ratgeber",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Wohnhaus mit großzügiger Verglasung",
  },
  {
    title: "Verkauf bei Erbschaft",
    text: "Wer eine Immobilie geerbt hat, hat viele Fragen. Welche Aufgaben, Paragraphen und Fristen sind zu berücksichtigen?",
    href: "/immobilie-verkaufen/immobilie-geerbt",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Schreibtisch mit Unterlagen im Büro",
  },
];

export function GuideTeasers() {
  return (
    <Section tone="muted">
      <Container size="wide">
        <Reveal>
          <h2 className="display-2 text-accent-500">
            Typische Verkaufsfehler? Nutzen Sie unsere Ratgeber!
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {guides.map((guide, i) => (
            <Reveal key={guide.title} delay={i * 100}>
              <article className="group flex h-full flex-col bg-surface">
                <Link
                  href={guide.href}
                  className="relative block aspect-[16/10] overflow-hidden"
                  tabIndex={-1}
                  aria-hidden
                >
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.05]"
                  />
                </Link>
                <div className="flex flex-1 flex-col border-t-2 border-accent-500 p-6">
                  <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-primary-800">
                    {guide.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                    {guide.text}
                  </p>
                  <Link
                    href={guide.href}
                    className="mt-5 inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-600 hover:text-accent-700"
                  >
                    Hier zum Ratgeber
                    <IconArrowRight size={15} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
