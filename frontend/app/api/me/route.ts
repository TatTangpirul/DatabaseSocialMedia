import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const token = (await cookies()).get('token')?.value;

  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}