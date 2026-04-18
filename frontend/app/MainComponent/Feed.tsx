'use client';

import { useEffect, useState } from 'react';
import { CircleUserRound, Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Post } from './usePostInteractions';
import PostForm from './PostForm';
import { useRouter } from 'next/navigation';
import { useFeed } from '../context/FeedContext';

export default function Feed() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const { sortType } = useFeed();

  async function fetchPosts(loading = false) {
    if (loading) setLoading(true);
    try {
      const response = await fetch(`/api/posts?sort=${sortType}`);
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

  useEffect(() => {
    fetchPosts(true);
  }, [user, sortType]);

  async function toggleLike(postId: number) {
    if (!user) return;
    const currentPost = posts.find(p => p.id === postId);
    if (currentPost?.likeLoading) return;
    setPosts(posts.map(p => p.id === postId ? { ...p, likeLoading: true } : p));
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, liked: data.liked, likes_count: data.liked ? p.likes_count + 1 : p.likes_count - 1, likeLoading: false } : p));
      }
    } catch (error) {
      setPosts(posts.map(p => p.id === postId ? { ...p, likeLoading: false } : p));
    }
  }

  async function toggleComments(postId: number) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    if (!post.showComments && !post.comments) {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        const data = await response.json();
        if (data.success) {
          setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, comments: data.comments, showComments: true } : p));
        }
      } catch (error) { console.error(error); }
    } else {
      setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, showComments: !p.showComments } : p));
    }
  }

  async function addComment(postId: number, content: string) {
    if (!user || !content.trim()) return;
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content }),
      });
      const data = await response.json();
      if (data.success) {
        setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, comments: [data.comment, ...(p.comments || [])], comments_count: p.comments_count + 1 } : p));
      }
    } catch (error) { console.error(error); }
  }

  if (loading) return <div className="w-150 bg-white dark:bg-slate-800 p-4 rounded shadow-lg dark:text-white">Loading posts...</div>;

  return (
    <div className="w-full flex flex-col items-center">
      {user && <div className="w-150 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg space-y-4 mb-6"><PostForm onPostSuccess={() => fetchPosts()} /></div>}
      <div className="w-full flex flex-col items-center">
        {posts.length === 0 ? <p className="text-gray-500 dark:text-gray-400 text-sm">No posts yet.</p> : posts.map((post) => (
          <div key={post.id} className="relative w-150 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg space-y-4 mb-6 border dark:border-gray-700" onMouseEnter={() => setHoveredPost(post.id)} onMouseLeave={() => { setHoveredPost(null); setMenuOpen(null); }}>
            {hoveredPost === post.id && user?.account === post.username && (
              <div className="absolute top-3 right-3">
                <button onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400"><MoreHorizontal size={18} /></button>
                {menuOpen === post.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-700 border dark:border-gray-600 rounded-lg shadow-lg z-10">
                    <button onClick={() => setMenuOpen(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 flex items-center gap-2"><Pencil size={14} />Edit</button>
                    <button onClick={() => setMenuOpen(null)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={() => router.push(`/${post.username}`)}>
              {post.profile_image_url ? <img src={post.profile_image_url} className="w-10 h-10 rounded-full object-cover" /> : <CircleUserRound size={48} className="text-gray-600 dark:text-gray-400" />}
              <p className="font-semibold text-sm dark:text-white">{post.username}</p>
            </div>
            {post.image_url && <img src={post.image_url} className="w-full object-cover rounded-md my-2" />}
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-4">{post.content}</p>
            <div className="flex items-center gap-4 mt-2">
              <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-sm"><Heart size={16} className={post.liked ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'} /><span className="text-gray-500 dark:text-gray-400">{post.likes_count}</span></button>
              <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 text-sm"><MessageCircle size={16} className="text-gray-500 dark:text-gray-400" /><span className="text-gray-500 dark:text-gray-400">{post.comments_count}</span></button>
            </div>
            {post.showComments && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-3">
                {post.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    {comment.profile_image_url ? <img src={comment.profile_image_url} className="w-8 h-8 rounded-full object-cover" /> : <CircleUserRound size={32} className="text-gray-400 dark:text-gray-500" />}
                    <div className="flex-1"><p className="text-xs font-semibold dark:text-white">{comment.username}</p><p className="text-xs text-gray-600 dark:text-gray-400">{comment.content}</p></div>
                  </div>
                ))}
                {user && <input type="text" placeholder="Write a comment..." className="w-full text-xs rounded px-2 py-1 bg-gray-50 dark:bg-slate-700 dark:text-white" onKeyDown={(e) => { if (e.key === 'Enter') { addComment(post.id, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}