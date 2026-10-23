import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-6 flex items-center justify-center">
        <div className="max-w-xl w-full text-center bg-white dark:bg-primary/5 p-12 rounded-3xl shadow-xl border border-slate-200 dark:border-primary/20 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 shadow-lg shadow-primary/10 flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5 relative z-10">
            <span className="material-symbols-outlined text-4xl text-primary">
              mail
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4 relative z-10">
            Get in Touch
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 relative z-10">
            Interested in collaborating, reporting a bug, or checking out more
            of my work? Feel free to reach out through my professional channels.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href="https://www.linkedin.com/in/walter-martínez-4712162b7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:-translate-y-1 transition-all"
            >
              <span className="material-symbols-outlined">work</span>
              Connect on LinkedIn
            </a>

            <a
              href="https://github.com/WalterMartinez20/app-files-converter-next.git"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-8 py-4 rounded-xl font-bold shadow-md border border-slate-200 dark:border-slate-700 hover:-translate-y-1 transition-all"
            >
              <span className="material-symbols-outlined">code</span>
              Follow on GitHub
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
