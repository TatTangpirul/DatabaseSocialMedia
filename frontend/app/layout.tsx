'use client';
import "./globals.css";
import TopBar from "./MainComponent/TopBar";
import { AuthProvider } from "./context/AuthContext";
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const pathname = usePathname();
    const noTopBarPaths = ['/login', '/register'];
    const showTopBar = !noTopBarPaths.includes(pathname);

    return (
      <html lang="en">
      <body className="flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-4 items-center">
          <AuthProvider>
            {showTopBar && <TopBar />}
            {children}
          </AuthProvider>
        </div>
      </body>
      </html>
    );
}
