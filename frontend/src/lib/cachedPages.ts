// my-portfolio/frontend/src/lib/cachedPages.ts
// Odolná cache pro „stránky“ z Strapi (kolekce "pages").
// Drží poslední platná data a nikdy je nepřepíše prázdnem při výpadku backendu.

import { unstable_cache } from "next/cache";
import { strapiFetch } from "./strapi";
import { blocksToHtml } from "./blocksToHtml";

export type PageDTO = {
  id: number;
  slug: string;
  title: string;
  content_html: string; // HTML vyrenderované z RichText bloků
};

// Pomocné: bezpečně vyzvedni content z různě pojmenovaných polí (content, body, rich_text…)
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

// „Tvrdý“ fetch z Strapi – když selže, vyhodí chybu (cache se tím pádem NEpřepíše prázdnem)
async function fetchPageStrict(slug: string): Promise<PageDTO> {
  const res = await strapiFetch<{ data: Array<any> }>({
    path: "/api/pages",
    query: {
      filters: { slug: { $eq: slug } },
      pagination: { pageSize: 1 }
    },
    next: {
      tags: ["pages", `page:${slug}`],
      revalidate: 600 // 10 min
    }
  });

  const item = res?.data?.[0];
  if (!item) {
    throw new Error(`Page '${slug}' not found`);
  }

  const a = item?.attributes ?? {};
  const blocks = pickContentBlocks(a);
  const html = blocksToHtml(blocks);

  const dto: PageDTO = {
    id: Number(item.id) || 0,
    slug: String(a.slug ?? ""),
    title: String(a.title ?? ""),
    content_html: html || ""
  };

  if (!dto.title) throw new Error("Invalid page payload: missing title");
  return dto;
}

// Cache wrapper – žádné React hooky, jen Next.js server cache
const getCachedPageInner = (slug: string) =>
  unstable_cache(
    async () => {
      return await fetchPageStrict(slug);
    },
    ["page", slug],
    { revalidate: 600, tags: ["pages", `page:${slug}`] }
  );

// Veřejná funkce pro serverové komponenty
export async function getCachedPage(slug: string): Promise<PageDTO | null> {
  const cachedFn = getCachedPageInner(slug);
  try {
    return await cachedFn();
  } catch (e) {
    // první build + výpadek → vrať null (UI ukáže „měkký“ fallback)
    return null;
  }
}