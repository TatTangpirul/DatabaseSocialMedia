// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT 
        p.id,
        p.content,
        p.image_url,
        p.likes_count,
        p.comments_count,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.username,
        u.profile_image_url
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.updated_at DESC`
    );
    
    return NextResponse.json({
      success: true,
      posts: result.rows
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}