import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ToastProvider } from "@/components/toast/toast-provider";
import { UnitsProvider } from "@/lib/context/units-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZRun",
  description: "Training plan management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <UnitsProvider>{children}</UnitsProvider>
          </AuthProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
