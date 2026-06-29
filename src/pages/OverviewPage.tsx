import { useEffect, useMemo, useState } from "react";
import { mockApi } from "../api/mockApi";
import { InsightCard } from "../components/insight/InsightCard";
import { ImmersiveHero } from "../components/overview/ImmersiveHero";
import { EvidenceNote } from "../components/overview/EvidenceNote";
import { ObservationRadar } from "../components/overview/ObservationRadar";
import { ReviewFocusPanel } from "../components/overview/ReviewFocusPanel";
import { RubricChip } from "../components/overview/RubricChip";
import { StatusPill } from "../components/ui/StatusPill";
import { t } from "../i18n";
import { filterDisplayRubrics, getDisplayRubrics } from "../lib/displayRubrics";
import { getRubricEvidence } from "../lib/rubricEvidence";
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
    const searchable = language === "zh" ? `${insight.title} ${insight.statement}` : `${insight.titleEn} ${insight.statementEn}`;
    return searchable.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  });

  if (!child) return <div>{language === "zh" ? "总览加载中" : "Loading overview"}</div>;

  const latest = sessions[sessions.length - 1];
  const totalCreativeMoments = sessions.reduce((sum, session) => sum + session.participation.seedCount, 0);
  const childName = language === "zh" ? child.displayName : child.displayNameEn;
  const teacherName = language === "zh" ? child.teacher : child.teacherEn;
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
      caption: language === "zh" ? "最近一次里他更多是这样" : "Latest activity record"
    },
    {
      label: t(language, "teacher"),
      value: teacherName,
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
        kicker={language === "zh" ? "共鸣 · 活动观察" : "SymPhony · Activity observation"}
        searchLabel={language === "zh" ? "搜索活动记录" : "Search activity records"}
        searchPlaceholder={language === "zh" ? "搜参加、亮度、暂停" : "Search joining, brightness, pause"}
        filterLabel={language === "zh" ? "即时筛选" : "Live filter"}
      />

      <ReviewFocusPanel />

      <div className="grid items-start gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ObservationRadar rubrics={displayRubrics} sessionCount={sessions.length} />
        <div className="surface rounded-2xl p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-tide-600">{language === "zh" ? "逐项查看" : "Score details"}</p>
              <h2 className="mt-1 font-display text-xl font-extrabold tracking-tightish">{language === "zh" ? "每项怎么看" : "Detailed Scores"}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">
                {language === "zh" ? "点开任意一项看证据；完整说明见 " : "Open any item to review the evidence. Full details are in the "}
                <a href={`#/child/${selectedChildId}/rubrics`} className="font-semibold text-tide-600 hover:underline">
                  {language === "zh" ? "评分说明" : "scoring guide"}
                </a>
                {language === "zh" ? "。" : "."}
              </p>
            </div>
            <StatusPill status={t(language, "needsReview")} />
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {visibleRubrics.map((rubric) => (
              <RubricChip
                key={rubric.id}
                rubric={rubric}
                evidence={sessions.length > 0 ? getRubricEvidence(rubric.id, sessions, language) : undefined}
                teacherName={teacherName}
              />
            ))}
          </div>
          {visibleRubrics.length === 0 ? (
            <p className="mt-4 rounded-xl bg-paper-warm/80 p-4 text-sm text-ink-muted">
              {language === "zh" ? "没找到相关内容。可以试试搜“参加”或“亮度”。" : "No matching item found. Try searching for \"join\" or \"brightness.\""}
            </p>
          ) : null}
        </div>
      </div>

      <EvidenceNote />

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="surface rounded-2xl p-6 shadow-card">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">{language === "zh" ? "最近一次" : "Latest session"}</p>
          <h2 className="mt-1 font-display text-lg font-extrabold tracking-tightish">{t(language, "latestSummary")}</h2>
          <p className="mt-3 text-sm leading-6 text-ink-soft">{latest ? (language === "zh" ? latest.story : latest.storyEn) : ""}</p>
          <div className="mt-4 rounded-xl border border-white/70 bg-paper-warm/70 p-4 text-sm leading-6 text-ink-soft">
            {language === "zh" ? child.guardianSummary : child.guardianSummaryEn}
          </div>
        </section>

        <section className="surface rounded-2xl p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold tracking-tightish">{t(language, "keyInsights")}</h2>
            <p className="text-sm text-ink-muted">{t(language, "traceableOnly")}</p>
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
