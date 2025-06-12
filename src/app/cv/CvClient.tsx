'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
    <div id="CV" className="w-full pb-[100px] h-auto min-h-screen bg-[#0a192f] text-gray-300 pt-[50px]">
      <motion.div
        className="max-w-[1000px] mt-[80px] mx-auto p-4 flex flex-col justify-center w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 pb-1 border-pink-600">Životopis</p>
          <div className="flex flex-col mt-6 md:flex-row justify-center items-start w-full h-full">
            <div className="w-full gap-8 pb-10">
              <div>
                <span className="block">{pageData.acf.cv_name || 'Jméno'}</span>
                <span className="block">{pageData.acf.cv_birth_Date || 'Datum'}</span>
                <span className="block">{pageData.acf.cv_mail || 'Mail'}</span>
                <span className="block">{pageData.acf.cv_tel_number || 'Telefon'}</span>
                <h2 className="text-2xl pt-6 pb-3">{pageData.acf.cv_title || 'Nadpis'}</h2>

                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div className="w-full" key={i}>
                    <span className="block pl-2 text-[#ccd6f6]">{pageData.acf[`cv_work_date${i}`] || 'Datum'}</span>
                    {pageData.acf[`cv_work_title${i}`] && <span className="block pl-4 text-[#8892b0]">{pageData.acf[`cv_work_title${i}`]}</span>}
                    <span className="block pl-10 text-[#8892b0]">{pageData.acf[`cv_work_description${i}`] || 'Popis'}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl pt-6 pb-3">{pageData.acf.cv_school_title || 'Škola'}</h2>
              <div className="w-full">
                <span className="block pl-2 pb-1 text-[#ccd6f6]">{pageData.acf.cv_school_date1 || 'Datum'}</span>
                <span className="block pl-4 text-[#8892b0]">{pageData.acf.cv_school_description1 || 'Popis'}</span>
                <span className="block pl-2 pb-1 text-[#ccd6f6]">{pageData.acf.cv_school_date2 || 'Datum'}</span>
                <span className="block pl-4 text-[#8892b0]">{pageData.acf.cv_school_description2 || 'Popis'}</span>
              </div>
            </div>

           
          </div>
        </div>
      </motion.div>
    </div>
  );
}