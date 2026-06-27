import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { MotionTrendChart } from "../components/charts/MotionTrendChart";
import { InsightCard } from "../components/insight/InsightCard";
import { Card } from "../components/ui/Card";
import { StatusPill } from "../components/ui/StatusPill";
import { t } from "../i18n";
import { formatAffectLabel } from "../lib/labels";
import { useAppStore } from "../store/useAppStore";
import type { Child, EvaluationDimension, LongitudinalInsight, SessionSummary } from "../types/domain";

function formatRubricScore(score: number) {
  return Number.isInteger(score) ? `${score}/5` : `${score.toFixed(1)}/5`;
}

export function OverviewPage() {
  const [child, setChild] = useState<Child | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [insights, setInsights] = useState<LongitudinalInsight[]>([]);
  const [dimensions, setDimensions] = useState<EvaluationDimension[]>([]);
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

  if (!child) return <div>{language === "zh" ? "观察总览加载中" : "Loading overview"}</div>;

  const latest = sessions[sessions.length - 1];
  const totalSeeds = sessions.reduce((sum, session) => sum + session.participation.seedCount, 0);

  return (
    <div className="space-y-6 page-enter">
      <div className="fancy-panel flex flex-wrap items-end justify-between gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <div>
          <p className="text-sm font-semibold text-coral">{t(language, "overviewKicker")}</p>
          <h1 className="mt-1 text-3xl font-bold">
            {language === "zh" ? child.displayName : child.displayNameEn}
            {t(language, "overviewTitleSuffix")}
          </h1>
          <p className="mt-2 max-w-3xl text-stone-600">{t(language, "overviewIntro")}</p>
        </div>
        <StatusPill status={t(language, "needsReview")} />
      </div>

      <Card className="p-5 soft-rise">
        <h2 className="text-lg font-bold">{t(language, "priorityTitle")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[t(language, "priorityOne"), t(language, "priorityTwo"), t(language, "priorityThree")].map((item, index) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-paper/70 p-4">
              <p className="text-xs font-bold text-coral">0{index + 1}</p>
              <p className="mt-2 text-sm font-semibold leading-6">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-stone-500">{t(language, "activityCount")}</p>
          <p className="mt-2 text-3xl font-bold">{sessions.length}</p>
          <p className="mt-1 text-xs text-stone-500">{t(language, "baselineCaption")}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-stone-500">{t(language, "seedCount")}</p>
          <p className="mt-2 text-3xl font-bold">{totalSeeds}</p>
          <p className="mt-1 text-xs text-stone-500">{t(language, "seedCaption")}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-stone-500">{t(language, "latestState")}</p>
          <p className="mt-2 text-3xl font-bold">{latest ? formatAffectLabel(language, latest.affect.dominantState) : "-"}</p>
          <p className="mt-1 text-xs text-stone-500">
            {t(language, "confidence")} {Math.round((latest?.affect.confidence ?? 0) * 100)}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-stone-500">{t(language, "teacher")}</p>
          <p className="mt-2 text-3xl font-bold">{child.teacher}</p>
          <p className="mt-1 text-xs text-stone-500">{t(language, "teacherCaption")}</p>
        </Card>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{t(language, "dimensionTitle")}</h2>
            <p className="mt-1 text-sm text-stone-500">{t(language, "dimensionSubtitle")}</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {dimensions.map((dimension) => (
            <Card key={dimension.id} className="rubric-card p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold">{language === "zh" ? dimension.title : dimension.titleEn}</h3>
                <span className="rounded-full bg-moss/10 px-2 py-1 text-xs font-bold text-moss">{formatRubricScore(dimension.score)}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{language === "zh" ? dimension.summary : dimension.summaryEn}</p>
              <div className="mt-4 border-t border-stone-200 pt-3">
                <p className="text-xs font-bold uppercase text-stone-500">{t(language, "rubricCriteria")}</p>
                <ul className="mt-2 space-y-2 text-sm leading-5 text-stone-700">
                  {(language === "zh" ? dimension.criteria : dimension.criteriaEn).map((criterion) => (
                    <li key={criterion} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 rounded-md bg-paper/80 p-3">
                <p className="text-xs font-bold uppercase text-stone-500">{t(language, "scaleGuide")}</p>
                <ul className="mt-2 space-y-1 text-xs leading-5 text-stone-600">
                  {(language === "zh" ? dimension.scale : dimension.scaleEn).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <MotionTrendChart sessions={sessions} />
        <Card className="p-5">
          <h2 className="text-lg font-bold">{t(language, "latestSummary")}</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">{latest?.story}</p>
          <div className="mt-4 rounded-md bg-stone-50 p-3 text-sm text-stone-600">{child.guardianSummary}</div>
        </Card>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t(language, "keyInsights")}</h2>
          <p className="text-sm text-stone-500">{t(language, "traceableOnly")}</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  );
}
