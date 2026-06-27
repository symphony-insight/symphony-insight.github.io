import type { DisplayRubric } from "../../lib/displayRubrics";

const toneClass: Record<DisplayRubric["tone"], string> = {
  low: "bg-coral",
  medium: "bg-amber-500",
  stable: "bg-tide",
  strong: "bg-moss"
};

export function ObservationScoreCard({ rubric }: { rubric: DisplayRubric }) {
  return (
    <article className="observation-score-card rounded-lg border border-white/70 bg-white/80 p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold">{rubric.title}</h3>
          <p className="mt-1 text-sm font-semibold text-coral">{rubric.statusLabel}</p>
        </div>
        <span className="rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">{rubric.scoreLabel}</span>
      </div>

      <p className="mt-3 min-h-16 text-sm leading-6 text-stone-600">{rubric.plainExplanation}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500">
          <span>{rubric.sourceLabel}</span>
          <span>{rubric.primaryObservable}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-stone-100">
          <div className={`h-full rounded-full ${toneClass[rubric.tone]}`} style={{ width: `${Math.max(8, (rubric.score / 5) * 100)}%` }} />
        </div>
      </div>

      <details className="mt-4 rounded-md bg-paper/80 px-3 py-2 text-sm">
        <summary className="cursor-pointer font-semibold text-stone-700">评分怎么看</summary>
        <ul className="mt-2 space-y-1 text-xs leading-5 text-stone-600">
          {rubric.guide.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}
