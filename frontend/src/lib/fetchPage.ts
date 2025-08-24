// src/lib/fetchPage.ts
import { strapiFetch } from "./strapi";
import { blocksToHtml } from "./blocksToHtml";

export type PageDTO = {
  id: number;
  title: string;
  slug: string;
  /** HTML string připravený k renderu (pochází z rich textu / bloků) */
  content_html: string;
  /** Prostý text – pokud máš na některých stránkách jen textové pole */
  about_text?: string;
};

// Pomocný picker: přečte title/slug z attributes i z kořene
function pick(a: any, b: any) {
  return a ?? b ?? "";
}

export async function fetchPage(slug: string): Promise<PageDTO | null> {
  try {
    const res = await strapiFetch<{ data: Array<any> }>({
      path: "/api/pages",
      query: {
        filters: { slug: { $eq: slug } },
        pagination: { pageSize: 1 },
      },
    });

    const item = res?.data?.[0];
    if (!item) return null;

    const a = item?.attributes ?? {};

    // title/slug tolerantně
    const title = pick(a.title, item.title);
    const realSlug = pick(a.slug, item.slug);

    // Najdi „obsahové“ pole: content / body / rich_text apod.
    const rawContent =
      a?.content ??
      a?.Content ??
      a?.body ??
      a?.rich_text ??
      a?.richText ??
      null;

    // Převeď na HTML:
    // - když je to string → bereme rovnou (už je to HTML/markdown-to-HTML)
    // - když je to bloková struktura → převedeme přes blocksToHtml
    // - jinak prázdný string
    let content_html = "";
    if (typeof rawContent === "string") {
      content_html = rawContent;
    } else if (rawContent != null) {
      content_html = blocksToHtml(rawContent);
    }

    // Některé stránky můžou mít prosté textové pole (např. „about_text“)
    const about_text =
      typeof a?.about_text === "string" ? a.about_text : "";

    return {
      id: Number(item.id) || 0,
      title: String(title || ""),
      slug: String(realSlug || slug),
      content_html: String(content_html || ""),
      about_text,
    };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`❌ Strapi fetch error for page '${slug}':`, error?.message || error);
    }
    return null;
  }
}