// frontend/src/lib/cachedReferences.ts
// Načítání referencí (list + detail) ze Strapi – funguje jak pro Strapi v4 (attributes),
// tak pro Strapi v5 (plochý tvar bez attributes).

import { unstable_cache } from 'next/cache';
import { strapiFetch } from './strapi';

// plural endpoint podle backendu
const REF_API_PLURAL = 'references';

export type RefImage = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ReferenceItem = {
  id: number;
  title: string;
  slug: string;
  type: 'web' | 'app';
  cover?: RefImage;
};

export type ReferenceDetail = {
  id: number;
  title: string;
  slug: string;
  type: 'web' | 'app';
  description?: string; // u tebe je "text", ne richtext
  demo_url?: string;
  repo_url?: string;
  cover?: RefImage;
  images: RefImage[];
};

/** Bezpečné vytažení media (v4 i v5) */
function imgOut(input: any): RefImage {
  // v4: { data: { attributes: {...} } }
  // v5: { ... } (ploché)
  const node = input?.data ? input.data : input;
  const a = node?.attributes ?? node ?? {};
  return {
    url: a?.url || '',
    alt: a?.alternativeText || a?.name || '',
    width: a?.width,
    height: a?.height,
  };
}

/** Vrátí „attributes“ pro v4/v5 jednotně */
function attrs(n: any): any {
  return n?.attributes ? n.attributes : n || {};
}

/** Map položky do ReferenceItem */
function mapListItem(n: any): ReferenceItem {
  const a = attrs(n);
  return {
    id: Number(n?.id),
    title: a.title ?? '',
    slug: a.slug ?? '',
    type: a.type === 'app' ? 'app' : 'web',
    cover: imgOut(a.cover),
  };
}

/** Map položky do ReferenceDetail */
function mapDetail(n: any): ReferenceDetail {
  const a = attrs(n);
  // v4: a.images?.data je pole, v5: a.images může být pole přímo
  const galleryRaw = a.images?.data ?? a.images ?? [];
  const images = Array.isArray(galleryRaw) ? galleryRaw.map((g: any) => imgOut(g)) : [];
  return {
    id: Number(n?.id),
    title: a.title ?? '',
    slug: a.slug ?? '',
    type: a.type === 'app' ? 'app' : 'web',
    description: a.description ?? '',
    demo_url: a.demo_url ?? '',
    repo_url: a.repo_url ?? '',
    cover: imgOut(a.cover),
    images,
  };
}

// ------------ LIST /work
async function fetchReferencesStrict() {
  const res = await strapiFetch<{ data: any[] }>({
    path: `/api/${REF_API_PLURAL}`,
    query: {
      sort: ['publishedAt:desc'],
      // pro jistotu načteme cover; u v5 stačí populate=cover
      populate: { cover: { populate: '*' } },
    },
    // debug-friendly: bez cache
    next: { tags: ['references'] },
    init: { cache: 'no-store' },
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('STRAPI /references RAW example:', JSON.stringify(res?.data?.[0], null, 2));
  }

  const items = Array.isArray(res?.data) ? res.data.map(mapListItem) : [];
  return { items };
}

const getReferencesInner = unstable_cache(async () => await fetchReferencesStrict(), ['references'], { revalidate: false, tags: ['references'] });

export async function getReferences() {
  try {
    return await getReferencesInner();
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('getReferences failed', e);
    }
    return { items: [] as ReferenceItem[] };
  }
}

// ------------ DETAIL /work/[slug]
export async function getReferenceBySlug(slug: string) {
  try {
    const res = await strapiFetch<{ data: any[] }>({
      path: `/api/${REF_API_PLURAL}`,
      query: {
        filters: { slug: { $eq: slug } },
        populate: {
          cover: { populate: '*' },
          images: { populate: '*' },
        },
      },
      next: { tags: [`reference:${slug}`] },
      init: { cache: 'no-store' },
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('STRAPI /references?slug RAW:', JSON.stringify(res?.data?.[0], null, 2));
    }

    const row = Array.isArray(res?.data) ? res.data[0] : null;
    if (!row) return null;
    return mapDetail(row);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('getReferenceBySlug failed', e);
    }
    return null;
  }
}
