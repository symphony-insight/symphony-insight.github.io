import { useMemo, useState } from "react";
import type { DisplayRubric } from "../../lib/displayRubrics";

const toneColors: Record<DisplayRubric["tone"], string> = {
  low: "#d97c65",
  medium: "#d9b365",
  stable: "#4b8f9f",
  strong: "#6f8f7c"
};

const toneText: Record<DisplayRubric["tone"], string> = {
  low: "text-coral-600",
  medium: "text-[#a9802f]",
  stable: "text-tide-600",
  strong: "text-moss-600"
};

const CENTER = 140;
const RADIUS = 102;

function polarToCartesian(center: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(angleInRadians),
    y: center + radius * Math.sin(angleInRadians)
  };
}

function describeArc(center: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(center, radius, endAngle);
  const end = polarToCartesian(center, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

export function ObservationScoreRing({ rubrics }: { rubrics: DisplayRubric[] }) {
  const [activeId, setActiveId] = useState(rubrics[0]?.id);
  const active = rubrics.find((rubric) => rubric.id === activeId) ?? rubrics[0];
  const average = useMemo(() => {
    if (rubrics.length === 0) return 0;
    return rubrics.reduce((sum, rubric) => sum + rubric.score, 0) / rubrics.length;
  }, [rubrics]);

  const needSupport = rubrics.filter((rubric) => rubric.score < 3.5).length;
  const conclusion = average >= 4 ? "比较稳" : average >= 3 ? "整体平稳" : "还需多帮一点";

  const segLen = (2 * Math.PI * RADIUS) / Math.max(rubrics.length, 1);

  return (
    <section className="surface ring-card rounded-2xl p-6 shadow-float">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-tide-600">整体观察</p>
          <h2 className="mt-1 font-display text-xl font-extrabold tracking-tightish">9 项观察总览</h2>
          <p className="mt-1 text-sm leading-6 text-ink-muted">看哪些地方已经比较稳，哪些下次还要多帮一点。</p>
        </div>
      </div>

      <div className="mt-6 grid items-center gap-6 md:grid-cols-[280px_1fr]">
        <div className="relative mx-auto h-[280px] w-[280px]">
          <div className="ring-glow absolute inset-6 rounded-full" aria-hidden="true" />
          <svg viewBox="0 0 280 280" className="ring-draw h-full w-full" aria-label="9 项观察总览评分图">
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(35,50,56,0.06)" strokeWidth="26" />
            {rubrics.map((rubric, index) => {
              const gap = 3.2;
              const segment = 360 / rubrics.length;
              const start = index * segment + gap;
              const end = (index + 1) * segment - gap;
              const isActive = activeId === rubric.id;
              const opacity = 0.42 + (rubric.score / 5) * 0.58;
              return (
                <path
                  key={rubric.id}
                  className="ring-segment"
                  style={{ "--len": `${segLen}px` } as React.CSSProperties}
                  d={describeArc(CENTER, RADIUS, start, end)}
                  fill="none"
                  stroke={toneColors[rubric.tone]}
                  strokeLinecap="round"
                  strokeWidth={isActive ? 30 : 24}
                  opacity={isActive ? 1 : opacity}
                  role="button"
                  tabIndex={0}
                  aria-label={`${rubric.title} ${rubric.scoreLabel}`}
                  onFocus={() => setActiveId(rubric.id)}
                  onMouseEnter={() => setActiveId(rubric.id)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">平均分</p>
            <p className="font-display text-5xl font-extrabold leading-none tracking-tightish">{average.toFixed(1)}</p>
            <p className="mt-1 text-xs text-ink-muted">满分 5 分</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-tide-50 px-2.5 py-1 text-xs font-bold text-tide-600">
              {conclusion}
              {needSupport > 0 ? <span className="text-ink-muted">· {needSupport} 项需支持</span> : null}
            </p>
          </div>
        </div>

        {active ? (
          <div className="rounded-2xl border border-white/70 bg-paper-warm/80 p-5">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: toneColors[active.tone] }}
                aria-hidden="true"
              />
              <p className={`text-sm font-bold ${toneText[active.tone]}`}>{active.statusLabel}</p>
            </div>
            <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tightish">{active.title}</h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{active.plainExplanation}</p>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white/85 px-4 py-3">
              <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-ink-muted">
                {active.sourceLabel}
              </span>
              <span
                className="rounded-full px-3 py-1 text-sm font-extrabold text-white"
                style={{ backgroundColor: toneColors[active.tone] }}
              >
                {active.scoreLabel}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
