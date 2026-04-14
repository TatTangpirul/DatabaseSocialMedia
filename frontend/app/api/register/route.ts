import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Parse request body
    const { account, pin, username } = await request.json();

    // Validate required fields
    if (!account || !pin || !username) {
      return NextResponse.json(
        { error: 'Account, password, and nickname are required' },
        { status: 400 }
      );
    }

    // Check if account already exists in the database
    const accountCheck = await pool.query(
      'SELECT id FROM users WHERE account = $1',
      [account]
    );

    if (accountCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 409 }
      );
    }

    // Check if nickname is already taken
    const nicknameCheck = await pool.query(
      'SELECT id FROM users WHERE nickname = $1',
      [username]
    );

    if (nicknameCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'That nickname has already been taken by someone.' },
        { status: 409 }
      );
    }

    // Hash the password before storing it in the database
    const hashedPin = await bcrypt.hash(pin, 10);

    // Insert the new user record
    await pool.query(
      'INSERT INTO users (account, pin_hash, nickname) VALUES ($1, $2, $3)',
      [account, hashedPin, username]
    );

    // Return success response
    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    // Log unexpected errors and return a generic server error response
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
