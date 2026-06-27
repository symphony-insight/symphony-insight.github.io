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

  const stats = [
    { label: "一共记录", value: `${sessions.length} 次`, tone: "text-tide-600" },
    { label: "重点看一下", value: "第 6 次活动", tone: "text-coral-600" },
    { label: "完成作品", value: "第 8 次活动", tone: "text-moss-600" },
    { label: "报告状态", value: "等待老师确认", tone: "text-ink-soft" }
  ];

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">{t(language, "sessions")}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tightish md:text-4xl">{t(language, "sessionsTitle")}</h1>
        <p className="mt-2 max-w-3xl text-ink-muted">{t(language, "sessionsIntro")}</p>
      </div>
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-sm text-ink-muted">{stat.label}</p>
              <p className={`mt-1 font-display text-xl font-extrabold tracking-tightish ${stat.tone}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>
      <SessionTimeline sessions={sessions} />
    </div>
  );
}
