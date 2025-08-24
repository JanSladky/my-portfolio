// my-portfolio/frontend/src/lib/cachedPages.ts
// ÚČEL: Bezpečně a tolerantně načíst jednu stránku (podle slugu) ze Strapi
//       a držet ji v Next.js cache. Žádné ACF, žádné WP pozůstatky.
//
// POZNÁMKY PRO ZAČÁTEČNÍKA:
// - import {...} from "next/cache": načítáme "unstable_cache" – Next umí kešovat
//   výsledek funkce a řídit revalidaci.
// - import { strapiFetch } ...: náš vlastní helper, který přidává base URL, hlavičky atd.

import { unstable_cache } from "next/cache";
import { strapiFetch } from "./strapi";

// 1) TYP DAT, které chceme mít ve frontendu
export type PageDTO = {
  id: number;
  title: string;      // titulek stránky
  slug: string;       // URL identifikátor (např. "about")
  about_text: string; // náš dlouhý text z jednoho pole
};

// 2) Pomocná funkce: sjednotí objekt z různých tvarů odpovědi Strapi
//    (v5 vrací { data: [{ id, attributes: {...} }] }, ale někdy se lidi trefí jiným mappingem).
function unifyItem(item: any): PageDTO {
  // "a" = attributes, když existují; jinak item (tolerantní)
  const a = item?.attributes ?? item ?? {};

  // Bezpečné přečtení polí – když některé chybí, doplníme prázdným stringem
  const id = Number(item?.id ?? 0);
  const title = typeof a.title === "string" ? a.title : "";
  const slug  = typeof a.slug  === "string" ? a.slug  : "";
  const about = typeof a.about_text === "string" ? a.about_text : "";

  return {
    id: Number.isFinite(id) ? id : 0,
    title,
    slug,
    about_text: about,
  };
}

// 3) Tvrdý fetch ze Strapi (bez vyhazování "Invalid page payload")
//    a) Dotaz na /api/pages s filtrem podle slugu
//    b) Tolerantní vytažení prvního záznamu
//    c) Vypíšu si do konzole response, když jsem v developmentu (abychom viděli, co chodí)
async function fetchPageStrict(slug: string): Promise<PageDTO> {
  const res = await strapiFetch<{ data: Array<any> }>({
    path: "/api/pages",
    query: {
      filters: { slug: { $eq: slug } },
      // fields můžeme posílat, ale když si nejsi jistý verzí/konfigurací,
      // klidně je vynecháme, ať to nic neodfiltruje:
      // fields: ["title", "slug", "about_text"],
      pagination: { pageSize: 1 },
    },
    next: { tags: ["pages", `page:${slug}`], revalidate: 600 }, // 10 minut
  });

  // DEV LOG: uvidíš v terminálu přesně co dorazilo (pomáhá odhalit, když je jiné jméno pole)
  if (process.env.NODE_ENV !== "production") {
    // Pozor na objem – logujeme jen první položku:
    const sample = Array.isArray(res?.data) ? res.data[0] : res?.data;
    console.log("🔎 Strapi /api/pages sample for slug =", slug, sample);
  }

  // Vytáhni první záznam
  const item = Array.isArray(res?.data) ? res.data[0] : res?.data;
  if (!item) {
    // Když nic není, vrať "prázdnou" PageDTO – stránka nahoře to ošetří hezkým fallbackem
    return { id: 0, title: "", slug: "", about_text: "" };
  }

  // Sjednoť data
  const dto = unifyItem(item);

  // DODELAT: Když "title" z nějakého důvodu nedorazí, nespadneme:
  // dáme bezpečný zástupný text. Tím eliminuju "Invalid page payload".
  return {
    ...dto,
    title: dto.title || "(bez názvu)",
  };
}

// 4) Per‑slug cache obal – Next uloží výsledek a po 10 min revaliduje
const getCachedPageInner = (slug: string) =>
  unstable_cache(
    async () => await fetchPageStrict(slug),
    ["page", slug],
    { revalidate: 600, tags: ["pages", `page:${slug}`] }
  );

// 5) Veřejná funkce pro serverové komponenty
export async function getCachedPage(slug: string): Promise<PageDTO | null> {
  try {
    const dto = await getCachedPageInner(slug)();
    return dto;
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ getCachedPage failed:", e?.message || e);
    }
    return null;
  }
}