import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function FAQPage() {
  const faqs = [
    {
      q: "Are my processed files secure?",
      a: "Absolutely. All files are processed securely and uploaded to an isolated storage bucket. Furthermore, an automated background task deletes all guest files after 24 hours to ensure complete privacy.",
    },
    {
      q: "Do I need to create an account?",
      a: "No. FileConvert supports anonymous operations using Row Level Security (RLS) policies. You can split, merge, and edit PDFs without ever signing up.",
    },
    {
      q: "What technologies power this app?",
      a: "This application is built using Next.js (App Router), React, Tailwind CSS, pdf-lib for document manipulation, and Supabase for authentication and database management.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f1423] p-10 md:p-16 rounded-3xl shadow-2xl border border-slate-200 dark:border-primary/20 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 shadow-lg shadow-primary/10 flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5 relative z-10">
            <span className="material-symbols-outlined text-4xl text-primary">
              quiz
            </span>
          </div>

          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Got questions? Find answers to common questions about file security, privacy, and how FileConvert works.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-b border-slate-200 dark:border-primary/10 pb-6 last:border-0"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {faq.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 w-fit"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back to Home
            </Link>
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Still have questions?
              </span>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
                  support_agent
                </span>
                <span>Contact Developer</span>
                <span className="material-symbols-outlined text-[18px] opacity-75 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
