"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
// Mantenemos tu hook de Auth por si a futuro lo vuelves a activar, pero no condicionamos la UI con él
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const pathname = usePathname();
  const isApp = pathname !== "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Puedes dejar esto aquí para no romper el contexto, aunque no lo usemos en la UI actual
  const { user, isLoading } = useAuth();

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

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {isApp ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-semibold ${
                    pathname === "/dashboard"
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-slate-600 dark:text-slate-400 hover:text-primary"
                  }`}
                >
                  Image Converter
                </Link>

                {/* PDF TOOLS */}
                <div className="relative group py-2">
                  <button
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      pathname.includes("/tools/")
                        ? "text-primary border-b-2 border-primary pb-1"
                        : "text-slate-600 dark:text-slate-400 hover:text-primary"
                    }`}
                  >
                    PDF Tools
                    <span className="material-symbols-outlined text-lg group-hover:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </button>
                  <div className="absolute left-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 duration-200 origin-top scale-95 group-hover:scale-100">
                    <div className="bg-white dark:bg-[#1a1c29] border border-slate-200 dark:border-primary/20 rounded-xl shadow-xl p-2 w-56 flex flex-col gap-1">
                      {/* Enlace MERGE */}
                      <Link
                        href="/tools/merge-pdf"
                        className={`px-4 py-3 text-sm rounded-lg flex items-center gap-3 ${
                          pathname === "/tools/merge-pdf"
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          library_books
                        </span>
                        Merge PDF
                      </Link>

                      {/* Enlace SPLIT */}
                      <Link
                        href="/tools/split-pdf"
                        className={`px-4 py-3 text-sm rounded-lg flex items-center gap-3 ${
                          pathname === "/tools/split-pdf"
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          view_module
                        </span>
                        Split PDF
                      </Link>

                      {/* Edit PDF */}
                      <Link
                        href="/tools/edit-pdf"
                        className={`px-4 py-3 text-sm rounded-lg flex items-center gap-3 ${
                          pathname === "/tools/edit-pdf"
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          edit_document
                        </span>
                        Edit PDF
                      </Link>
                    </div>
                  </div>
                </div>

                {/* History visible para todos en la demo */}
                <Link
                  href="/history"
                  className={`text-sm font-semibold ${
                    pathname === "/history"
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-slate-600 dark:text-slate-400 hover:text-primary"
                  }`}
                >
                  History
                </Link>
              </>
            ) : (
              <>
                <Link href="#features" className="text-sm hover:text-primary">
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-sm hover:text-primary"
                >
                  How it Works
                </Link>
                <Link href="#pricing" className="text-sm hover:text-primary">
                  Pricing
                </Link>
                <Link href="#code" className="text-sm hover:text-primary">
                  Code
                </Link>

                {/* Ocultamos Pricing porque es un portafolio técnico */}
              </>
            )}
          </nav>
        </div>

        {/* ✨ RIGHT SIDE (PORTFOLIO CTAs) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/WalterMartinez20/app-files-converter-next.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
            View Code
          </a>

          <a
            href="https://www.linkedin.com/in/walter-martínez-4712162b7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">work</span>
            LinkedIn
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 ml-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined text-3xl">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0B0F19] border-b p-6 flex flex-col gap-4 shadow-xl">
          {isApp ? (
            <>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                href="/dashboard"
              >
                Image Converter
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                href="/tools/merge-pdf"
              >
                Merge PDF
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                href="/tools/split-pdf"
              >
                Split PDF
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                href="/tools/edit-pdf"
              >
                Edit PDF
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/history">
                History
              </Link>
            </>
          ) : (
            <>
              <Link href="#features">Features</Link>
              <Link href="#how-it-works">How it Works</Link>
              <Link href="#pricing">Pricing</Link>
              <Link href="#code">Code</Link>
            </>
          )}

          {/* ✨ PORTFOLIO CTAs PARA EL MENÚ DEL CELULAR */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mt-2 flex flex-col gap-4">
            <a
              href="https://github.com/WalterMartinez20/app-files-converter-next.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold"
            >
              <span className="material-symbols-outlined">code</span>
              View Source Code
            </a>
            <a
              href="https://www.linkedin.com/in/walter-martínez-4712162b7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary font-bold"
            >
              <span className="material-symbols-outlined">work</span>
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
