// src/lib/cachedDeveloper.ts
import { unstable_cache } from 'next/cache';
import { strapiFetch } from './strapi';

// Cache: v devu 1 s (prakticky bez cache), v prod 10 min
const CACHE_SECONDS = process.env.NODE_ENV === 'development' ? 1 : 30;

export type WorkItem = {
  date?: string;
  company?: string;
  position?: string;
  description?: string;
};

export type EducationItem = {
  edu_date?: string;
  edu_school?: string;
  edu_description?: string;
};

export type StackItem = {
  icon: 'html' | 'css' | 'sass' | 'js' | 'react' | 'firebase' | 'github' | 'gitlab' | 'tailwind' | 'nextjs' | 'bootstrap' | 'vercel';
  label?: string;
};

export type DeveloperDTO = {
  id: number;
  title?: string;

  cv_section_title?: string;
  cv_name?: string;
  cv_birth_date?: string;
  cv_mail?: string;
  cv_tel_number?: string;

  work_section_title?: string;
  work_experiences: WorkItem[];

  education_section_title?: string;
  education_experiences: EducationItem[];

  stack_section_title?: string;
  stack_items: StackItem[];
};

function unify(input: any): DeveloperDTO {
  const data = input?.data ?? input ?? {};
  const a = data.attributes ?? data;

  const work: any[] = Array.isArray(a?.work_experiences) ? a.work_experiences : [];
  const edu: any[] = Array.isArray(a?.education_experiences) ? a.education_experiences : [];
  const stack: any[] = Array.isArray(a?.stack_items) ? a.stack_items : [];

  return {
    id: Number(data.id ?? 0) || 0,
    title: a?.title ?? '',

    cv_section_title: a?.cv_section_title ?? '',
    cv_name: a?.cv_name ?? '',
    cv_birth_date: a?.cv_birth_date ?? '',
    cv_mail: a?.cv_mail ?? '',
    cv_tel_number: a?.cv_tel_number ?? '',

    work_section_title: a?.work_section_title ?? 'Pracovní zkušenosti',
    work_experiences: work.map((w) => ({
      date: w?.date ?? '',
      company: w?.company ?? '',
      position: w?.position ?? '',
      description: w?.description ?? '',
    })),

    education_section_title: a?.education_section_title ?? 'Vzdělání',
    education_experiences: edu.map((e) => ({
      edu_date: e?.edu_date ?? '',
      edu_school: e?.edu_school ?? '',
      edu_description: e?.edu_description ?? '',
    })),

    stack_section_title: a?.stack_section_title ?? 'Můj dev stack',
    stack_items: stack.map((s) => ({
      icon: s?.icon ?? 'react',
      label: s?.label ?? '',
    })),
  };
}

async function fetchDeveloperStrict(): Promise<DeveloperDTO> {
  const base = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '');

  // 1) Rychlý warmup – ideálně /api/health (Strapi 5 ho má)
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000); // 5 s max
    await fetch(`${base}/api/health`, { signal: controller.signal });
    clearTimeout(t);
  } catch {
    // Když health není nebo timeoutne, nevadí – pokračujeme.
  }

  // 2) Super‑lehký ping na developer pro probuzení DB, ale bez populates
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    await fetch(`${base}/api/developer?fields[0]=id&publicationState=live`, { signal: controller.signal });
    clearTimeout(t);
  } catch {
    // Taky ignorujeme – jen se snažíme backend probrat
  }

  // 3) Plná data (pouze to, co fakt potřebujeme)
  const res = await strapiFetch<{ data: any }>({
    path: '/api/developer',
    query: {
      publicationState: 'live',
      fields: ['title', 'cv_section_title', 'cv_name', 'cv_birth_date', 'cv_mail', 'cv_tel_number', 'work_section_title', 'education_section_title', 'stack_section_title'],
      populate: {
        work_experiences: { fields: ['date', 'company', 'position', 'description'] },
        education_experiences: { fields: ['edu_date', 'edu_school', 'edu_description'] },
        stack_items: { fields: ['icon', 'label'] },
      },
    },
    next: { tags: ['developer'], revalidate: CACHE_SECONDS },
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('🔎 /api/developer sample:', res?.data ?? res);
  }
  return unify(res);
}

const getCachedDeveloperInner = unstable_cache(async () => await fetchDeveloperStrict(), ['developer'], { revalidate: CACHE_SECONDS, tags: ['developer'] });

export async function getCachedDeveloper(): Promise<DeveloperDTO | null> {
  try {
    return await getCachedDeveloperInner();
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ getCachedDeveloper failed:', e?.message || e);
    }
    return null;
  }
}
