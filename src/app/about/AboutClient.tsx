// src/app/about/AboutClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWpPage } from '../../lib/fetchWpPage';

type Props = {
  initialData: any;
};

export default function AboutClient({ initialData }: Props) {
  const [pageData, setPageData] = useState(initialData);

  useEffect(() => {
    const fetchLatest = async () => {
      const updated = await fetchWpPage('about');
      if (updated) setPageData(updated);
      console.log('[AboutClient] Aktualizovaná data:', updated);
    };
    fetchLatest();
  }, []);

  return (
    <div id="about" className="w-full min-h-screen bg-[#f4f7fc] text-[#1f2937]  pt-[120px] pb-[60px]">
      <motion.div className="flex flex-col justify-start items-center w-full h-full font-sans antialiased" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="max-w-6xl w-full px-6">
          <div className="text-left mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">{pageData.title?.rendered || 'O mně'}</h1>
            <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
          </div>

          <div className="text-lg md:text-xl leading-relaxed text-gray-700 space-y-6 pb-32">
            <p>{pageData.acf?.about_text || 'Text o mně'}</p>
            <p>{pageData.acf?.about_text2 || ''}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
