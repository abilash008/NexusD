"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NexusLogo } from "@/components/brand/nexus-logo";
import { loginWithGoogle, loginWithCredentials } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage(null);
      await loginWithGoogle();
    } catch (err: any) {
      setIsGoogleLoading(false);
      if (err?.digest?.startsWith("NEXT_REDIRECT")) return;
      setErrorMessage("Google Sign-in failed. Please verify your credentials.");
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginWithCredentials(formData);
      if (res?.error) {
        setErrorMessage(res.error);
        setIsEmailLoading(false);
      }
    } catch (err: any) {
      setIsEmailLoading(false);
      if (err?.digest?.startsWith("NEXT_REDIRECT")) return;
      setErrorMessage("Invalid email or password. Please sign up if you do not have an account.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Link href="/" className="inline-block bg-white/90 dark:bg-transparent rounded-xl p-2 shadow-2xs hover:opacity-90 transition-opacity">
              <NexusLogo size="lg" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome Back to NexusD
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sign in to access your saved progress, practice tests, and analytics.
          </p>
        </div>

        {/* Card */}
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-[#131D31] shadow-md transition-colors">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg text-slate-900 dark:text-white">Sign In</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Enter your account credentials to log in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. PRIMARY: Real Google OAuth */}
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading || isEmailLoading}
              onClick={handleGoogleSignIn}
              className="w-full h-11 gap-3 text-slate-700 dark:text-slate-100 dark:border-slate-700 dark:bg-[#0E1524] hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold shadow-xs transition-all border border-slate-300"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#131D31] px-2 text-slate-400 font-medium">
                  Or sign in with email & password
                </span>
              </div>
            </div>

            {/* 2. Credentials Sign In Form */}
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="dark:bg-[#0E1524] dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 dark:bg-[#0E1524] dark:border-slate-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full gap-2 text-base font-semibold shadow-xs"
                disabled={isEmailLoading || isGoogleLoading}
              >
                {isEmailLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            <div>
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="text-[#0066FF] hover:underline font-semibold">
                Sign Up here
              </Link>
            </div>
            <p className="text-[11px] text-slate-400">
              Only authenticated users with existing accounts can log in.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
