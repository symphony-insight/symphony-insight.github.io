import type { LongitudinalInsight } from "../../types/domain";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

const claimLabels = {
  observation: "观察发现",
  trend: "近期变化",
  requires_professional_review: "需要老师复核"
};

function formatEvidenceLabel(id: string) {
  const index = id.match(/(\d+)$/)?.[1];
  return index ? `第 ${index} 次活动` : "活动记录";
}

function formatInsightCopy(text: string) {
  return text.replace(/创作素材/g, "创作片段");
}

export function InsightCard({ insight }: { insight: LongitudinalInsight }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold">{insight.title}</h3>
        <Badge tone={insight.claimLevel === "requires_professional_review" ? "coral" : "moss"}>{claimLabels[insight.claimLevel]}</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-600">{formatInsightCopy(insight.statement)}</p>
      <p className="mt-3 text-xs font-semibold text-stone-500">观察依据：{insight.evidenceSessionIds.map(formatEvidenceLabel).join(" / ")}</p>
    </Card>
  );
}
