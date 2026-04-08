// app/api/users/[userId]/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await params if it's a Promise
    const { userId } = await params;
    
    console.log('userId from params:', userId);
    
    const result = await pool.query(
      `SELECT 
        p.id,
        p.content,
        p.image_url,
        p.likes_count,
        p.comments_count,
        p.created_at,
        u.id as user_id,
        u.username,
        u.profile_image_url
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC`,
      [userId]
    );
    
    return NextResponse.json({
      success: true,
      posts: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}