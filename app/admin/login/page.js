"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/login");
  }, [router]);

  return (
    <div className="text-center py-20 text-slate-500 font-bold">
      Przekierowanie / Redirecting...
    </div>
  );
}
