import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f1423] p-10 md:p-16 rounded-3xl shadow-2xl border border-slate-200 dark:border-primary/20">
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              <strong className="text-slate-900 dark:text-slate-200">
                Last updated: Today
              </strong>
            </p>
            <p>
              At FileConvert, we take data security and privacy seriously.
              Because this is a demonstration environment, we have implemented
              strict automated protocols to protect your files.
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6">
              1. Automated File Deletion (Cron Jobs)
            </h3>
            <p>
              We do not store your files permanently. All documents uploaded or
              processed by guest users are stored in a temporary Supabase bucket
              and are permanently erased by an automated serverless Cron Job
              every 24 hours.
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6">
              2. Data Usage
            </h3>
            <p>
              We only process your files to deliver the requested output (e.g.,
              merging or editing a PDF). No files are analyzed, shared with
              third parties, or used for training models.
            </p>
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-primary/20">
              <Link href="/" className="text-primary font-bold hover:underline">
                Back to App
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
