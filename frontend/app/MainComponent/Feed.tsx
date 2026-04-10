// app/components/Feed.tsx
'use client';

import { useEffect, useState } from 'react';
import { CircleUserRound, ImageIcon, SquareUserRound, Heart } from 'lucide-react';
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
  liked?: boolean;
  likeLoading?: boolean;
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
          const postsWithLikes = await Promise.all(
            data.posts.map(async (post: Post) => {
              if (!user) return { ...post, liked: false };
              try {
                const likeRes = await fetch(`/api/posts/${post.id}/like?userId=${user.id}`);
                const likeData = await likeRes.json();
                return { ...post, liked: likeData.liked };
              } catch {
                return { ...post, liked: false };
              }
            })
          );
          setPosts(postsWithLikes);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [user]);

  async function toggleLike(postId: number) {
    if (!user) return;
    
    const currentPost = posts.find(p => p.id === postId);
    if (currentPost?.likeLoading) return;

    setPosts(posts.map(p => 
      p.id === postId ? { ...p, likeLoading: true } : p
    ));

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        setPosts(prevPosts => prevPosts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                liked: data.liked, 
                likes_count: data.liked ? p.likes_count + 1 : p.likes_count - 1,
                likeLoading: false 
              }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likeLoading: false } : p
      ));
    }
  }

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
      <div className="">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="w-150 bg-white p-4 rounded-lg shadow-lg space-y-4 mb-6">
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
              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={() => toggleLike(post.id)}
                  disabled={post.likeLoading}
                  className={`flex items-center gap-1 text-sm ${post.likeLoading ? 'opacity-50' : ''}`}
                >
                  <Heart 
                    size={16} 
                    className={post.liked && post.likes_count > 0 ? 'fill-red-500 text-red-500' : 'text-gray-500'} 
                  />
                  <span className="text-gray-500">{post.likes_count}</span>
                </button>
              </div>
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