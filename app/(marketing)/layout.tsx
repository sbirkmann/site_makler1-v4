import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuickActionRail } from "@/components/layout/QuickActionRail";
import { isDemoSite, site } from "@/lib/site";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zipCode,
      addressLocality: site.address.city,
      addressCountry: "DE",
    },
    areaServed: site.regions.map((r) => ({ "@type": "City", name: r })),
    // Die Bewertungen im Bestand sind Beispieldaten. Ein AggregateRating
    // darauf waere irrefuehrende Werbung – es wird erst ausgeliefert, wenn
    // echte Bewertungen vorliegen (`isDemoSite` auf false).
    ...(isDemoSite
      ? {}
      : {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: site.stats.averageRating,
            bestRating: 5,
            ratingCount: 12,
          },
        }),
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header overlay={false} />
      <main id="hauptinhalt" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* Abstandhalter: die feste Leiste auf Mobil wuerde sonst den
          Seitenfuss ueberdecken. */}
      <div aria-hidden className="h-14 xl:hidden" />
      <QuickActionRail />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </div>
  );
}
