import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import TopBar from "./MainComponent/TopBar";
import { AuthProvider } from "./context/AuthContext";
// 1. Import the ThemeProvider you created
import { ThemeProvider } from "./MainComponent/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="en" suppressHydrationWarning> 
        {/* 2. Added suppressHydrationWarning to prevent a Next.js warning with themes */}
        <body className="flex flex-col justify-center gap-4">
          <div className="flex flex-col gap-4 items-center">
            {/* 3. Wrap everything inside ThemeProvider */}
            <ThemeProvider>
              <AuthProvider>
                <TopBar />
                {children}
              </AuthProvider>
            </ThemeProvider>
          </div>
        </body>
      </html>
    );
}