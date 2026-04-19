import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    
    if (!username || username.length < 3) {
      return NextResponse.json({ available: false });
    }
    
    const result = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    
    return NextResponse.json({
      available: result.rows.length === 0
    });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ available: false });
  }
}