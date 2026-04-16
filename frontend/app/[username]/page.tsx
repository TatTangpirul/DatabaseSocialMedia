'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CircleUserRound, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';

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
}

export default function UserPage() {
    const { user } = useAuth();
    const { username } = useParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { sortType } = useFeed();

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

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex flex-col items-center gap-4 px-4">

            {/* <h1 className="text-xl font-bold text-gray-800">{username}'s posts</h1> */}
            {posts.length === 0 ? (
                <p className="text-gray-500 text-sm">No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="w-150 bg-white p-4 rounded-lg shadow-lg space-y-2">
                        <div className="flex items-center gap-2">
                            {post.profile_image_url ? (
                                <img
                                    src={post.profile_image_url}
                                    alt={post.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <CircleUserRound size={40} className="text-gray-600" />
                            )}
                            <p className="font-semibold text-sm">{post.username}</p>
                        </div>
                        {post.image_url && (
                            <img src={post.image_url} alt="Post" className="w-full rounded-md object-cover" />
                        )}
                        <p className="text-sm text-gray-600">{post.content}</p>
                        <div className="flex items-center gap-4">
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
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                <MessageCircle size={16} /> {post.comments_count}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400">{new Date(post.updated_at).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    );
}