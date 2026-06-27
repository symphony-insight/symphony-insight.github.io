import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { Card } from "../components/ui/Card";
import { SettingFitPanel } from "../components/state/SettingFitPanel";
import { t } from "../i18n";
import { useAppStore } from "../store/useAppStore";
import type { LongitudinalInsight, SessionSummary } from "../types/domain";

function formatObservationText(text: string) {
  return text.replace(/创作素材/g, "创作片段");
}

export function MotionAffectPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [insights, setInsights] = useState<LongitudinalInsight[]>([]);
  const { language, selectedChildId } = useAppStore();

  useEffect(() => {
    Promise.all([mockApi.getSessions(selectedChildId), mockApi.getInsights(selectedChildId)]).then(([sessionData, insightData]) => {
      setSessions(sessionData);
      setInsights(insightData);
    });
  }, [selectedChildId]);

  if (sessions.length === 0) return <div>{language === "zh" ? "状态变化加载中" : "Loading state view"}</div>;

  const highBrightness = sessions.find((session) => session.stimulus === "high_brightness");
  const lowSupport = sessions.find((session) => session.stimulus === "low_brightness");
  const slowTempo = sessions.find((session) => session.stimulus === "slow_tempo");

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-sm font-semibold text-coral">{t(language, "motionAffect")}</p>
        <h1 className="mt-1 text-3xl font-bold">{t(language, "motionAffectTitle")}</h1>
        <p className="mt-2 max-w-3xl text-stone-600">{t(language, "motionAffectIntro")}</p>
      </div>

      <div className="grid gap-4">
        <SettingFitPanel
          title="音乐和节奏"
          fitLabel="更适合：熟悉旋律、慢节奏"
          evidence={`${formatObservationText(slowTempo?.story ?? "慢节奏活动中，孩子更容易停留在活动里。")} 主动动作和创作片段更稳定。`}
          nextStep="下次先用慢节奏开场，再逐步增加新的声音变化。"
          score={86}
          tone="moss"
        />
        <SettingFitPanel
          title="画面亮度"
          fitLabel="需要调低：高亮动画"
          evidence={`${formatObservationText(highBrightness?.story ?? "高亮动画后出现退出。")} 这类画面建议先由老师复核。`}
          nextStep="默认使用低亮度反馈，必要时再短时间尝试更明显的视觉提示。"
          score={62}
          tone="coral"
        />
        <SettingFitPanel
          title="老师支持方式"
          fitLabel="更适合：保留暂停权和重新开始"
          evidence={`${formatObservationText(lowSupport?.story ?? "降低负担后更容易回到活动。")} 清楚预告和暂停选择能降低活动压力。`}
          nextStep="每次活动开始前先说明可以暂停，结束前保留一次再试机会。"
          score={78}
          tone="tide"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <h2 className="text-lg font-bold">高亮动画需要复核</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {formatObservationText(highBrightness?.story ?? "")} 该片段显示画面强度变高后，孩子更容易退出活动。下一次建议降低亮度并保留暂停权，仅作为老师复核材料。
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-sm text-stone-500">等待更久</p>
              <p className="mt-1 text-2xl font-bold">{highBrightness?.motion.responseLatencyMs}ms</p>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-sm text-stone-500">老师介入</p>
              <p className="mt-1 text-2xl font-bold">{highBrightness?.affect.teacherInterventionCount} 次</p>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-sm text-stone-500">退出记录</p>
              <p className="mt-1 text-2xl font-bold">{highBrightness?.participation.refusalCount} 次</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-bold">复核提示</h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-stone-600">
            {insights
              .filter((insight) => insight.claimLevel === "requires_professional_review")
              .map((insight) => (
                <p key={insight.id}>{formatObservationText(insight.statement)}</p>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
