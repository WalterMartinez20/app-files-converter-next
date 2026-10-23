import Link from "next/link";

interface ToolItem {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const TOOLS_CATALOG: ToolItem[] = [
  {
    href: "/tools/image-converter",
    icon: "image",
    title: "Image Converter",
    description: "Batch convert JPG, PNG, and WebP formats instantly. Fast, secure, and optimized.",
  },
  {
    href: "/tools/merge-pdf",
    icon: "library_add",
    title: "Merge PDF",
    description: "Combine multiple PDFs into a single document in the exact order you need them.",
  },
  {
    href: "/tools/organize-pdf",
    icon: "note_stack",
    title: "Organize PDF",
    description: "Extract pages, delete the ones you don't need, and reorganize your PDFs visually.",
  },
  {
    href: "/tools/edit-pdf",
    icon: "edit_document",
    title: "Edit PDFs",
    description: "Add custom watermarks, text, images, and sign your documents professionally.",
  },
  {
    href: "/tools/split-pdf",
    icon: "content_cut",
    title: "Split PDF",
    description: "Extract pages from your PDF or save each page as a separate document.",
  },
  {
    href: "/tools/protect-pdf",
    icon: "lock",
    title: "Protect PDF",
    description: "Encrypt your PDF with a strong password to prevent unauthorized access.",
  },
  {
    href: "/tools/unlock-pdf",
    icon: "lock_open",
    title: "Unlock PDF",
    description: "Remove password security from your PDF documents easily.",
  },
  {
    href: "/tools/number-pdf",
    icon: "format_list_numbered",
    title: "Add Page Numbers",
    description: "Insert page numbers into your PDF in your preferred position.",
  },
];

export function ToolsGridSection() {
  return (
    <section className="px-6 lg:px-40 py-20 bg-slate-50 dark:bg-slate-900/30" id="features">
      <div className="container mx-auto">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
            Supported Features
          </h2>
          <h3 className="text-3xl md:text-4xl font-black mb-6">
            Everything you need, in one place
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Our powerful engine handles your files securely in the browser and
            via fast serverless functions, ensuring high quality and zero data
            loss.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS_CATALOG.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group block cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">
                  {tool.icon}
                </span>
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {tool.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
