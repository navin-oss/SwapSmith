"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
<<<<<<< HEAD
=======
  Zap,
>>>>>>> 941ae72
  User,
  Users,
  LogOut,
  Home,
  TrendingUp,
  Terminal as TerminalIcon,
  MessageSquare,
  BookOpen,
  Trophy,
  Menu,
  X,
  Info,
  ChevronRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import WalletConnector from "./WalletConnector";
import ThemeToggle from "@/components/ThemeToggle";
import MarketSentimentWidget from "@/components/MarketSentimentWidget";

<<<<<<< HEAD
const NAV_ITEMS = [
  { href: "/prices", label: "Live Prices", Icon: TrendingUp },
  { href: "/yield-scout", label: "Yield Scout", Icon: Trophy },
  { href: "/contributors", label: "Contributors", Icon: Users },
  { href: "/about", label: "About", Icon: Info },
=======
/* ================================================================ */
/* Navigation Config                                                 */
/* ================================================================ */

const NAV_ITEMS = [
  { href: "/prices", label: "Live Prices", Icon: TrendingUp },
  { href: "/discussions", label: "Discussions", Icon: MessageSquare },
  { href: "/terminal", label: "Terminal", Icon: TerminalIcon },
  { href: "/contributors", label: "Contributors", Icon: Users },
  { href: "/watchlist", label: "Watchlist", Icon: Star },
>>>>>>> 941ae72
];

const PROFILE_MENU = [
  { href: "/profile", label: "Profile", Icon: User },
<<<<<<< HEAD
  { href: "/portfolio", label: "Portfolio", Icon: Users },
  { href: "/rewards", label: "Rewards", Icon: Trophy },
  { href: "/learn", label: "Learn", Icon: BookOpen },
  { href: "/terminal", label: "Terminal", Icon: TerminalIcon },
  { href: "/watchlist", label: "Watchlist", Icon: Star },
  { href: "/strategies", label: "Strategies", Icon: TrendingUp },
  { href: "/discussions", label: "Discussions", Icon: MessageSquare },
];

=======
  { href: "/rewards", label: "Rewards", Icon: Trophy },
  { href: "/learn", label: "Learn", Icon: BookOpen },
  { href: "/about", label: "About", Icon: Info },
];

/* ================================================================ */
/* Component                                                         */
/* ================================================================ */

>>>>>>> 941ae72
export default function Navbar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const isTerminal = pathname === "/terminal";

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
=======
  /* Detect scroll for shrinking navbar shadow */
>>>>>>> 941ae72
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

<<<<<<< HEAD
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

=======
  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  /* Close profile dropdown on outside click */
>>>>>>> 941ae72
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

<<<<<<< HEAD
=======
  /* Load profile image */
>>>>>>> 941ae72
  useEffect(() => {
    const loadImage = () => {
      if (!user?.uid) return;
      const img = localStorage.getItem(`profile-image-${user.uid}`);
      setProfileImageUrl(img);
    };
    loadImage();
    window.addEventListener("profileImageChanged", loadImage);
    return () => window.removeEventListener("profileImageChanged", loadImage);
  }, [user?.uid]);

  return (
    <>
<<<<<<< HEAD
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 backdrop-blur-[24px] transition-all duration-300 ${
          scrolled ? "border-b border-blue-500/10 dark:border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-sm" : "border-b border-transparent"
        } ${isTerminal ? "bg-white/70 dark:bg-zinc-950/80" : "bg-gradient-to-r from-white/90 via-slate-50/90 to-white/90 dark:from-[#08080f]/85 dark:via-[#08080f]/85 dark:to-[#08080f]/85"}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-full grid grid-cols-[auto_1fr_auto] items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="p-0.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-200 overflow-hidden">
              <Image src="/swapsmithicon.png" alt="SwapSmith" width={36} height={36} className="rounded-xl" unoptimized />
            </div>
            <span className="hidden lg:block text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white">
=======
      {/* ========================= NAVBAR ========================= */}
      <nav
        className={`fixed  top-0 left-0 right-0 z-50 h-16 sm:h-17 backdrop-blur-2xl transition-all duration-300 ${
          scrolled
            ? "shadow-lg shadow-black/4 dark:shadow-black/30"
            : ""
        } ${
          isTerminal
            ? "bg-white/80 dark:bg-zinc-950/80"
            : "bg-white/85 dark:bg-[#08080f]/85"
        } border-b border-zinc-200/80 dark:border-zinc-800/50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-blue-500/25 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/25 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
            </div>
            <span className="hidden sm:block text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white select-none">
>>>>>>> 941ae72
              SwapSmith
            </span>
          </Link>

<<<<<<< HEAD
          {/* Center Navigation - hidden on mobile, shown on md+ */}
          <div className="hidden md:flex items-center justify-center px-4">
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-zinc-800/40 p-1.5 rounded-2xl border border-white/60 dark:border-zinc-800 overflow-hidden shadow-inner backdrop-blur-sm">
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 duration-300 ${
                  pathname === "/" 
                  ? "bg-white dark:bg-zinc-700/50 text-blue-600 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-none" 
                  : "text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden lg:inline">Home</span>
=======
          {/* Desktop Nav + Market Sentiment */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-4">
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/40 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <Link
                href="/"
                className={`nav-link group ${
                  pathname === "/"
                    ? "text-zinc-900 dark:text-white nav-link-active"
                    : "text-zinc-600 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
                <span className={`nav-link-indicator ${
                  pathname === "/" ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                }`} />
>>>>>>> 941ae72
              </Link>

              {NAV_ITEMS.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
<<<<<<< HEAD
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 duration-300 ${
                    pathname === href
                      ? "bg-white dark:bg-zinc-700/50 text-blue-600 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-none"
                      : "text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{label}</span>
                </Link>
              ))}
            </div>
            <div className="ml-4 hidden xl:block flex-shrink-0">
=======
                  className={`nav-link group ${
                    pathname === href
                      ? "text-zinc-900 dark:text-white nav-link-active"
                      : "text-zinc-600 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{label}</span>
                  <span className={`nav-link-indicator ${
                    pathname === href ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`} />
                </Link>
              ))}
            </div>
            {/* Market Sentiment Widget */}
            <div className="ml-4">
>>>>>>> 941ae72
              <MarketSentimentWidget />
            </div>
          </div>

<<<<<<< HEAD
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-3">
=======
          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
>>>>>>> 941ae72
              <WalletConnector />
              <ThemeToggle />
            </div>

<<<<<<< HEAD
            <div className="hidden md:block relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                className="p-1 rounded-full border-2 border-transparent hover:border-blue-500 transition-all active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-none"
              >
                {profileImageUrl ? (
                  <Image src={profileImageUrl} alt="P" width={36} height={36} className="rounded-full object-cover" unoptimized />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
=======
            {/* Profile avatar + dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                aria-label="Profile menu"
                className={`rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900 transition-all duration-200 ${
                  showProfileMenu
                    ? "ring-blue-500 scale-105"
                    : "ring-transparent hover:ring-blue-400/60 dark:hover:ring-blue-500/60"
                }`}
              >
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt="Profile"
                    width={34}
                    height={34}
                    className="rounded-full object-cover w-8.5 h-8.5"
                    unoptimized
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
>>>>>>> 941ae72
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

<<<<<<< HEAD
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-white/90 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-400">Manage Account</p>
                  </div>
                  <div className="p-2">
=======
              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 shadow-2xl shadow-black/10 dark:shadow-black/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/40">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Account
                    </p>
                  </div>

                  <div className="py-1">
>>>>>>> 941ae72
                    {PROFILE_MENU.map(({ href, label, Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setShowProfileMenu(false)}
<<<<<<< HEAD
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-800 transition-all"
                      >
                        <Icon className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        {label}
                        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                      </Link>
                    ))}
                    <div className="h-px bg-slate-200 dark:bg-zinc-800 my-2" />
                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
=======
                        className="group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-blue-50/60 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-zinc-700 transition-colors">
                          <Icon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </span>
                        {label}
                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-zinc-300 dark:text-zinc-600 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </div>

                  <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="group w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                        <LogOut className="w-3.5 h-3.5" />
                      </span>
>>>>>>> 941ae72
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

<<<<<<< HEAD
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 ml-auto border border-slate-200/50 dark:border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-none"
            >
              <Menu className="w-6 h-6" />
=======
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
>>>>>>> 941ae72
            </button>
          </div>
        </div>
      </nav>

<<<<<<< HEAD
      {/* Mobile Menu - shown below md */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-white/20 dark:bg-black/60 backdrop-blur-md z-[60]" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white/95 dark:bg-zinc-900 shadow-[-10px_0_40px_rgba(0,0,0,0.1)] dark:shadow-2xl z-[70] animate-in slide-in-from-right duration-300 backdrop-blur-xl border-l border-slate-200/50 dark:border-none">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="overflow-hidden rounded-xl shadow-lg shadow-blue-500/20">
                    <Image src="/swapsmithicon.png" alt="SwapSmith" width={36} height={36} className="rounded-xl" unoptimized />
                  </div>
                  <span className="font-black text-lg uppercase tracking-tighter text-slate-900 dark:text-white">SwapSmith</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"><X /></button>
              </div>
              <div className="space-y-1 flex-1 overflow-y-auto">
                {[{ href: "/", label: "Home", Icon: Home }, ...NAV_ITEMS].map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-base font-bold transition-all ${
                      pathname === href ? "bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)]" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" /> {label}
                  </Link>
                ))}
                {PROFILE_MENU.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-base font-bold transition-all ${
                      pathname === href ? "bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)]" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" /> {label}
                  </Link>
                ))}
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
                <WalletConnector />
                <div className="flex items-center justify-between">
                  <ThemeToggle />
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
=======
      {/* ========================= MOBILE DRAWER ========================= */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-zinc-900 shadow-2xl z-70 animate-in slide-in-from-right">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <span className="font-black tracking-tighter text-xl">
                  MENU
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Market Sentiment Widget for mobile */}
              <div className="mb-6">
                <MarketSentimentWidget />
              </div>

              <div className="space-y-2 flex-1">
                {[{ href: "/", label: "Home", Icon: Home }, ...NAV_ITEMS].map(
                  ({ href, label, Icon }) => {
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                          active
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                            : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            active
                              ? "bg-white/20"
                              : "bg-zinc-100 dark:bg-zinc-800"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        {label}
                      </Link>
                    );
                  }
                )}
              </div>

              {/* Footer actions */}
              <div className="px-4 py-4 border-t border-zinc-100 dark:border-zinc-800/60 space-y-3">
                <WalletConnector />
                <div className="flex justify-center">
                  <ThemeToggle />
>>>>>>> 941ae72
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}