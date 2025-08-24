// my-portfolio/frontend/src/app/page.tsx
import HomeClient from './home/HomeClient';
import { getCachedHome } from '../lib/cachedHome';

export const revalidate = 0;

export default async function HomePage() {
  const data = await getCachedHome(); // { home: {...} } nebo null
  return <HomeClient data={data || undefined} />;
}