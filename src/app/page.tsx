import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Navigation */}
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 lg:px-40 py-16 md:py-24">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex flex-col gap-8 lg:w-1/2">
                <div className="space-y-4">
                  <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                    Modern, browser-based PDF processing
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl">
                    A full-stack project built with Next.js and Supabase to
                    demonstrate file manipulation, storage management, and
                    scalable API design. No sign-up required, try it now.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/dashboard"
                    className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center"
                  >
                    Start Converting
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      className="w-8 h-8 rounded-full border-2 border-background-dark object-cover"
                    />
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      className="w-8 h-8 rounded-full border-2 border-background-dark object-cover"
                    />
                    <img
                      src="https://randomuser.me/api/portraits/men/75.jpg"
                      className="w-8 h-8 rounded-full border-2 border-background-dark object-cover"
                    />
                  </div>
                  <span>Joined by 10k+ creators this month</span>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
                  {/* Cambiamos el background-image por una clase de Tailwind o estilo de React */}
                  <div className="aspect-video bg-slate-200 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden group">
                    {/* Elementos abstractos de fondo en lugar de la URL de googleusercontent */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 blur-2xl"></div>
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors z-0"></div>

                    <Link
                      href="/dashboard"
                      className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-6xl text-white">
                        upload_file
                      </span>
                      <p className="text-white font-bold text-lg">
                        Drop your files here
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section
          className="px-6 lg:px-40 py-20 bg-slate-50 dark:bg-slate-900/30"
          id="features"
        >
          <div className="container mx-auto">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
                Supported Features
              </h2>
              <h3 className="text-3xl md:text-4xl font-black mb-6">
                Everything you need, in one place
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Our powerful engine handles your files securely in the browser
                and via fast serverless functions, ensuring high quality and
                zero data loss.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Image Processing */}
              <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark hover:border-primary/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-primary group-hover:text-white">
                    image
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-3">Image Converter</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Batch convert JPG, PNG, and WebP formats instantly. Fast,
                  secure, and optimized.
                </p>
              </div>

              {/* Merge PDF */}
              <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark hover:border-primary/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-primary group-hover:text-white">
                    library_books
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-3">Merge PDF</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Combine multiple PDFs into a single document in the exact
                  order you need them.
                </p>
              </div>

              {/* Split PDF */}
              <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark hover:border-primary/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-primary group-hover:text-white">
                    call_split
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-3">Split PDF</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {`Extract pages, delete the ones you don't need, and reorganize
                  your PDFs visually.`}
                </p>
              </div>

              {/* Nuevas Funciones (Watermark / Rotate) */}
              <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark hover:border-primary/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-primary group-hover:text-white">
                    branding_watermark
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-3">Edit PDFs</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Add custom watermarks, text, images, and sign your documents
                  professionally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 lg:px-40 py-20" id="how-it-works">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                Get your converted files in seconds without any technical
                knowledge.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden md:block"></div>
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black mb-8 relative z-10 shadow-xl shadow-primary/40">
                  1
                </div>
                <h4 className="text-xl font-bold mb-4">Upload</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Drag and drop your files into our secure web uploader.
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black mb-8 relative z-10 shadow-xl shadow-primary/40">
                  2
                </div>
                <h4 className="text-xl font-bold mb-4">Convert</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {`Choose your output format and click "Convert". It's instant.`}
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black mb-8 relative z-10 shadow-xl shadow-primary/40">
                  3
                </div>
                <h4 className="text-xl font-bold mb-4">Download</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Download your optimized files or save them to the cloud.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section
          className="px-6 lg:px-40 py-24 bg-slate-50 dark:bg-slate-900/30"
          id="pricing"
        >
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Transparent Pricing
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Start for free and upgrade as you grow.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark">
                <h4 className="text-xl font-bold mb-2">Free</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-slate-500">/forever</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-green-500 text-xl">
                      check_circle
                    </span>
                    10 conversions per day
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-green-500 text-xl">
                      check_circle
                    </span>
                    Up to 50MB file size
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-green-500 text-xl">
                      check_circle
                    </span>
                    All standard formats
                  </li>
                  <li className="flex items-center gap-3 text-slate-500 line-through">
                    <span className="material-symbols-outlined text-slate-400 text-xl">
                      cancel
                    </span>
                    Cloud storage integration
                  </li>
                </ul>
                <button className="w-full py-4 px-6 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
                  Get Started
                </button>
              </div>
              {/* Pro Plan */}
              <div className="p-10 rounded-3xl border-2 border-primary bg-white dark:bg-background-dark relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-4 py-1 rounded-full tracking-wider uppercase">
                  Most Popular
                </div>
                <h4 className="text-xl font-bold mb-2">Pro</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black">$12</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-xl">
                      check_circle
                    </span>
                    Unlimited conversions
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-xl">
                      check_circle
                    </span>
                    Up to 5GB file size
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-xl">
                      check_circle
                    </span>
                    Priority processing
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-xl">
                      check_circle
                    </span>
                    Cloud storage sync
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-xl">
                      check_circle
                    </span>
                    Batch processing
                  </li>
                </ul>
                <button className="w-full py-4 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:opacity-90 transition-all">
                  Go Pro Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter/CTA Section */}
        {/* <section className="px-6 lg:px-40 py-20">
          <div className="container mx-auto">
            <div className="bg-primary rounded-3xl p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 lg:max-w-xl text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                  Ready to convert your first file?
                </h2>
                <p className="text-primary/10 text-slate-100 text-lg">
                  Join thousands of users who trust FileConvert for their daily
                  workflows. Secure, fast, and reliable.
                </p>
              </div>
              <div className="relative z-10 w-full lg:w-auto">
                <Link
                  href="/auth/signup"
                  className="block text-center w-full lg:w-auto bg-white text-primary text-lg font-black px-10 py-5 rounded-2xl shadow-2xl hover:bg-slate-50 transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </section> */}

        <section className="px-6 lg:px-40 py-20" id="code">
          <div className="container mx-auto">
            <div className="bg-primary rounded-3xl p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 lg:max-w-xl text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                  Curious about the code?
                </h2>
                <p className="text-primary/10 text-slate-100 text-lg">
                  Dive into the GitHub repository to explore the Next.js
                  architecture, Supabase backend integration, and the inner
                  workings of this serverless application.
                </p>
              </div>
              <div className="relative z-10 w-full lg:w-auto">
                <a
                  href="https://github.com/WalterMartinez20/app-files-converter-next.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full lg:w-auto bg-white text-primary text-lg font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-slate-50 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-[28px]">
                    code
                  </span>
                  View Source Code
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
