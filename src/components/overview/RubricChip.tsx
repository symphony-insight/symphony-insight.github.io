import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { getDomainForRubric, getDomainName } from "../../lib/assessmentDomains";
import type { DisplayRubric } from "../../lib/displayRubrics";
import type { MetricTrend, RubricEvidence } from "../../lib/rubricEvidence";
import { useAppStore } from "../../store/useAppStore";

const toneChip: Record<DisplayRubric["tone"], string> = {
  low: "bg-coral text-white",
  medium: "bg-sun text-white",
  stable: "bg-tide text-white",
  strong: "bg-moss text-white"
};

const toneDot: Record<DisplayRubric["tone"], string> = {
  low: "bg-coral",
  medium: "bg-sun",
  stable: "bg-tide",
  strong: "bg-moss"
};

const toneText: Record<DisplayRubric["tone"], string> = {
  low: "text-coral-600",
  medium: "text-[#a9802f]",
  stable: "text-tide-600",
  strong: "text-moss-600"
};

function TrendIcon({ trend }: { trend: MetricTrend }) {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5 text-moss-600" aria-hidden="true" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5 text-coral-600" aria-hidden="true" />;
  return <Minus className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />;
}

export function RubricChip({
  rubric,
  evidence,
  teacherName
}: {
  rubric: DisplayRubric;
  evidence?: RubricEvidence;
  teacherName?: string;
}) {
  const language = useAppStore((state) => state.language);
  const domain = getDomainForRubric(rubric.id);
  return (
    <details className="rubric-card group rounded-xl border border-white/70 bg-white/85 shadow-card backdrop-blur">
      <summary className="flex cursor-pointer items-center gap-3 px-4 py-3 marker:content-['']">
        <span className={`h-2 w-2 shrink-0 rounded-full ${toneDot[rubric.tone]}`} aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">{rubric.title}</span>
          <span className={`text-xs font-semibold ${toneText[rubric.tone]}`}>{rubric.statusLabel}</span>
        </span>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${toneChip[rubric.tone]}`}>
          {rubric.scoreLabel}
        </span>
        <span className="shrink-0 text-xs text-ink-muted transition group-open:rotate-180">⌄</span>
      </summary>

      <div className="space-y-3 border-t border-stone-100 px-4 py-3">
        <p className="text-sm leading-6 text-ink-soft">{rubric.plainExplanation}</p>

        {evidence ? (
          <>
            <div>
              <p className="text-xs font-bold text-ink-muted">关键变化</p>
              <ul className="mt-1.5 space-y-1">
                {evidence.metricChanges.map((change) => (
                  <li key={change.label} className="flex items-center gap-2 text-xs text-ink-soft">
                    <TrendIcon trend={change.trend} />
                    <span className="font-medium">{change.label}</span>
                    <span className="ml-auto font-semibold tabular-nums">
                      {change.from} <span className="text-ink-muted">→</span> {change.to}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
              <span className="text-ink-muted">
                来自 <span className="font-semibold text-ink-soft">{evidence.evidenceSessions.map((n) => `第 ${n} 次`).join(" / ")}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold ${
                  evidence.teacherConfirmed ? "bg-moss-50 text-moss-600" : "bg-coral-50 text-coral-600"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${evidence.teacherConfirmed ? "bg-moss" : "bg-coral"}`} aria-hidden="true" />
                {evidence.teacherConfirmed ? `${teacherName ?? "老师"}已看` : "待确认"}
              </span>
              {domain ? (
                <span className="text-ink-muted">
                  方向 <span className="rounded-md bg-tide-50 px-1.5 py-0.5 font-medium text-tide-600">{getDomainName(domain, language)}</span>
                </span>
              ) : null}
              <span className="text-ink-muted">
                参照 <span className="rounded-md bg-paper-warm/80 px-1.5 py-0.5 font-medium text-ink-soft">{evidence.frameworkLabel}</span>
              </span>
            </div>
          </>
        ) : null}
      </div>
    </details>
  );
}
