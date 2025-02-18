import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QueryProvider from "@/components/QueryProvider";
import { AuthGuard } from "@/components/auth-guard";


export const metadata: Metadata = {
    title: "Hilti Project Seminar",
    description: "Frontend for Hilti Project Seminar",
};

// const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AuthGuard>
                            {children}
                        </AuthGuard>
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
