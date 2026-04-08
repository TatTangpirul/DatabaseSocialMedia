import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import TopBar from "./MainComponent/TopBar";
import { AuthProvider } from "./context/AuthContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="en">
      <body className="flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-4 items-center">
          <AuthProvider>
            <TopBar />
            {children}
          </AuthProvider>
        </div>
      </body>
      </html>
    );
}