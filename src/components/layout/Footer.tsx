import Link from "next/link";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const FOOTER_GROUPS: FooterLinkGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Source Code", href: "/#code" },
    ],
  },
  {
    title: "PDF Tools",
    links: [
      { label: "Image Converter", href: "/tools/image-converter" },
      { label: "Merge PDF", href: "/tools/merge-pdf" },
      { label: "Organize PDF", href: "/tools/organize-pdf" },
      { label: "Edit PDF", href: "/tools/edit-pdf" },
      { label: "Split PDF", href: "/tools/split-pdf" },
      { label: "Protect PDF", href: "/tools/protect-pdf" },
      { label: "Unlock PDF", href: "/tools/unlock-pdf" },
      { label: "Add Numbers", href: "/tools/number-pdf" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help-center" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

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
            The ultimate tool for all your file conversion and PDF needs.
            Private, secure, and blazingly fast directly in your browser.
          </p>
        </div>

        {/* Dynamic Link Groups */}
        {FOOTER_GROUPS.map((group) => (
          <div key={group.title}>
            <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-100">
              {group.title}
            </h5>
            <ul className="space-y-3.5 text-sm text-slate-500">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} FileConvert Inc. All rights reserved. Made
        for creators.
      </div>
    </footer>
  );
};
