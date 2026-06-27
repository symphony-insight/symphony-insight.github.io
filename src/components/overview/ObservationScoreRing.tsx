import { useMemo, useState } from "react";
import type { DisplayRubric } from "../../lib/displayRubrics";

const toneColors: Record<DisplayRubric["tone"], string> = {
  low: "#d97c65",
  medium: "#d9b365",
  stable: "#4b8f9f",
  strong: "#6f8f7c"
};

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

  return (
    <section className="score-ring-panel rounded-lg border border-white/70 bg-white/80 p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">9 项观察总览</h2>
          <p className="mt-1 text-sm leading-6 text-stone-500">看哪些地方已经比较稳，哪些地方下次还要多帮一点。</p>
        </div>
        <div className="rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">{average.toFixed(1)}/5</div>
      </div>

      <div className="mt-5 grid items-center gap-5 md:grid-cols-[260px_1fr]">
        <div className="relative mx-auto h-64 w-64">
          <svg viewBox="0 0 260 260" className="h-full w-full" aria-label="9 项观察总览评分图">
            <circle cx="130" cy="130" r="92" fill="none" stroke="rgba(35,50,56,0.08)" strokeWidth="28" />
            {rubrics.map((rubric, index) => {
              const gap = 3;
              const segment = 360 / rubrics.length;
              const start = index * segment + gap;
              const end = (index + 1) * segment - gap;
              const opacity = 0.35 + (rubric.score / 5) * 0.65;
              return (
                <path
                  key={rubric.id}
                  d={describeArc(130, 92, start, end)}
                  fill="none"
                  stroke={toneColors[rubric.tone]}
                  strokeLinecap="round"
                  strokeWidth="28"
                  opacity={activeId === rubric.id ? 1 : opacity}
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
            <p className="text-xs font-bold text-stone-500">平均分</p>
            <p className="text-4xl font-bold">{average.toFixed(1)}</p>
            <p className="mt-1 text-xs text-stone-500">满分 5 分</p>
          </div>
        </div>

        {active ? (
          <div className="rounded-lg bg-paper/70 p-4">
            <p className="text-sm font-bold text-coral">{active.statusLabel}</p>
            <h3 className="mt-2 text-2xl font-bold">{active.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">{active.plainExplanation}</p>
            <div className="mt-4 flex items-center justify-between rounded-md bg-white/80 px-3 py-2 text-sm">
              <span className="font-semibold">{active.sourceLabel}</span>
              <span className="font-bold">{active.scoreLabel}</span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
