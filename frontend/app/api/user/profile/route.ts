import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { account: string };
    
    const result = await pool.query(
      'SELECT id, username, profile_image_url FROM users WHERE username = $1',
      [decoded.account]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { account: string };
    const { username, profile_image_url } = await request.json();
    
    if (username !== decoded.account) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );
      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Username already taken' },
          { status: 400 }
        );
      }
    }
    
    const result = await pool.query(
      `UPDATE users 
       SET username = $1, profile_image_url = $2 
       WHERE username = $3 
       RETURNING id, username, profile_image_url`,
      [username, profile_image_url || null, decoded.account]
    );
    
    const newToken = jwt.sign(
      { account: username, id: result.rows[0].id },
      process.env.JWT_SECRET!
    );
    
    (await cookies()).set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}