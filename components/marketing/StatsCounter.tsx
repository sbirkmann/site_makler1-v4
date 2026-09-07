"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";

/**
 * Kennzahlenband wie in der Referenz: dunkle Flaeche, die Zahlen zaehlen beim
 * Erscheinen hoch. Die Animation laeuft nur einmal und respektiert
 * `prefers-reduced-motion` – dann steht der Endwert sofort.
 */
type Stat = {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
  /** Jahreszahlen ohne Tausendertrennzeichen ausgeben. */
  plain?: boolean;
};

const stats: Stat[] = [
  { prefix: "seit", value: site.founded, label: "am Markt", plain: true },
  { prefix: "über", value: site.stats.propertiesSold, label: "vermittelte Immobilien" },
  { prefix: "über", value: site.stats.happyClients, label: "betreute Kundinnen und Kunden" },
  { prefix: "rund", value: site.stats.yearsExperience, label: "Jahre Erfahrung" },
  { prefix: "über", value: 340, suffix: " Mio.", label: "vermitteltes Volumen" },
];

function useCountUp(target: number, run: boolean, decimals = 0, plain = false) {
  const [value, setValue] = useState(run ? target : 0);

  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // Ease-out, damit die Zahl weich einrastet statt hart zu stoppen.
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, target]);

  if (plain) return String(Math.round(value));
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function StatItem({ stat, run }: { stat: Stat; run: boolean }) {
  const shown = useCountUp(stat.value, run, stat.decimals ?? 0, stat.plain);
  return (
    // Feste Zeilenhoehen fuer Prefix und Zahl: so liegen die Zahlen aller
    // Kennzahlen auf einer Linie und die Labels beginnen gemeinsam darunter.
    <div className="text-center">
      <p className="h-5 text-[0.75rem] font-light uppercase tracking-[0.16em] text-white/70">
        {stat.prefix}
      </p>
      <p className="font-[family-name:var(--font-display)] text-[2.25rem] font-semibold leading-[1.15] text-white sm:text-[2.75rem]">
        {shown}
        {stat.suffix}
      </p>
      <p className="mx-auto mt-2 max-w-[13rem] text-[0.8125rem] font-light leading-snug text-white/75">
        {stat.label}
      </p>
    </div>
  );
}

export function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-primary-800 py-14 sm:py-16">
      <Container size="wide">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <StatItem key={stat.label + stat.prefix} stat={stat} run={run} />
          ))}
        </div>
      </Container>
    </section>
  );
}
