// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'time';
    
    let orderBy = '';
    if (sort === 'time') {
      orderBy = 'ORDER BY p.created_at DESC';
    } else if (sort === 'popularity') {
      orderBy = 'ORDER BY p.likes_count DESC';
    } else {
      orderBy = 'ORDER BY p.created_at DESC';
    }
    
    const query = `
      SELECT 
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
      ${orderBy}
    `;
    
    const result = await pool.query(query);
    
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

export async function POST(req: Request) {
  try {
    // verify jwt
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { account: string };

    // get user id from username
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [decoded.account]
    );

    const user = userResult.rows[0];
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { content, image_url } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // insert post
    const result = await pool.query(
      `INSERT INTO posts (user_id, content, image_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user.id, content, image_url || null]
    );

    // increment n_posts on users table
    await pool.query(
      'UPDATE users SET n_posts = n_posts + 1 WHERE id = $1',
      [user.id]
    );

    return NextResponse.json({ success: true, post: result.rows[0] });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}