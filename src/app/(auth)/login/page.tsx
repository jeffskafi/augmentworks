"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Shield, Mail, Lock, Loader2, Sparkles } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { login, sendMagicLink, type AuthState } from "~/actions/auth";

export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState<
    AuthState,
    FormData
  >(login, {});
  const [magicState, magicAction, isMagicPending] = useActionState<
    AuthState,
    FormData
  >(sendMagicLink, {});

  return (
    <div className="space-y-6">
      {/* Mobile logo */}
      <div className="flex items-center justify-center gap-2 lg:hidden">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20">
          <Shield className="size-6 text-primary" />
        </div>
        <span className="text-xl font-semibold">AgentReady</span>
      </div>

      <Card className="border-border/50">
        <CardHeader className="space-y-1 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your client portal
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email/Password Form */}
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {loginState.error && (
              <p className="text-sm text-destructive">{loginState.error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoginPending}
            >
              {isLoginPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Magic Link Form */}
          <form action={magicAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="magic-email" className="text-sm font-medium">
                Magic Link
              </label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="magic-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {magicState.error && (
              <p className="text-sm text-destructive">{magicState.error}</p>
            )}
            {magicState.success && (
              <p className="text-sm text-success">{magicState.success}</p>
            )}

            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={isMagicPending}
            >
              {isMagicPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                <>
                  <Mail className="size-4" />
                  Send magic link
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Contact us
          </Link>
        </p>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/demo">
            Try Demo Mode
          </Link>
        </Button>
      </div>
    </div>
  );
}

