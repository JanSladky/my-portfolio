// my-portfolio/frontend/src/app/home/page.tsx
// Stránka /home načítá Single Type "Home" přes odolnou cache a předává data do HomeClient.

import HomeClient from './HomeClient';
import { getCachedHome } from '../../lib/cachedHome';

export const revalidate = 0;

export default async function HomePage() {
  const data = await getCachedHome();   // ← DŮLEŽITÉ: čteme Single Type "Home"
  return <HomeClient data={data || undefined} />;
}