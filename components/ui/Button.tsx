import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const baseClasses =
  "px-4 py-2 text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-black text-white border border-neutral-800 font-medium hover:bg-neutral-900/50",
  outline: "text-white border border-neutral-700 hover:bg-neutral-800/50",
  danger: "text-white border border-red-950 hover:bg-red-900/75",
};

/**
 * General-purpose button for the dashboard. Variants map to Tailwind class
 * bundles; anything you pass (`onClick`, `disabled`, etc.) is forwarded to the
 * native `<button>`.
 */
export function Button({
  children,
  variant = "outline",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
