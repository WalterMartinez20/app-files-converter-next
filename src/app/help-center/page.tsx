import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f1423] p-10 md:p-16 rounded-3xl shadow-2xl border border-slate-200 dark:border-primary/20 text-center">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">
              support_agent
            </span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4">
            Help Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
            {`Need assistance with your files or experiencing a technical issue?
            We're here to help.`}
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
            <div className="p-6 border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 rounded-2xl">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  bug_report
                </span>
                Report a Bug
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {`Found something that isn't working right? Please open an issue
                on the GitHub repository.`}
              </p>
            </div>

            <div className="p-6 border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 rounded-2xl">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  quick_reference_all
                </span>
                Check the FAQ
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Most common questions about file retention and security are
                answered there.
              </p>
              <Link
                href="/faq"
                className="text-primary text-sm font-bold hover:underline"
              >
                Read FAQ →
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-primary/20 pt-8 mt-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              For professional inquiries or recruitment
            </p>
            <a
              href="https://www.linkedin.com/in/walter-martínez-4712162b7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-transform"
            >
              <span className="material-symbols-outlined">work</span>
              Contact via LinkedIn
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
