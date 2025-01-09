"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_PATHS = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
      router.push('/login');
    }
  }, [router, pathname]);

  return <>{children}</>;
}