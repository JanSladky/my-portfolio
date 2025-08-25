"use client";

import Image from "next/image";
import type { StackItem } from "@/lib/cachedDeveloper";

const ICONS: Record<StackItem["icon"], string> = {
  html: "/stack/html.svg",
  css: "/stack/css.svg",
  sass: "/stack/sass.svg",
  js: "/stack/js.svg",
  react: "/stack/react.svg",
  firebase: "/stack/firebase.svg",
  github: "/stack/github.svg",
  gitlab: "/stack/gitlab.svg",
  tailwind: "/stack/tailwind.svg",
  nextjs: "/stack/nextjs.svg",
  bootstrap: "/stack/bootstrap.svg",
  vercel: "/stack/vercel.svg"
};

export default function DevStack({ title, items }: { title: string; items: StackItem[] }) {
  if (!items?.length) return null;

  return (
    <section className="mb-16">
      <h3 className="text-2xl font-bold mb-6">{title}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((it, i) => {
          const src = ICONS[it.icon] ?? "/stack/react.svg";
          return (
            <div
              key={`${it.icon}-${i}`}
              className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8"
            >
              <div className="relative w-16 h-16 mb-4">
                <Image src={src} alt={it.label} fill sizes="64px" />
              </div>
              <div className="text-sm font-medium text-slate-700">{it.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}