'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const skills = [
  { src: '/html.png', label: 'HTML' },
  { src: '/css.png', label: 'CSS' },
  { src: '/sass.png', label: 'SASS' },
  { src: '/javascript.png', label: 'JavaScript' },
  { src: '/react.png', label: 'React' },
  { src: '/firebase.png', label: 'Firebase' },
  { src: '/github.png', label: 'GitHub' },
  { src: '/gitlab.png', label: 'GitLab' },
  { src: '/tailwind.png', label: 'Tailwind' },
  { src: '/nextjs.png', label: 'Next.js' },
  { src: '/bootstrap.png', label: 'Bootstrap' },
  { src: '/vercel.png', label: 'Vercel' },
];

type Props = {
  initialData: any;
};

export default function DeveloperClient({ initialData }: Props) {
  const pageData = initialData;

  if (!pageData || !pageData.acf) return null;

  return (
    <div className="w-full min-h-screen bg-[#e9f0fb] text-[#1f2937] pt-[120px] pb-[60px] font-sans antialiased">
      <motion.div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* ŽIVOTOPIS */}
        <section>
          <div className="space-y-6 text-left">
            <div className="text-left mb-12">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Infostránka pro případné zaměstnavatele</h1>
              <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 border-b-2 border-blue-500 w-fit pb-1">Životopis</h3>
          </div>

          <div className="mt-6 space-y-1 text-slate-600 text-base">
            <p>{pageData.acf.cv_name}</p>
            <p>{pageData.acf.cv_birth_Date}</p>
            <p>{pageData.acf.cv_mail}</p>
            <p>{pageData.acf.cv_tel_number}</p>
          </div>

          <h4 className="text-xl font-bold text-gray-800 pt-10 pb-4">{pageData.acf.cv_title}</h4>
          <div className="space-y-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i}>
                <p className="text-sm text-blue-600 font-medium">{pageData.acf[`cv_work_date${i}`]}</p>
                <p className="text-base font-semibold text-gray-800">{pageData.acf[`cv_work_title${i}`]}</p>
                <p className="text-sm text-slate-600">{pageData.acf[`cv_work_description${i}`]}</p>
              </div>
            ))}
          </div>

          <h4 className="text-xl font-bold text-gray-800 pt-10 pb-4">{pageData.acf.cv_school_title}</h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-blue-600">{pageData.acf.cv_school_date1}</p>
              <p className="text-base text-slate-600">{pageData.acf.cv_school_description1}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">{pageData.acf.cv_school_date2}</p>
              <p className="text-base text-slate-600">{pageData.acf.cv_school_description2}</p>
            </div>
          </div>
        </section>

        {/* TECHNOLOGIE */}
        <section className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 border-b-4 inline-block border-blue-500 pb-1 mb-2">Můj dev stack</h2>
          <p className="pt-2 text-slate-600">// S těmito technologiemi pracuji</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center py-10">
            {skills.map(({ src, label }, index) => (
              <div key={index} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition hover:scale-105">
                <Image src={src} alt={label} width={80} height={80} className="mx-auto mb-4" />
                <p className="text-blue-600 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
