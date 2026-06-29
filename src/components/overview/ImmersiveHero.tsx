import { Activity, Music2, Search, Sparkles, UserCheck } from "lucide-react";
import type { ChangeEvent } from "react";

type SummaryItem = {
  label: string;
  value: string;
  caption: string;
};

const accents = [
  { bar: "from-tide to-tide-600", chip: "bg-tide-50 text-tide-600", Icon: Activity },
  { bar: "from-moss to-moss-600", chip: "bg-moss-50 text-moss-600", Icon: Music2 },
  { bar: "from-coral to-coral-600", chip: "bg-coral-50 text-coral-600", Icon: Sparkles },
  { bar: "from-sun to-[#c79a3f]", chip: "bg-sun-50 text-[#a9802f]", Icon: UserCheck }
] as const;

export function ImmersiveHero({
  childName,
  titleSuffix,
  intro,
  summary,
  searchQuery,
  onSearchChange,
  kicker,
  searchLabel,
  searchPlaceholder,
  filterLabel
}: {
  childName: string;
  titleSuffix: string;
  intro: string;
  summary: SummaryItem[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  kicker: string;
  searchLabel: string;
  searchPlaceholder: string;
  filterLabel: string;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value);

  return (
    <section className="immersive-hero overflow-hidden rounded-3xl p-6 md:p-9">
      <div className="relative z-10 grid gap-8 xl:grid-cols-[1fr_460px]">
        <div className="flex min-h-[300px] flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-coral-600 ring-1 ring-inset ring-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" aria-hidden="true" />
              {kicker}
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-tightish md:text-6xl">
              {childName}
              <span className="text-ink-soft">{titleSuffix}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted md:text-lg">{intro}</p>
          </div>

          <label
            className="search-pill mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/80 bg-white/92 px-4 py-3 shadow-card transition-all duration-200"
            aria-label={searchLabel}
          >
            <Search className="h-5 w-5 text-tide" aria-hidden="true" />
            <input
              type="search"
              role="searchbox"
              aria-label={searchLabel}
              value={searchQuery}
              onChange={handleChange}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-stone-400"
            />
            <span className="hidden shrink-0 rounded-lg bg-paper px-2.5 py-1 text-xs font-semibold text-ink-muted sm:inline">
              {filterLabel}
            </span>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {summary.map((item, index) => {
            const accent = accents[index % accents.length];
            const Icon = accent.Icon;
            return (
              <div
                key={item.label}
                className="summary-glass-card relative overflow-hidden rounded-2xl border border-white/75 bg-white/72 p-4 backdrop-blur"
              >
                <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.bar}`} aria-hidden="true" />
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink-muted">{item.label}</p>
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${accent.chip}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 font-display text-3xl font-extrabold tracking-tightish">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-ink-muted">{item.caption}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
