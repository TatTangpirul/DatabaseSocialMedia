// app/components/Feed.tsx
'use client';

import { useEffect, useState } from 'react';

interface Post {
  id: number;
  content: string;
  image_url: string;
  likes_count: number;
  created_at: string;
  username: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-10 font-bold text-blue-800">
        Loading HKUgram Feed...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts yet.</p>
        ) : (
          posts.map((post) => (
            /* Main Post Container: Matching the HKUgram Blue Border style */
            <div key={post.id} className="border-2 border-blue-900 bg-blue-50 shadow-md">

              {/* Top Header */}
              <div className="flex justify-between items-center p-2 border-b-2 border-blue-900 font-bold">
                <span className="text-lg">HKUgram</span>
                <span className="text-sm">User: {post.username || 'User 1'}</span>
              </div>

              {/* Date/Time */}
              <div className="text-right p-1 text-xs font-semibold">
                {new Date(post.created_at).toLocaleString()}
              </div>

              {/* IMAGE VISUALIZATION: The core of your role */}
              <div className="border-b-2 border-blue-900 bg-white">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt="Post content"
                    className="w-full h-auto block"
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    Photo Here
                  </div>
                )}
              </div>

              {/* Likes Row */}
              <div className="p-2 font-bold border-b-2 border-blue-900">
                Likes {post.likes_count}
              </div>

              {/* Bottom Row: Text and Like Button */}
              <div className="flex items-stretch">
                <div className="flex-1 p-3 text-sm font-medium">
                  {post.content}
                </div>
                <button className="bg-red-600 text-white px-8 font-bold border-l-2 border-blue-900 hover:bg-red-700 transition-colors">
                  Like
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Bottom Buttons as seen in the example */}
      <div className="flex space-x-2 mt-6 w-full max-w-md">
        <button className="flex-1 py-2 bg-gray-200 border-2 border-black font-bold">Refresh</button>
        <button className="flex-1 py-2 bg-green-500 text-white border-2 border-black font-bold">New Post</button>
      </div>
    </div>
  );
}