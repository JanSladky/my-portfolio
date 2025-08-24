// my-portfolio/frontend/src/app/[slug]/page.tsx
// ÚČEL: Dynamická stránka /[slug] – používá getCachedPage() s DTO { id, slug, title, content_html }

import { getCachedPage } from "../../lib/cachedPages";

export const revalidate = 0;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  // Klidně prázdné – necháme si slugy generovat on‑demand a cachovat.
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getCachedPage(params.slug);

  if (!data) {
    // Měkký fallback, když není ani cache (první build + výpadek Strapi)
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Obsah dočasně nedostupný</h1>
        <p className="text-gray-400">
          Zkuste to prosím za chvíli. Držíme poslední platnou verzi – jakmile bude backend k dispozici, načteme ji.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">{data.title}</h1>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content_html || "" }}
      />
    </div>
  );
}