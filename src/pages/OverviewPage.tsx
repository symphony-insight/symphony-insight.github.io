import { useEffect, useMemo, useState } from "react";
import { mockApi } from "../api/mockApi";
import { InsightCard } from "../components/insight/InsightCard";
import { ImmersiveHero } from "../components/overview/ImmersiveHero";
import { ObservationScoreCard } from "../components/overview/ObservationScoreCard";
import { ObservationScoreRing } from "../components/overview/ObservationScoreRing";
import { ReviewFocusPanel } from "../components/overview/ReviewFocusPanel";
import { StatusPill } from "../components/ui/StatusPill";
import { t } from "../i18n";
import { filterDisplayRubrics, getDisplayRubrics } from "../lib/displayRubrics";
import { formatAffectLabel } from "../lib/labels";
import { useAppStore } from "../store/useAppStore";
import type { Child, EvaluationDimension, LongitudinalInsight, SessionSummary } from "../types/domain";

export function OverviewPage() {
  const [child, setChild] = useState<Child | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [insights, setInsights] = useState<LongitudinalInsight[]>([]);
  const [dimensions, setDimensions] = useState<EvaluationDimension[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { language, selectedChildId } = useAppStore();

  useEffect(() => {
    Promise.all([
      mockApi.getChild(selectedChildId),
      mockApi.getSessions(selectedChildId),
      mockApi.getInsights(selectedChildId),
      mockApi.getEvaluationDimensions(selectedChildId)
    ]).then(([childData, sessionData, insightData, dimensionData]) => {
      setChild(childData);
      setSessions(sessionData);
      setInsights(insightData);
      setDimensions(dimensionData);
    });
  }, [selectedChildId]);

  const displayRubrics = useMemo(() => getDisplayRubrics(dimensions, language), [dimensions, language]);
  const visibleRubrics = filterDisplayRubrics(displayRubrics, searchQuery);
  const visibleInsights = insights.filter((insight) => {
    const query = searchQuery.trim();
    if (!query) return true;
    return `${insight.title} ${insight.statement}`.includes(query);
  });

  if (!child) return <div>{language === "zh" ? "总览加载中" : "Loading overview"}</div>;

  const latest = sessions[sessions.length - 1];
  const totalCreativeMoments = sessions.reduce((sum, session) => sum + session.participation.seedCount, 0);
  const childName = language === "zh" ? child.displayName : child.displayNameEn;
  const summary = [
    {
      label: t(language, "activityCount"),
      value: language === "zh" ? `${sessions.length} 次` : `${sessions.length}`,
      caption: t(language, "baselineCaption")
    },
    {
      label: t(language, "seedCount"),
      value: language === "zh" ? `${totalCreativeMoments} 个` : `${totalCreativeMoments}`,
      caption: t(language, "seedCaption")
    },
    {
      label: t(language, "latestState"),
      value: latest ? formatAffectLabel(language, latest.affect.dominantState) : "-",
      caption: language === "zh" ? "最近一次活动记录" : "Latest activity record"
    },
    {
      label: t(language, "teacher"),
      value: child.teacher,
      caption: t(language, "teacherCaption")
    }
  ];

  return (
    <div className="space-y-6 page-enter">
      <ImmersiveHero
        childName={childName}
        titleSuffix={t(language, "overviewTitleSuffix")}
        intro={t(language, "overviewIntro")}
        summary={summary}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ReviewFocusPanel />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <ObservationScoreRing rubrics={displayRubrics} />
        <div className="rounded-lg border border-white/70 bg-white/70 p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{language === "zh" ? "具体评分" : "Detailed Scores"}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-500">{t(language, "dimensionSubtitle")}</p>
            </div>
            <StatusPill status={t(language, "needsReview")} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {visibleRubrics.map((rubric) => (
              <ObservationScoreCard key={rubric.id} rubric={rubric} />
            ))}
          </div>
          {visibleRubrics.length === 0 ? <p className="mt-4 rounded-md bg-paper/80 p-4 text-sm text-stone-500">没有找到对应的观察内容。</p> : null}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-white/70 bg-white/80 p-5 shadow-soft">
          <h2 className="text-lg font-bold">{t(language, "latestSummary")}</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">{latest?.story}</p>
          <div className="mt-4 rounded-md bg-paper/80 p-3 text-sm text-stone-600">{child.guardianSummary}</div>
        </section>

        <section className="rounded-lg border border-white/70 bg-white/80 p-5 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{t(language, "keyInsights")}</h2>
            <p className="text-sm text-stone-500">{t(language, "traceableOnly")}</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {visibleInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
