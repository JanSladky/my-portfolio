// my-portfolio/frontend/src/app/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getCachedPage } from "../../lib/cachedPages";

export const revalidate = 0; // data řešíme přes unstable_cache, stránku nech statickou

export async function generateStaticParams() {
  // Klidně může zůstat prázdné (nebo si můžeš načíst slugs ze Strapi).
  // Když slug nebude předem vygenerovaný, Next ho vyrobí on-demand a dá do cache.
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getCachedPage(params.slug);

  // Když ani cache nic nemá (např. úplně první build a Strapi je nedostupné)
  if (!data) {
    // Bereme "měkký" fallback místo 404 (profesionálnější dojem)
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Obsah dočasně nedostupný</h1>
        <p className="text-gray-400">
          Zkuste to prosím za chvíli. Zároveň držíme poslední platnou verzi — jakmile bude backend k dispozici, načteme ji.
        </p>
      </div>
    );
  }

  // Normální render z poslední platné cache (nebo čerstvě natažených dat)
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">{data.title.rendered}</h1>
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: data.content.rendered }} />
    </div>
  );
}