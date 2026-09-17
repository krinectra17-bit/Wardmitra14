import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Issue } from '@/lib/models/Issue';
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
      const [total, pending, inProgress, resolved, recentSubmissions, feedbackCount] =
        await Promise.all([
          Issue.countDocuments(),
          Issue.countDocuments({ status: { $in: ['Pending', 'नई समस्या'] } }),
          Issue.countDocuments({
            status: { $in: ['In Progress', 'जांच में', 'संबंधित विभाग को सूचित'] },
          }),
          Issue.countDocuments({ status: { $in: ['Resolved', 'समाधान हुआ'] } }),
          Issue.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('referenceId citizenName name category location status createdAt')
            .lean(),
          Feedback.countDocuments(),
        ]);

      return NextResponse.json({
        success: true,
        stats: {
          total,
          pending,
          inProgress,
          resolved,
          feedbackCount,
        },
        recentSubmissions,
      });
    } else {
      // Memory store fallback
      const list = memoryStore.getIssues();
      const fbList = memoryStore.getFeedback();

      const total = list.length;
      const pending = list.filter((i) => ['Pending', 'नई समस्या'].includes(i.status)).length;
      const inProgress = list.filter((i) =>
        ['In Progress', 'जांच में', 'संबंधित विभाग को सूचित'].includes(i.status)
      ).length;
      const resolved = list.filter((i) => ['Resolved', 'समाधान हुआ'].includes(i.status)).length;

      const recentSubmissions = list.slice(0, 5).map((i) => ({
        referenceId: i.referenceId,
        citizenName: i.citizenName || i.name || 'नागरिक',
        name: i.citizenName || i.name || 'नागरिक',
        category: i.category,
        location: i.location,
        status: i.status,
        createdAt: i.createdAt,
      }));

      return NextResponse.json({
        success: true,
        stats: {
          total,
          pending,
          inProgress,
          resolved,
          feedbackCount: fbList.length,
        },
        recentSubmissions,
      });
    }
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'डैशबोर्ड डेटा प्राप्त करने में असमर्थ।' },
      { status: 500 }
    );
  }
}
