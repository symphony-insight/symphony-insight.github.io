import type { PropsWithChildren } from "react";

type BadgeTone = "moss" | "coral" | "tide" | "neutral";

const tones: Record<BadgeTone, string> = {
  moss: "bg-moss/12 text-moss ring-moss/25",
  coral: "bg-coral/12 text-coral ring-coral/25",
  tide: "bg-tide/12 text-tide ring-tide/25",
  neutral: "bg-stone-100 text-stone-600 ring-stone-200"
};

export function Badge({ children, tone = "neutral" }: PropsWithChildren<{ tone?: BadgeTone }>) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tones[tone]}`}>{children}</span>;
}
