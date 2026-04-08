import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { account } = await request.json();

    if (!account) {
      return NextResponse.json(
        { error: 'Account is required' },
        { status: 400 }
      );
    }

    // Check if account exists
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE account = ?',
      [account]
    );

    const exists = (rows as any[]).length > 0;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
