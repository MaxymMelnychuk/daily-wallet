import type { FormEvent, ReactNode } from "react";

interface AuthFormCardProps {
  title: string;
  error?: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

/**
 * Bordered stack: title, optional server/validation error, then arbitrary
 * fields + submit passed as `children`. `role="alert"` helps screen readers
 * pick up error text immediately.
 */
export function AuthFormCard({
  title,
  error,
  onSubmit,
  children,
}: AuthFormCardProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 w-full max-w-md border border-neutral-800 p-8 rounded-sm"
    >
      <h1 className="text-3xl font-semibold mb-6 text-white text-center">
        {title}
      </h1>
      {error && (
        <p className="text-red-500 mb-4" role="alert">
          {error}
        </p>
      )}
      {children}
    </form>
  );
}
