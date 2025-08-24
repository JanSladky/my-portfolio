// src/app/about/page.tsx
import { getCachedAbout } from '../../lib/cachedAbout';
import AboutClient from './AboutClient';

export const revalidate = 0;

export default async function AboutPage() {
  const data = await getCachedAbout();

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">O mně – obsah dočasně nedostupný</h1>
        <p className="text-gray-400">
          Zkuste to prosím za chvíli. Jakmile bude backend k dispozici, načteme obsah.
        </p>
      </div>
    );
  }

  return <AboutClient data={data} />;
}