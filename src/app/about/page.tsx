import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f1423] p-10 md:p-16 rounded-3xl shadow-2xl border border-slate-200 dark:border-primary/20">
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6">
            About FileConvert
          </h1>

          <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              FileConvert is a full-stack portfolio project developed to
              demonstrate advanced capabilities in modern web engineering,
              specifically focusing on seamless file manipulation and scalable
              backend architecture.
            </p>
            <p>
              Developed by an engineering student at Gerardo Barrios University
              in El Salvador, this application serves as a practical
              implementation of cutting-edge technologies. It showcases the
              integration of Next.js, React, and Tailwind CSS on the frontend,
              powered by a robust Supabase backend for secure file storage and
              database management.
            </p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-10 mb-4">
              The Architecture
            </h2>
            <p>
              The core philosophy behind FileConvert is processing efficiency.
              Features like PDF splitting, merging, and watermarking are handled
              seamlessly through specialized APIs. To ensure data privacy and
              optimize storage costs, the system implements automated Cron Jobs
              that securely purge all anonymous user data every 24 hours.
            </p>
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-primary/20">
              <Link
                href="/"
                className="text-primary font-bold hover:underline flex items-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
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
