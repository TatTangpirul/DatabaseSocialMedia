'use client';

import { useEffect, useState } from 'react';
import { Flame, Heart, CircleUserRound, Crown, Wheat } from 'lucide-react';

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

  useEffect(() => {
    async function fetchHotPosts() {
      try {
        const res = await fetch('/api/posts/hot-today?limit=3');
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch hot posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHotPosts();
  }, []);

  // Helper function to get rank badge styles
  const getRankBadge = (index: number) => {
    const colors = [
      'bg-yellow-400 text-yellow-900',      // Gold for 1st
      'bg-gray-300 text-gray-700',          // Silver for 2nd
      'bg-amber-600 text-amber-100',        // Bronze for 3rd
    ];
    return `w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${colors[index]}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Flame size={20} className="text-orange-500" />
          Today's Hottest
        </h2>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Flame size={20} className="text-orange-500" />
          Today's Hottest
        </h2>
        <p className="text-gray-500 text-sm">No posts today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Flame size={20} className="text-orange-500" />
        Today's Hottest
      </h2>
      <ul className="space-y-3">
        {posts.map((post, index) => (
          <li key={post.id} className="border-b border-gray-100 pb-3 last:border-0">
            <div className="flex items-start gap-3">
              {/* Rank Badge */}
              <div className={getRankBadge(index)}>
                {index + 1}
              </div>

              {/* Avatar with champion decorations for first place */}
              <div className="relative shrink-0">
                {/* Wheat ears on both sides (only for 1st place) */}
                {index === 0 && (
                  <>
                    <Wheat
                      size={20}
                      className="absolute -left-3 top-5 -translate-y-1/2 text-yellow-500 fill-yellow-500 -rotate-90"
                    />
                    <Wheat
                      size={20}
                      className="absolute -right-3 top-5 -translate-y-1/2 text-yellow-500 fill-yellow-500 -rotate-0"
                    />
                  </>
                )}

                {/* Avatar image or fallback icon */}
                {post.profile_image_url ? (
                  <img
                    src={post.profile_image_url}
                    alt={post.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <CircleUserRound size={32} className="text-gray-400" />
                )}

                {/* Crown on top for 1st place */}
                {index === 0 && (
                  <Crown
                    size={16}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-500 fill-yellow-500"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  @{post.username}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                  {post.content || <span className="text-gray-400 italic">(Image post)</span>}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Heart size={14} className="fill-red-500 text-red-500" />
                  <span className="text-xs text-gray-500">{post.likes_count}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}