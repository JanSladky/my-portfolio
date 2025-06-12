// src/app/page.tsx
import { fetchWpPage } from '../lib/fetchWpPage';
import HomeClient from '../components/HomeClient';

export const revalidate = 30;

export default async function HomePage() {
  const pageData = await fetchWpPage('home');
  if (!pageData) return <p>Chyba načítání</p>;
  return <HomeClient pageData={pageData} />;
}