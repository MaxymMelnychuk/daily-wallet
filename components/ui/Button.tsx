import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const baseClasses = "px-4 py-2 text-sm cursor-pointer transition-colors";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-black text-white border border-neutral-800 font-medium hover:bg-neutral-900/50",
  outline: "text-white border border-neutral-700 hover:bg-neutral-800/50",
  danger: "text-white border border-red-950 hover:bg-red-900/75",
};

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
