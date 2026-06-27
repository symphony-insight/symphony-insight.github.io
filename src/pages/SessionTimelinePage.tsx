import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { SessionTimeline } from "../components/session/SessionTimeline";
import { Card } from "../components/ui/Card";
import { t } from "../i18n";
import { useAppStore } from "../store/useAppStore";
import type { SessionSummary } from "../types/domain";

export function SessionTimelinePage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const { language, selectedChildId } = useAppStore();

  useEffect(() => {
    mockApi.getSessions(selectedChildId).then(setSessions);
  }, [selectedChildId]);

  if (sessions.length === 0) return <div>{language === "zh" ? "Session 时间轴加载中" : "Loading sessions"}</div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-coral">Session 时间轴</p>
        <h1 className="mt-1 text-3xl font-bold">{t(language, "sessionsTitle")}</h1>
        <p className="mt-2 max-w-3xl text-stone-600">{t(language, "sessionsIntro")}</p>
      </div>
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <p className="text-sm text-stone-500">阶段覆盖</p>
            <p className="mt-1 text-xl font-bold">warmup 到 reveal</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">重点复核</p>
            <p className="mt-1 text-xl font-bold">Session 6</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">完成节点</p>
            <p className="mt-1 text-xl font-bold">Session 8</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">输出状态</p>
            <p className="mt-1 text-xl font-bold">等待审核</p>
          </div>
        </div>
      </Card>
      <SessionTimeline sessions={sessions} />
    </div>
  );
}
