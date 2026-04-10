// app/api/posts/[postId]/like/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { userId } = await request.json();
    const { postId: postIdStr } = await params;
    const postId = parseInt(postIdStr);

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User not logged in' }, { status: 401 });
    }

    const existingLike = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (existingLike.rows.length > 0) {
      await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
      await pool.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1', [postId]);
      
      return NextResponse.json({ success: true, liked: false });
    } else {
      await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
      await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [postId]);
      
      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle like' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { postId: postIdStr } = await params;
    const postId = parseInt(postIdStr);

    if (!userId) {
      return NextResponse.json({ success: true, liked: false });
    }

    const likeResult = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    return NextResponse.json({ success: true, liked: likeResult.rows.length > 0 });
  } catch (error) {
    console.error('Error checking like:', error);
    return NextResponse.json({ success: false, error: 'Failed to check like' }, { status: 500 });
  }
}