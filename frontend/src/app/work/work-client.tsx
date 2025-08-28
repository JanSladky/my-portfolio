'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ReferenceItem } from '../../lib/cachedReferences';

// Absolutní base URL na Strapi (bez trailing /)
const ABS_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || '').replace(/\/+$/, '');
const abs = (u?: string) => {
  if (!u) return '';
  try { return new URL(u, ABS_BASE || undefined).href; } catch { return u; }
};

// 1×1 průhledný PNG jako univerzální blur placeholder
const TINY_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

export default function WorkClient({ items }: { items: ReferenceItem[] }) {
  const [activeTab, setActiveTab] = useState<'web' | 'app'>('web');
  const filtered = useMemo(() => items.filter(i => i.type === activeTab), [items, activeTab]);

  return (
    <div id="work" className="w-full min-h-screen bg-[#e9f0fb] text-[#1f2937] pt-[120px] pb-[60px] font-sans antialiased">
      <motion.div
        className="max-w-6xl mx-auto px-6 flex flex-col justify-center w-full h-full"
        initial={false} // ❗ žádné zhasnutí celé stránky při mountu
      >
        {/* Nadpis + podtitulek */}
        <div className="pb-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Reference</h2>
          <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
          <p className="pt-4 text-slate-600">// Projekty které jsem naprogramoval</p>
        </div>

        {/* Záložky */}
        <div className="flex gap-4 mb-10 mt-6">
          <button
            onClick={() => setActiveTab('web')}
            className={`tab-btn-glass px-4 py-1.5 text-sm font-semibold ${activeTab === 'web' ? 'btn-primary-dark' : 'btn-primary-light'}`}
          >
            Webové stránky
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`tab-btn-glass px-4 py-1.5 text-sm font-semibold ${activeTab === 'app' ? 'btn-primary-dark' : 'btn-primary-light'}`}
          >
            Webové aplikace
          </button>
        </div>

        {/* Karty s projekty */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const src = abs(proj.cover?.url);
            return (
              <div
                key={proj.id}
                className="flex flex-col rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300 min-h-[340px] will-change-transform"
              >
                {/* Obrázek – stabilní layout pomocí aspect ratio */}
                <div className="w-full bg-gray-100 overflow-hidden">
                  <div className="relative w-full aspect-[16/9]">
                    {src ? (
                      <Image
                        src={src}
                        alt={proj.cover?.alt || proj.title || 'Cover'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={TINY_BLUR}
                        className="object-cover"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                        Bez náhledu
                      </div>
                    )}
                  </div>
                </div>

                {/* Text + tlačítko */}
                <div className="flex flex-col p-4 flex-1">
                  <h3 className="font-bold text-lg text-blue-600 mb-2">{proj.title || '(bez názvu)'}</h3>
                  <div className="mt-auto">
                    <Link href={`/work/${proj.slug}`}>
                      <button className="btn-glass btn-primary-dark">
                        <span className="btn-primary-inner">Detail</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Link href="/contact">
          <button className="btn-glass btn-primary-light mt-10">
            <span className="btn-primary-inner">Objednat</span>
          </button>
        </Link>
      </motion.div>
    </div>
  );
}