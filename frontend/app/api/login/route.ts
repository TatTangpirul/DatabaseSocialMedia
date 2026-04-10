import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import pool from '@/lib/db';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Account and password are required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, password_hash, profile_image_url, n_posts FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await argon2.verify(user.password_hash, password);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload = { 
      id: user.id,
      account: user.username,
      profile_image_url: user.profile_image_url,
      n_posts: user.n_posts,
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '2h' });

    const res = NextResponse.json({ user: payload });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2,
      path: '/',
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}