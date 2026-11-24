"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function CatalogFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const { catalog } = messages[useLocale()];
  const current = params.get("category") ?? "all";
  const kind = params.get("kind") ?? "all";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.push(query ? `/catalog?${query}` : "/catalog");
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.entries(catalog.categories).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => update("category", id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              current === id
                ? "bg-sky-700 text-white"
                : "bg-white text-slate-600 ring-1 ring-sky-100 hover:bg-sky-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(catalog.kinds).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => update("kind", id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              kind === id
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-sky-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
