import { NextResponse } from 'next/server';
//import bcrypt from 'bcrypt';
import pool from '@/lib/db';
import argon2 from 'argon2';

export async function POST(request: Request) {
  try {
    // Parse request body (frontend uses account, pin, username)
    const data = await request.json();
    console.log(data);
    const { account, pin, username } = data;

    // Validate required fields
    if (!account || !pin || !username) {
      return NextResponse.json(
        { error: 'Account, password, and nickname are required' },
        { status: 400 }
      );
    }

    // Check if email (account) already exists
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [account]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 409 }
      );
    }

    // Check if username (nickname) already exists
    const usernameCheck = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (usernameCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'That nickname has already been taken.' },
        { status: 409 }
      );
    }

    // Hash the password
    //const hashedPassword = await bcrypt.hash(pin, 10);
    const hashedPassword = await argon2.hash(pin);

    // Insert new user with correct column names
    await pool.query(
      'INSERT INTO users (email, password_hash, username, n_posts) VALUES ($1, $2, $3, 0)',
      [account, hashedPassword, username]
    );

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}