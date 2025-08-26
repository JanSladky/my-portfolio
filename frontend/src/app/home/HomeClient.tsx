'use client';

/**
 * Klientská komponenta homepage.
 * - Bere data přes prop `data.home` (typy z lib/cachedHome)
 * - Služby: ikony podle enum `icon` (file|sitemap|wpforms|edit)
 * - Spolupráce: kroky podle enum `icon` (handshake|ruler|comments|bug|plane)
 */

import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionWave from '../../components/SectionWave';

import type { IconName, StepIconName, HomeAttrs } from '../../lib/cachedHome';

// Ikony (FontAwesome)
import {
  FaFileAlt as IconFile,
  FaSitemap as IconSitemap,
  FaWpforms as IconWpforms,
  FaEdit as IconEdit,
  FaHandshake,
  FaPencilRuler,
  FaComments,
  FaBug,
  FaPaperPlane,
} from 'react-icons/fa';

type HomeData = { home?: HomeAttrs };

// mapování ikon pro Služby
const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
  file: IconFile,
  sitemap: IconSitemap,
  wpforms: IconWpforms,
  edit: IconEdit,
};

// mapování ikon pro Kroky spolupráce
const stepIconMap: Record<StepIconName, React.ComponentType<{ className?: string }>> = {
  handshake: FaHandshake,
  ruler: FaPencilRuler,
  comments: FaComments,
  bug: FaBug,
  plane: FaPaperPlane,
};

export default function HomeClient({ data }: { data?: HomeData }) {
  const h = data?.home || {};

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const T = (s?: string) => (s && s.trim().length ? s : '');

  /**
   * ABSOLUTIZACE URL:
   * - Pokud `u` už je absolutní (začíná na http/https), vrátíme ji.
   * - Pokud je relativní (např. "/uploads/a.png"), použijeme `new URL(u, BASE)`.
   * - BASE bereme z NEXT_PUBLIC_STRAPI_URL (musí být bez trailing slash).
   * - `try/catch` chrání před neplatnými vstupy, ať nám to nespadne v klientu.
   */
  const ABS_BASE = useMemo(() => (process.env.NEXT_PUBLIC_STRAPI_URL || '').replace(/\/+$/, ''), []);
  const abs = (u?: string) => {
    if (!u) return '';
    try {
      // Pokud je `u` už absolutní, new URL(u) projde a vrátíme ji.
      // Pokud je relativní, new URL(u, ABS_BASE) správně slepí "https://strapi... + /uploads/..."
      return new URL(u, ABS_BASE || undefined).href;
    } catch {
      // Když by `u` bylo třeba "blob:..." nebo něco nestandardního, vrátíme původní.
      return u;
    }
  };

  // Volitelná dev diagnostika: když BASE chybí a máme relativní obrázek, ukaž varování.
  const showBaseWarning =
    process.env.NODE_ENV !== 'production' &&
    !ABS_BASE &&
    [h.tech_image?.url, h.responzivita_image?.url, h.cms_image?.url].some((u) => typeof u === 'string' && u.startsWith('/'));

  return (
    <div id="home" style={{ overflow: 'hidden' }} className="w-full pt-[80px] text-[#1f2937]">
      {showBaseWarning && (
        <div className="mx-auto my-4 max-w-6xl rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Chybí <code>NEXT_PUBLIC_STRAPI_URL</code>. Relativní obrázky zůstanou na doméně frontendu a nebudou vidět.
        </div>
      )}

      {/* HERO */}
      <motion.div
        style={{ backgroundColor: '#e9f0fb' }}
        className="w-full bg-[#e9f0fb] font-sans antialiased text-gray-800 min-h-screen flex items-center relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 text-left">
          {T(h.home_intro) && <p className="text-blue-500 font-medium text-md mb-2">{h.home_intro}</p>}
          {T(h.home_name) && <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-3">{h.home_name}</h1>}
          {T(h.home_subtitle) && <h2 className="text-2xl md:text-4xl font-semibold text-slate-700 mb-6">{h.home_subtitle}</h2>}
          {T(h.home_description) && <p className="text-slate-500 max-w-2xl mb-8 leading-relaxed">{h.home_description}</p>}

          {T(h.home_button_text) && (
            <button onClick={() => scrollTo('cards')} className="btn-glass btn-primary-light">
              <span className="btn-primary-inner">{h.home_button_text}</span>
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <SectionWave color="#f4f7fc" variant="angle" />
        </div>
      </motion.div>

      {/* KARTY (tech/responzivita/cms) */}
      <section id="cards" className="bg-[#f4f7fc] pt-20 px-4 pb-60 relative scroll-mt-32">
        {T(h.cards_heading) && (
          <h2 className="text-2xl md:text-4xl font-bold flex text-gray-800 justify-center mb-8">{h.cards_heading}</h2>
        )}

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: h.tech_title,         text: h.tech_text,         img: h.tech_image },
            { title: h.responzivita_title, text: h.responzivita_text, img: h.responzivita_image },
            { title: h.cms_title,          text: h.cms_text,          img: h.cms_image },
          ].map(({ title, text, img }, idx) => (
            <div key={idx} className="card-glass">
              {T(title) && <h2 className="text-xl font-bold text-blue-600 mb-2">{title}</h2>}
              {T(text) && <p className="text-gray-700 leading-relaxed mb-4">{text}</p>}
              {img?.url && <img src={abs(img.url)} alt={img.alt || ''} className="rounded-md shadow w-full" />}
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10">
          <SectionWave color="#e3edf9" variant="angle" />
        </div>
      </section>

      {/* SLUŽBY (ServiceCard ze Strapi) */}
      <section className="relative bg-[#e3edf9] pt-20 pb-60 scroll-mt-32" id="sluzby">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16">
            {T(h.services_heading) || 'Co mohu nabídnout'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {(h.services || []).map((service, index) => {
              const Icon = service.icon && iconMap[service.icon as IconName];
              return (
                <div key={index} className="card-glass">
                  <div className="absolute top-0 left-0 w-full h-1 from-indigo-400 to-pink-400 rounded-t-2xl" />
                  {Icon && <Icon className="text-blue-500 text-3xl mb-4" />}

                  {T(service.title) && <h3 className="text-lg font-semibold text-blue-600 mb-4">{service.title}</h3>}
                  <ul className="list-disc list-inside text-gray-800 space-y-2 text-sm">
                    {(service.bullets || []).map((b, i) => (T(b.text) ? <li key={i}>{b.text}</li> : null))}
                  </ul>
                </div>
              );
            })}
          </div>

          {T(h.services_button_text) && (
            <div className="max-w-6xl mx-auto px-6">
              <button onClick={() => scrollTo('spoluprace')} className="btn-glass btn-primary-light mt-10">
                <span className="btn-primary-inner">{h.services_button_text}</span>
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10">
          <SectionWave color="#f4f7fc" variant="angle" />
        </div>
      </section>

      {/* JAK PROBÍHÁ SPOLUPRÁCE (StepCard ze Strapi) */}
      <section className="bg-[#f4f7fc] pt-20 pb-20 relative scroll-mt-32" id="spoluprace">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16">
            {T(h.collaboration_heading) || 'Jak probíhá spolupráce'}
          </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {(h.steps || []).map((step, index) => {
              const SIcon = step.icon && stepIconMap[step.icon as StepIconName];
              return (
                <div key={index} className="card-glass text-left">
                  {SIcon && <SIcon className="text-blue-500 text-3xl mb-4" />}
                  {T(step.title) && <h3 className="text-lg font-semibold text-blue-600 mb-2">{step.title}</h3>}
                  {T(step.text) && <p className="text-gray-800 text-sm leading-relaxed">{step.text}</p>}
                </div>
              );
            })}
          </div>

          {T(h.collaboration_button_text) ? (
            <Link href="/work">
              <button className="btn-glass btn-primary-dark mt-10">
                <span className="btn-primary-inner">{h.collaboration_button_text}</span>
              </button>
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}