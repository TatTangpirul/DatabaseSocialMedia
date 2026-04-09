// app/components/Feed.tsx
'use client';

import { useEffect, useState } from 'react';
import { CircleUserRound, ImageIcon, SquareUserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PostForm from './PostForm';

interface Post {
  id: number;
  content: string;
  image_url: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  username: string;
  profile_image_url: string;
}

export default function Feed() {
  const { user } = useAuth();
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
      <div className="w-150 bg-white p-4 rounded shadow-lg">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="">
      { user ? (
        <div className="w-150 bg-white p-4 rounded-lg shadow-lg space-y-4 mb-6">
          <PostForm />
        </div>
      ) : null}

      {/* Posts List */}
      <div className="w-150 bg-white p-4 rounded-lg shadow-lg space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border-b pb-2 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                {post.profile_image_url ? (
                  <img
                    src={post.profile_image_url}
                    alt={post.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <CircleUserRound size={48} className="text-gray-600" />
                )}
                <p className="font-semibold text-sm">{post.username}</p>
              </div>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post image"
                  className="w-full object-cover rounded-md my-2"
                />
              )}
              <p className="text-xs text-gray-600 truncate">{post.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}