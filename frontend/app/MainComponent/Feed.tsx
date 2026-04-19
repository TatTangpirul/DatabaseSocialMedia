'use client';

import { useEffect, useState } from 'react';
import { CircleUserRound, Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useFeed } from '../context/FeedContext';
import { usePostInteractions, Post } from './usePostInteractions';
import PostForm from './PostForm';
import { useTheme } from 'next-themes';

export default function Feed() {
  const { user } = useAuth();
  const { sortType } = useFeed();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const {
      posts,
      setPosts,
      editingPost,
      setEditingPost,
      editContent,
      setEditContent,
      toggleLike,
      toggleComments,
      addComment,
      deletePost,
      editPost,
  } = usePostInteractions({ initialPosts: [], userId: user?.id });

  async function fetchPosts(showLoading = false) {
    if (showLoading) setLoading(true);
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

  if (loading) {
    return (
      <div className={`w-150 p-4 rounded shadow-lg ${isDark ? 'bg-[#141519] text-white' : 'bg-white text-gray-800'}`}>
        Loading posts...
      </div>
    );
  }

  return (
    <div className="w-150 flex flex-col items-center">
      {user && (
        <div className={`w-150 p-4 rounded-lg shadow-lg space-y-4 mb-6 ${isDark ? 'bg-[#141519] border border-gray-700' : 'bg-white'}`}>
          <PostForm onPostSuccess={() => fetchPosts()} />
        </div>
      )}
      
      <div className="w-150 flex flex-col items-center">
        {posts.length === 0 ? (
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={`relative w-150 p-4 rounded-lg shadow-lg space-y-4 mb-6 ${isDark ? 'bg-[#141519] border border-gray-700' : 'bg-white'}`}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => { setHoveredPost(null); setMenuOpen(null); }}
            >
              {/* Menu */}
              {hoveredPost === post.id && user?.account === post.username && (
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === post.id ? null : post.id); }}
                    className={`p-1 rounded-full text-gray-400 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              )}
              {menuOpen === post.id && (
                <div className={`absolute top-10 right-3 w-36 rounded-lg shadow-lg z-10 overflow-hidden border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                  <button
                    onClick={() => { setEditingPost(post.id); setEditContent(post.content); setMenuOpen(null); }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${isDark ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Pencil size={14} />
                    Edit post
                  </button>
                  <button
                    onClick={() => { deletePost(post.id); setMenuOpen(null); }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-red-500 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-red-50'}`}
                  >
                    <Trash2 size={14} />
                    Delete post
                  </button>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={() => router.push(`/${post.username}`)}>
                {post.profile_image_url ? (
                  <img src={post.profile_image_url} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <CircleUserRound size={48} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                )}
                <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{post.username}</p>
              </div>

              {/* Content */}
              {post.image_url && <img src={post.image_url} className="w-full object-cover rounded-md my-2" />}
              {editingPost === post.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isDark ? 'bg-slate-700 text-white border-gray-600' : 'bg-white text-gray-800'}`}
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setEditingPost(null); setEditContent(''); }}
                      className={`px-3 py-1 text-sm rounded-md ${isDark ? 'text-gray-300 bg-gray-600 hover:bg-gray-500' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => editPost(post.id)}
                      disabled={!editContent.trim()}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`text-sm truncate mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{post.content}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-2">
                <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-sm">
                  <Heart size={16} className={post.liked ? 'fill-red-500 text-red-500' : (isDark ? 'text-gray-400' : 'text-gray-500')} />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{post.likes_count}</span>
                </button>
                <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 text-sm">
                  <MessageCircle size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{post.comments_count}</span>
                </button>
              </div>

              {/* Comments Section */}
              {post.showComments && (
                <div className={`mt-3 pt-3 border-t space-y-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  {post.comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      {comment.profile_image_url ? (
                        <img src={comment.profile_image_url} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <CircleUserRound size={32} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                      )}
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{comment.username}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {user && (
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className={`w-full text-xs rounded px-2 py-1 ${isDark ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-800'}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addComment(post.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}