// frontend/src/app/developer/developer-client.tsx
// --------------------------------------------------------------
// Klientská komponenta "Developer" (sekce s CV a mým stackem).
// Cíl: udělat ikony v "Můj dev stack" menší na mobilu a plynule
// je zvětšovat na větších breakpointech (Tailwind).
// --------------------------------------------------------------

'use client'; // 1) označíme komponentu jako klientskou (používá prohlížeč)

import type { DeveloperDTO } from '@/lib/cachedDeveloper'; // 2) typ dat z API/loaderu
import DevStack from './DevStack'; // 3) (pokud používáš; pokud ne, můžeš smazat import)

// 4) ikonky z react-icons/si (Simple Icons)
import { SiHtml5, SiCss3, SiSass, SiJavascript, SiReact, SiFirebase, SiGithub, SiGitlab, SiTailwindcss, SiNextdotjs, SiBootstrap, SiVercel } from 'react-icons/si';

// 5) Props pro komponentu – očekává objekt `data` typu DeveloperDTO
type Props = { data: DeveloperDTO };

// 6) Jedno místo, kde určujeme VELIKOST ikon přes Tailwind.
//    - w-9 h-9   => mobil (36 px)
//    - sm:w-12  => ≥640px (48 px)
//    - md:w-14  => ≥768px (56 px)
//    - lg:w-16  => ≥1024px (64 px)
//    → můžeš upravit podle chuti (např. zmenšit/zvětšit konkrétní breakpoint).
const ICON_CLASSES = 'w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-slate-700';

// 7) Mapa ikon – místo pevného `size={56}` používáme `className={ICON_CLASSES}`,
//    takže velikost je responzivní podle breakpointů výše.
const iconMap: Record<string, JSX.Element> = {
  nextjs: <SiNextdotjs className={ICON_CLASSES} aria-label="Next.js" />,
  react: <SiReact className={ICON_CLASSES} aria-label="React" />,
  js: <SiJavascript className={ICON_CLASSES} aria-label="JavaScript" />,
  html: <SiHtml5 className={ICON_CLASSES} aria-label="HTML" />,
  tailwind: <SiTailwindcss className={ICON_CLASSES} aria-label="Tailwind CSS" />,
  css: <SiCss3 className={ICON_CLASSES} aria-label="CSS" />,
  sass: <SiSass className={ICON_CLASSES} aria-label="SASS" />,
  firebase: <SiFirebase className={ICON_CLASSES} aria-label="Firebase" />,
  github: <SiGithub className={ICON_CLASSES} aria-label="GitHub" />,
  gitlab: <SiGitlab className={ICON_CLASSES} aria-label="GitLab" />,
  bootstrap: <SiBootstrap className={ICON_CLASSES} aria-label="Bootstrap" />,
  vercel: <SiVercel className={ICON_CLASSES} aria-label="Vercel" />,
};

// 8) Hlavní komponenta sekce "Developer"
export default function DeveloperClient({ data }: Props) {
  // 9) Rozbalíme si jednotlivé části ze `data`
  const {
    title,
    cv_section_title,
    cv_name,
    cv_birth_date,
    cv_mail,
    cv_tel_number,
    work_section_title,
    work_experiences,
    education_section_title,
    education_experiences,
    stack_section_title,
    stack_items,
  } = data;

  // 10) Vykreslení celé stránky/sekce
  return (
    <div
      className="w-full min-h-screen bg-[#e9f0fb] text-[#1f2937] pt-[120px] pb-[60px]"
      // Pozadí a okraje celé sekce
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* HLAVNÍ TITULEK */}
        {(title || cv_section_title) && (
          <header className="mb-12">
            {/* Titulek sekce – velikost se mění na větších displejích */}
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{title || cv_section_title}</h1>
            {/* malý proužek pod titulkem */}
            <div className="h-1 w-24 bg-blue-400 rounded-full" />
          </header>
        )}

    
        {/* ŽIVOTOPIS */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{cv_section_title || 'Životopis'}</h2>
          <div className="space-y-1 text-slate-700">
            {cv_name && <p>{cv_name}</p>}
            {cv_birth_date && <p>{cv_birth_date}</p>}
            {cv_mail && <p>{cv_mail}</p>}
            {cv_tel_number && <p>{cv_tel_number}</p>}
          </div>
        </section>

        {/* PRACOVNÍ ZKUŠENOSTI */}
        <section className="mb-14">
          <h3 className="text-2xl font-bold mb-6">{work_section_title || 'Pracovní zkušenosti'}</h3>
          <div className="space-y-8">
            {work_experiences?.map((item, i) => (
              <div key={i}>
                {item.date && item.company ? (
                  <p className="text-blue-600 font-medium">
                    {item.date} – {item.company}
                  </p>
                ) : item.date ? (
                  <p className="text-blue-600 font-medium">{item.date}</p>
                ) : null}
                {item.position && <p className="font-semibold text-gray-800">{item.position}</p>}
                {item.description && <p className="text-slate-600">{item.description}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* VZDĚLÁNÍ */}
        <section className="mb-14">
          <h3 className="text-2xl font-bold mb-6">{education_section_title || 'Vzdělání'}</h3>
          <div className="space-y-8">
            {education_experiences?.map((e, i) => (
              <div key={i}>
                {e.edu_date && <p className="text-blue-600 font-medium">{e.edu_date}</p>}
                {e.edu_school && <p className="text-slate-700">– {e.edu_school}</p>}
                {e.edu_description && <p className="text-slate-600">{e.edu_description}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* MŮJ DEV STACK */}
        {stack_items?.length ? (
          <section className="mb-10">
            <h3 className="text-2xl font-bold mb-2">{stack_section_title || 'Můj dev stack'}</h3>
            <p className="text-slate-500 mb-8">// S těmito technologiemi pracuji</p>

            {/* 
              GRID – na mobilu 3 sloupce (grid-cols-3),
              na "sm" 4 sloupce, na "md" 6. 
              Můžeš upravit podle potřeby.
            */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
              {stack_items.map((s, i) => (
                <div
                  key={`${s.icon}-${i}`}
                  className="
                    rounded-2xl bg-white shadow-sm 
                    p-5 sm:p-6 md:p-7 
                    flex flex-col items-center justify-center gap-3 sm:gap-4
                    transition-transform
                    hover:scale-[1.02]
                  ">
                  {/* IKONA – responsivní velikost přes ICON_CLASSES */}
                  <div className="opacity-90">{iconMap[s.icon] ?? null}</div>

                  {/* POPISEK */}
                  <div className="font-medium text-center text-sm sm:text-base">{s.label || s.icon}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
