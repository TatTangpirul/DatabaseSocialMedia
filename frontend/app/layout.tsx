'use client';
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { usePathname } from 'next/navigation';
import { FeedProvider } from "./context/FeedContext";
import { TopBar } from "./MainComponent/TopBar";
import { ThemeProvider } from "./MainComponent/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const noTopBarPaths = ['/login', '/register'];
    const showTopBar = !noTopBarPaths.includes(pathname);

    return (
      <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col justify-center gap-4 transition-colors duration-200 bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex flex-col gap-4 items-center w-full">
          <ThemeProvider>
            <AuthProvider>
                <FeedProvider>
                    {showTopBar && <TopBar />}
                    {children}
                </FeedProvider>
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
      </html>
    );
}