import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    try {
        const userResult = await pool.query(
            'SELECT id, username, profile_image_url FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const user = userResult.rows[0];

        const postsResult = await pool.query(
            `SELECT 
                p.id, p.content, p.image_url, p.likes_count, p.comments_count,
                p.created_at, p.updated_at,
                u.username, u.profile_image_url
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE u.username = $1
            ORDER BY p.created_at DESC`,
            [username]
        );

        return NextResponse.json({ 
            success: true, 
            user,
            posts: postsResult.rows 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}