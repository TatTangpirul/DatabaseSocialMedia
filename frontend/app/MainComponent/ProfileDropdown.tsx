'use client';

import { useState, useEffect, useRef } from 'react';
import { Power, SquareUserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // close when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
    };

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(!open)} className="w-10 h-10 flex items-center justify-center cursor-pointer hover:brightness-75">
                {user?.profile_image_url ? (
                    <img
                        src={user.profile_image_url}
                        alt="Profile"
                        className="w-full h-full rounded-lg object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.removeAttribute('style');
                        }}
                    />
                ) : (
                    <SquareUserRound size={40} className="text-gray-600" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-100 z-50">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    >
                        <Power size={16} className="text-gray-600" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}