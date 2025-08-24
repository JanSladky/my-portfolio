// src/lib/fetchPage.ts
import { strapiFetch } from "./strapi";

export type PageDTO = {
  id: number;
  title: string;
  slug: string;
  about_text: string;
};

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
    if (!item) throw new Error(`Page '${slug}' not found in Strapi`);

    const a = item?.attributes ?? {};

    return {
      id: item.id,
      title: a.title ?? "",
      slug: a.slug ?? "",
      about_text: a.about_text ?? "",
    };
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`❌ Strapi fetch error for page '${slug}':`, error?.message || error);
    }
    return null;
  }
}