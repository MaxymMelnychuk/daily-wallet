import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className = "", disabled, ...props }: TextInputProps) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={`w-full border border-neutral-800 bg-neutral-900 text-white p-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-600 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    />
  );
}
