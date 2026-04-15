'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CircleUserRound, Heart, MessageCircle } from 'lucide-react';

interface Post {
    id: number;
    content: string;
    image_url: string;
    likes_count: number;
    comments_count: number;
    updated_at: string;
    username: string;
    profile_image_url: string;
}

export default function UserPage() {
    const { username } = useParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserPosts() {
            try {
                const res = await fetch(`/api/users/${username}`);
                const data = await res.json();
                if (data.success) setPosts(data.posts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserPosts();
    }, [username]);

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
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                <Heart size={16} /> {post.likes_count}
                            </span>
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