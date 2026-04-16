import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q.trim()) {
        return NextResponse.json({ success: true, users: [] });
    }

    try {
        const result = await pool.query(
            `SELECT id, username, profile_image_url 
             FROM users 
             WHERE username ILIKE $1 
             LIMIT 5`,
            [`%${q}%`]
        );

        return NextResponse.json({ success: true, users: result.rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
    }
}