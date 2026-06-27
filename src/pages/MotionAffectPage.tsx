import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { MotionAffectMatrix } from "../components/charts/MotionAffectMatrix";
import { RecoveryPatternChart } from "../components/charts/RecoveryPatternChart";
import { Card } from "../components/ui/Card";
import { t } from "../i18n";
import { useAppStore } from "../store/useAppStore";
import type { LongitudinalInsight, SessionSummary } from "../types/domain";

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

  if (sessions.length === 0) return <div>{language === "zh" ? "动作-情绪关联加载中" : "Loading motion-affect view"}</div>;

  const highBrightness = sessions.find((session) => session.stimulus === "high_brightness");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-coral">动作-情绪关联</p>
        <h1 className="mt-1 text-3xl font-bold">{t(language, "motionAffectTitle")}</h1>
        <p className="mt-2 max-w-3xl text-stone-600">{t(language, "motionAffectIntro")}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <MotionAffectMatrix sessions={sessions} />
        <RecoveryPatternChart sessions={sessions} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <h2 className="text-lg font-bold">过载前 30 秒观察信号</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {highBrightness?.story} 该片段显示视觉刺激强度、动作平滑度下降和反应延迟增加同时出现，建议在下一次活动中降低亮度并保留暂停权。
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-sm text-stone-500">反应延迟</p>
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
                <p key={insight.id}>{insight.statement}</p>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
