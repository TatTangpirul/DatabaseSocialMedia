'use client';

import Link from 'next/link';
import { Settings, Sun, Moon, Search, ListFilterPlus, CircleUserRound, Clock, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import ProfileDropdown from './ProfileDropdown';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchUsers, SearchResult } from '@/lib/util/searchHandler';

export function TopBar() {
    const { user } = useAuth();
    const { sortType, setSortType } = useFeed();
    const [darkMode, setDarkMode] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setFilterOpen(false);
            }
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
        }, 300); // debounce 300ms

        return () => clearTimeout(delay);
    }, [searchQuery]);

    return (
        <div id="top" className="fixed top-0 left-0 right-0 bg-white z-50 shadow h-[60px]">
            <div className="relative w-full h-full">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px] h-full flex items-center justify-between gap-2">
                    <div ref={searchRef} className="relative bg-gray-100 hover:bg-gray-300 rounded-lg h-9 w-70">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full pl-2 pr-8 bg-transparent rounded-lg outline-none text-sm"
                            placeholder="Search..."
                        />
                        <Search
                            size={15}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        />
                        {searchOpen && searchResults.length > 0 && (
                            <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 z-50">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => {
                                            router.push(`/${result.username}`);
                                            setSearchQuery('');
                                            setSearchOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                                    >
                                        {result.profile_image_url ? (
                                            <img
                                                src={result.profile_image_url}
                                                alt={result.username}
                                                className="w-7 h-7 rounded-full object-cover"
                                            />
                                        ) : (
                                            <CircleUserRound size={28} className="text-gray-400" />
                                        )}
                                        <span className="text-sm text-gray-700">{result.username}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform flex items-center justify-center ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                                {darkMode ? (
                                    <Moon size={10} className="text-gray-700" />
                                ) : (
                                    <Sun size={10} className="text-gray-700" />
                                )}
                            </div>
                        </button>

                        {/* Filter dropdown */}
                        <div ref={filterRef} className="relative">
                            <div
                                onClick={() => setFilterOpen(!filterOpen)}
                                className={`flex items-center p-2 h-10 rounded-md cursor-pointer hover:bg-gray-300 ${filterOpen ? 'bg-gray-300' : 'bg-gray-200'}`}
                            >
                                <ListFilterPlus size={20} className="text-gray-600" />
                            </div>
                            {filterOpen && (
                                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 z-50">
                                    <button
                                        onClick={() => { setSortType('time'); setFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer ${sortType === 'time' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                                    >
                                        <Clock size={14} />
                                        Sort by time
                                    </button>
                                    <button
                                        onClick={() => { setSortType('popularity'); setFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer ${sortType === 'popularity' ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}
                                    >
                                        <Flame size={14} />
                                        Sort by popularity
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center p-2 h-10 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                            <Settings size={20} className="text-gray-600" />
                        </div>
                        {user ? (
                            <ProfileDropdown />
                        ) : null}
                    </div>
                </div>

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