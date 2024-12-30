"use client";

import { MyRuntimeProvider } from "./MyRuntimeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MyRuntimeProvider>
          {children}
    </MyRuntimeProvider>
  );
}
