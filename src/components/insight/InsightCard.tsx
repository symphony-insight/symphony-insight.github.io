import type { LongitudinalInsight } from "../../types/domain";
import { useAppStore } from "../../store/useAppStore";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

const claimLabels = {
  zh: {
    observation: "观察发现",
    trend: "近期变化",
    requires_professional_review: "请老师看一下"
  },
  en: {
    observation: "Observation",
    trend: "Recent change",
    requires_professional_review: "Teacher review"
  }
};

function formatEvidenceLabel(id: string, language: "zh" | "en") {
  const index = id.match(/(\d+)$/)?.[1];
  if (!index) return language === "zh" ? "活动记录" : "Activity record";
  return language === "zh" ? `第 ${index} 次活动` : `Session ${index}`;
}

export function InsightCard({ insight }: { insight: LongitudinalInsight }) {
  const language = useAppStore((state) => state.language);
  return (
    <Card className="soft-rise p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-bold">{language === "zh" ? insight.title : insight.titleEn}</h3>
        <Badge tone={insight.claimLevel === "requires_professional_review" ? "coral" : "moss"} dot>
          {claimLabels[language][insight.claimLevel]}
        </Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{language === "zh" ? insight.statement : insight.statementEn}</p>
      <p className="mt-3 text-xs font-semibold text-ink-muted">
        {language === "zh" ? "观察依据：" : "Evidence: "}
        {insight.evidenceSessionIds.map((id) => formatEvidenceLabel(id, language)).join(" / ")}
      </p>
    </Card>
  );
}
