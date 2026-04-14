'use client';

import { SquareUserRound, Sun, Moon } from "lucide-react"; // Added Sun and Moon
import { useTheme } from "next-themes"; // Added useTheme hook
import { useEffect, useState } from "react"; // Added for safety
import Link from "next/link"

export default function TopBar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // This ensures the component is fully loaded before showing the button
    useEffect(() => setMounted(true), []);

    return(
        <div id="top" className="flex items-center bg-white dark:bg-slate-900 p-4 space-x-4 border-b border-gray-200 dark:border-gray-700 w-full justify-center">
            <SquareUserRound size={40} className="text-gray-600 dark:text-gray-300"/>
            
            <Link
                href="/login"
                className="inline-block rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
            >
                Log in
            </Link>
            
            <Link
                href="/register"
                className="inline-block rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                Sign up
            </Link>

            {/* --- Theme Toggle Button --- */}
            {mounted && (
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-300 dark:border-gray-600"
                    aria-label="Toggle Dark Mode"
                >
                    {theme === "dark" ? (
                        <Sun size={20} className="text-yellow-400" />
                    ) : (
                        <Moon size={20} className="text-blue-600" />
                    )}
                </button>
            )}
        </div>
    );
}