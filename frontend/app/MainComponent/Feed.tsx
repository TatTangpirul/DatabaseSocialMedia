// app/components/Feed.tsx
'use client';

import { useEffect, useState } from 'react';

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

export default function AccountInfo() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');  // ← New endpoint
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
      <div className="w-64 bg-white p-4 rounded shadow-lg mt-16">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="w-64 bg-white p-4 rounded shadow-lg mt-16">
      <h3 className="font-bold mb-3 text-lg">Latest Posts</h3>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border-b pb-2 last:border-0">
              <p className="font-semibold text-sm">{post.username}</p>
              {/* Display the image if it exists */}
              {post.image_url && (
                <img 
                  src={post.image_url} 
                  alt="Post image"
                  className="w-full h-32 object-cover rounded-md my-2"
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