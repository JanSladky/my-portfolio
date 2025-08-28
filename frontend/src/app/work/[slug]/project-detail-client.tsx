// frontend/src/app/work/[slug]/project-detail-client.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { ReferenceDetail } from '../../../lib/cachedReferences';
import type { ReactImageGalleryProps, ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const ImageGallery = dynamic<ReactImageGalleryProps>(() => import('react-image-gallery'), { ssr: false });

const ABS_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || '').replace(/\/+$/, '');
const abs = (u?: string) => {
  if (!u) return '';
  try { return new URL(u, ABS_BASE || undefined).href; } catch { return u; }
};

export default function ProjectDetailClient({ data }: { data: ReferenceDetail }) {
  const galleryItems: ReactImageGalleryItem[] = (data.images || []).map((img) => ({
    original: abs(img.url),
    thumbnail: abs(img.url),
    originalAlt: img.alt || data.title,
    thumbnailAlt: img.alt || data.title,
    description: img.alt || data.title,
  }));

  return (
    <div className="min-h-screen w-full pt-[120px] pb-16 bg-[#e9f0fb] text-[#1f2937] font-sans antialiased">
      <motion.div
        className="max-w-6xl mx-auto px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Vlevo: titulek + popis + tlačítka */}
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 break-words">
                {data.title}
              </h1>
              {data.description && (
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {data.description}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
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
          </div>

          {/* Vpravo: galerie */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            {!!galleryItems.length ? (
              <div className="rounded-lg overflow-hidden">
                <ImageGallery
                  items={galleryItems}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showThumbnails={true}
                  renderItem={(item: any) => (
                    <div className="image-gallery-image flex flex-col items-center bg-white">
                      <img
                        src={item.original}
                        alt={item.description || 'Ukázka projektu'}
                        className="object-contain max-h-[70vh] w-full"
                      />
                      {item.description && (
                        <div className="text-sm text-gray-700 bg-white px-4 py-2 w-full text-center">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            ) : (
              <div className="text-center text-gray-400 py-16">Žádné obrázky</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}