'use client';

import StackIcon from "./StackIcon";
import type { StackItem } from "@/lib/cachedDeveloper";

export default function DevStack({ title, items }: { title: string; items: StackItem[] }) {
  if (!items?.length) return null;

  return (
    <section className="mb-16">
      <h3 className="text-2xl font-bold mb-6">{title}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <div
            key={`${it.icon}-${i}`}
            className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8"
          >
            <StackIcon name={it.icon} alt={it.label} size={64} />
            <div className="mt-3 text-sm font-medium text-slate-700">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}