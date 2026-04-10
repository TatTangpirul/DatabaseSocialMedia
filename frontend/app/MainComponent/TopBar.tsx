'use client';

import Link from 'next/link';
import { Send, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { useState } from 'react';

export default function TopBar() {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div id="top" className="fixed top-0 left-0 right-0 bg-white z-50 shadow h-[60px]">
            <div className="relative w-full h-full">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px] h-full flex items-center justify-end gap-2">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform flex items-center justify-center ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                            {darkMode ? (
                                <Moon size={10} className="text-gray-700" />
                            ) : (
                                <Sun size={10} className="text-gray-700" />
                            )}
                        </div>
                    </button>
                    <div className="flex items-center p-2 h-10 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-400">
                        <Send size={20} className="text-gray-600" />
                    </div>
                    <div className="flex items-center p-2 h-10 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-400">
                        <Settings size={20} className="text-gray-600" />
                    </div>
                    {user ? (
                        <>
                            <ProfileDropdown />
                        </>
                    ) : null}
                </div>
                
                {/* Login buttons - positioned at the right end of the screen */}
                {!user && (
                    <div className="absolute right-4 h-full flex items-center gap-2">
                        <Link
                            href="/login"
                            className="inline-block rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="inline-block rounded-md bg-gray-200 px-3 py-1.5 text-gray-800 hover:bg-gray-300"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}