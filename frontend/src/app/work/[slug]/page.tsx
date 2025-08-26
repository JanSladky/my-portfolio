// src/app/work/[slug]/page.tsx
// Serverová stránka detailu reference podle slugu.

// 1) notFound() = vyhodí 404, když záznam nenajdeme
import { notFound } from "next/navigation";

// 2) Server-fetch do Strapi (už umí v4/v5 tvar)
import { getReferenceBySlug } from "../../../lib/cachedReferences";

// 3) Klientská komponenta, která vykreslí detail (galerie, tlačítka …)
import ProjectDetailClient from "./project-detail-client";

// ---- Typy props pro tuto stránku ----
// params = objekt z URL: /work/[slug]  → { slug: string }
type RouteParams = { params: { slug: string } };

// ---- Cache/ISR pro tuto stránku ----
// Next 15: musí být `false` NEBO číslo > 0. (0 je neplatné.)
// 600 = revalidate po 10 min. Klidně změň na `false` (bez ISR).
export const revalidate = 600;

// ---- Vlastní stránka ----
export default async function WorkDetailPage({ params }: RouteParams) {
  // vytáhneme slug z URL
  const { slug } = params;

  // načteme detail ze Strapi
  const data = await getReferenceBySlug(slug);

  // pokud nic, vrať 404
  if (!data) return notFound();

  // jinak předáme data do klientské komponenty
  return <ProjectDetailClient data={data} />;
}