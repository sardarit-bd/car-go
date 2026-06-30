"use client";

import { useApp } from "@/app/context/AppContext";
import { LogOut, Menu, Search, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import CallingInfo from "./CallingInfo";

export default function Header() {
  const { lang, setLang, currentUser, logoutUser, t } = useApp();
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center h-16 lg:h-20 px-4 sm:px-6 container mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="CAR-GO.PL"
              className="h-8 lg:h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-6 flex-1 px-2 lg:px-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm lg:text-[15px] font-medium whitespace-nowrap transition duration-200 px-2 lg:px-3 py-2 rounded-lg ${
                    isActive 
                      ? "text-brand-red bg-brand-red/5" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            
            {/* Calling Info - Desktop Only */}
            <div className="hidden xl:block">
              <CallingInfo />
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "pl" ? "en" : "pl")}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition px-2 py-1 rounded-md hover:bg-slate-50"
            >
              {lang.toUpperCase()}
            </button>

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              title={t("lookupTitle")}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Area - Desktop */}
            <div className="hidden sm:block relative">
              {currentUser ? (
                <div className="flex items-center">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg transition text-sm font-medium text-slate-700"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-red/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-brand-red" />
                    </div>
                    <span className="max-w-[100px] truncate">{currentUser.firstName}</span>
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 animate-slide-up text-sm font-medium z-10">
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 bg-[#FF0000] hover:bg-[#FF0000]/70"
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
                        <span className="flex items-center gap-1.5">
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
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#FF0000] hover:bg-[#FF0000]/70 text-white text-sm font-medium rounded-lg transition"
                >
                  <User className="w-4 h-4" />
                  <span>{t("navLogin")}</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-full transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium py-3 px-3 rounded-lg transition ${
                      pathname === item.path
                        ? "text-brand-red bg-brand-red/5"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-slate-100 pt-4 mt-4 space-y-2">
                {currentUser ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-slate-700 font-medium py-3 px-3 rounded-lg hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-brand-red" />
                      <span>{t("navMyAccount")}</span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logoutUser();
                        router.push("/");
                      }}
                      className="flex items-center gap-2 w-full text-left text-brand-red font-medium py-3 px-3 rounded-lg hover:bg-slate-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("navLogout")}</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/account/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-medium rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    <span>{t("navLogin")}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {t("lookupTitle")}
              </h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {t("confirmNum")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("lookupPlaceholder")}
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl focus:outline-none text-slate-800 font-mono placeholder-slate-400 uppercase tracking-wider text-sm"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FF0000] hover:bg-[#FF0000]/70 text-white font-semibold rounded-xl transition"
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