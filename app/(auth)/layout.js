"use client";

import { useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, adminUser, authInitialized } = useApp();

  useLayoutEffect(() => {
    // Wait until AppContext has finished loading from localStorage
    if (!authInitialized) return;

    const isLogin = pathname === "/account/login";
    const isSignup = pathname === "/account/signup";
    const isAdminRoute = pathname.startsWith("/admin");
    const isAccountRoute =
      pathname.startsWith("/account") && !isLogin && !isSignup;

    const hasUser = !!currentUser;
    const hasAdmin = !!adminUser;

    // 1. Logged-in user visits Login or Signup -> Redirect to their Dashboard
    if (hasUser && (isLogin || isSignup)) {
      if (hasAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/account");
      }
      return;
    }

    // 2. Regular user tries to access Admin dashboard -> Redirect to User dashboard
    if (hasUser && !hasAdmin && isAdminRoute) {
      router.replace("/account");
      return;
    }

    // 3. Unauthenticated user tries to access protected pages -> Redirect to Login
    if (!hasUser && (isAdminRoute || isAccountRoute)) {
      router.replace("/account/login");
      return;
    }
  }, [currentUser, adminUser, authInitialized, pathname, router]);

  // Prevent ANY UI flash by rendering nothing until auth is fully resolved
  if (!authInitialized) {
    return null;
  }

  return <>{children}</>;
}
