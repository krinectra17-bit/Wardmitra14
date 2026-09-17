import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Feedback } from '@/lib/models/Feedback';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच (Unauthorized)' }, { status: 401 });
    }

    const db = await connectToDatabase();

    if (db) {
      const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(200).lean();
      return NextResponse.json({
        success: true,
        feedback,
      });
    } else {
      const list = memoryStore.getFeedback();
      return NextResponse.json({
        success: true,
        feedback: list,
      });
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'प्रतिक्रिया लोड करने में असमर्थ।' }, { status: 500 });
  }
}
