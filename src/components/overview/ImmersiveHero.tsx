import { Search, SlidersHorizontal } from "lucide-react";
import type { ChangeEvent } from "react";

type SummaryItem = {
  label: string;
  value: string;
  caption: string;
};

export function ImmersiveHero({
  childName,
  titleSuffix,
  intro,
  summary,
  searchQuery,
  onSearchChange
}: {
  childName: string;
  titleSuffix: string;
  intro: string;
  summary: SummaryItem[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value);

  return (
    <section className="immersive-hero overflow-hidden rounded-lg border border-white/70 bg-white/65 p-5 shadow-premium md:p-7">
      <div className="relative z-10 grid gap-6 xl:grid-cols-[1fr_440px]">
        <div className="flex min-h-[280px] flex-col justify-between">
          <div>
            <p className="text-sm font-semibold text-coral">共鸣观察台</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              {childName}
              {titleSuffix}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">{intro}</p>
          </div>

          <label className="mt-8 flex max-w-2xl items-center gap-3 rounded-full border border-white/80 bg-white/90 px-4 py-3 shadow-soft" aria-label="搜索观察内容">
            <Search className="h-5 w-5 text-stone-500" aria-hidden="true" />
            <input
              type="search"
              role="searchbox"
              aria-label="搜索观察内容"
              value={searchQuery}
              onChange={handleChange}
              placeholder="搜索观察内容"
              className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-stone-400"
            />
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </span>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {summary.map((item) => (
            <div key={item.label} className="summary-glass-card rounded-lg border border-white/75 bg-white/70 p-4">
              <p className="text-sm font-semibold text-stone-500">{item.label}</p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
              <p className="mt-2 text-xs leading-5 text-stone-500">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
