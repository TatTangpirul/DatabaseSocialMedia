// app/api/posts/[postId]/comments/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId: postIdStr } = await params;
    const postId = parseInt(postIdStr);

    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at, c.updated_at, u.id as user_id, u.username, u.profile_image_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [postId]
    );

    return NextResponse.json({ success: true, comments: result.rows });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { userId, content } = await request.json();
    const { postId: postIdStr } = await params;
    const postId = parseInt(postIdStr);

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User not logged in' }, { status: 401 });
    }

    if (!content || content.trim() === '') {
      return NextResponse.json({ success: false, error: 'Comment content is required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, postId, content.trim()]
    );

    await pool.query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1', [postId]);

    const comment = result.rows[0];
    
    const userResult = await pool.query('SELECT username, profile_image_url FROM users WHERE id = $1', [userId]);
    
    return NextResponse.json({ 
      success: true, 
      comment: {
        ...comment,
        username: userResult.rows[0].username,
        profile_image_url: userResult.rows[0].profile_image_url
      }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
  }
}
