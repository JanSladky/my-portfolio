// src/lib/cachedDeveloper.ts
import { unstable_cache } from "next/cache";
import { strapiFetch } from "./strapi";

// Cache: v devu 1 s (prakticky bez cache), v prod 10 min
const CACHE_SECONDS = process.env.NODE_ENV === "development" ? 1 : 600;

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

export type DeveloperDTO = {
  id: number;
  cv_section_title?: string;
  cv_name?: string;
  cv_birth_date?: string;
  cv_mail?: string;
  cv_tel_number?: string;

  work_section_title?: string;
  work_experiences: WorkItem[];

  education_section_title?: string;
  education_experiences: EducationItem[];
};

function unify(input: any): DeveloperDTO {
  const data = input?.data ?? input ?? {};
  const a = data.attributes ?? data;

  const work: WorkItem[] = Array.isArray(a?.work_experiences) ? a.work_experiences : [];
  const edu: EducationItem[] = Array.isArray(a?.education_experiences) ? a.education_experiences : [];

  return {
    id: Number(data.id ?? 0) || 0,

    cv_section_title: a?.cv_section_title ?? "",
    cv_name: a?.cv_name ?? "",
    cv_birth_date: a?.cv_birth_date ?? "",
    cv_mail: a?.cv_mail ?? "",
    cv_tel_number: a?.cv_tel_number ?? "",

    work_section_title: a?.work_section_title ?? "Pracovní zkušenosti",
    work_experiences: work.map((w: any) => ({
      date: w?.date ?? "",
      company: w?.company ?? "",
      position: w?.position ?? "",
      description: w?.description ?? "",
    })),

    education_section_title: a?.education_section_title ?? "Vzdělání",
    education_experiences: edu.map((e: any) => ({
      edu_date: e?.edu_date ?? "",
      edu_school: e?.edu_school ?? "",
      edu_description: e?.edu_description ?? "",
    })),
  };
}

async function fetchDeveloperStrict(): Promise<DeveloperDTO> {
  const res = await strapiFetch<{ data: any }>({
    path: "/api/developer",
    next: { tags: ["developer"], revalidate: CACHE_SECONDS },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("🔎 /api/developer sample:", res?.data ?? res);
  }
  return unify(res);
}

const getCachedDeveloperInner = unstable_cache(
  async () => await fetchDeveloperStrict(),
  ["developer"],
  { revalidate: CACHE_SECONDS, tags: ["developer"] }
);

export async function getCachedDeveloper(): Promise<DeveloperDTO | null> {
  try {
    return await getCachedDeveloperInner();
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ getCachedDeveloper failed:", e?.message || e);
    }
    return null;
  }
}