// src/app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const { tag, secret } = await req.json();

    // jednoduché ověření – nastav stejné heslo ve Strapi webhooku
    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid secret" }), { status: 401 });
    }

    if (!tag) {
      return new Response(JSON.stringify({ ok: false, error: "Missing tag" }), { status: 400 });
    }

    revalidateTag(tag);
    return new Response(JSON.stringify({ ok: true, revalidated: true, tag, now: Date.now() }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || String(e) }), { status: 500 });
  }
}