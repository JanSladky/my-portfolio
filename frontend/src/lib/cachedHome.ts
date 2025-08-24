// frontend/src/lib/cachedHome.ts
// Odolný fetch + jednotné typy pro homepage (Home)

import { unstable_cache } from "next/cache";
import { strapiFetch } from "./strapi";

export type HomeImage = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
};

// Ikony pro Služby (ServiceCard)
export type IconName = "file" | "sitemap" | "wpforms" | "edit";

// Ikony pro „Jak probíhá spolupráce“ (StepCard)
export type StepIconName = "handshake" | "ruler" | "comments" | "bug" | "plane";

export type HomeService = {
  title?: string;
  icon?: IconName;
  bullets?: Array<{ text?: string }>;
};

export type HomeStep = {
  title?: string;
  text?: string;
  icon?: StepIconName;
};

export type HomeAttrs = {
  // hero
  home_intro?: string;
  home_name?: string;
  home_subtitle?: string;
  home_description?: string;
  home_button_text?: string;

  // cards (technologie / responzivita / CMS)
  cards_heading?: string;
  tech_title?: string;
  tech_text?: string;
  responzivita_title?: string;
  responzivita_text?: string;
  cms_title?: string;
  cms_text?: string;

  // images
  tech_image?: HomeImage;
  responzivita_image?: HomeImage;
  cms_image?: HomeImage;

  // services
  services_heading?: string;
  services_button_text?: string;
  services?: HomeService[];

  // cooperation (steps)
  collaboration_heading?: string;
  collaboration_button_text?: string;
  steps?: HomeStep[];
};

function imgOut(input: any): HomeImage {
  const a = input?.data?.attributes ?? input ?? {};
  return {
    url: a?.url || "",
    alt: a?.alternativeText || "",
    width: a?.width,
    height: a?.height,
  };
}

function normalizeIcon(val: any): IconName | undefined {
  // ochrana proti staré hodnotě "wordpress"
  if (val === "wordpress") return "edit";
  if (val === "file" || val === "sitemap" || val === "wpforms" || val === "edit") return val;
  return undefined;
}

function normalizeStepIcon(val: any): StepIconName | undefined {
  if (val === "handshake" || val === "ruler" || val === "comments" || val === "bug" || val === "plane") return val;
  return undefined;
}

function unifyHomePayload(input: any): HomeAttrs {
  const a = input?.attributes ? input.attributes : input || {};
  return {
    // hero
    home_intro: a.home_intro ?? "",
    home_name: a.home_name ?? "",
    home_subtitle: a.home_subtitle ?? "",
    home_description: a.home_description ?? "",
    home_button_text: a.home_button_text ?? "",

    // cards
    cards_heading: a.cards_heading ?? "",
    tech_title: a.tech_title ?? "",
    tech_text: a.tech_text ?? "",
    responzivita_title: a.responzivita_title ?? "",
    responzivita_text: a.responzivita_text ?? "",
    cms_title: a.cms_title ?? "",
    cms_text: a.cms_text ?? "",

    // images
    tech_image: imgOut(a.tech_image),
    responzivita_image: imgOut(a.responzivita_image),
    cms_image: imgOut(a.cms_image),

    // services
    services_heading: a.services_heading ?? "",
    services_button_text: a.services_button_text ?? "",
    services: Array.isArray(a.services)
      ? a.services.map((s: any) => ({
          title: s?.title ?? "",
          icon: normalizeIcon(s?.icon),
          bullets: Array.isArray(s?.bullets) ? s.bullets.map((b: any) => ({ text: b?.text ?? "" })) : [],
        }))
      : [],

    // cooperation steps
    collaboration_heading: a.collaboration_heading ?? "",
    collaboration_button_text: a.collaboration_button_text ?? "",
    steps: Array.isArray(a.steps)
      ? a.steps.map((st: any) => ({
          title: st?.title ?? "",
          text: st?.text ?? "",
          icon: normalizeStepIcon(st?.icon),
        }))
      : [],
  };
}

async function fetchHomeStrict() {
  const res = await strapiFetch<{ data: any }>({
    path: "/api/home",
    query: {
      populate: {
        // obrázky
        tech_image: { fields: ["url", "alternativeText", "width", "height"] },
        responzivita_image: { fields: ["url", "alternativeText", "width", "height"] },
        cms_image: { fields: ["url", "alternativeText", "width", "height"] },

        // služby
        services: {
          fields: ["title", "icon"],
          populate: { bullets: { fields: ["text"] } },
        },

        // kroky spolupráce
        steps: { fields: ["title", "text", "icon"] },
      },
    },
    next: { tags: ["home"], revalidate: 600 },
  });

  const item = res?.data;
  if (!item) throw new Error("Home not found");

  const home = unifyHomePayload(item);

  const hasAny = Object.values(home).some((v) =>
    typeof v === "string" ? v.trim() : v && typeof v === "object"
  );
  if (!hasAny) throw new Error("Invalid home payload");

  return { home };
}

const getCachedHomeInner = unstable_cache(
  async () => await fetchHomeStrict(),
  ["home"],
  { revalidate: 600, tags: ["home"] }
);

export async function getCachedHome() {
  try {
    return await getCachedHomeInner();
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ getCachedHome failed:", e?.message || e);
    }
    return null;
  }
}