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
    <div id="about" className="w-full min-h-screen bg-[#0a192f] text-gray-300 pt-[50px]">
      <motion.div className="flex flex-col justify-start items-center w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="max-w-[1000px] w-full grid grid-cols-2 gap-8">
          <div className="sm:text-left mt-[80px] pb-8 pl-4">
            <p className="text-4xl text-left font-bold inline border-b-4 pb-1 border-pink-600">{pageData.title?.rendered || 'O mně'}</p>
          </div>
        </div>

        <div className="max-w-[1000px] pb-[100px] w-full px-4">
          <div className="sm:text-2xl md:text-2xl">
            <p className="mb-2">{pageData.acf?.about_text || 'Text o mně'}</p>
            <p>{pageData.acf?.about_text2 || 'Text o mně'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
