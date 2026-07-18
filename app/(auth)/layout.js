"use client";

import { useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/app/context/AppContext";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, adminUser, authInitialized } = useApp();

  useLayoutEffect(() => {
    if (!authInitialized) return;

    const isLogin = pathname === "/account/login";
    const isSignup = pathname === "/account/signup";
    const isAdminRoute = pathname.startsWith("/admin");
    const isAccountRoute =
      pathname.startsWith("/account") && !isLogin && !isSignup;

    const hasUser = !!currentUser;
    const hasAdmin =
      currentUser?.role === "ADMIN" || currentUser?.role === "EMPLOYEE";

    if (hasUser && (isLogin || isSignup)) {
      if (hasAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/account");
      }
      return;
    }

    if (hasUser && !hasAdmin && isAdminRoute) {
      router.replace("/account");
      return;
    }

    if (hasUser && hasAdmin && isAccountRoute) {
      router.replace("/admin");
      return;
    }

    if (!hasUser && (isAdminRoute || isAccountRoute)) {
      router.replace("/account/login");
      return;
    }
  }, [currentUser, adminUser, authInitialized, pathname, router]);

  if (!authInitialized) {
    return null;
  }

  return <>{children}</>;
}
