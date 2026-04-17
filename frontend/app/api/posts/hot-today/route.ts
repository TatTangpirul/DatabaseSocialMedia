import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  try {
    // Get the start of today in UTC (or adjust to your timezone if needed)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const result = await pool.query(
      `SELECT 
        p.id, 
        p.content, 
        p.likes_count, 
        u.username,
        u.profile_image_url
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.created_at >= $1
      ORDER BY p.likes_count DESC
      LIMIT $2`,
      [todayStart.toISOString(), limit]
    );

    return NextResponse.json({
      success: true,
      posts: result.rows,
    });
  } catch (error) {
    console.error('Error fetching hot posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}