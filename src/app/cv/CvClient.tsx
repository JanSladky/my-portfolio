'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWpPage } from '../../lib/fetchWpPage';

type Props = {
  initialData: any;
};

export default function CvClient({ initialData }: Props) {
  const [pageData, setPageData] = useState(initialData);

  useEffect(() => {
    const refreshData = async () => {
      const updated = await fetchWpPage('zivotopis');
      if (updated) setPageData(updated);
    };
    refreshData();
  }, []);

  if (!pageData || !pageData.acf) return null;

  return (
    <div id="CV" className="w-full min-h-screen bg-[#e9f0fb] text-[#1f2937] pt-[120px] pb-[60px] font-sans antialiased">
      <motion.div className="max-w-6xl mx-auto px-6 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="pb-8">
          <p className="text-4xl font-extrabold text-gray-800 inline border-b-4 pb-1 border-blue-500">Životopis</p>
          <div className="flex flex-col mt-6 md:flex-row justify-center items-start w-full h-full">
            <div className="w-full gap-8 pb-10">
              <div>
                <span className="block text-base text-slate-600">{pageData.acf.cv_name || 'Jméno'}</span>
                <span className="block text-base text-slate-600">{pageData.acf.cv_birth_Date || 'Datum'}</span>
                <span className="block text-base text-slate-600">{pageData.acf.cv_mail || 'Mail'}</span>
                <span className="block text-base text-slate-600">{pageData.acf.cv_tel_number || 'Telefon'}</span>

                <h2 className="text-2xl font-bold text-gray-800 pt-10 pb-4">{pageData.acf.cv_title || 'Nadpis'}</h2>

                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div className="w-full mt-4" key={i}>
                    <span className="block pl-2 text-sm text-blue-600 font-medium">{pageData.acf[`cv_work_date${i}`] || 'Datum'}</span>
                    <span className="block pl-4 text-base text-gray-800">{pageData.acf[`cv_work_title${i}`] || 'Pozice'}</span>
                    <span className="block pl-10 text-sm text-slate-600">{pageData.acf[`cv_work_description${i}`] || 'Popis'}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 pt-10 pb-4">{pageData.acf.cv_school_title || 'Škola'}</h2>
              <div className="w-full">
                <span className="block pl-2 pb-1 text-sm text-blue-600 font-medium">{pageData.acf.cv_school_date1 || 'Datum'}</span>
                <span className="block pl-4 text-base text-slate-600">{pageData.acf.cv_school_description1 || 'Popis'}</span>
                <span className="block pl-2 pt-6 pb-1 text-sm text-blue-600 font-medium">{pageData.acf.cv_school_date2 || 'Datum'}</span>
                <span className="block pl-4 text-base text-slate-600">{pageData.acf.cv_school_description2 || 'Popis'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
