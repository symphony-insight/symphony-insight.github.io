import { Eye, Sparkles } from "lucide-react";

type SettingFitPanelProps = {
  title: string;
  fitLabel: string;
  evidence: string;
  nextStep: string;
  score: number;
  tone?: "moss" | "coral" | "tide";
};

const toneBar: Record<"moss" | "coral" | "tide", string> = {
  moss: "from-moss to-moss-600",
  coral: "from-coral to-coral-600",
  tide: "from-tide to-tide-600"
};

const toneText: Record<"moss" | "coral" | "tide", string> = {
  moss: "text-moss-600",
  coral: "text-coral-600",
  tide: "text-tide-600"
};

const toneChip: Record<"moss" | "coral" | "tide", string> = {
  moss: "bg-moss-50 text-moss-600",
  coral: "bg-coral-50 text-coral-600",
  tide: "bg-tide-50 text-tide-600"
};

export function SettingFitPanel({ title, fitLabel, evidence, nextStep, score, tone = "tide" }: SettingFitPanelProps) {
  return (
    <article className="soft-rise rounded-2xl border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-extrabold tracking-tightish">{title}</h2>
          <p className={`mt-2 flex items-center gap-1.5 text-sm font-semibold ${toneText[tone]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {fitLabel}
          </p>
        </div>
        <span className={`rounded-2xl px-4 py-2 text-center ${toneChip[tone]}`}>
          <span className="block font-display text-2xl font-extrabold leading-none">{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">适配度</span>
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100">
        <div className={`h-full rounded-full bg-gradient-to-r ${toneBar[tone]}`} style={{ width: `${score}%` }} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/70 bg-paper-warm/70 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-ink-muted">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            这次看到
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{evidence}</p>
        </div>
        <div className="rounded-xl border border-white/70 bg-paper-warm/70 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-ink-muted">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            下次可以这样试
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{nextStep}</p>
        </div>
      </div>
    </article>
  );
}
