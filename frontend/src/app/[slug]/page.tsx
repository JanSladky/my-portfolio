// src/app/[slug]/page.tsx
import { getCachedPage } from "../../lib/cachedPages";

export const revalidate = 0;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [];
}

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;          // 👈 Next 15: params je Promise
  const data = await getCachedPage(slug);

  if (!data) {
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