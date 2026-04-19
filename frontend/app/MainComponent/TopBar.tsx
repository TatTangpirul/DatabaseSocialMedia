'use client';

import Link from 'next/link';
import { Settings, Sun, Moon, Search, ListFilterPlus, CircleUserRound, Clock, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import ProfileDropdown from './ProfileDropdown';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchUsers, SearchResult } from '@/lib/util/searchHandler';
import { useTheme } from 'next-themes';

export function TopBar() {
    const { user } = useAuth();
    const { sortType, setSortType } = useFeed();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const isDark = theme === 'dark';

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (searchQuery.trim()) {
                const results = await searchUsers(searchQuery);
                setSearchResults(results);
                setSearchOpen(true);
            } else {
                setSearchResults([]);
                setSearchOpen(false);
            }
        }, 300);
        return () => clearTimeout(delay);
    }, [searchQuery]);

    return (
        <div id="top" className={`fixed top-0 left-0 right-0 z-50 shadow h-[60px] ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="relative w-full h-full">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px] h-full flex items-center justify-between gap-2">
                    <div ref={searchRef} className={`relative rounded-lg h-9 w-70 transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-300'}`}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full h-full pl-2 pr-8 bg-transparent rounded-lg outline-none text-sm ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-800'}`}
                            placeholder="Search..."
                        />
                        <Search size={15} className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                        {searchOpen && searchResults.length > 0 && (
                            <div className={`absolute left-0 top-full mt-1 w-full rounded-md shadow-lg border z-50 ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                {searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => { router.push(`/${result.username}`); setSearchQuery(''); setSearchOpen(false); }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-left ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}
                                    >
                                        {result.profile_image_url ? (
                                            <img src={result.profile_image_url} className="w-7 h-7 rounded-full object-cover" />
                                        ) : (
                                            <CircleUserRound size={28} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                        )}
                                        <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{result.username}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {mounted && (
                            <button
                                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform flex items-center justify-center ${isDark ? 'translate-x-6' : 'translate-x-0'}`}>
                                    {isDark ? <Moon size={10} className="text-gray-700" /> : <Sun size={10} className="text-gray-700" />}
                                </div>
                            </button>
                        )}

                        <div ref={filterRef} className="relative">
                            <div
                                onClick={() => setFilterOpen(!filterOpen)}
                                className={`flex items-center p-2 h-10 rounded-md cursor-pointer transition-colors ${filterOpen ? (isDark ? 'bg-gray-600' : 'bg-gray-300') : (isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')}`}
                            >
                                <ListFilterPlus size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                            </div>
                            {filterOpen && (
                                <div className={`absolute right-0 top-full mt-2 w-44 rounded-md shadow-lg border z-50 ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                    <button
                                        onClick={() => { setSortType('time'); setFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer ${sortType === 'time' ? 'text-blue-600 font-semibold' : (isDark ? 'text-gray-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50')}`}
                                    >
                                        <Clock size={14} />
                                        Sort by time
                                    </button>
                                    <button
                                        onClick={() => { setSortType('popularity'); setFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer ${sortType === 'popularity' ? 'text-orange-500 font-semibold' : (isDark ? 'text-gray-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50')}`}
                                    >
                                        <Flame size={14} />
                                        Sort by popularity
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link href="/changeInfo">
                            <div className={`flex items-center p-2 h-10 rounded-md cursor-pointer transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                <Settings size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                            </div>
                        </Link>

                        {user ? <ProfileDropdown /> : null}
                    </div>
                </div>

                {!user && (
                    <div className="absolute right-4 h-full flex items-center gap-2">
                        <Link href="/login" className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">
                            Log in
                        </Link>
                        <Link href="/register" className={`rounded-md px-3 py-1.5 ${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}