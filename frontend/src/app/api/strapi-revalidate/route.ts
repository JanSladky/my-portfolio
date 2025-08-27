// frontend/src/app/api/strapi-revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

async function safeJson(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  // 1) ověření secretu (může být v query i v těle)
  const qsSecret = req.nextUrl.searchParams.get("secret");
  const body = await safeJson(req);
  const bodySecret = body?.secret as string | undefined;
  const secret = qsSecret || bodySecret;

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  // 2) MANUÁLNÍ mód (stejné schopnosti jako tvůj původní /api/revalidate)
  //    Přijme { tag: "x" } nebo { tags: ["x","y"], paths:["/work","/"] }
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

    return NextResponse.json({ ok: true, mode: "manual", tags, paths });
  }

  // 3) STRAPI mód – webhook payload (v4/v5)
  const event = (body?.event || body?.action || "") as string;
  const contentType = String(
    body?.contentType || body?.model || body?.collection || ""
  ).toLowerCase();

  const entry = (body?.entry || body?.data || body?.result || {}) as any;
  const slug: string | null =
    typeof entry?.slug === "string"
      ? entry.slug
      : typeof entry?.data?.slug === "string"
      ? entry.data.slug
      : null;

  const toRevalidateTags: string[] = [];
  const toRevalidatePaths: string[] = [];

  if (contentType.includes("reference")) {
    // list
    toRevalidateTags.push("references");
    toRevalidatePaths.push("/work");

    // detail
    if (slug) {
      toRevalidateTags.push(`reference:${slug}`);
      toRevalidatePaths.push(`/work/${slug}`);
    }
  }

  if (contentType.includes("home")) {
    toRevalidateTags.push("home");
    toRevalidatePaths.push("/");
  }

  // sem můžeš doplnit další content types (developer apod.)

  for (const t of toRevalidateTags) revalidateTag(t);
  for (const p of toRevalidatePaths) revalidatePath(p);

  return NextResponse.json({
    ok: true,
    mode: "strapi",
    event,
    contentType,
    slug,
    tags: toRevalidateTags,
    paths: toRevalidatePaths,
  });
}