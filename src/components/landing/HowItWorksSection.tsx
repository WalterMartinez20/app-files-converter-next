interface StepItem {
  number: number;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    number: 1,
    title: "Upload",
    description: "Drag and drop your files into our secure web uploader.",
  },
  {
    number: 2,
    title: "Convert",
    description: 'Choose your output format and click "Convert". It\'s instant.',
  },
  {
    number: 3,
    title: "Download",
    description: "Download your optimized files or save them to the cloud.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="px-6 lg:px-40 py-20" id="how-it-works">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">
            Simple 3-Step Process
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Get your converted files in seconds without any technical knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden md:block"></div>
          {STEPS.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black mb-8 relative z-10 shadow-xl shadow-primary/40 group-hover:scale-110 transition-transform">
                {step.number}
              </div>
              <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                {step.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
