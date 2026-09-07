import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { IconCheck, IconShield } from "@/components/icons";

export function FunnelLayout({
  eyebrow,
  title,
  description,
  benefits,
  children,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  children: ReactNode;
  /** Motiv fuer den Seitenkopf; ohne Angabe bleibt der Funnel ohne Hero. */
  image?: string;
  imageAlt?: string;
}) {
  return (
    <>
      {/* Bildband ueber dem Funnel – wie auf den Unterseiten der Referenz. */}
      {image ? (
        <div className="relative h-[13rem] w-full overflow-hidden bg-primary-900 sm:h-[16rem] lg:h-[19rem]">
          <Image src={image} alt={imageAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/35 to-primary-950/30" />
          <Container className="relative flex h-full items-end pb-7">
            <div>
              <span className="eyebrow text-accent-300">{eyebrow}</span>
              <h1 className="hero-title mt-2 max-w-[22ch] text-balance text-white">{title}</h1>
            </div>
          </Container>
        </div>
      ) : null}

      <div className="bg-surface-muted py-10 sm:py-14 lg:py-18">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
          {/* Begleitende Argumentation – auf Mobile ueber dem Formular gekuerzt */}
          <aside className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            {image ? null : (
              <>
                <span className="eyebrow">{eyebrow}</span>
                <h1 className="funnel-title mt-4 hyphens-auto break-words text-balance" lang="de">
                  {title}
                </h1>
              </>
            )}
            <p className={image ? "lead" : "lead mt-5"}>{description}</p>

            <ul className="mt-8 flex flex-col gap-3.5">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                    <IconCheck size={12} strokeWidth={3} />
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-muted">{benefit}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 flex items-start gap-2.5 border-t border-line pt-6 text-[0.8125rem] leading-relaxed text-ink-subtle">
              <IconShield size={16} className="mt-0.5 shrink-0 text-primary-500" />
              Ihre Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht
              an Dritte weitergegeben.
            </p>
          </aside>

          {/* Kantiger Formularkasten mit oranger Oberkante – Handschrift der Marke. */}
          <div className="min-w-0 border-t-2 border-accent-500 bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
            {children}
          </div>
        </div>
      </Container>
      </div>
    </>
  );
}
