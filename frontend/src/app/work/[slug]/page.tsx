// frontend/src/app/work/[slug]/page.tsx
// Serverová stránka detailu Reference podle slugu. Přizpůsobeno Next 15,
// kde PageProps očekává params jako Promise.

// 1) notFound() vrátí 404 stránku Nextu, když záznam nenajdeme.
import { notFound } from "next/navigation";

// 2) Naše serverová funkce, která načte detail Reference ze Strapi.
import { getReferenceBySlug } from "../../../lib/cachedReferences";

// 3) Klientská komponenta, která umí vykreslit detail (titul, galerie, tlačítka…).
import ProjectDetailClient from "./project-detail-client";

// 4) Revalidace stránky (ISR). V Next 15 musí být false nebo číslo > 0.
//    600 = 10 minut; pokud chceš úplně bez cache, dej export const revalidate = false;
export const revalidate = 600;

// 5) DŮLEŽITÉ: typ props nastavíme tak, aby params bylo Promise<{ slug: string }>.
//    To přesně splní globální constraint Nextu (PageProps s params: Promise<any>).
type RouteProps = {
  params: Promise<{ slug: string }>;
};

// 6) Výchozí export stránky (serverová komponenta).
//    Parametr { params } je Promise → uvnitř si ho rozbalíme přes await.
export default async function WorkDetailPage({ params }: RouteProps) {
  // 7) Získáme skutečný objekt params a vytáhneme slug z URL.
  const { slug } = await params;

  // 8) Načteme data ze Strapi podle slugu.
  const data = await getReferenceBySlug(slug);

  // 9) Pokud záznam neexistuje, vrátíme 404.
  if (!data) return notFound();

  // 10) Jinak předáme data do klientské komponenty, která je vykreslí.
  return <ProjectDetailClient data={data} />;
}