import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-tide text-white shadow-[0_8px_20px_rgba(75,143,159,0.3)] hover:bg-tide-600 hover:shadow-[0_10px_24px_rgba(75,143,159,0.36)] active:translate-y-px",
  secondary:
    "border border-white/80 bg-white/85 text-ink shadow-card backdrop-blur hover:border-tide/40 hover:bg-white",
  ghost: "text-ink-soft hover:bg-white/70 hover:text-ink",
  danger:
    "bg-coral text-white shadow-[0_8px_20px_rgba(217,124,101,0.3)] hover:bg-coral-600 active:translate-y-px"
};

export function Button({
  children,
  variant = "secondary",
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }>) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-tide/40 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
