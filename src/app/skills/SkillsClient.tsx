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

export default function SkillsClient() {
  return (
    <div id="skills" className="w-full min-h-screen bg-[#e9f0fb] text-[#1f2937] pt-[120px] pb-[60px] font-sans antialiased">
      <motion.div
        className="max-w-6xl mx-auto px-6 flex flex-col justify-center w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="pb-8">
          <h2 className="text-4xl font-bold text-gray-800 border-b-4 inline border-blue-500 pb-1">Můj dev stack</h2>
          <p className="pt-4 text-slate-600">// S těmito technologiemi pracuji</p>
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center py-12">
          {skills.map(({ src, label }, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300 hover:scale-105">
              <Image
                src={src}
                alt={`${label} ikona`}
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
              <p className="text-blue-600 font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}