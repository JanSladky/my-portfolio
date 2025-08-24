'use client';

import { motion } from 'framer-motion';
import type { AboutDTO } from '../../lib/cachedAbout';

/**
 * Přijde { title, about_text } z getCachedAbout().
 * about_text je prostý text – rozdělíme ho na odstavce podle prázdné řádky.
 */
export default function AboutClient({ data }: { data: AboutDTO }) {
  const title = data?.title || 'O mně';
  const text = data?.about_text || '';

  // Rozdělení na odstavce (prázdná řádka = nový odstavec)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div id="about" className="w-full min-h-screen bg-[#f4f7fc] text-[#1f2937] pt-[120px] pb-[60px]">
      <motion.div
        className="flex flex-col justify-start items-center w-full h-full font-sans antialiased"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl w-full px-6">
          {/* Hlavička */}
          <div className="text-left mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">{title}</h1>
            <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
          </div>

          {/* Obsah */}
          <div className="text-lg md:text-xl leading-relaxed text-gray-700 space-y-6 pb-32">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="text-gray-400">Zatím žádný obsah.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}