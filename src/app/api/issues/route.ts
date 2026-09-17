import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Issue } from '@/lib/models/Issue';
import { generateReferenceId } from '@/lib/idGenerator';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Simple in-memory rate limiting: max 10 submissions per minute per IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60000 });
    return true;
  }

  if (entry.count >= 10) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Sanitize string to remove potential script tags or malicious html
function sanitizeInput(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 2000); // Enforce max length
}

/**
 * POST /api/issues - Submit a new citizen issue
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'बहुत सारे अनुरोध प्राप्त हुए हैं। कृपया कुछ देर बाद पुनः प्रयास करें।' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const category = sanitizeInput(body.category);
    const location = sanitizeInput(body.location);
    const description = sanitizeInput(body.description);
    const citizenName = sanitizeInput(body.citizenName || body.name);
    const mobile = sanitizeInput(body.mobile);
    const photoUrl = typeof body.photoUrl === 'string' ? body.photoUrl.trim() : (typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '');

    // Server-side validation
    if (!category || !location || !description) {
      return NextResponse.json(
        { error: 'श्रेणी, विवरण एवं स्थान अनिवार्य हैं।' },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        { error: 'समस्या का विवरण कम से कम 10 अक्षरों का होना चाहिए।' },
        { status: 400 }
      );
    }

    const referenceId = generateReferenceId();
    const db = await connectToDatabase();

    if (db) {
      const newIssue = await Issue.create({
        referenceId,
        citizenName: citizenName || 'नागरिक',
        name: citizenName || 'नागरिक',
        mobile: mobile || '',
        category,
        location,
        description,
        photoUrl: photoUrl || '',
        imageUrl: photoUrl || '',
        status: 'Pending',
      });

      return NextResponse.json({
        success: true,
        referenceId: newIssue.referenceId,
        status: 'Pending',
        message: 'आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है।',
      });
    } else {
      // Fallback in-memory store
      const fallbackIssue = {
        _id: 'mem_' + Date.now(),
        referenceId,
        citizenName: citizenName || 'नागरिक',
        name: citizenName || 'नागरिक',
        mobile: mobile || '',
        category,
        location,
        description,
        photoUrl: photoUrl || '',
        imageUrl: photoUrl || '',
        status: 'Pending' as const,
        internalNotes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryStore.addIssue(fallbackIssue);

      return NextResponse.json({
        success: true,
        referenceId: fallbackIssue.referenceId,
        status: 'Pending',
        message: 'आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है।',
      });
    }
  } catch (error) {
    console.error('Error submitting issue:', error);
    return NextResponse.json(
      { error: 'समस्या दर्ज करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/issues - Admin query for issues with search and filter
 */
export async function GET(req: NextRequest) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच (Unauthorized)' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const db = await connectToDatabase();

    if (db) {
      const query: Record<string, unknown> = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
          { referenceId: regex },
          { citizenName: regex },
          { name: regex },
          { location: regex },
          { description: regex },
        ];
      }

      const issues = await Issue.find(query).sort({ createdAt: -1 }).limit(100).lean();

      return NextResponse.json({
        success: true,
        issues,
      });
    } else {
      // Memory store fallback
      let list = memoryStore.getIssues();

      if (category && category !== 'all') {
        list = list.filter((i) => i.category === category);
      }

      if (status && status !== 'all') {
        list = list.filter((i) => i.status === status);
      }

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (i) =>
            i.referenceId.toLowerCase().includes(s) ||
            (i.citizenName && i.citizenName.toLowerCase().includes(s)) ||
            (i.name && i.name.toLowerCase().includes(s)) ||
            i.location.toLowerCase().includes(s) ||
            i.description.toLowerCase().includes(s)
        );
      }

      return NextResponse.json({
        success: true,
        issues: list,
      });
    }
  } catch (error) {
    console.error('Error fetching admin issues:', error);
    return NextResponse.json(
      { error: 'समस्याएं प्राप्त करने में त्रुटि हुई।' },
      { status: 500 }
    );
  }
}
