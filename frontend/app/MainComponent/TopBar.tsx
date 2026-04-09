'use client';

import Link from 'next/link';
import { Cog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

export default function TopBar() {
    const { user } = useAuth();

    return (
        <div id="top" className="fixed top-0 left-0 right-0 bg-white z-50 shadow h-[60px]">
            <div className="max-w-[600px] mx-auto h-full flex items-center justify-end gap-2">
                {!user ? (
                    <>
                        <Link
                            href="/login"
                            className="inline-block rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="inline-block rounded-md bg-gray-200 px-3 py-1.5 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Sign up
                        </Link>
                    </>
                ) : null}
                {user ? (
                        <>
                            <div className="p-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-400">
                                <Cog size={24} className="text-gray-600" />
                            </div>
                            <ProfileDropdown />
                        </>
                ) : null}
            </div>
        </div>
    );
}