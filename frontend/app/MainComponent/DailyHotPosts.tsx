'use client';

import { useEffect, useState } from 'react';
import { Flame, Heart, CircleUserRound, Crown, Wheat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface HotPost {
  id: number;
  content: string;
  username: string;
  likes_count: number;
  profile_image_url: string | null;
}

export default function DailyHotPosts() {
  const [posts, setPosts] = useState<HotPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchHotPosts() {
      try {
        const res = await fetch('/api/posts/hot-today?limit=3');
        const data = await res.json();
        if (data.success) setPosts(data.posts);
      } catch (error) {
        console.error('Failed to fetch hot posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHotPosts();
  }, []);

  const getRankBadge = (index: number) => {
    const colors = [
      'bg-yellow-400 text-yellow-900',
      'bg-gray-300 text-gray-700',
      'bg-amber-600 text-amber-100',
    ];
    return `w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${colors[index]}`;
  };

  if (loading) {
    return (
      <div className={`rounded-lg shadow p-4 ${isDark ? 'bg-[#141519]' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          <Flame size={20} className="text-orange-500" />
          Today's Hottest
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`rounded-lg shadow p-4 ${isDark ? 'bg-[#141519]' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          <Flame size={20} className="text-orange-500" />
          Today's Hottest
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No posts today.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow p-4 ${isDark ? 'bg-[#141519]' : 'bg-white'}`}>
      <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        <Flame size={20} className="text-orange-500" />
        Today's Hottest
      </h2>
      <ul className="space-y-3">
        {posts.map((post, index) => (
          <li key={post.id} className={`border-b pb-3 last:border-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-start gap-3">
              <div className={getRankBadge(index)}>
                {index + 1}
              </div>

              <div className="relative shrink-0">
                {index === 0 && (
                  <>
                    <Wheat size={20} className="absolute -left-3 top-5 -translate-y-1/2 text-yellow-500 fill-yellow-500 -rotate-90" />
                    <Wheat size={20} className="absolute -right-3 top-5 -translate-y-1/2 text-yellow-500 fill-yellow-500 -rotate-0" />
                  </>
                )}

                {post.profile_image_url ? (
                  <img
                    src={post.profile_image_url}
                    alt={post.username}
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                    onClick={() => router.push(`/${post.username}`)}
                  />
                ) : (
                  <CircleUserRound
                    size={32}
                    className={`cursor-pointer ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                    onClick={() => router.push(`/${post.username}`)}
                  />
                )}

                {index === 0 && (
                  <Crown size={16} className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-500 fill-yellow-500" />
                )}
              </div>

              <div className="flex-1 min-w-0 ml-2">
                <p
                  className={`text-sm font-medium truncate cursor-pointer hover:underline ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                  onClick={() => router.push(`/${post.username}`)}
                >
                  <b>{post.username}</b>
                </p>
                <p className={`text-sm line-clamp-1 mt-0.5 overflow-hidden ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.content || <span className={`italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>(Image post)</span>}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Heart size={14} className="fill-red-500 text-red-500" />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{post.likes_count}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}