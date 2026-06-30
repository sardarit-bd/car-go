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

      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-slate-900" />

      <header className="fixed top-[3px] left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-100">

        <div className="flex justify-between items-center h-20 lg:h-24 px-4 sm:px-6 container mx-auto">


          <Link href="/" className="flex items-center group shrink-0">
            <img
              src="/logo.png"
              alt="CAR-GO.PL"
              className="h-9 lg:h-11 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          </Link>

   
          <nav className="hidden lg:flex items-center justify-center gap-8 flex-1 px-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[15px] font-semibold whitespace-nowrap transition duration-200 ${isActive ? "text-brand-red" : "text-slate-700 hover:text-slate-950"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="hidden xl:block mr-1">
              <CallingInfo />
            </div>


            <div className="flex items-center gap-0.5 border border-slate-200 rounded-full p-0.5 bg-slate-50">
              <button
                onClick={() => setLang("pl")}
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition ${lang === "pl" ? "bg-brand-red text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                title="Polski"
              >
                PL
              </button>
              <button
                onClick={() => setLang("en")}
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition ${lang === "en" ? "bg-brand-red text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                title="English"
              >
                EN
              </button>
            </div>

  
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 pl-2 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition text-sm font-semibold text-slate-700"
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200">
                      <User className="w-3.5 h-3.5 text-brand-red" />
                    </span>
                    <span className="max-w-[100px] truncate">{currentUser.firstName}</span>
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 animate-slide-up text-sm font-medium z-10">
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
                  className="flex items-center space-x-1.5 px-5 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold rounded-full shadow-sm hover:shadow-md transition duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{t("navLogin")}</span>
                </Link>
              )}
            </div>

            {/* Quick Lookup Button — circular accent button, like the arrow CTA in reference */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-11 h-11 bg-brand-red hover:bg-brand-red-hover rounded-full text-white transition duration-200 shadow-sm hover:shadow-md shrink-0"
              title={t("lookupTitle")}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Quick Lookup Mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 text-white bg-brand-red rounded-full transition"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Lang Button */}
            <button
              onClick={() => setLang(lang === "pl" ? "en" : "pl")}
              className="flex items-center justify-center w-9 h-9 text-slate-600 bg-slate-50 rounded-full border border-slate-200 text-xs font-extrabold"
            >
              {lang.toUpperCase()}
            </button>

            {/* Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-9 h-9 text-slate-600 bg-slate-50 rounded-full border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 px-4 py-5 space-y-5 animate-slide-down bg-white shadow-lg">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold py-2.5 px-3 rounded-lg transition ${pathname === item.path
                      ? "text-brand-red bg-brand-red/5"
                      : "text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-slate-100 pt-4 flex flex-col space-y-2">
              {currentUser ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-slate-700 font-bold py-2.5 px-3 rounded-lg hover:bg-slate-50"
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
                    className="flex items-center space-x-2 text-brand-red font-bold py-2.5 px-3 rounded-lg hover:bg-slate-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("navLogout")}</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/account/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 py-3 bg-brand-red text-white font-bold rounded-full shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>{t("navLogin")}</span>
                </Link>
              )}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-1 text-xs text-slate-400 py-2"
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