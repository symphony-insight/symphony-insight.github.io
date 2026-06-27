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

  if (sessions.length === 0) return <div>{language === "zh" ? "活动记录加载中" : "Loading sessions"}</div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-coral">{t(language, "sessions")}</p>
        <h1 className="mt-1 text-3xl font-bold">{t(language, "sessionsTitle")}</h1>
        <p className="mt-2 max-w-3xl text-stone-600">{t(language, "sessionsIntro")}</p>
      </div>
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <p className="text-sm text-stone-500">一共记录</p>
            <p className="mt-1 text-xl font-bold">{sessions.length} 次</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">重点看一下</p>
            <p className="mt-1 text-xl font-bold">第 6 次活动</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">完成作品</p>
            <p className="mt-1 text-xl font-bold">第 8 次活动</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">报告状态</p>
            <p className="mt-1 text-xl font-bold">等待老师确认</p>
          </div>
        </div>
      </Card>
      <SessionTimeline sessions={sessions} />
    </div>
  );
}
