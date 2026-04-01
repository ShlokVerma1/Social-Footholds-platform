import { NextResponse } from 'next/server';

const rateLimitMap = new Map();

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const limit = 5;

  const userRate = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - userRate.startTime > windowMs) {
    userRate.count = 1;
    userRate.startTime = now;
  } else {
    userRate.count++;
  }

  rateLimitMap.set(ip, userRate);

  if (userRate.count > limit) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429 }
    );
  }

  return NextResponse.json({ success: true });
}
