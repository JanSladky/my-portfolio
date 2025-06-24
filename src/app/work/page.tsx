'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    type: 'web',
    image: '/pohanka.png',
    title: 'Webové stránky pro kosmetické studio',
    link: '/work/1',
  },
  {
    id: 2,
    type: 'web',
    image: '/videojinak.png',
    title: 'Webové stránky pro videojinak',
    link: '/work/2',
  },
  {
    id: 3,
    type: 'app',
    image: '/randomator.png',
    title: 'Randomator - aplikace na rozdělení do skupin',
    link: '/work/3',
  },
  {
    id: 4,
    type: 'app',
    image: '/zasedacka.png',
    title: 'Plánovač událostí zasedací místnosti',
    link: '/work/4',
  },
  {
    id: 5,
    type: 'app',
    image: '/recepty.png',
    title: 'Aplikace na recepty',
    link: '/work/5',
  },
];

const Work = () => {
  const [activeTab, setActiveTab] = useState('web');

  const filtered = projects.filter((p) => p.type === activeTab);

  return (
    <div id="work" className="w-full min-h-screen bg-[#e9f0fb] text-[#1f2937] pt-[120px] pb-[60px] font-sans antialiased">
      <motion.div className="max-w-6xl mx-auto px-6 flex flex-col justify-center w-full h-full transition-opacity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="pb-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Reference</h2>
          <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
          <p className="pt-4 text-slate-600">// Projekty které jsem naprogramoval</p>
        </div>

        {/* Přepínací tlačítka */}
        <div className="flex gap-4 mb-10 mt-6">
          <button
            onClick={() => setActiveTab('web')}
            className={`tab-btn-glass px-4 py-1.5 text-sm font-semibold 
      ${activeTab === 'web' ? 'btn-primary-dark' : 'btn-primary-light'}`}>
            Webové stránky
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`tab-btn-glass px-4 py-1.5 text-sm font-semibold 
      ${activeTab === 'app' ? 'btn-primary-dark' : 'btn-primary-light'}`}>
            Webové aplikace
          </button>
        </div>

        {/* Projekty */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div key={proj.id} className="flex flex-col rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300 min-h-[340px]">
              <div className="w-full h-56 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${proj.image})` }} />
              <div className="flex flex-col p-4 flex-1">
                <h3 className="font-bold text-lg text-blue-600 mb-2">{proj.title}</h3>
                <div className="mt-auto">
                  <Link href={proj.link}>
                    <button className="btn-glass btn-primary-dark">
                      <span className="btn-primary-inner">Detail</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA tlačítko */}
        <Link href="/contact">
          <button className="btn-glass btn-primary-light mt-10">
            <span className="btn-primary-inner">Objednat</span>
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Work;
