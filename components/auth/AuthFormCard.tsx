import type { ReactNode } from "react";
import type { FormEvent } from "react";

interface AuthFormCardProps {
  title: string;
  error?: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function AuthFormCard({
  title,
  error,
  onSubmit,
  children,
}: AuthFormCardProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 w-full max-w-md border border-neutral-800 p-8"
    >
      <h1 className="text-3xl font-semibold mb-6 text-white text-center">
        {title}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {children}
    </form>
  );
}
