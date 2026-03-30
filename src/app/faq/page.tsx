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
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f1423] p-10 md:p-16 rounded-3xl shadow-2xl border border-slate-200 dark:border-primary/20">
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-8">
            Frequently Asked Questions
          </h1>

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

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-primary/20 flex justify-between items-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Still have questions?
            </p>
            <Link
              href="/contact"
              className="text-primary font-bold hover:underline"
            >
              Contact Developer
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
