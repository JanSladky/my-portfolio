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
    link: '/work/1', // ⬅ změna zde
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
    <div id="work" className="w-full min-h-screen bg-[#0a192f] text-gray-300">
      <motion.div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full transition-opacity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="pb-4 mt-[80px]">
          <p className="text-4xl font-bold inline border-b-4 pb-1 text-gray-300 border-pink-600">Projekty</p>
          <p className="py-2">// Projekty které jsem naprogramoval</p>
        </div>

        {/* Přepínací tlačítka */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('web')} className={`px-4 py-2 rounded ${activeTab === 'web' ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'} transition-all`}>
            Webové stránky
          </button>
          <button onClick={() => setActiveTab('app')} className={`px-4 py-2 rounded ${activeTab === 'app' ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'} transition-all`}>
            Webové aplikace
          </button>
        </div>

        {/* Projekty */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              style={{ backgroundImage: `url(${proj.image})` }}
              className="shadow-lg shadow-[#040c16] group container rounded-md flex justify-center items-center mx-auto content-div bg-cover bg-center">
              <div className="opacity-0 group-hover:opacity-100 text-center bg-black bg-opacity-50 w-full h-full flex flex-col justify-center items-center rounded-md">
                <span className="text-xl font-bold text-white tracking-wide px-2">{proj.title}</span>
                <div className="pt-4">
                  <Link href={proj.link}>
                    <button className="text-center rounded-lg px-4 py-2 bg-white text-gray-700 font-semibold">Detail</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/contact" className="text-white cursor-pointer border-2 rounded w-64 group px-6 py-3 my-8 flex justify-center items-center hover:bg-pink-600 hover:border-pink-600 mx-auto">
          Objednat
        </Link>
      </motion.div>
    </div>
  );
};

export default Work;
