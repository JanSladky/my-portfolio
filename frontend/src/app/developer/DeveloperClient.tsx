"use client";

import type { DeveloperDTO } from "@/lib/cachedDeveloper";
import DevStack from "./DevStack";
import {
  SiHtml5, SiCss3, SiSass, SiJavascript, SiReact, SiFirebase,
  SiGithub, SiGitlab, SiTailwindcss, SiNextdotjs, SiBootstrap, SiVercel
} from "react-icons/si";

type Props = { data: DeveloperDTO };

const iconMap: Record<string, JSX.Element> = {
  html: <SiHtml5 size={56} />,
  css: <SiCss3 size={56} />,
  sass: <SiSass size={56} />,
  js: <SiJavascript size={56} />,
  react: <SiReact size={56} />,
  firebase: <SiFirebase size={56} />,
  github: <SiGithub size={56} />,
  gitlab: <SiGitlab size={56} />,
  tailwind: <SiTailwindcss size={56} />,
  nextjs: <SiNextdotjs size={56} />,
  bootstrap: <SiBootstrap size={56} />,
  vercel: <SiVercel size={56} />,
};

export default function DeveloperClient({ data }: Props) {
  const {
    title,
    cv_section_title, cv_name, cv_birth_date, cv_mail, cv_tel_number,
    work_section_title, work_experiences,
    education_section_title, education_experiences,
    stack_section_title, stack_items,
  } = data;

  return (
    <div className="w-full min-h-screen bg-[#e9f0fb] text-[#1f2937] pt-[120px] pb-[60px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hlavní titulek */}
        {(title || cv_section_title) && (
          <header className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{title || cv_section_title}</h1>
            <div className="h-1 w-24 bg-blue-400 rounded-full" />
          </header>
        )}

        {/* Životopis */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold border-b-2 border-blue-500 w-fit pb-1 mb-6">
            Životopis
          </h2>
          <div className="space-y-1 text-slate-700">
            {cv_name && <p>{cv_name}</p>}
            {cv_birth_date && <p>{cv_birth_date}</p>}
            {cv_mail && <p>{cv_mail}</p>}
            {cv_tel_number && <p>{cv_tel_number}</p>}
          </div>
        </section>

        {/* Pracovní zkušenosti */}
        <section className="mb-14">
          <h3 className="text-2xl font-bold mb-6">{work_section_title || "Pracovní zkušenosti"}</h3>
          <div className="space-y-8">
            {work_experiences?.map((item, i) => (
              <div key={i}>
                {item.date && item.company ? (
                  <p className="text-blue-600 font-medium">{item.date} – {item.company}</p>
                ) : item.date ? (
                  <p className="text-blue-600 font-medium">{item.date}</p>
                ) : null}
                {item.position && <p className="font-semibold text-gray-800">{item.position}</p>}
                {item.description && <p className="text-slate-600">{item.description}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Vzdělání */}
        <section className="mb-14">
          <h3 className="text-2xl font-bold mb-6">{education_section_title || "Vzdělání"}</h3>
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

        {/* Můj dev stack */}
        {stack_items?.length ? (
          <section className="mb-10">
            <h3 className="text-2xl font-bold mb-2">{stack_section_title || "Můj dev stack"}</h3>
            <p className="text-slate-500 mb-8">// S těmito technologiemi pracuji</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stack_items.map((s, i) => (
                <div
                  key={`${s.icon}-${i}`}
                  className="rounded-2xl bg-white shadow-sm p-8 flex flex-col items-center justify-center gap-4"
                >
                  <div className="opacity-90">{iconMap[s.icon] ?? null}</div>
                  <div className="font-medium">{s.label || s.icon}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}