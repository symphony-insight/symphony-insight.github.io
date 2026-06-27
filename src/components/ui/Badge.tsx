import type { PropsWithChildren } from "react";

type BadgeTone = "moss" | "coral" | "tide" | "sun" | "neutral";

const tones: Record<BadgeTone, string> = {
  moss: "bg-moss-50 text-moss-600 ring-moss/20",
  coral: "bg-coral-50 text-coral-600 ring-coral/20",
  tide: "bg-tide-50 text-tide-600 ring-tide/20",
  sun: "bg-sun-50 text-[#a9802f] ring-sun/30",
  neutral: "bg-stone-100/80 text-stone-600 ring-stone-200"
};

const dotColor: Record<BadgeTone, string> = {
  moss: "bg-moss",
  coral: "bg-coral",
  tide: "bg-tide",
  sun: "bg-sun",
  neutral: "bg-stone-400"
};

export function Badge({
  children,
  tone = "neutral",
  dot = false
}: PropsWithChildren<{ tone?: BadgeTone; dot?: boolean }>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {dot ? <span className={`h-1.5 w-1.5 rounded-full ${dotColor[tone]}`} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
