// src\app\auth\signup\page.tsx

"use client";

import Link from "next/link";
import { useAuthForm } from "@/hooks/useAuthForm";
export default function SignupPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    error,
    isLoading,
    success,
    handleSignup,
    redirectTo,
    isAuthLoading,
    user,
    isAnonymous,
  } = useAuthForm();

  if (isAuthLoading || (user && !isAnonymous)) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-2xl">
        <div className="flex items-center gap-2 text-primary mb-8 justify-center">
          <Link
            href="/"
            className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity"
          >
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white p-1.5">
              <img
                src="/icon.svg"
                alt="FileConvert Logo"
                className="size-full object-contain"
              />
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">
              FileConvert
            </h2>
          </Link>
        </div>

        <h3 className="text-xl font-bold text-center mb-6">
          Create your account
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 text-sm text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4">
            <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">
                check_circle
              </span>
            </div>
            <h4 className="font-bold text-lg">Check your email</h4>
            <p className="text-slate-500 text-sm">
              {`We've sent a confirmation link to {email}. Please verify your
              account to continue.`}
            </p>
            <Link
              href="/auth/login"
              className="block w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl mt-6 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2 mt-6"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-sm">
                  sync
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
