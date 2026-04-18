import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUser() {
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as { account: string };
    } catch {
        return null;
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ postId: string }> }) {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { postId } = await params;
    const { content } = await req.json();

    if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 });

    try {
        const result = await pool.query(
            `UPDATE posts SET content = $1, updated_at = NOW()
             WHERE id = $2 AND user_id = (SELECT id FROM users WHERE username = $3)
             RETURNING *`,
            [content, postId, user.account]
        );

        if (result.rows.length === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        return NextResponse.json({ success: true, post: result.rows[0] });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ postId: string }> }) {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { postId } = await params;

    try {
        const result = await pool.query(
            `DELETE FROM posts WHERE id = $1 AND user_id = (SELECT id FROM users WHERE username = $2)
             RETURNING id`,
            [postId, user.account]
        );

        if (result.rows.length === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        // decrement n_posts
        await pool.query(
            'UPDATE users SET n_posts = n_posts - 1 WHERE username = $1',
            [user.account]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}