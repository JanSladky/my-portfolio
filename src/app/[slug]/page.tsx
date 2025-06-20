// src/app/[slug]/page.tsx
import { notFound } from 'next/navigation';

export const revalidate = 10;

async function getPageData(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}?slug=${slug}&_fields=id,title,content,acf`, { next: { revalidate: 10 } });

  if (!res.ok) return null;

  const pages = await res.json();
  return Array.isArray(pages) && pages.length ? pages[0] : null;
}

export async function generateStaticParams() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API as string);
    const pages = await res.json();

    if (!Array.isArray(pages)) {
      console.error('❌ Chyba: WordPress API nevrátilo pole:', pages);
      return [];
    }

    return pages.filter((page: any) => page?.slug && typeof page.slug === 'string').map((page: any) => ({ slug: page.slug }));
  } catch (err) {
    console.error('❌ Chyba při načítání stránek z WP:', err);
    return [];
  }
}

// ❗️ ŽÁDNÝ TYP pro { params }
export default async function Page({ params }: any) {
  const pageData = await getPageData(params.slug);
  if (!pageData) notFound();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold">{pageData.title.rendered}</h1>
      <div className="text-gray-300 mt-4" dangerouslySetInnerHTML={{ __html: pageData.content.rendered }} />
    </div>
  );
}
