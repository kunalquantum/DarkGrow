"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithPassword, signUpWithPassword } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      if (mode === "signin") {
        const result = await signInWithPassword(email, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.push("/");
        router.refresh();
      } else {
        const result = await signUpWithPassword(email, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        setMessage("Account created. Check your email if confirmation is required, then sign in.");
        setMode("signin");
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground">
            <span className="text-lg font-semibold text-background">L</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Life OS</h1>
          <p className="text-sm text-muted-foreground">
            Your private life intelligence system.
          </p>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              {mode === "signin" ? "Sign in" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Welcome back. Sign in to continue."
                : "Life OS is designed for a single person. Create your private account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-muted-foreground">{message}</p>}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setMessage(null);
              }}
              className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {mode === "signin"
                ? "First time here? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
