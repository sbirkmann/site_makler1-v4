"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";

/**
 * Grafimmo-Stil: durchgaengig heller, feststehender Header auf allen Seiten
 * (kein transparenter Overlay-Header mehr ueber dem Hero-Bild).
 */
export function HeaderSwitch() {
  usePathname();
  return <Header overlay={false} />;
}
