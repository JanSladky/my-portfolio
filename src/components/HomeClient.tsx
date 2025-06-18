'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchWpPage } from '../lib/fetchWpPage';
import SectionWave from '../components/SectionWave';

import { FaFileAlt, FaSitemap, FaWpforms, FaWordpress, FaHandshake, FaPencilRuler, FaComments, FaLaptopCode, FaBug, FaPaperPlane } from 'react-icons/fa';

interface PageData {
  acf: {
    home_intro?: string;
    home_name?: string;
    home_subtitle?: string;
    home_description?: string;
    tech_title?: string;
    tech_text?: string;
    tech_image?: { url: string; alt?: string };
    responzivita_title?: string;
    responzivita_text?: string;
    responzivita_image?: { url: string; alt?: string };
    cms_title?: string;
    cms_text?: string;
    cms_image?: { url: string; alt?: string };
  };
  content?: {
    rendered?: string;
  };
}

interface HomeProps {
  pageData: PageData;
}

const HomeClient: React.FC<HomeProps> = ({ pageData: initialData }) => {
  const [pageData, setPageData] = useState<PageData>(initialData);

  useEffect(() => {
    const refreshData = async () => {
      const updated = await fetchWpPage('home');
      if (updated) setPageData(updated);
    };
    refreshData();
  }, []);

  if (!pageData || !pageData.acf) return null;

  return (
    <div id="home" style={{ overflow: 'hidden' }} className="w-full pt-[80px] text-[#1f2937]">
      <motion.div
        style={{ backgroundColor: '#e9f0fb' }}
        className="w-full bg-[#e9f0fb] font-sans antialiased text-gray-800 min-h-screen flex items-center relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <div className="max-w-6xl mx-auto px-6 text-left">
          <p className="text-blue-500 font-medium text-md mb-2">{pageData.acf.home_intro || 'Ahoj, jmenuji se'}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-3">{pageData.acf.home_name || 'Honza'}</h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-slate-700 mb-6">{pageData.acf.home_subtitle || 'Frontend developer, který tvoří přístupné weby'}</h2>
          <p className="text-slate-500 max-w-2xl mb-8 leading-relaxed">{pageData.acf.home_description || 'Specializuji se na prezentační weby…'}</p>
          <button
            onClick={() => {
              const section = document.getElementById('cards');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-indigo-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-200 transition">
            Zobrazit podrobnosti
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <SectionWave color="#f4f7fc" variant="angle" />
        </div>
      </motion.div>

      <section id="cards" className="bg-[#f4f7fc] pt-20 px-4 pb-60 relative scroll-mt-32">
        <h2 className="text-2xl md:text-4xl font-bold flex text-gray-800 justify-center mb-8">Proč web ode mně?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: pageData.acf.tech_title || 'Technologický náskok',
              text: pageData.acf.tech_text || 'Používám moderní frameworky jako React a Next.js…',
              image: pageData.acf.tech_image,
            },
            {
              title: pageData.acf.responzivita_title || 'Responzivita',
              text: pageData.acf.responzivita_text || 'Text ohledně responzivity',
              image: pageData.acf.responzivita_image,
            },
            {
              title: pageData.acf.cms_title || 'Redakční systém',
              text: pageData.acf.cms_text || 'Web předám s jednoduchým redakčním systémem…',
              image: pageData.acf.cms_image,
            },
          ].map(({ title, text, image }, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition duration-300 p-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2">{title}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{text}</p>
              {image?.url && <img src={image.url} alt={image.alt || 'Ilustrační obrázek'} className="rounded-md shadow w-full" />}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const section = document.getElementById('sluzby');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-indigo-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-200 transition mt-32 flex mx-auto">
          Služby které nabízím
        </button>
        <div className="absolute bottom-0 left-0 w-full z-10">
          <SectionWave color="#e3edf9" variant="angle" />
        </div>
      </section>

      <section className="relative bg-[#e3edf9] pt-20 pb-60 scroll-mt-32" id="sluzby">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16">Co mohu nabídnout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              {
                icon: <FaFileAlt />,
                title: 'Jednoduchý prezentační web',
                items: ['Jednostránkový prezentační web', 'Bez redakčního systému', 'Rychlé načítání a přehledný design', 'Ideální pro vizitku, portfolio, kontakt'],
              },
              {
                icon: <FaSitemap />,
                title: 'Vícestránkový web bez redakčního systému',
                items: ['Stránky typu Domů, O mně, Služby, Kontakt', 'Bez redakčního systému – statický obsah'],
              },
              {
                icon: <FaWpforms />,
                title: 'Jednostránkový web s redakčním systémem',
                items: ['Jednostránkový web s možností editace obsahu'],
              },
              {
                icon: <FaWordpress />,
                title: 'Vícestránkový web s redakčním systémem',
                items: ['Web s administrací', 'Správa článků, aktualit, fotogalerií, atd.', 'Vhodné pro firemní weby, spolky'],
              },
            ].map(({ icon, title, items }, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-105 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 from-indigo-400 to-pink-400 rounded-t-2xl" />
                <div className="text-blue-500 text-3xl mb-4">{icon}</div>
                <h3 className="text-lg font-semibold text-blue-600 mb-4">{title}</h3>
                <ul className="list-disc list-inside text-gray-800 space-y-2 text-sm">
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
         <button
          onClick={() => {
            const section = document.getElementById('spoluprace');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-indigo-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-200 transition mt-32 flex mx-auto">
          Spolupráce
        </button>
        <div className="absolute bottom-0 left-0 w-full z-10">
          <SectionWave color="#f4f7fc" variant="angle" />
        </div>
      </section>

      <section className="bg-[#f4f7fc] pt-20 pb-20 relative scroll-mt-32" id="spoluprace">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16">Jak probíhá spolupráce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              {
                icon: <FaHandshake />,
                title: 'Osobní setkání',
                text: 'Vyslechnu vaše potřeby, požadavky a očekávání. Vzniká základ zadání projektu.',
              },
              {
                icon: <FaPencilRuler />,
                title: 'Grafický návrh',
                text: 'Připravím návrh struktury a vizuálu webu na míru podle vašich cílů a značky.',
              },
              {
                icon: <FaComments />,
                title: 'Konzultace návrhu',
                text: 'Společně návrh projdeme, zapracujeme případné změny a doladíme detaily.',
              },
              {
                icon: <FaBug />,
                title: 'Výroba a testování',
                text: 'Web naprogramuji, a otestuji tak aby byl bezchybný a uživatelsky přívětivý',
              },
              {
                icon: <FaPaperPlane />,
                title: 'Předání projektu',
                text: 'Předám zákazníkovi, projdeme finální podobu a případně zapracujeme finální požadavky',
              },
            ].map(({ icon, title, text }, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-105 p-6 text-left">
                <div className="text-blue-500 text-3xl mx-auto mb-4">{icon}</div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">{title}</h3>
                <p className="text-gray-800 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <Link className="bg-indigo-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-200 transition mt-32 inline-flex mx-auto" href="/work">
            Reference
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeClient;
