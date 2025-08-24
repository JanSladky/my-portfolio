// my-portfolio/frontend/src/lib/strapi.ts
// Jednotné volání Strapi REST API z frontendu + podpora Next.js tagů/revalidate.

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

type FetchOpts = {
  path: string;                 // např. "/api/pages"
  query?: Record<string, any>;  // např. { filters: { slug: { $eq: "about" } } }
  next?: {                      // volitelné: Next.js caching metadata
    tags?: string[];            // revalidateTag() → invalidace podle tagu
    revalidate?: number;        // sekundy pro ISR (per-request)
  };
};

function toSearchParams(obj: Record<string, any>, prefix?: string, params = new URLSearchParams()) {
  for (const [key, value] of Object.entries(obj)) {
    const k = prefix ? `${prefix}[${key}]` : key;
    if (value == null) continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(k, String(v)));
    else if (typeof value === "object") toSearchParams(value, k, params);
    else params.append(k, String(value));
  }
  return params;
}

export async function strapiFetch<T>({ path, query, next }: FetchOpts): Promise<T> {
  const url = new URL(path, STRAPI_URL);
  if (query) url.search = toSearchParams(query).toString();

  // Next.js: předáme tagy + revalidate
  const init: RequestInit & { next?: { tags?: string[]; revalidate?: number } } = {};
  if (next?.tags || next?.revalidate) init.next = { ...next };

  const res = await fetch(url.toString(), {
    ...init,
    headers: { "Content-Type": "application/json" },
    // "force-cache" je default v App Routeru; init.next.revalidate případně zvedne ISR
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi fetch error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}