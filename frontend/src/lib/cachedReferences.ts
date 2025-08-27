// frontend/src/lib/cachedReferences.ts
import { unstable_cache } from "next/cache";
import { strapiFetch } from "./strapi";

const REF_API_PLURAL = "references";

export type RefImage = { url?: string; alt?: string; width?: number; height?: number };
export type ReferenceItem = { id: number; title: string; slug: string; type: "web"|"app"; cover?: RefImage };
export type ReferenceDetail = ReferenceItem & {
  description?: string;
  demo_url?: string;
  repo_url?: string;
  images: RefImage[];
};

function imgOut(input: any): RefImage {
  const node = input?.data ? input.data : input;
  const a = node?.attributes ?? node ?? {};
  return { url: a?.url || "", alt: a?.alternativeText || a?.name || "", width: a?.width, height: a?.height };
}
function attrs(n: any) { return n?.attributes ? n.attributes : n || {}; }

function mapListItem(n: any): ReferenceItem {
  const a = attrs(n);
  return { id: Number(n?.id), title: a.title ?? "", slug: a.slug ?? "", type: a.type === "app" ? "app" : "web", cover: imgOut(a.cover) };
}
function mapDetail(n: any): ReferenceDetail {
  const a = attrs(n);
  const galleryRaw = a.images?.data ?? a.images ?? [];
  const images = Array.isArray(galleryRaw) ? galleryRaw.map((g: any) => imgOut(g)) : [];
  return {
    id: Number(n?.id),
    title: a.title ?? "",
    slug: a.slug ?? "",
    type: a.type === "app" ? "app" : "web",
    description: a.description ?? "",
    demo_url: a.demo_url ?? "",
    repo_url: a.repo_url ?? "",
    cover: imgOut(a.cover),
    images,
  };
}

// ---------- LIST /work (tag: "references")
async function fetchReferencesStrict() {
  const res = await strapiFetch<{ data: any[] }>({
    path: `/api/${REF_API_PLURAL}`,
    query: { sort: ["publishedAt:desc"], populate: { cover: { populate: "*" } } },
    next: { tags: ["references"] },   // necháme Nextu vytvořit cache pod tímto tagem
  });
  const items = Array.isArray(res?.data) ? res.data.map(mapListItem) : [];
  return { items };
}

const getReferencesInner = unstable_cache(
  async () => await fetchReferencesStrict(),
  ["references-list"],
  { revalidate: 86400, tags: ["references"] } // 24h max; webhook zneplatní hned
);

export async function getReferences() {
  try { return await getReferencesInner(); }
  catch { return { items: [] as ReferenceItem[] }; }
}

// ---------- DETAIL /work/[slug] (tag: "reference:<slug>")
async function fetchReferenceBySlug(slug: string) {
  const res = await strapiFetch<{ data: any[] }>({
    path: `/api/${REF_API_PLURAL}`,
    query: {
      filters: { slug: { $eq: slug } },
      populate: { cover: { populate: "*" }, images: { populate: "*" } },
    },
    next: { tags: [`reference:${slug}`] }, // tag pro detail
  });
  const row = Array.isArray(res?.data) ? res.data[0] : null;
  return row ? mapDetail(row) : null;
}

const getReferenceBySlugInner = (slug: string) =>
  unstable_cache(
    async () => await fetchReferenceBySlug(slug),
    ["reference-detail", slug],
    { revalidate: 86400, tags: [`reference:${slug}`] }
  )();

export async function getReferenceBySlug(slug: string) {
  try { return await getReferenceBySlugInner(slug); }
  catch { return null; }
}