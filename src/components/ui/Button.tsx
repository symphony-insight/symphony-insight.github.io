import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-ink/90",
  secondary: "border border-stone-300 bg-white text-ink hover:bg-stone-50",
  danger: "bg-coral text-white hover:bg-coral/90"
};

export function Button({
  children,
  variant = "secondary",
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }>) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
