import { useMemo, useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { DisplayRubric } from "../../lib/displayRubrics";
import { useAppStore } from "../../store/useAppStore";

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

// 短轴标签，避免雷达图角标过长
const shortLabels: Record<string, string> = {
  join: "愿意参加",
  choice: "说出选择",
  focus: "保持兴趣",
  respond: "回应别人",
  create: "自己表达",
  recover: "不舒服后回来",
  access: "操作顺手",
  setting: "环境舒适",
  goal: "小目标"
};

const shortLabelsEn: Record<string, string> = {
  join: "Joining",
  choice: "Choice",
  focus: "Interest",
  respond: "Response",
  create: "Expression",
  recover: "Return",
  access: "Input",
  setting: "Comfort",
  goal: "Goal"
};

function AxisTick({ payload, x, y, cx, cy, activeLabel }: any) {
  const isActive = payload.value === activeLabel;
  const dx = x - cx;
  const dy = y - cy;
  const anchor = Math.abs(dx) < 12 ? "middle" : dx > 0 ? "start" : "end";
  return (
    <text
      x={x + (dx > 0 ? 4 : dx < 0 ? -4 : 0)}
      y={y + (dy > 0 ? 8 : 0)}
      textAnchor={anchor}
      dominantBaseline="middle"
      className={isActive ? "fill-ink text-[11px] font-bold" : "fill-[#6b7d83] text-[11px] font-semibold"}
    >
      {payload.value}
    </text>
  );
}

export function ObservationRadar({ rubrics, sessionCount = 0 }: { rubrics: DisplayRubric[]; sessionCount?: number }) {
  const language = useAppStore((state) => state.language);
  const [activeId, setActiveId] = useState(rubrics[0]?.id);
  const active = rubrics.find((rubric) => rubric.id === activeId) ?? rubrics[0];

  const average = useMemo(() => {
    if (rubrics.length === 0) return 0;
    return rubrics.reduce((sum, rubric) => sum + rubric.score, 0) / rubrics.length;
  }, [rubrics]);

  const needSupport = rubrics.filter((rubric) => rubric.score < 3.5).length;
  const conclusion =
    language === "zh"
      ? average >= 4
        ? "比较稳"
        : average >= 3
          ? "整体平稳"
          : "还需多帮一点"
      : average >= 4
        ? "fairly steady"
        : average >= 3
          ? "generally steady"
          : "needs more support";
  const labels = language === "zh" ? shortLabels : shortLabelsEn;

  const data = rubrics.map((rubric) => ({
    id: rubric.id,
    label: labels[rubric.id] ?? rubric.title,
    score: rubric.score
  }));

  const activeLabel = active ? labels[active.id] ?? active.title : "";

  return (
    <section className="surface rounded-2xl p-6 shadow-float">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-tide-600">{language === "zh" ? "整体观察" : "Overall view"}</p>
          <h2 className="mt-1 font-display text-xl font-extrabold tracking-tightish">{language === "zh" ? "9 项观察总览" : "Nine-question overview"}</h2>
          <p className="mt-1 text-sm leading-6 text-ink-muted">
            {language === "zh" ? "一眼看出哪些地方已经比较稳，哪些下次还要多帮一点。" : "A quick view of what is steady and what may need more support next time."}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-tide-50 px-3 py-1 text-sm font-extrabold text-tide-600">
          {average.toFixed(1)}<span className="text-xs font-bold text-ink-muted">/5</span>
        </span>
      </div>

      <div className="mt-4 grid items-center gap-5 md:grid-cols-[1fr_240px]">
        <div className="relative h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%" margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
              <PolarGrid stroke="rgba(35,50,56,0.1)" />
              <PolarAngleAxis
                dataKey="label"
                tick={(props) => <AxisTick {...props} activeLabel={activeLabel} />}
              />
              <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={false} axisLine={false} />
              <Radar
                dataKey="score"
                stroke="#4b8f9f"
                strokeWidth={2}
                fill="#4b8f9f"
                fillOpacity={0.22}
                dot={{ r: 3, fill: "#4b8f9f" }}
                isAnimationActive
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-ink-muted backdrop-blur">
              {language === "zh" ? "本轮观察" : "Current cycle"} · {conclusion}
              {needSupport > 0 ? (language === "zh" ? ` · ${needSupport} 项需支持` : ` · ${needSupport} need support`) : ""}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {rubrics.map((rubric) => {
              const isActive = rubric.id === activeId;
              return (
                <button
                  key={rubric.id}
                  type="button"
                  onClick={() => setActiveId(rubric.id)}
                  onMouseEnter={() => setActiveId(rubric.id)}
                  aria-pressed={isActive}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                    isActive ? "bg-ink text-white" : "bg-paper-warm/70 text-ink-muted hover:bg-paper-warm"
                  }`}
                >
                  {labels[rubric.id] ?? rubric.title}
                </button>
              );
            })}
          </div>

          {active ? (
            <div className="rounded-2xl border border-white/70 bg-paper-warm/70 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: toneColors[active.tone] }} aria-hidden="true" />
                <p className={`text-sm font-bold ${toneText[active.tone]}`}>{active.statusLabel}</p>
                <span
                  className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white"
                  style={{ backgroundColor: toneColors[active.tone] }}
                >
                  {active.scoreLabel}
                </span>
              </div>
              <h3 className="mt-2 font-display text-base font-extrabold tracking-tightish">{active.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{active.plainExplanation}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
