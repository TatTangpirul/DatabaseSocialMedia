'use client';

import { useEffect, useState } from 'react';
import { CircleUserRound, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePostInteractions, Post } from '../MainComponent/usePostInteractions';

export default function UserPage({ params }: { params: { username: string } }) {
  const { user } = useAuth();
  const { posts, toggleLike, toggleComments, addComment } = usePostInteractions({
    initialPosts: [],
    userId: user?.id,
  });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ username: string; profile_image_url: string } | null>(null);

  useEffect(() => {
    async function fetchUserPosts() {
      try {
        const response = await fetch(`/api/users/${params.username}/posts`);
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
          setUserProfile(data.user);
          setPosts(postsWithLikes);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserPosts();
  }, [user, params.username]);

  if (loading) {
    return (
      <div className="w-150 bg-white p-4 rounded shadow-lg">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-150 bg-white p-4 rounded-lg shadow-lg mb-6">
        <div className="flex items-center gap-3">
          {userProfile?.profile_image_url ? (
            <img
              src={userProfile.profile_image_url}
              alt={userProfile.username}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <CircleUserRound size={64} className="text-gray-600" />
          )}
          <div>
            <h1 className="text-xl font-bold">{userProfile?.username}</h1>
            <p className="text-sm text-gray-500">{posts.length} posts</p>
          </div>
        </div>
      </div>

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
              <p className="text-xs text-gray-600">{post.content}</p>
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
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1 text-sm"
                >
                  <MessageCircle size={16} className="text-gray-500" />
                  <span className="text-gray-500">{post.comments_count}</span>
                </button>
              </div>
              {post.showComments && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                  {post.comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      {comment.profile_image_url ? (
                        <img
                          src={comment.profile_image_url}
                          alt={comment.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <CircleUserRound size={32} className="text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold">{comment.username}</p>
                        <p className="text-xs text-gray-600">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {user && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="flex-1 text-xs border rounded px-2 py-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addComment(post.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
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
