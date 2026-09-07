import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/**
 * Bildband als Seitenkopf – dasselbe Muster wie ueber den Funnels und auf
 * den Verkaufs-Unterseiten: Foto, dunkler Verlauf, Rubrik und Titel darauf.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  image: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative h-[15rem] w-full overflow-hidden bg-primary-900 sm:h-[18rem] lg:h-[21rem]">
      <Image src={image} alt={imageAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/40 to-primary-950/30" />
      <Container size="wide" className="relative flex h-full items-end pb-8">
        <div>
          <span className="eyebrow text-accent-300">{eyebrow}</span>
          <h1 className="hero-title mt-2 max-w-[24ch] text-balance text-white">{title}</h1>
          {lead ? (
            <p className="mt-3 max-w-2xl text-[1rem] font-light leading-relaxed text-white/80">
              {lead}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
