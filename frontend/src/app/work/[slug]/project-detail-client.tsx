// frontend/src/app/work/[slug]/project-detail-client.tsx
'use client';

/**
 * Detail reference s volitelnou galerií obrázků.
 * DŮLEŽITÉ: Pro dynamický import ImageGallery používáme přesné typy
 * ReactImageGalleryProps a ReactImageGalleryItem, aby TS věděl o props jako "items".
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { ReferenceDetail } from '../../../lib/cachedReferences';

// 1) Import TYPŮ z react-image-gallery (balík obsahuje .d.ts)
import type { ReactImageGalleryProps, ReactImageGalleryItem } from 'react-image-gallery';

// 2) CSS galerie
import 'react-image-gallery/styles/css/image-gallery.css';

// 3) Dynamický import komponenty s deklarovanými props (=> TS zná "items", atd.)
const ImageGallery = dynamic<ReactImageGalleryProps>(() => import('react-image-gallery'), { ssr: false });

// 4) Absolutizace URL (když Strapi vrací /uploads/...)
const ABS_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || '').replace(/\/+$/, '');
const abs = (u?: string) => {
  if (!u) return '';
  try {
    return new URL(u, ABS_BASE || undefined).href;
  } catch {
    return u;
  }
};

export default function ProjectDetailClient({ data }: { data: ReferenceDetail }) {
  // 5) Převedeme Strapi media -> typované položky galerie
  const galleryItems: ReactImageGalleryItem[] = (data.images || []).map((img) => ({
    original: abs(img.url),
    thumbnail: abs(img.url),
    originalAlt: img.alt || data.title,
    thumbnailAlt: img.alt || data.title,
    description: img.alt || data.title,
  }));

  return (
    <div className="min-h-screen w-full pt-[120px] pb-20 bg-[#e9f0fb] text-[#1f2937] font-sans antialiased">
      <motion.div className="max-w-4xl mx-auto px-6" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Titulek + popis */}
        <div className="bg-white p-8 rounded-xl shadow-md mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{data.title}</h1>
          {data.description && <p className="text-slate-600 leading-relaxed whitespace-pre-line">{data.description}</p>}
        </div>

        {/* Galerie (pokud jsou obrázky) */}
        {!!galleryItems.length && (
          <div className="mb-12">
            <ImageGallery
              items={galleryItems}
              showPlayButton={false}
              showFullscreenButton={true}
              showThumbnails={true}
              // Vlastní renderer položky (typ `any` stačí, knihovna nepředává přesný typ)
              renderItem={(item: any) => (
                <div className="image-gallery-image flex flex-col items-center bg-[#e9f0fb] rounded-xl shadow overflow-hidden">
                  <img src={item.original} alt={item.description || 'Ukázka projektu'} className="object-contain max-h-[75vh] w-full rounded" />
                  {item.description && <div className="text-sm text-gray-700 bg-white/80 px-4 py-2 w-full text-center">{item.description}</div>}
                </div>
              )}
            />
          </div>
        )}

        {/* Tlačítka */}
        <div className="flex flex-wrap justify-center gap-4">
          {data.demo_url && (
            <a href={data.demo_url} target="_blank" rel="noopener noreferrer">
              <button className="btn-glass btn-primary-light">
                <span className="btn-primary-inner">Zobrazit demo</span>
              </button>
            </a>
          )}
          {data.repo_url && (
            <a href={data.repo_url} target="_blank" rel="noopener noreferrer">
              <button className="btn-glass btn-primary-light">
                <span className="btn-primary-inner">Repozitář</span>
              </button>
            </a>
          )}
          <Link href="/work">
            <button className="btn-glass btn-primary-light">
              <span className="btn-primary-inner">Zpět na projekty</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
