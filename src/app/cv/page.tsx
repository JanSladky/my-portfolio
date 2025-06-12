// src/app/cv/page.tsx
import { fetchWpPage } from '../../lib/fetchWpPage';
import CvClient from './CvClient';

export const revalidate = 30;

export default async function CvPage() {
  const pageData = await fetchWpPage('zivotopis');

  if (!pageData || !pageData.acf) {
    return <p className="text-white">Nepodařilo se načíst data.</p>;
  }

  return <CvClient initialData={pageData} />;
}