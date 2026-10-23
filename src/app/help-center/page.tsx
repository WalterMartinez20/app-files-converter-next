import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f1423] p-10 md:p-16 rounded-3xl shadow-2xl border border-slate-200 dark:border-primary/20 text-center relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 shadow-lg shadow-primary/10 flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5 relative z-10">
            <span className="material-symbols-outlined text-4xl text-primary">
              support_agent
            </span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4 relative z-10">
            Help Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 relative z-10">
            {`Need assistance with your files or experiencing a technical issue?
            We're here to help.`}
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-10 relative z-10">
            <div className="p-6 md:p-8 border border-slate-200/80 dark:border-primary/20 bg-slate-50/70 dark:bg-background-dark/60 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-primary/40 transition-colors shadow-sm">
              <div>
                <div className="size-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/25 shadow-md shadow-rose-500/10 flex items-center justify-center mb-5 ring-4 ring-rose-500/5">
                  <span className="material-symbols-outlined text-3xl text-rose-500 dark:text-rose-400">
                    bug_report
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Report a Bug
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {`Found something that isn't working right? Please open an issue
                  on the GitHub repository.`}
                </p>
              </div>
              <a
                href="https://github.com/WalterMartinez20/app-files-converter-next/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-lg font-bold text-xs shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 w-fit mt-5"
              >
                <span className="material-symbols-outlined text-[17px] text-rose-500 dark:text-rose-400 transition-transform group-hover:scale-110">
                  bug_report
                </span>
                <span>Report on GitHub</span>
                <span className="material-symbols-outlined text-[15px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </a>
            </div>

            <div className="p-6 md:p-8 border border-slate-200/80 dark:border-primary/20 bg-slate-50/70 dark:bg-background-dark/60 rounded-2xl flex flex-col justify-between hover:border-primary/40 dark:hover:border-primary/40 transition-colors shadow-sm">
              <div>
                <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 shadow-md shadow-primary/10 flex items-center justify-center mb-5 ring-4 ring-primary/5">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    quiz
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Check the FAQ
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Most common questions about file retention, supported formats,
                  and security are answered there.
                </p>
              </div>
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-xs shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95 w-fit mt-5"
              >
                <span className="material-symbols-outlined text-[17px] transition-transform group-hover:scale-110">
                  quiz
                </span>
                <span>Read FAQ</span>
                <span className="material-symbols-outlined text-[15px] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-primary/20 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 w-fit"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back to Home
            </Link>
            <div className="flex flex-col items-center md:items-end gap-2">
              <a
                href="https://www.linkedin.com/in/walter-martínez-4712162b7"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">work</span>
                <span>Contact via LinkedIn</span>
                <span className="material-symbols-outlined text-[18px] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
