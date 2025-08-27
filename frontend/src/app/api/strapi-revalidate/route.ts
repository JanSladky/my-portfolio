// frontend/src/app/api/strapi-revalidate/route.ts
// ------------------------------------------------------------
// Webhook endpoint pro revalidaci cache v Next.js.
// - Ověří "secret" z query (?secret=...) nebo z JSON těla.
// - MANUAL mód: přijme { tag | tags | paths } a revaliduje, co pošleš.
// - STRAPI mód: z payloadu Strapi (v4/v5) pozná typ obsahu a
//   revaliduje správné tagy a cesty (reference/home/about/developer/page).
// ------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Bezpečné přečtení JSON těla – když nepřijde validní JSON, vrátí null.
async function safeJson(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

// Z různých Strapi payloadů (v4/v5) detekuje typ obsahu (reference, home, about, developer, page, ...)
function detectType(body: any): string {
  // Strapi v5 posílá často "uid" (např. "api::reference.reference"),
  // v4 to může být "model" nebo "contentType"/"collection".
  const raw = String(
    body?.uid || body?.model || body?.contentType || body?.collection || ""
  ).toLowerCase();

  if (!raw) return "";

  // Pokusíme se parsovat tvar "api::<typ>.<název>", vrátíme "<typ>"
  const m = raw.match(/api::([a-z0-9_-]+)\.[a-z0-9_-]+/);
  if (m) return m[1];

  // Jinak vrátíme "raw" (když už tam je např. jen "reference")
  return raw;
}

// Z payloadu vyzobneme "entry"/"result" a z něj případný "slug"
function extractEntry(body: any) {
  // v5: body.result, v4: body.entry, někdy body.data
  const node = body?.result ?? body?.entry ?? body?.data ?? {};
  // v4: node.attributes, v5: ploché
  const a = node?.attributes ? node.attributes : node;

  const slug =
    typeof a?.slug === "string"
      ? a.slug
      : typeof a?.data?.slug === "string"
      ? a.data.slug
      : null;

  return { node: a, slug: slug as string | null };
}

export async function POST(req: NextRequest) {
  // 1) SECRET – musí sedět s REVALIDATE_SECRET z env (Vercel)
  const qsSecret = req.nextUrl.searchParams.get("secret");
  const body = await safeJson(req);
  const bodySecret = (body?.secret as string | undefined) || undefined;
  const secret = qsSecret || bodySecret;

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  // 2) MANUÁLNÍ MÓD – stejné schopnosti jako tvůj starý /api/revalidate
  //    Příklad payloadu:
  //    { "secret":"...", "tags":["references","reference:videojinak"], "paths":["/work","/work/videojinak"] }
  if (body && (body.tag || body.tags || body.paths)) {
    const tags: string[] = [];
    if (typeof body.tag === "string") tags.push(body.tag);
    if (Array.isArray(body.tags)) {
      for (const t of body.tags) if (typeof t === "string") tags.push(t);
    }

    const paths: string[] = [];
    if (Array.isArray(body.paths)) {
      for (const p of body.paths) if (typeof p === "string") paths.push(p);
    }

    for (const t of tags) revalidateTag(t);
    for (const p of paths) revalidatePath(p);

    if (process.env.NODE_ENV !== "production") {
      console.log("REVALIDATE manual:", { tags, paths });
    }

    return NextResponse.json({ ok: true, mode: "manual", tags, paths });
  }

  // 3) STRAPI MÓD – webhook ze Strapi (v4/v5)
  const event = (body?.event || body?.action || "") as string; // např. 'entry.update'
  const type = detectType(body);                                // 'reference' | 'home' | 'about' | 'developer' | 'page' | ...
  const { slug } = extractEntry(body);                          // vyzobneme slug, když existuje

  // Co revalidovat nasbíráme do polí (až pak provedeme hromadně)
  const toRevalidateTags: string[] = [];
  const toRevalidatePaths: string[] = [];

  // ---- Reference (kolekce se seznamem a detailem /work/[slug])
  if (type.includes("reference")) {
    // list + /work
    toRevalidateTags.push("references");
    toRevalidatePaths.push("/work");

    // detail, pokud máme slug
    if (slug) {
      toRevalidateTags.push(`reference:${slug}`);
      toRevalidatePaths.push(`/work/${slug}`);
    }
  }

  // ---- Home (single type) – pokud používáš
  if (type.includes("home")) {
    toRevalidateTags.push("home");
    toRevalidatePaths.push("/");
  }

  // ---- About (single type) – stránka /about
  if (type.includes("about")) {
    toRevalidateTags.push("about");
    toRevalidatePaths.push("/about");
  }

  // ---- Developer (single type) – stránka /developer
  if (type.includes("developer")) {
    toRevalidateTags.push("developer");
    toRevalidatePaths.push("/developer");
  }

  // ---- Page (kolekce se slugem) – stránka /:slug
  // Pokud máš kolekci "pages" s polem slug a route /[slug]
  if (type.includes("page")) {
    toRevalidateTags.push("page");          // obecný tag pro list, kdyby ses rozhodl cacheovat i list stránek
    if (slug) {
      toRevalidateTags.push(`page:${slug}`);
      toRevalidatePaths.push(`/${slug}`);
    }
  }

  // Odstranit duplicity (ochrana když dojde víckrát stejný záznam)
  const uniqTags = Array.from(new Set(toRevalidateTags));
  const uniqPaths = Array.from(new Set(toRevalidatePaths));

  // Proveď revalidace
  for (const t of uniqTags) revalidateTag(t);
  for (const p of uniqPaths) revalidatePath(p);

  if (process.env.NODE_ENV !== "production") {
    console.log("REVALIDATE strapi:", { event, type, slug, tags: uniqTags, paths: uniqPaths });
  }

  return NextResponse.json({
    ok: true,
    mode: "strapi",
    event,
    type,
    slug,
    tags: uniqTags,
    paths: uniqPaths,
  });
}