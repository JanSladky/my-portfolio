// src/app/page.tsx
import HomeClient from '../../components/HomeClient';
import { fetchWpPage } from '../../lib/fetchWpPage';

export const revalidate = 30; // ISR (pokud chceš pravidelně aktualizovat)

export default async function HomePage() {
  const pageData = await fetchWpPage('home');

  if (!pageData) return <p>Chyba načítání obsahu</p>;

  return <HomeClient pageData={pageData} />;
}