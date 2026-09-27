"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Compass,
  Bookmark,
  Bell,
  Activity,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  const isCurrent = (href: string) => {
    if (href === "/opportunities") return pathname === "/opportunities";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg shadow-black/40"
          : "bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/40 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] transition-transform group-hover:scale-105 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  {siteConfig.brand.name}
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 uppercase tracking-wider">
                  AUTOPILOT
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {siteConfig.brand.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/opportunities"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isCurrent("/opportunities") && !pathname.includes("status=CLOSING_SOON")
                  ? "text-cyan-400 bg-slate-900 border border-slate-800"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              Explore Opportunities
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  categoriesOpen
                    ? "text-white bg-slate-900"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                Categories
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200" />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 w-64 p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {siteConfig.navigation.categories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                    >
                      {cat.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/opportunities?status=CLOSING_SOON"
              className="px-3 py-2 text-sm font-medium rounded-lg transition-colors text-amber-300 hover:text-amber-200 hover:bg-amber-950/20 border border-amber-900/30 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Closing Soon
            </Link>

            <Link
              href="/saved"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isCurrent("/saved")
                  ? "text-cyan-400 bg-slate-900"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <Bookmark className="w-4 h-4 text-slate-400" />
              Saved
            </Link>

            <Link
              href="/alerts"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isCurrent("/alerts")
                  ? "text-cyan-400 bg-slate-900"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <Bell className="w-4 h-4 text-slate-400" />
              Alerts
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/saved"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
            >
              <span>Saved Bookmarks</span>
            </Link>

            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg shadow-md shadow-cyan-600/20 transition-all hover:-translate-y-0.5"
            >
              <span>{siteConfig.ctas.primary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/opportunities"
              className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg"
            >
              Explore All Opportunities
            </Link>
            <Link
              href="/opportunities?status=CLOSING_SOON"
              className="px-3 py-2 text-sm font-medium text-amber-300 hover:bg-slate-900 rounded-lg flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Closing Soon
            </Link>
            <Link
              href="/saved"
              className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-slate-400" />
              Saved Bookmarks
            </Link>
            <Link
              href="/alerts"
              className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-slate-400" />
              Alert Preferences
            </Link>
            <div className="pt-2 pb-1 border-t border-slate-800/80">
              <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Categories
              </span>
              <div className="mt-1 space-y-0.5">
                {siteConfig.navigation.categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="block px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-400"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/saved"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg flex items-center gap-2"
            >
              Saved Bookmarks
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
