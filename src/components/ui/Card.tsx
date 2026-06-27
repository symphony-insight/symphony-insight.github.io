import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return <section className={`rounded-lg border border-stone-200 bg-white shadow-soft ${className}`}>{children}</section>;
}
