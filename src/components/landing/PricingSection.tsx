export function PricingSection() {
  return (
    <section className="px-6 lg:px-40 py-24 bg-slate-50 dark:bg-slate-900/30" id="pricing">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">
            Transparent Pricing
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Start for free and upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark shadow-sm">
            <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Free</h4>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
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
            <button
              type="button"
              className="w-full py-4 px-6 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-10 rounded-3xl border-2 border-primary bg-white dark:bg-background-dark relative shadow-xl shadow-primary/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-4 py-1 rounded-full tracking-wider uppercase shadow-md">
              Most Popular
            </div>
            <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Pro</h4>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">$12</span>
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
            <button
              type="button"
              className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              Go Pro Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
