import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-6 flex items-center justify-center">
        <div className="max-w-xl w-full text-center bg-white dark:bg-[#0f1423] p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-primary/20">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">
              mail
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-4">
            Get in Touch
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
            Interested in collaborating, reporting a bug, or checking out more
            of my work? Feel free to reach out through my professional channels.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/walter-martínez-4712162b7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0077b5] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-transform"
            >
              <span className="material-symbols-outlined">work</span>
              Connect on LinkedIn
            </a>

            <a
              href="https://github.com/WalterMartinez20/app-files-converter-next.git"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold shadow-lg border border-slate-700 hover:-translate-y-1 transition-transform"
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
