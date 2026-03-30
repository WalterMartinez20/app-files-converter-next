import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f1423] p-10 md:p-16 rounded-3xl shadow-2xl border border-slate-200 dark:border-primary/20">
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6">
            Terms of Service
          </h1>

          <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              <strong className="text-slate-900 dark:text-slate-200">
                Effective Date: Today
              </strong>
            </p>
            <p>
              Welcome to FileConvert. By accessing or using our application, you
              agree to be bound by these Terms of Service. Please read them
              carefully.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6">
              1. Acceptance of Terms
            </h3>
            <p>
              {`This application is provided as a technical demonstration
              portfolio piece. By uploading files and using our conversion
              tools, you acknowledge that this is a free, "as-is" service
              provided without warranties of any kind.`}
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6">
              2. User Responsibilities
            </h3>
            <p>
              {`You agree not to use the service for any illegal or unauthorized
              purpose. You are solely responsible for the content of the files
              you upload. We reserve the right to block any IP address or user
              that abuses the API or attempts to breach the platform's security.`}
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6">
              3. Limitation of Liability
            </h3>
            <p>
              In no event shall the developer be liable for any indirect,
              incidental, special, or consequential damages arising out of the
              use or inability to use the application. While we use automated
              background jobs to purge data, we recommend not uploading highly
              sensitive personal information.
            </p>

            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-primary/20">
              <Link
                href="/"
                className="text-primary font-bold hover:underline flex items-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
