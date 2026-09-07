import { NextResponse } from "next/server";
import {
  findPropertyMapMarkers,
  type PropertyQuery,
} from "@/lib/repositories/properties";
import { parsePropertySearchParams, type RawSearchParams } from "@/lib/search-params";
import { lookupPlaceCenter } from "@/lib/services/place-lookup";
import { toNumber } from "@/lib/utils";

export const revalidate = 120;

/**
 * Schlanker GeoJSON-Endpunkt fuer die Karte auf /immobilien.
 *
 * Bewusst getrennt von der Seite: die Karte laedt erst nach der
 * Einwilligung, und sie soll dann nur Koordinaten und die paar Felder
 * holen, die im Popover stehen – nicht die vollstaendigen Objektdaten.
 * Es gelten dieselben URL-Parameter wie auf der Seite, damit Liste und
 * Karte garantiert dieselbe Ergebnismenge zeigen.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params: RawSearchParams = {};
  for (const key of new Set(url.searchParams.keys())) {
    params[key] = url.searchParams.getAll(key);
  }

  let query: PropertyQuery = parsePropertySearchParams(params);
  if (query.radiusKm && query.city) {
    const center = await lookupPlaceCenter(query.city);
    if (center) query = { ...query, center };
  }

  const rows = await findPropertyMapMarkers(query);

  const features = rows
    .filter((row) => row.latitude != null && row.longitude != null)
    .map((row) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [row.longitude as number, row.latitude as number],
      },
      properties: {
        id: row.id,
        slug: row.slug,
        title: row.title,
        city: row.city,
        zipCode: row.zipCode,
        marketingType: row.marketingType,
        price: row.priceOnRequest ? null : toNumber(row.price),
        priceOnRequest: row.priceOnRequest,
        livingArea: toNumber(row.livingArea),
        rooms: toNumber(row.rooms),
        image: row.images[0]?.url ?? null,
      },
    }));

  return NextResponse.json(
    { type: "FeatureCollection", features },
    {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=120, stale-while-revalidate=600",
      },
    },
  );
}
