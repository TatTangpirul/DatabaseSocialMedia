'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CircleUserRound, Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import { usePostInteractions } from '../MainComponent/usePostInteractions';
import { useTheme } from 'next-themes';

interface Post {
    id: number;
    content: string;
    image_url: string;
    likes_count: number;
    comments_count: number;
    updated_at: string;
    username: string;
    profile_image_url: string;
    liked?: boolean;
    likeLoading?: boolean;
    comments?: Comment[];
    showComments?: boolean;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    username: string;
    profile_image_url: string;
}

export default function UserPage() {
    const { user } = useAuth();
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const { sortType } = useFeed();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [hoveredPost, setHoveredPost] = useState<number | null>(null);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const {
        posts, setPosts,
        editingPost, setEditingPost,
        editContent, setEditContent,
        toggleLike, toggleComments, addComment, deletePost, editPost,
        navigateToUser,
    } = usePostInteractions({ initialPosts: [], userId: user?.id });

    async function fetchUserPosts() {
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${username}?sort=${sortType}`);
            const data = await res.json();
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
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserPosts();
    }, [username, sortType, user]);

    if (loading) return (
        <div className={`w-150 p-8 rounded-lg shadow-lg ${isDark ? 'bg-bg-[#141519] text-white' : 'bg-white text-gray-800'}`}>
            Loading posts...
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-4 px-4">
            {posts.length === 0 ? (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.id}
                        className={`relative w-150 p-4 rounded-lg shadow-lg space-y-2 ${isDark ? 'bg-[#141519] border border-gray-700' : 'bg-white'}`}
                        onMouseEnter={() => setHoveredPost(post.id)}
                        onMouseLeave={() => { setHoveredPost(null); setMenuOpen(null); }}
                    >
                        {hoveredPost === post.id && user?.account === post.username && (
                            <div className="absolute top-3 right-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === post.id ? null : post.id); }}
                                    className={`p-1 rounded-full text-gray-400 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        )}

                        {menuOpen === post.id && (
                            <div className={`absolute top-10 right-3 w-36 rounded-lg shadow-lg z-10 overflow-hidden border ${isDark ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                                <button
                                    onClick={() => { setEditingPost(post.id); setEditContent(post.content); setMenuOpen(null); }}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${isDark ? 'text-gray-200 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <Pencil size={14} />
                                    Edit post
                                </button>
                                <button
                                    onClick={() => { deletePost(post.id); setMenuOpen(null); }}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-red-500 ${isDark ? 'hover:bg-slate-600' : 'hover:bg-red-50'}`}
                                >
                                    <Trash2 size={14} />
                                    Delete post
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {post.profile_image_url ? (
                                <img src={post.profile_image_url} alt={post.username} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <CircleUserRound size={40} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                            )}
                            <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{post.username}</p>
                        </div>

                        {post.image_url && (
                            <img src={post.image_url} alt="Post" className="w-full rounded-md object-cover" />
                        )}

                        {editingPost === post.id ? (
                            <div className="flex flex-col gap-2">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className={`w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isDark ? 'bg-slate-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                                    rows={3}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => { setEditingPost(null); setEditContent(''); }}
                                        className={`px-3 py-1 text-sm rounded-md ${isDark ? 'text-gray-300 bg-slate-600 hover:bg-slate-500' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
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
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{post.content}</p>
                        )}

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleLike(post.id)}
                                disabled={post.likeLoading}
                                className={`flex items-center gap-1 text-sm cursor-pointer ${post.likeLoading ? 'opacity-50' : ''}`}
                            >
                                <Heart size={16} className={post.liked && post.likes_count > 0 ? 'fill-red-500 text-red-500' : (isDark ? 'text-gray-400' : 'text-gray-500')} />
                                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{post.likes_count}</span>
                            </button>
                            <button
                                onClick={() => toggleComments(post.id)}
                                className="flex items-center gap-1 text-sm cursor-pointer"
                            >
                                <MessageCircle size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{post.comments_count}</span>
                            </button>
                        </div>

                        {post.showComments && (
                            <div className={`mt-3 pt-3 border-t space-y-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                {post.comments?.map((comment) => (
                                    <div key={comment.id} className="flex gap-2">
                                        {comment.profile_image_url ? (
                                            <img
                                                src={comment.profile_image_url}
                                                alt={comment.username}
                                                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                                                onClick={() => navigateToUser(comment.username)}
                                            />
                                        ) : (
                                            <CircleUserRound
                                                size={32}
                                                className={`cursor-pointer ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                                                onClick={() => navigateToUser(comment.username)}
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p
                                                className={`text-xs font-semibold cursor-pointer hover:underline ${isDark ? 'text-white' : 'text-gray-800'}`}
                                                onClick={() => navigateToUser(comment.username)}
                                            >
                                                {comment.username}
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {user && (
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        className={`w-full flex-1 text-xs rounded px-2 py-1 border ${isDark ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800'}`}
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
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(post.updated_at).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    );
}