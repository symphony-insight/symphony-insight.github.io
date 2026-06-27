type SettingFitPanelProps = {
  title: string;
  fitLabel: string;
  evidence: string;
  nextStep: string;
  score: number;
  tone?: "moss" | "coral" | "tide";
};

const toneClass = {
  moss: "bg-moss",
  coral: "bg-coral",
  tide: "bg-tide"
};

export function SettingFitPanel({ title, fitLabel, evidence, nextStep, score, tone = "tide" }: SettingFitPanelProps) {
  return (
    <article className="rounded-lg border border-white/70 bg-white/80 p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-2 text-sm font-semibold text-coral">{fitLabel}</p>
        </div>
        <span className="rounded-full bg-paper px-3 py-1 text-sm font-bold text-stone-700">{score}%</span>
      </div>

      <div className="mt-5 h-2 rounded-full bg-stone-100">
        <div className={`h-full rounded-full ${toneClass[tone]}`} style={{ width: `${score}%` }} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-md bg-paper/80 p-3">
          <p className="text-xs font-bold text-stone-500">看到的情况</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{evidence}</p>
        </div>
        <div className="rounded-md bg-paper/80 p-3">
          <p className="text-xs font-bold text-stone-500">下次怎么做</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{nextStep}</p>
        </div>
      </div>
    </article>
  );
}
