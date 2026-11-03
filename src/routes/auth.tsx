import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in or create your FastData Africa account" },
      {
        name: "description",
        content:
          "Create a free FastData Africa account with your phone number to track orders, save recipient numbers and earn loyalty points.",
      },
      { property: "og:title", content: "Sign in to FastData Africa" },
      {
        property: "og:description",
        content: "Track orders, save numbers and earn points on every data bundle you buy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/** Turns "024 123 4567" or "233241234567" into E.164 (+233241234567). Local 0-numbers default to Ghana. */
export function toE164(raw: string): string {
  const d = raw.trim().replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return "+" + d.slice(1).replace(/\+/g, "");
  if (d.startsWith("00")) return "+" + d.slice(2);
  if (d.startsWith("0")) return "+233" + d.slice(1);
  return "+" + d;
}

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/account" });
  }, [loading, session, navigate]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      if (method === "phone") {
        const p = toE164(phone);
        if (!/^\+\d{9,15}$/.test(p)) throw new Error("Enter a valid phone number");
        if (mode === "signup") {
          const { error } = await supabase.auth.signUp({
            phone: p,
            password,
            options: { data: { full_name: fullName }, channel: "sms" },
          });
          if (error) throw error;
          setPendingPhone(p);
          toast.success("We sent a code by SMS — enter it to finish.");
        } else {
          const { error } = await supabase.auth.signInWithPassword({ phone: p, password });
          if (error) throw error;
          toast.success("Welcome back!");
          void navigate({ to: "/account" });
        }
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created — check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        void navigate({ to: "/account" });
      }
    });
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPhone) return;
    void run(async () => {
      const { error } = await supabase.auth.verifyOtp({
        phone: pendingPhone,
        token: code.trim(),
        type: "sms",
      });
      if (error) throw error;
      toast.success("Phone confirmed — welcome!");
      void navigate({ to: "/account" });
    });
  };

  const resend = () =>
    pendingPhone &&
    void run(async () => {
      const { error } = await supabase.auth.resend({ type: "sms", phone: pendingPhone });
      if (error) throw error;
      toast.success("New code sent.");
    });

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-10">
      <Link to="/" className="text-sm font-semibold text-muted-foreground">
        ← Back to store
      </Link>

      {pendingPhone ? (
        <>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Enter your code</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a 6-digit code to {pendingPhone}.
          </p>
          <form onSubmit={verify} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">SMS code</Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="h-12 tracking-widest"
                maxLength={8}
              />
            </div>
            <Button type="submit" className="h-12 w-full text-base" disabled={busy}>
              {busy ? "Please wait…" : "Confirm"}
            </Button>
          </form>
          <div className="mt-6 flex justify-between text-sm font-semibold">
            <button type="button" className="text-primary" onClick={resend} disabled={busy}>
              Resend code
            </button>
            <button
              type="button"
              className="text-muted-foreground"
              onClick={() => setPendingPhone(null)}
            >
              Change number
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track every order, save your favourite numbers and earn points on each purchase.
          </p>

          <div className="mt-6 grid grid-cols-2 rounded-lg bg-muted p-1 text-sm font-semibold">
            {(["phone", "email"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`rounded-md py-2 ${method === m ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                {m === "phone" ? "Phone number" : "Email (optional)"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" ? (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12"
                  placeholder="Kofi Mensah"
                />
              </div>
            ) : null}

            {method === "phone" ? (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))}
                  className="h-12"
                  placeholder="024 123 4567 or +234…"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  placeholder="you@example.com"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                placeholder="At least 6 characters"
              />
            </div>

            <Button type="submit" className="h-12 w-full text-base" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-sm font-semibold text-primary"
          >
            {mode === "signin" ? "New here? Create a free account" : "Already have an account? Sign in"}
          </button>
        </>
      )}
    </main>
  );
}
