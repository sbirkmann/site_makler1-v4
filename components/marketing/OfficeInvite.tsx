import Image from "next/image";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Persoenliche Einladung ins Buero – in der Referenz der Gegenpol zu den
 * Funnels: ein Bild, ein warmer Text, Telefon und Mail im Klartext.
 */
export function OfficeInvite() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="relative min-h-[18rem] lg:min-h-[30rem]">
        <Image
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1400&q=80"
          alt="Kaffee auf dem Besprechungstisch im Maklerbüro"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-center bg-primary-800 px-6 py-14 sm:px-10 lg:px-16">
        <Reveal className="max-w-xl">
          <h2 className="display-2 text-white">Auf einen Kaffee ins Maklerbüro</h2>
          <p className="mt-5 text-[1.0625rem] font-light leading-relaxed text-white/80">
            Besuchen Sie uns von Montag bis Freitag zwischen 9:00 und 17:00 Uhr. Sie
            finden uns mitten in {site.address.city}, in der {site.address.street}.
            Lernen Sie uns bei einem guten Kaffee persönlich kennen – ob Kauf,
            Miete oder Bewertung, wir sind Ihr Ansprechpartner.
          </p>
          <p className="mt-6 text-[0.9375rem] font-light text-white/80">
            Für den schnellen Kontakt schreiben Sie uns eine Mail an{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-medium text-accent-300 underline underline-offset-4 hover:text-accent-200"
            >
              {site.contact.email}
            </a>{" "}
            oder rufen Sie unter{" "}
            <a
              href={site.contact.phoneHref}
              className="font-medium text-accent-300 underline underline-offset-4 hover:text-accent-200"
            >
              {site.contact.phone}
            </a>{" "}
            an.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
