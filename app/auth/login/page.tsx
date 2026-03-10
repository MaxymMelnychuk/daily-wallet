"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginResponse } from "@/types/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { TextInput } from "@/components/ui/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Username or password not valid");

      console.log("Logged in user:", data.user);
      router.push("/");
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
      <AuthFormCard title="Login" error={error} onSubmit={handleSubmit}>
        <TextInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PrimaryButton type="submit">
          {loading ? "Logging in..." : "Login"}
        </PrimaryButton>

        <p className="text-neutral-400 mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/auth/register")}
            className="text-white hover:underline cursor-pointer hover:text-gray-200 transition-colors"
          >
            Register
          </span>
        </p>
      </AuthFormCard>
    </AuthShell>
  );
}
