"use client";

import { useApp } from "@/app/context/AppContext";
import { LogOut, Menu, Search, Shield, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import CallingInfo from "./CallingInfo";

export default function Header() {
  const { lang, setLang, currentUser, logoutUser, adminUser, logoutAdmin, t } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchRef, setSearchRef] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);


  const navItems = [
    { name: t("navHome"), path: "/" },
    { name: t("navVehicles"), path: "/vehicles" },
    { name: t("navMyReservations"), path: "/my-reservations" },
    { name: t("navTerms"), path: "/terms" },
    { name: t("navFAQ"), path: "/faq" },
    { name: t("navReviews"), path: "/reviews" },
    { name: t("navBlog"), path: "/blog" },
    { name: t("navContact"), path: "/contact" }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchRef.trim()) {
      setSearchOpen(false);
      router.push(`/lookup?id=${searchRef.trim()}`);
      setSearchRef("");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">

        {/* Support Top Bar */}
        <div className="hidden md:flex bg-white py-2 px-4 sm:px-6 border-b border-gray-200 items-center">
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">

            <div className="flex items-center space-x-2 text-slate-500 font-bold text-lg">
              <span>{t("phoneHours")}</span>
            </div>
            <CallingInfo />
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="flex justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Logo Area (Dynamic Image to SVG Fallback) */}
          <Link href="/" className="flex items-center group">
            <div className="relative flex items-center justify-center">
              <img
                src="/logo.png"
                alt="CAR-GO.PL"
                className="h-20 w-auto object-contain block"
                onError={(e) => {
                  e.target.style.display = "none";
                  const fallback = e.target.nextSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-semibold transition duration-200 ${isActive ? "text-brand-red" : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 border border-slate-200 rounded-full p-0.5 bg-slate-50">
              <button
                onClick={() => setLang("pl")}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition ${lang === "pl" ? "bg-brand-red text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                title="Polski"
              >
                PL
              </button>
              <button
                onClick={() => setLang("en")}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition ${lang === "en" ? "bg-brand-red text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Quick Lookup Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 border border-slate-200 hover:border-slate-400 rounded-full text-slate-500 hover:text-slate-800 transition bg-slate-50"
              title={t("lookupTitle")}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Account Login / Actions */}
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition text-sm font-semibold text-slate-700"
                  >
                    <User className="w-4 h-4 text-brand-red" />
                    <span className="max-w-[100px] truncate">{currentUser.firstName}</span>
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 animate-slide-up text-sm font-medium">
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        {t("navMyAccount")}
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logoutUser();
                          router.push("/");
                        }}
                        className="w-full text-left block px-4 py-2 text-brand-red hover:bg-slate-50"
                      >
                        <span className="flex items-center space-x-1.5">
                          <LogOut className="w-4 h-4" />
                          <span>{t("navLogout")}</span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className="flex items-center space-x-1.5 px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold rounded-full shadow-sm hover:shadow-md transition duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{t("navLogin")}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Quick Lookup Mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-full border border-slate-200"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Lang Button */}
            <button
              onClick={() => setLang(lang === "pl" ? "en" : "pl")}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-full border border-slate-200 text-xs font-extrabold w-8 h-8 flex items-center justify-center"
            >
              {lang.toUpperCase()}
            </button>

            {/* Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-full border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4 animate-slide-down">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold py-1 ${pathname === item.path ? "text-brand-red border-l-2 border-brand-red pl-2.5" : "text-slate-600 pl-2.5"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-slate-100 pt-4 flex flex-col space-y-3">
              {currentUser ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-slate-700 font-bold py-1 pl-2.5"
                  >
                    <User className="w-4 h-4 text-brand-red" />
                    <span>{t("navMyAccount")} ({currentUser.firstName})</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logoutUser();
                      router.push("/");
                    }}
                    className="flex items-center space-x-2 text-brand-red font-bold py-1 pl-2.5 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("navLogout")}</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/account/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 py-2.5 bg-brand-red text-white font-bold rounded-lg shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>{t("navLogin")}</span>
                </Link>
              )}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-1 text-xs text-slate-400 py-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>CMS Admin Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Reservation Lookup Modal Popup */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center space-x-2">
                <Search className="w-5 h-5 text-brand-red" />
                <span>{t("lookupTitle")}</span>
              </h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full border border-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {t("confirmNum")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("lookupPlaceholder")}
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-red rounded-lg focus:outline-none text-slate-800 font-mono placeholder-slate-400 uppercase tracking-wider text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-lg transition duration-200 shadow-sm"
              >
                {t("lookupBtn")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
