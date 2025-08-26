// src/app/work/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getReferenceBySlug } from "../../../lib/cachedReferences";
import ProjectDetailClient from "./project-detail-client";

type Props = { params: { slug: string } };

export const revalidate = 0;

export default async function Page({ params }: Props) {
  const data = await getReferenceBySlug(params.slug);
  if (!data) return notFound();
  return <ProjectDetailClient data={data} />;
}