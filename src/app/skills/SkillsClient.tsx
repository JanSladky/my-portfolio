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
    <div id="skills" className="w-full min-h-screen bg-[#0a192f] text-gray-300 pt-[100px] sm:pt-0">
      <motion.div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="sm:mt-[80px]">
          <p className="text-4xl font-bold inline border-b-4 pb-1 border-pink-600">Můj dev stack</p>
          <p className="py-4">// S těmito technologiemi pracuji</p>
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-center py-8">
          {skills.map(({ src, label }, index) => (
            <div key={index} className="shadow-md shadow-[#040c16] hover:scale-110 duration-500">
              <Image src={src} alt={`${label} ikona`} width={80} height={80} className="mx-auto" />
              <p className="my-4">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
