'use client';

import { useEffect, useState } from 'react';
import { CircleUserRound, Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useFeed } from '../context/FeedContext';
import { usePostInteractions, Post } from './usePostInteractions'; // Ensure this import matches your file structure
import PostForm from './PostForm';

export default function Feed() {
  const { user } = useAuth();
  const { sortType } = useFeed();
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
      <div className="w-150 bg-white dark:bg-slate-800 p-4 rounded shadow-lg dark:text-white">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="w-150 flex flex-col items-center">
      {user && (
        <div className="w-150 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg space-y-4 mb-6">
          <PostForm onPostSuccess={() => fetchPosts()} />
        </div>
      )}
      
      <div className="w-150 flex flex-col items-center">
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="relative w-150 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg space-y-4 mb-6 dark:border dark:border-gray-700"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => { setHoveredPost(null); setMenuOpen(null); }}
            >
              {/* Menu */}
              {hoveredPost === post.id && user?.account === post.username && (
                  <div className="absolute top-3 right-3">
                      <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === post.id ? null : post.id); }}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400"
                      >
                          <MoreHorizontal size={18} />
                      </button>
                  </div>
              )}
              {menuOpen === post.id && (
                  <div className="absolute top-10 right-3 w-36 bg-white dark:bg-slate-700 border dark:border-gray-600 rounded-lg shadow-lg z-10 overflow-hidden">
                      <button
                          onClick={() => { setEditingPost(post.id); setEditContent(post.content); setMenuOpen(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 flex items-center gap-2"
                      >
                          <Pencil size={14} />
                          Edit post
                      </button>
                      <button
                          onClick={() => { deletePost(post.id); setMenuOpen(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
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
                  <CircleUserRound size={48} className="text-gray-600 dark:text-gray-400" />
                )}
                <p className="font-semibold text-sm dark:text-white">{post.username}</p>
              </div>

              {/* Content */}
              {post.image_url && <img src={post.image_url} className="w-full object-cover rounded-md my-2" />}
              {editingPost === post.id ? (
                  <div className="flex flex-col gap-2">
                      <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-slate-700 dark:text-white"
                          rows={3}
                      />
                      <div className="flex gap-2 justify-end">
                          <button
                              onClick={() => { setEditingPost(null); setEditContent(''); }}
                              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
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
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-4">{post.content}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-2">
                <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-sm">
                  <Heart size={16} className={post.liked ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'} />
                  <span className="text-gray-500 dark:text-gray-400">{post.likes_count}</span>
                </button>
                <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 text-sm">
                  <MessageCircle size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">{post.comments_count}</span>
                </button>
              </div>

              {/* Comments Section */}
              {post.showComments && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-3">
                  {post.comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      {comment.profile_image_url ? (
                        <img src={comment.profile_image_url} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <CircleUserRound size={32} className="text-gray-400 dark:text-gray-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold dark:text-white">{comment.username}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {user && (
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="w-full text-xs rounded px-2 py-1 bg-gray-50 dark:bg-slate-700 dark:text-white"
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