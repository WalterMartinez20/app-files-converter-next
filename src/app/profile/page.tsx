"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ProfilePage() {
  const { user, isLoading, isAnonymous } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || isAnonymous)) {
      router.push("/auth/login");
    }
  }, [user, isAnonymous, isLoading, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/"); // replace evita que el usuario vuelva con "back"
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            sync
          </span>
        </main>
      </div>
    );
  }
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              My Profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage your account settings and preferences.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a1c29] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6 border-b border-slate-100 dark:border-slate-800/50 pb-8 mb-8">
              <div className="size-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold uppercase shadow-inner border border-primary/20">
                {user?.user_metadata?.full_name?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.user_metadata?.full_name || "User"}
                </h2>
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                  <span className="material-symbols-outlined text-sm">
                    mail
                  </span>
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-slate-800/50">
                    <p className="text-xs text-slate-500 mb-1">Account ID</p>
                    <p className="text-sm font-mono truncate text-slate-700 dark:text-slate-300">
                      {user?.id}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-slate-800/50">
                    <p className="text-xs text-slate-500 mb-1">Last Sign In</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 font-bold rounded-xl transition-colors border border-rose-200 dark:border-rose-500/20"
                >
                  <span className="material-symbols-outlined text-lg">
                    logout
                  </span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
