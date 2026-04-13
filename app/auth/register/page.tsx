"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RegisterResponse } from "@/types/auth";
import { validatePassword } from "@/lib/passwordValidation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { TextInput } from "@/components/ui/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

/** Keep in sync with product rules — short names are hard to distinguish in UI. */
const MIN_USERNAME_LEN = 4;

/**
 * Creates an account via `/api/register`, then sends the user to login. We
 * validate password complexity here first to avoid a round trip for obvious
 * mistakes.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = username.trim();
    if (name.length < MIN_USERNAME_LEN) {
      setError(`Username must be at least ${MIN_USERNAME_LEN} characters`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to register");

      router.push("/auth/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthFormCard title="Register" error={error} onSubmit={handleSubmit}>
        <TextInput
          type="text"
          name="username"
          autoComplete="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextInput
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <PrimaryButton type="submit">
          {loading ? "Registering..." : "Register"}
        </PrimaryButton>

        <p className="text-neutral-400 mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="text-white hover:underline cursor-pointer hover:text-gray-200 transition-colors"
          >
            Login
          </span>
        </p>
      </AuthFormCard>
    </AuthShell>
  );
}
