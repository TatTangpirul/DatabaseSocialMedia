import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { account, pin } = await request.json();

    if (!account || !pin) {
      return NextResponse.json(
        { error: 'Account and password are required' },
        { status: 400 }
      );
    }

    // Fetch user by account
    const [rows] = await pool.query(
      'SELECT id, account, pin_hash, nickname FROM users WHERE account = ?',
      [account]
    );

    const users = rows as any[];
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid account or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    const isValid = await bcrypt.compare(pin, user.pin_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid account or password' },
        { status: 401 }
      );
    }

    // Return user info (exclude password hash)
    return NextResponse.json({
      id: user.id,
      account: user.account,
      nickname: user.nickname,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
