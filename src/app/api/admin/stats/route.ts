import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Issue } from '@/lib/models/Issue';
import { Feedback } from '@/lib/models/Feedback';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const isAdmin = verifyAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच' }, { status: 401 });
    }

    const db = await connectToDatabase();

    if (db) {
      const [total, newIssues, inReview, forwarded, resolved, feedbackCount] = await Promise.all([
        Issue.countDocuments(),
        Issue.countDocuments({ status: 'नई समस्या' }),
        Issue.countDocuments({ status: 'जांच में' }),
        Issue.countDocuments({ status: 'संबंधित विभाग को सूचित' }),
        Issue.countDocuments({ status: 'समाधान हुआ' }),
        Feedback.countDocuments(),
      ]);

      return NextResponse.json({
        success: true,
        stats: {
          total,
          newIssues,
          inReview,
          forwarded,
          resolved,
          feedbackCount,
        },
      });
    } else {
      const issues = memoryStore.getIssues();
      const feedback = memoryStore.getFeedback();

      return NextResponse.json({
        success: true,
        stats: {
          total: issues.length,
          newIssues: issues.filter((i) => i.status === 'नई समस्या').length,
          inReview: issues.filter((i) => i.status === 'जांच में').length,
          forwarded: issues.filter((i) => i.status === 'संबंधित विभाग को सूचित').length,
          resolved: issues.filter((i) => i.status === 'समाधान हुआ').length,
          feedbackCount: feedback.length,
        },
      });
    }
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'आंकड़े लोड करने में त्रुटि' }, { status: 500 });
  }
}
