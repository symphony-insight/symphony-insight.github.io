import type { DisplayRubric } from "../../lib/displayRubrics";

const toneBar: Record<DisplayRubric["tone"], string> = {
  low: "from-coral to-coral-600",
  medium: "from-sun to-[#c79a3f]",
  stable: "from-tide to-tide-600",
  strong: "from-moss to-moss-600"
};

const toneChip: Record<DisplayRubric["tone"], string> = {
  low: "bg-coral text-white",
  medium: "bg-sun text-white",
  stable: "bg-tide text-white",
  strong: "bg-moss text-white"
};

const toneText: Record<DisplayRubric["tone"], string> = {
  low: "text-coral-600",
  medium: "text-[#a9802f]",
  stable: "text-tide-600",
  strong: "text-moss-600"
};

export function ObservationScoreCard({ rubric }: { rubric: DisplayRubric }) {
  return (
    <article className="observation-score-card rounded-2xl border border-white/70 bg-white/85 p-4 shadow-card backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold">{rubric.title}</h3>
          <p className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${toneText[rubric.tone]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {rubric.statusLabel}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-extrabold ${toneChip[rubric.tone]}`}>
          {rubric.scoreLabel}
        </span>
      </div>

      <p className="mt-3 min-h-16 text-sm leading-6 text-ink-soft">{rubric.plainExplanation}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
          <span>{rubric.sourceLabel}</span>
          <span className="max-w-[60%] truncate text-right">{rubric.primaryObservable}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${toneBar[rubric.tone]}`}
            style={{ width: `${Math.max(8, (rubric.score / 5) * 100)}%` }}
          />
        </div>
      </div>

      <details className="group mt-4 rounded-xl bg-paper-warm/70 px-3 py-2 text-sm">
        <summary className="flex cursor-pointer items-center justify-between font-semibold text-ink-soft marker:content-['']">
          分数怎么看
          <span className="text-xs text-ink-muted transition group-open:rotate-180">⌄</span>
        </summary>
        <ul className="mt-2 space-y-1 text-xs leading-5 text-ink-muted">
          {rubric.guide.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}
