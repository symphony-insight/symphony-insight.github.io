import type { PropsWithChildren } from "react";

type CardElevation = "flat" | "raised" | "float";

const elevations: Record<CardElevation, string> = {
  flat: "surface-soft",
  raised: "surface shadow-card",
  float: "surface shadow-float"
};

type CardProps = PropsWithChildren<{
  className?: string;
  elevation?: CardElevation;
}>;

export function Card({ children, className = "", elevation = "raised" }: CardProps) {
  return <section className={`rounded-2xl ${elevations[elevation]} ${className}`}>{children}</section>;
}
