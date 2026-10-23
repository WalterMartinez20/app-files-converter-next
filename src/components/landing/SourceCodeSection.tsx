export function SourceCodeSection() {
  return (
    <section className="px-6 lg:px-40 py-20" id="code">
      <div className="container mx-auto">
        <div className="bg-primary rounded-3xl p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 lg:max-w-xl text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Curious about the code?
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
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
              className="flex items-center justify-center gap-3 w-full lg:w-auto bg-white text-primary text-lg font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[28px]">code</span>
              View Source Code
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
