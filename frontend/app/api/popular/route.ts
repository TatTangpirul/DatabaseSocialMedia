import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT u.id, u.username, u.profile_image_url,
                COALESCE(SUM(p.likes_count), 0) AS total_likes,
                u.n_posts
             FROM users u
             LEFT JOIN posts p ON p.user_id = u.id
             GROUP BY u.id, u.username, u.profile_image_url, u.n_posts
             ORDER BY total_likes DESC
             LIMIT 5`
        );
        return NextResponse.json({ success: true, users: result.rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}