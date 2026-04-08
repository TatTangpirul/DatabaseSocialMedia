import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AccountInfo from "./MainComponent/AccountInfo";
import Feed from "./MainComponent/Feed";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="en">
      <body className="flex flex-row justify-center gap-4">
        <div className="flex flex-row gap-4 items-center">
          <AccountInfo />
          <div id="top" className="bg-white p-4">test</div>
          <Feed />
          <main>{children}</main>
        </div>
      </body>
      </html>
    );
}