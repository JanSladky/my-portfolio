// src/app/work/page.tsx
import WorkClient from "./work-client";
import { getReferences } from "../../lib/cachedReferences";

export const revalidate = 0;

export default async function WorkPage() {
  const { items } = await getReferences();
  return <WorkClient items={items} />;
}