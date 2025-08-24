// src/app/developer/page.tsx
import { getCachedDeveloper } from "@/lib/cachedDeveloper";
import DeveloperClient from "./DeveloperClient";

export const revalidate = 0; // v devu ignorujeme ISR, invalidace řeší webhook/tag

export default async function DeveloperPage() {
  const data = await getCachedDeveloper();

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-4">Obsah dočasně nedostupný</h1>
        <p className="text-gray-400">Zkuste to prosím později.</p>
      </div>
    );
  }

  return <DeveloperClient data={data} />;
}