// my-portfolio/frontend/src/lib/cachedPages.ts
// ÚČEL: Odolná cache pro libovolnou stránku ze Strapi podle slugu.
// Vrací DTO sjednocené do tvaru { id, slug, title, content_html }.
// - title: string (ne WP { rendered })
// - content_html: string (HTML poskládané z RichText bloků)

import { unstable_cache } from "next/cache";
import { strapiFetch } from "./strapi";
import { blocksToHtml } from "./blocksToHtml";

// ========== DTO, které bude používat UI ==========
export type PageDTO = {
  id: number;
  slug: string;
  title: string;
  content_html: string; // <- DŮLEŽITÉ: sjednocený název pro HTML obsahu
};

// Pomocné čtení hodnot z různých variant payloadu (content-only / attributes…)
function pickAttributes(node: any): any {
  return node?.attributes ? node.attributes : node;
}

function pickTitle(a: any): string {
  // preferované klíče
  if (typeof a?.title === "string") return a.title;

  // alternativy (kdyby ses přejmenoval)
  if (typeof a?.heading === "string") return a.heading;
  if (typeof a?.name === "string") return a.name;

  return "";
}

function pickSlug(a: any): string {
  if (typeof a?.slug === "string") return a.slug;
  return "";
}

/**
 * Najdi pole s obsahem (může se jmenovat různě) a vrať ho,
 * blocksToHtml si poradí i s null/undefined/špatným tvarem.
 */
function pickContentBlocks(a: any): unknown {
  return (
    a?.content ??
    a?.Content ??
    a?.body ??
    a?.rich_text ??
    a?.richText ??
    null
  );
}

// Tvrdý fetch jedné stránky podle slugu; vyhodí chybu, když něco chybí
async function fetchPageStrict(slug: string): Promise<PageDTO> {
  const res = await strapiFetch<{ data: any[] }>({
    path: "/api/pages",
    query: {
      filters: { slug: { $eq: slug } },
      pagination: { pageSize: 1 },
    },
    next: { tags: ["pages", `page:${slug}`], revalidate: 600 },
  });

  const item = Array.isArray(res?.data) ? res.data[0] : undefined;
  if (!item) throw new Error(`Page '${slug}' not found`);

  const a = pickAttributes(item);
  const title = pickTitle(a);
  const s = pickSlug(a);
  const html = blocksToHtml(pickContentBlocks(a)); // bezpečně vrátí string

  if (!title) throw new Error("Invalid page payload: missing title");

  return {
    id: Number(item?.id ?? 0) || 0,
    slug: s || slug,
    title,
    content_html: html || "",
  };
}

// Vytvoř „odolnou“ cached funkci pro každý slug
const getCachedPageInner = (slug: string) =>
  unstable_cache(
    async () => {
      return await fetchPageStrict(slug);
    },
    ["page", slug],
    { revalidate: 600, tags: ["pages", `page:${slug}`] }
  );

/**
 * Veřejná funkce: vrať poslední platná data (nepřepíše se prázdnem při výpadku).
 * Když selže úplně poprvé (bez cache), vrátí null – UI zobrazí měkký fallback.
 */
export async function getCachedPage(slug: string): Promise<PageDTO | null> {
  const cachedFn = getCachedPageInner(slug);
  try {
    return await cachedFn();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ getCachedPage failed:", (e as any)?.message || e);
    }
    return null;
  }
}