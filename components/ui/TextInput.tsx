import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className = "", ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={`w-full border border-neutral-800 bg-neutral-900 text-white p-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-600 ${className}`}
    />
  );
}
