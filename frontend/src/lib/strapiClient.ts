export async function postToStrapi<T = any>(path: string, body: unknown) {
  const base = (process.env.NEXT_PUBLIC_STRAPI_URL || '').replace(/\/+$/, '');
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Pokud bys někdy přidal auth, tady přidej Authorization
    body: JSON.stringify(body),
    // Pro jistotu vypnout cache na postech
    cache: 'no-store',
  });

  // Zkusit naparsovat případnou chybu od Strapi
  let data: any = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}