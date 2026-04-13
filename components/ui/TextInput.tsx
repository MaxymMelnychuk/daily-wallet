import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Styled text field shared by auth and the wallet modal. Pulls `disabled` out
 * only so we can dim the control — every other HTML input prop still works.
 */
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
