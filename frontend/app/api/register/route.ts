import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { account, pin, username } = await request.json();

    // Validate input
    if (!account || !pin || !username) {
      return NextResponse.json(
        { error: 'Account, password, and nickname are required' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const [existingAccount] = await pool.query(
      'SELECT id FROM users WHERE account = ?',
      [account]
    );

    if ((existingAccount as any[]).length > 0) {
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 409 }
      );
    }

    // Check if nickname already exists
    const [existingNickname] = await pool.query(
      'SELECT id FROM users WHERE nickname = ?',
      [username]
    );

    if ((existingNickname as any[]).length > 0) {
      return NextResponse.json(
        { error: 'That nickname has already been taken by someone.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPin = await bcrypt.hash(pin, 10);

    // Insert new user
    await pool.query(
      'INSERT INTO users (account, pin_hash, nickname) VALUES (?, ?, ?)',
      [account, hashedPin, username]
    );

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
