'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { fetchWpPage } from '../lib/fetchWpPage';

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

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  bg?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, direction = 'left', bg = '#0a192f' }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [inView, controls]);

  const variants = {
    hidden: { opacity: 0, x: direction === 'left' ? -100 : 100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className="py-32 border-t border-[#1e2a3a]"
      style={{ backgroundColor: bg }}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
};

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
    <div id="home" className="w-full pt-[100px] bg-[#0a192f] text-[#ccd6f6] space-y-20 md:space-y-40">
      {/* Úvodní sekce */}
      <motion.div
        className="max-w-[1000px] mx-auto px-8 flex flex-col justify-center min-h-[60vh] md:min-h-screen"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-pink-600">{pageData.acf.home_intro || 'Nadpis'}</p>
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold">{pageData.acf.home_name || 'Jméno'}</h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#8892b0]">{pageData.acf.home_subtitle || 'Podnadpis'}</h2>
        <p className="text-[#8892b0] py-4 max-w-[700px]">{pageData.acf.home_description || 'Popis stránek'}</p>

        {pageData.content?.rendered && (
          <div
            className="text-[#8892b0] py-4 max-w-[700px]"
            dangerouslySetInnerHTML={{ __html: pageData.content.rendered }}
          />
        )}

        <Link
          href="/work"
          className="text-white cursor-pointer rounded-md border-2 w-64 group px-6 py-3 my-2 flex items-center hover:bg-pink-600 hover:border-pink-600"
        >
          Více o mých projektech
          <span className="group-hover:rotate-90 duration-300">
            <HiArrowNarrowRight className="ml-3" />
          </span>
        </Link>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-40 sm:mt-12 md:mt-20 text-center text-sm text-[#8892b0] flex flex-col items-center"
          animate={{ y: [0, -6, 0], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="mb-1">Více informací níže</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-pink-600 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Technologický náskok */}
      <AnimatedSection direction="right" bg="#112240">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">{pageData.acf.tech_title || 'Technologický náskok'}</h2>
            <p className="text-[#ccd6f6]">{pageData.acf.tech_text || 'Používám moderní frameworky jako React a Next.js…'}</p>
          </div>
          <div className="flex-1">
            {pageData.acf.tech_image?.url && (
              <img src={pageData.acf.tech_image.url} alt={pageData.acf.tech_image.alt || 'Ilustrační obrázek'} className="w-full max-w-md mx-auto" />
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Responzivita */}
      <AnimatedSection direction="left" bg="#0a192f">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">{pageData.acf.responzivita_title || 'Responzivita'}</h2>
            <p className="text-[#ccd6f6]">{pageData.acf.responzivita_text || 'Text ohledně responzivity'}</p>
          </div>
          <div className="flex-1">
            {pageData.acf.responzivita_image?.url && (
              <img src={pageData.acf.responzivita_image.url} alt={pageData.acf.responzivita_image.alt || 'Ilustrační obrázek'} className="w-full max-w-md mx-auto" />
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* CMS */}
      <AnimatedSection direction="right" bg="#112240">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">{pageData.acf.cms_title || 'CMS'}</h2>
            <p className="text-[#ccd6f6]">{pageData.acf.cms_text || 'Popis'}</p>
          </div>
          <div className="flex-1">
            {pageData.acf.cms_image?.url && (
              <img src={pageData.acf.cms_image.url} alt={pageData.acf.cms_image.alt || 'Ilustrační obrázek'} className="w-full max-w-md mx-auto" />
            )}
          </div>
        </div>
        <div className="justify-center mx-auto flex">
          <Link
            href="/work"
            className="text-white cursor-pointer rounded-md border-2 w-64 group px-6 py-3 my-2 flex items-center hover:bg-pink-600 hover:border-pink-600"
          >
            Více o mých projektech
            <span className="group-hover:rotate-90 duration-300">
              <HiArrowNarrowRight className="ml-3" />
            </span>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default HomeClient;