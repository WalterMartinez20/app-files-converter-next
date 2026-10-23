"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface NavLinkItem {
  href: string;
  label: string;
  shortLabel?: string;
  icon: string;
}

const TOOL_NAV_ITEMS: NavLinkItem[] = [
  { href: "/tools/image-converter", label: "Image Converter", icon: "image" },
  { href: "/tools/merge-pdf", label: "Merge PDF", icon: "library_add" },
  { href: "/tools/organize-pdf", label: "Organize PDF", icon: "note_stack" },
  { href: "/tools/edit-pdf", label: "Edit PDF", icon: "edit_document" },
  { href: "/tools/split-pdf", label: "Split PDF", icon: "content_cut" },
  { href: "/tools/protect-pdf", label: "Protect PDF", shortLabel: "Protect", icon: "lock" },
  { href: "/tools/unlock-pdf", label: "Unlock PDF", shortLabel: "Unlock", icon: "lock_open" },
  { href: "/tools/number-pdf", label: "Add Numbers", shortLabel: "Numbers", icon: "format_list_numbered" },
];

const LANDING_NAV_ITEMS: NavLinkItem[] = [
  { href: "#features", label: "Features", icon: "star" },
  { href: "#how-it-works", label: "How it Works", icon: "settings_suggest" },
  { href: "#pricing", label: "Pricing", icon: "payments" },
  { href: "#code", label: "Code", icon: "data_object" },
];

export const Header = () => {
  const pathname = usePathname();
  const isApp = pathname !== "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useAuth();

  return (
    <header
      className={`relative border-b px-6 md:px-10 py-4 sticky top-0 z-50 backdrop-blur-md ${
        isApp
          ? "border-slate-200 dark:border-primary/20 bg-background-light/90 dark:bg-background-dark/90"
          : "border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        {/* LOGO + NAV */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity shrink-0"
          >
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white p-1.5">
              <img
                src="/icon.svg"
                alt="FileConvert Logo"
                className="size-full object-contain"
              />
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">
              FileConvert
            </h2>
          </Link>

          <nav className="hidden md:flex items-center gap-3 lg:gap-5">
            {isApp
              ? TOOL_NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 text-xs lg:text-sm font-semibold transition-colors ${
                        isActive
                          ? "text-primary border-b-2 border-primary pb-1"
                          : "text-slate-600 dark:text-slate-400 hover:text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>
                      <span>{item.shortLabel ?? item.label}</span>
                    </Link>
                  );
                })
              : LANDING_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 text-sm hover:text-primary font-medium text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
          </nav>
        </div>

        {/* RIGHT SIDE (PORTFOLIO CTAs + THEME TOGGLE) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[20px] text-amber-500 dark:text-amber-400">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <a
            href="https://github.com/WalterMartinez20/app-files-converter-next.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
            View Code
          </a>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={toggleTheme}
            className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-center transition-all active:scale-95"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-500 dark:text-amber-400">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <button
            type="button"
            className="p-2 text-slate-700 dark:text-slate-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
          {isApp
            ? TOOL_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  href={item.href}
                  className={`flex items-center gap-3 font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))
            : LANDING_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  href={item.href}
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}

          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 flex flex-col gap-4">
            <a
              href="https://github.com/WalterMartinez20/app-files-converter-next.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-transform text-center w-full"
            >
              <span className="material-symbols-outlined">code</span>
              View Source Code
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
