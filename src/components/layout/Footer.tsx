import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="px-6 lg:px-40 py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark mt-auto w-full font-display">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        {/* Columna 1: Logo y Descripción */}
        <div className="col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="flex items-center gap-3 text-primary mb-6 hover:opacity-80 transition-opacity"
          >
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white p-1.5">
              <img
                src="/icon.svg"
                alt="FileConvert Logo"
                className="size-full object-contain"
              />
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
              FileConvert
            </h2>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            The ultimate tool for all your file conversion needs. Private,
            secure, and blazingly fast.
          </p>
          {/* <div className="flex gap-4">
            <Link
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">public</span>
            </Link>
            <Link
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">share</span>
            </Link>
          </div> */}
        </div>

        {/* Columna 2: Product */}
        <div>
          <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-100">
            Product
          </h5>
          <ul className="space-y-4 text-sm text-slate-500">
            <li>
              <Link
                href="/#features"
                className="hover:text-primary transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#how-it-works"
                className="hover:text-primary transition-colors"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/#pricing"
                className="hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/#code"
                className="hover:text-primary transition-colors"
              >
                Code
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Tools & Formats (Actualizado) */}
        <div>
          <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-100">
            Tools
          </h5>
          <ul className="space-y-4 text-sm text-slate-500">
            <li>
              <Link
                href="/dashboard"
                className="hover:text-primary transition-colors"
              >
                Image Converter
              </Link>
            </li>
            <li>
              <Link
                href="/tools/edit-pdf"
                className="hover:text-primary transition-colors"
              >
                Edit PDF
              </Link>
            </li>
            <li>
              <Link
                href="/tools/merge-pdf"
                className="hover:text-primary transition-colors"
              >
                Merge PDF
              </Link>
            </li>
            <li>
              <Link
                href="/tools/split-pdf"
                className="hover:text-primary transition-colors"
              >
                Split PDF
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Company */}
        <div>
          <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-100">
            Company
          </h5>
          <ul className="space-y-4 text-sm text-slate-500">
            <li>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="terms"
                className="hover:text-primary transition-colors"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 5: Support */}
        <div>
          <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-100">
            Support
          </h5>
          <ul className="space-y-4 text-sm text-slate-500">
            <li>
              <Link
                href="help-center"
                className="hover:text-primary transition-colors"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} FileConvert Inc. All rights reserved. Made
        for creators.
      </div>
    </footer>
  );
};
