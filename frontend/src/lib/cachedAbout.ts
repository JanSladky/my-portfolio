// src/lib/cachedAbout.ts
// ÚČEL: Načíst Single Type "About" ze Strapi a držet v cache.
// V DEVu cache vypínáme (revalidate=false), v PROD ji držíme (např. 600s).
// Zároveň čteme hodnoty tolerantně z attributes i z kořene (viz Strapi response).

import { unstable_cache } from "next/cache";
import { strapiFetch } from "./strapi";

// ====== Typ dat pro UI ======
export type AboutDTO = {
  id: number;
  title: string;
  about_text: string;
};

// ====== Pomocné pickery (bezpečné čtení z různých názvů/úrovní) ======
function pickTitle(item: any): string {
  const a = item?.attributes ?? {};
  return (
    (typeof a.title === "string" && a.title) ||
    (typeof item?.title === "string" && item.title) ||
    (typeof a.about_title === "string" && a.about_title) ||
    (typeof item?.about_title === "string" && item.about_title) ||
    (typeof a.heading === "string" && a.heading) ||
    (typeof item?.heading === "string" && item.heading) ||
    (typeof a.name === "string" && a.name) ||
    (typeof item?.name === "string" && item.name) ||
    ""
  );
}

function pickAboutText(item: any): string {
  const a = item?.attributes ?? {};
  return (
    (typeof a.about_text === "string" && a.about_text) ||
    (typeof item?.about_text === "string" && item.about_text) ||
    (typeof a.text === "string" && a.text) ||
    (typeof item?.text === "string" && item.text) ||
    (typeof a.content === "string" && a.content) ||
    (typeof item?.content === "string" && item.content) ||
    (typeof a.body === "string" && a.body) ||
    (typeof item?.body === "string" && item.body) ||
    (typeof a.rich_text === "string" && a.rich_text) ||
    (typeof item?.rich_text === "string" && item.rich_text) ||
    ""
  );
}

// ====== Sjednocení odpovědi ======
function unify(input: any): AboutDTO {
  // Single-type může být { data: {...} } nebo rovnou {...}
  const dataNode = input?.data ?? input ?? {};
  const id = Number(dataNode?.id ?? 0) || 0;

  return {
    id,
    title: pickTitle(dataNode),
    about_text: pickAboutText(dataNode),
  };
}

// ====== Tvrdý fetch (bez cache), tagujeme pro on-demand revalidate ======
async function fetchAboutStrict(): Promise<AboutDTO> {
  const res = await strapiFetch<{ data: any }>({
    path: "/api/about",
    // revalidate přes unstable_cache; tady stačí tag, ať může fungovat revalidateTag('about')
    next: { tags: ["about"] },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("🔎 Strapi /api/about sample:", res?.data ?? res);
  }

  const dto = unify(res);
  return {
    id: dto.id,
    title: dto.title || "(bez názvu)",
    about_text: dto.about_text || "",
  };
}

// ====== Nastavení revalidate pro unstable_cache ======
// DŮLEŽITÉ: v DEV musí být FALSE (vypne cache), v PROD číslo > 0 (např. 600s).
const CACHE_REVALIDATE: number | false =
  process.env.NODE_ENV === "development" ? false : 600;

// ====== Cache wrapper ======
const getCachedAboutInner = unstable_cache(
  async () => await fetchAboutStrict(),
  ["about"], // cache key
  { revalidate: CACHE_REVALIDATE, tags: ["about"] }
);

// ====== Veřejná funkce ======
export async function getCachedAbout(): Promise<AboutDTO | null> {
  try {
    return await getCachedAboutInner();
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ getCachedAbout failed:", e?.message || e);
    }
    return null;
  }
}