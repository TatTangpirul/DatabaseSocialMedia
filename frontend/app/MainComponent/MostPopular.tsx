'use client';

import { useEffect, useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface PopularUser {
    id: number;
    username: string;
    profile_image_url: string | null;
    total_likes: number;
    n_posts: number;
}

export default function MostPopular() {
    const [users, setUsers] = useState<PopularUser[]>([]);
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        fetch('/api/popular')
            .then(res => res.json())
            .then(data => { if (data.success) setUsers(data.users); })
            .catch(console.error);
    }, []);

    return (
        <div className={`w-64 rounded-lg shadow-lg p-4 ${isDark ? 'bg-[#141519]' : 'bg-white'}`}>
            <h2 className={`font-bold text-lg mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Trending Accounts</h2>
            <div className="space-y-3">
                {users.map((u, i) => (
                    <div
                        key={u.id}
                        onClick={() => router.push(`/${u.username}`)}
                        className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}
                    >
                        <span className={`text-xs font-bold w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{i + 1}</span>
                        {u.profile_image_url ? (
                            <img
                                src={u.profile_image_url}
                                alt={u.username}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <CircleUserRound size={32} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{u.username}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{u.total_likes} likes · {u.n_posts} posts</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}