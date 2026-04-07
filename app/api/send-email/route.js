import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  sendOrderConfirmation,
  sendStatusUpdate,
  sendAdminOrderCreated,
} from '@/lib/email';

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 10 requests per minute per IP
// ---------------------------------------------------------------------------
const rateLimitMap = new Map(); // Map<ip, { count: number, resetAt: number }>

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

// Periodically flush expired entries to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) rateLimitMap.delete(key);
  }
}, 5 * 60 * 1000);

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------
const baseSchema = z.object({
  type: z.enum(['order_confirmation', 'status_update', 'admin_order_created']),
  to: z.string().email('Invalid recipient email'),
  creatorName: z.string().min(1, 'creatorName is required').max(200),
  orderId: z.string().min(1, 'orderId is required').max(200),
  serviceName: z.string().min(1, 'serviceName is required').max(300),
});

const orderConfirmationSchema = baseSchema.extend({
  type: z.literal('order_confirmation'),
  amount: z.union([z.string().min(1), z.number()]),
});

const statusUpdateSchema = baseSchema.extend({
  type: z.literal('status_update'),
  newStatus: z.string().min(1, 'newStatus is required').max(100),
  milestoneName: z.string().min(1, 'milestoneName is required').max(300),
  clientNote: z.string().max(2000).optional().nullable(),
});

const adminOrderCreatedSchema = baseSchema.extend({
  type: z.literal('admin_order_created'),
  amount: z.union([z.string().min(1), z.number()]),
  adminNote: z.string().max(2000).optional().nullable(),
});

const payloadSchema = z.discriminatedUnion('type', [
  orderConfirmationSchema,
  statusUpdateSchema,
  adminOrderCreatedSchema,
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();
  return 'unknown';
}

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

function badRequest(message = 'Bad Request') {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

function tooManyRequests() {
  return NextResponse.json(
    { success: false, error: 'Rate limit exceeded. Try again in a minute.' },
    { status: 429 }
  );
}

// ---------------------------------------------------------------------------
// POST /api/send-email
// ---------------------------------------------------------------------------
export async function POST(request) {
  try {
    // 1. Verify internal secret
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const internalSecret = process.env.INTERNAL_API_SECRET;

    if (!internalSecret || token !== internalSecret) {
      return unauthorized();
    }

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP)) {
      return tooManyRequests();
    }

    // 3. Parse & validate body
    let body;
    try {
      body = await request.json();
    } catch {
      return badRequest('Invalid JSON body');
    }

    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return badRequest(`Validation failed: ${firstError.path.join('.')} — ${firstError.message}`);
    }

    const data = parsed.data;

    // 4. Dispatch to correct email function
    let result;

    if (data.type === 'order_confirmation') {
      result = await sendOrderConfirmation(
        data.to,
        data.creatorName,
        data.orderId,
        data.serviceName,
        data.amount
      );
    } else if (data.type === 'status_update') {
      result = await sendStatusUpdate(
        data.to,
        data.creatorName,
        data.orderId,
        data.serviceName,
        data.newStatus,
        data.milestoneName,
        data.clientNote || null
      );
    } else if (data.type === 'admin_order_created') {
      result = await sendAdminOrderCreated(
        data.to,
        data.creatorName,
        data.orderId,
        data.serviceName,
        data.amount,
        data.adminNote || null
      );
    }

    // 5. Return result — never expose the Resend API key
    if (!result?.success) {
      console.error('[send-email route] Email send failed:', result?.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[send-email route] Unhandled exception:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Reject non-POST methods
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json({ success: false, error: 'Method not allowed.' }, { status: 405 });
}
