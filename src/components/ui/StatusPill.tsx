import { Badge } from "./Badge";

export function StatusPill({ status }: { status: string }) {
  const tone = status.includes("复核") || status.includes("审核") ? "coral" : status.includes("已") ? "moss" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}
