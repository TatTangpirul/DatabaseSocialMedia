'use client';

import { useState, useCallback } from 'react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  username: string;
  profile_image_url: string;
}

export interface Post {
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
  comments?: Comment[];
  showComments?: boolean;
}

interface UsePostInteractionsOptions {
  initialPosts: Post[];
  userId?: number;
}

export function usePostInteractions({ initialPosts, userId }: UsePostInteractionsOptions) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const toggleLike = useCallback(async (postId: number) => {
    if (!userId) return;

    const currentPost = posts.find(p => p.id === postId);
    if (currentPost?.likeLoading) return;

    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likeLoading: true } : p
    ));

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, liked: data.liked, likes_count: data.liked ? p.likes_count + 1 : p.likes_count - 1, likeLoading: false }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, likeLoading: false } : p
      ));
    }
  }, [userId, posts]);

  const toggleComments = useCallback(async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.showComments && !post.comments) {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        const data = await response.json();
        if (data.success) {
          setPosts(prev => prev.map(p =>
            p.id === postId ? { ...p, comments: data.comments, showComments: true } : p
          ));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    } else {
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, showComments: !p.showComments } : p
      ));
    }
  }, [posts]);

  const addComment = useCallback(async (postId: number, content: string) => {
    if (!userId || !content.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content }),
      });
      const data = await response.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [data.comment, ...(p.comments || [])],
              comments_count: p.comments_count + 1
            };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }, [userId]);

  const deletePost = useCallback(async (postId: number) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }, []);

  const editPost = useCallback(async (postId: number) => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: editContent } : p));
        setEditingPost(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error editing post:', error);
    }
  }, [editContent]);

  return {
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
  };
}