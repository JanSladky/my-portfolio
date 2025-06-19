import DeveloperClient from './DeveloperClient';
import { fetchWpPage } from '../../lib/fetchWpPage';

export default async function DeveloperPage() {
  const initialData = await fetchWpPage('zivotopis');

  return <DeveloperClient initialData={initialData} />;
}