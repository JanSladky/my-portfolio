// my-portfolio/frontend/src/lib/strapi.ts
// ÚČEL: jednotné volání Strapi REST API z Next.js (App Router)
// - přidává automaticky Authorization Bearer token (pokud je STRAPI_API_TOKEN)
// - podporuje Next.js cache tagy a per-request revalidate
// - bezpečně serializuje Strapi dotazy (populate, filters, ...)

type FetchOpts = {
  path: string;                 // např. "/api/about" nebo "/api/home"
  query?: Record<string, any>;  // např. { populate: { cover: { fields: ["url"] } } }
  next?: RequestInit["next"];   // { tags?: string[], revalidate?: number }
  init?: RequestInit;           // extra fetch options (většinou nepotřebuješ)
};

// 1) Základní URL – bez koncového lomítka (aby z toho nebylo //api)
const BASE =
  (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/+$/, "");

// 2) Pomocná funkce: Strapi styl serializace query objektů -> URLSearchParams
function toSearchParams(obj: Record<string, any> = {}): string {
  const params = new URLSearchParams();

  const append = (prefix: string, value: any) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      for (const v of value) params.append(`${prefix}[]`, String(v));
    } else if (typeof value === "object") {
      for (const k of Object.keys(value)) {
        append(`${prefix}[${k}]`, value[k]);
      }
    } else {
      params.append(prefix, String(value));
    }
  };

  for (const k of Object.keys(obj)) append(k, (obj as any)[k]);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function strapiFetch<T = any>({ path, query, next, init }: FetchOpts): Promise<T> {
  // 3) Poskládáme URL (BASE + path + query)
  const url = `${BASE}${path}${toSearchParams(query)}`;

  // 4) Hlavičky – JSON a případně Authorization: Bearer <token>
  const headers: HeadersInit = {
    "content-type": "application/json",
    ...(init?.headers || {}),
  };

  const token = process.env.STRAPI_API_TOKEN; // nastav v .env.local
  if (token && !("authorization" in headers) && !("Authorization" in headers)) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 5) Složíme options pro fetch + Next.js metadata (tags/revalidate)
  const opts: RequestInit & { next?: RequestInit["next"] } = {
    method: "GET",
    ...init,
    headers,
    next,
  };

  // 6) Provedeme request
  const res = await fetch(url, opts);

  // 7) Chyby logujeme čitelně (Strapi většinou vrací JSON s "error")
  if (!res.ok) {
    let body: any = null;
    try { body = await res.json(); } catch {}
    const message = body ? JSON.stringify(body) : await res.text();
    throw new Error(`Strapi fetch error ${res.status}: ${message}`);
  }

  // 8) Vracej JSON (pokud je prázdná odpověď, vrať prázdný objekt)
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}