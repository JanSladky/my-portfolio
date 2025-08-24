import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_API}?slug=${slug}&_fields=id,title,content,acf`;
    const wpRes = await fetch(url);

    if (!wpRes.ok) throw new Error(`HTTP ${wpRes.status}`);

    const data = await wpRes.json();
    if (!Array.isArray(data) || !data.length) throw new Error('No data');

    return NextResponse.json(data[0], { status: 200 });
  } catch (err: any) {
    console.error(`❌ API fetch failed for slug '${slug}':`, err.message);
    return NextResponse.json({ error: 'Failed to load WordPress data' }, { status: 500 });
  }
}