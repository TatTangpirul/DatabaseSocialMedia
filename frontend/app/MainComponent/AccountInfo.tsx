'use client';

import { CircleUserRound, Home, Newspaper, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function AccountInfo() {
    const { user } = useAuth();
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const menuItems = [
        { icon: Home, label: 'Feed', path: '/' },
        { icon: Newspaper, label: 'Your Posts', path: `/${user?.account}` },
        { icon: Settings, label: 'Settings', path: '/changeInfo' },
    ];

    return (
        <div className={`w-64 rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-[#141519]' : 'bg-white'}`}>
            <div className="h-24 overflow-hidden">
                <img
                    src='/image.png'
                    alt="Banner"
                    className="w-full h-full object-cover object-top"
                />
            </div>

            {/* Profile image */}
            <div className="flex justify-center -mt-10 mb-2">
                {user?.profile_image_url ? (
                    <img
                        src={user.profile_image_url}
                        alt="Profile"
                        className={`w-20 h-20 rounded-xl object-cover border-4 shadow ${isDark ? 'border-[#141519]' : 'border-white'}`}
                    />
                ) : (
                    <div className={`w-20 h-20 rounded-xl border-4 shadow flex items-center justify-center ${isDark ? 'border-[#141519] bg-slate-700' : 'border-white bg-gray-100'}`}>
                        <CircleUserRound size={48} className={isDark ? 'text-gray-400' : 'text-gray-400'} />
                    </div>
                )}
            </div>

            {/* Name and bio */}
            <div className="text-center px-4 pb-4">
                <h2
                    className={`text-lg font-bold cursor-pointer hover:underline ${isDark ? 'text-white' : 'text-gray-900'}`}
                    onClick={() => router.push(`/${user?.account}`)}
                >
                    {user?.account ?? 'Guest'}
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.bio ?? 'No bio yet'}
                </p>
            </div>

            {/* Stats */}
            <div className={`flex items-center justify-around px-4 py-3 border-t border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="text-center">
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.n_posts ?? 0}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Posts</p>
                </div>
                <div className={`w-px h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="text-center">
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.followers ?? 0}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Followers</p>
                </div>
                <div className={`w-px h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="text-center">
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.n_likes ?? 0}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Likes</p>
                </div>
            </div>

            {/* Menu */}
            <div className="px-4 py-3 space-y-1">
                {menuItems.map(({ icon: Icon, label, path }) => (
                    <button
                        key={label}
                        onClick={() => router.push(path)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <Icon size={20} />
                        <span className="font-semibold text-sm">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}