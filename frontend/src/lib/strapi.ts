// src/lib/strapi.ts
// Jednotná funkce pro volání Strapi z Next.js (App Router) s retry a nastavitelným timeoutem.

type FetchOpts = {
  path: string;
  query?: Record<string, any>;
  next?: RequestInit["next"];
  init?: RequestInit;
};

// 1) Základní URL (bez koncového lomítka)
const BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/+$/, "");

// 2) Timeout a retry z env (lze měnit bez build)
const timeoutMs = Number(process.env.NEXT_PUBLIC_STRAPI_TIMEOUT_MS ?? 30000); // default 30s
const maxRetries = Number(process.env.NEXT_PUBLIC_STRAPI_RETRIES ?? 2);       // zkusíme ještě 2x

// 3) Serializace Strapi-like query => URLSearchParams
function toSearchParams(obj: Record<string, any> = {}): string {
  const params = new URLSearchParams();

  const append = (prefix: string, value: any) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      for (const v of value) params.append(`${prefix}[]`, String(v));
    } else if (typeof value === "object") {
      for (const k of Object.keys(value)) append(`${prefix}[${k}]`, value[k]);
    } else {
      params.append(prefix, String(value));
    }
  };

  for (const k of Object.keys(obj)) append(k, (obj as any)[k]);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function strapiFetch<T = any>({ path, query, next, init }: FetchOpts): Promise<T> {
  const url = `${BASE}${path}${toSearchParams(query)}`;

  const headers: HeadersInit = {
    "content-type": "application/json",
    ...(init?.headers || {}),
  };

  const token = process.env.STRAPI_API_TOKEN;
  if (token && !("authorization" in headers) && !("Authorization" in headers)) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let lastErr: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: "GET",
        ...init,
        headers,
        next,
        signal: controller.signal,
        // když chceš debugovat, odkomentuj:
        // cache: "no-store",
      });

      clearTimeout(timer);

      if (!res.ok) {
        let body: any = null;
        try { body = await res.json(); } catch {}
        const message = body ? JSON.stringify(body) : await res.text();
        throw new Error(`Strapi fetch error ${res.status}: ${message}`);
      }

      const text = await res.text();
      return (text ? JSON.parse(text) : {}) as T;
    } catch (err: any) {
      clearTimeout(timer);
      lastErr = err;

      // Timeout -> zkusíme backoff a nový pokus
      const isTimeout = err?.name === "AbortError" || String(err?.message || "").includes("timeout");
      const isNetwork = err?.cause?.code === "ECONNRESET" || err?.cause?.code === "ENOTFOUND";

      if (attempt < maxRetries && (isTimeout || isNetwork)) {
        // jednoduchý exponenciální backoff
        const wait = 500 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      if (isTimeout) throw new Error(`Strapi fetch timeout after ${timeoutMs}ms`);
      throw err;
    }
  }

  // sem bys neměl spadnout
  throw lastErr ?? new Error("Unknown Strapi fetch error");
}