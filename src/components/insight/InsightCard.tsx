import type { LongitudinalInsight } from "../../types/domain";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

const claimLabels = {
  observation: "观察信号",
  trend: "个体内趋势",
  requires_professional_review: "需要老师复核"
};

export function InsightCard({ insight }: { insight: LongitudinalInsight }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold">{insight.title}</h3>
        <Badge tone={insight.claimLevel === "requires_professional_review" ? "coral" : "moss"}>{claimLabels[insight.claimLevel]}</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-600">{insight.statement}</p>
      <p className="mt-3 text-xs font-semibold text-stone-500">证据：{insight.evidenceSessionIds.join(" / ")}</p>
    </Card>
  );
}
