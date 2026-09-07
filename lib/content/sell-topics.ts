/**
 * Unterseiten von "Immobilie verkaufen". Jede Seite ist individuell
 * aufgebaut (app/(marketing)/immobilie-verkaufen/<slug>/page.tsx);
 * diese Liste speist Navigation, Themenuebersicht, Unter-Navigation
 * und Sitemap.
 */
export interface SellTopic {
  slug: string;
  href: string;
  label: string;
  title: string;
  teaser: string;
  /** Frueherer Ratgeber-Slug – wird per Redirect auf die neue Seite geleitet. */
  legacySlug: string;
  /** Motiv fuer den Seitenkopf. */
  image: string;
  imageAlt: string;
}

const base = "/immobilie-verkaufen";

export const sellTopics: SellTopic[] = [
  {
    slug: "ablauf",
    href: `${base}/ablauf`,
    label: "Ablauf des Verkaufs",
    title: "Der Verkauf in neun Schritten",
    teaser:
      "Von der ersten Entscheidung bis zur Schlüsselübergabe – was wann passiert und wo Verkäufe ins Stocken geraten.",
    legacySlug: "immobilie-verkaufen-ablauf",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Hausmodell mit Schlüsselbund auf einem Tisch",
  },
  {
    slug: "unterlagen",
    href: `${base}/unterlagen`,
    label: "Benötigte Unterlagen",
    title: "Unterlagen für den Verkauf",
    teaser:
      "Welche Dokumente Sie brauchen, wo Sie sie bekommen, was sie kosten und wie lange die Beschaffung dauert.",
    legacySlug: "unterlagen-immobilienverkauf",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Schreibtisch mit Unterlagen im Büro",
  },
  {
    slug: "immobilienwert",
    href: `${base}/immobilienwert`,
    label: "Wie ein Wert entsteht",
    title: "Was Ihre Immobilie wert ist",
    teaser:
      "Vergleichswert, Ertragswert, Sachwert: welches Verfahren wann greift – und warum Online-Rechner danebenliegen.",
    legacySlug: "was-ist-meine-immobilie-wert",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Taschenrechner und Unterlagen zur Wertermittlung",
  },
  {
    slug: "maklerprovision",
    href: `${base}/maklerprovision`,
    label: "Maklerprovision",
    title: "Maklerprovision: Wer zahlt was",
    teaser:
      "Gesetzliche Teilung seit 2020, übliche Sätze im Rheinland, Fälligkeit und was zur Leistung gehört.",
    legacySlug: "maklerprovision-erklaert",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Unterschrift unter einen Vertrag",
  },
  {
    slug: "immobilie-geerbt",
    href: `${base}/immobilie-geerbt`,
    label: "Immobilie geerbt",
    title: "Immobilie geerbt – was jetzt zu tun ist",
    teaser:
      "Fristen, Erbengemeinschaft, Erbschaft- und Spekulationssteuer: die Entscheidungen der ersten Monate.",
    legacySlug: "immobilie-geerbt-was-tun",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Wohnhaus mit Garten in ruhiger Lage",
  },
  {
    slug: "energieausweis",
    href: `${base}/energieausweis`,
    label: "Energieausweis",
    title: "Energieausweis verstehen",
    teaser:
      "Verbrauchs- oder Bedarfsausweis, Effizienzklassen und was ein schlechter Wert beim Verkauf tatsächlich kostet.",
    legacySlug: "energieausweis-verstehen",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Modernes Wohnhaus mit großzügiger Verglasung",
  },
];

export function findSellTopic(slug: string) {
  return sellTopics.find((t) => t.slug === slug);
}
