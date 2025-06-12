// src/app/about/page.tsx
import { fetchWpPage } from '../../lib/fetchWpPage';
import AboutClient from './AboutClient';

export const revalidate = 30; // ISR: stránka se obnovuje po 30 vteřinách

export default async function AboutPage() {
  const pageData = await fetchWpPage('about');

  if (!pageData || !pageData.acf) return <p className="text-white">Chyba při načítání dat.</p>;

  return <AboutClient initialData={pageData} />;
}
