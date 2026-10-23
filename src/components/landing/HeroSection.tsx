import Link from "next/link";

export function HeroSection() {
  return (
    <section className="px-6 lg:px-40 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Text Column */}
          <div className="flex flex-col gap-8 lg:w-1/2">
            <div className="space-y-4">
              <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                Modern, browser-based PDF processing
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl">
                A project built with Next.js and Supabase to
                demonstrate file manipulation, storage management, and scalable
                API design. No sign-up required, try it now.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tools/image-converter"
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Start Converting</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Creator avatar"
                  className="w-8 h-8 rounded-full border-2 border-background-dark object-cover"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Creator avatar"
                  className="w-8 h-8 rounded-full border-2 border-background-dark object-cover"
                />
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Creator avatar"
                  className="w-8 h-8 rounded-full border-2 border-background-dark object-cover"
                />
              </div>
              <span>Joined by 10k+ creators this month</span>
            </div>
          </div>

          {/* Right Visual Drop Target Column */}
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 dark:border-primary/20 shadow-2xl">
              <div className="aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden group p-5 sm:p-8">
                {/* Abstract Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-purple-500/15 to-transparent blur-2xl"></div>
                <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-900/40"></div>

                {/* Interactive drop zone card */}
                <Link
                  href="/tools/image-converter"
                  className="relative z-10 w-full h-full border-2 border-dashed border-primary/30 dark:border-primary/40 hover:border-primary dark:hover:border-primary rounded-2xl flex items-center justify-center p-4 bg-white/40 dark:bg-primary/[0.03] hover:bg-white/60 dark:hover:bg-primary/[0.07] transition-all cursor-pointer group/card"
                >
                  <div className="bg-primary hover:bg-primary/90 text-white p-7 sm:p-9 rounded-2xl border border-white/20 shadow-xl shadow-primary/30 group-hover/card:shadow-primary/50 flex flex-col items-center gap-3.5 group-hover/card:scale-105 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-5xl sm:text-6xl text-white group-hover/card:-translate-y-1 transition-transform">
                      upload_file
                    </span>
                    <p className="text-white font-bold text-lg sm:text-xl tracking-wide">
                      Drop your files here
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
