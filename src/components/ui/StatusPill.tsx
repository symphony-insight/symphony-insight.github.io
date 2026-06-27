import { Badge } from "./Badge";

export function StatusPill({ status }: { status: string }) {
  const tone = status.includes("请老师") || status.includes("看一眼") ? "coral" : status.includes("已") || status.includes("看过了") ? "moss" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}
