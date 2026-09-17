import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Issue } from '@/lib/models/Issue';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/issues
 * Search by referenceId, filter by category & status
 */
export async function GET(req: NextRequest) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच (Unauthorized)' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim();
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const db = await connectToDatabase();

    if (db) {
      const query: Record<string, unknown> = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (status && status !== 'all') {
        // Map status filter to support legacy strings as well
        if (status === 'Pending') {
          query.status = { $in: ['Pending', 'नई समस्या'] };
        } else if (status === 'In Progress') {
          query.status = { $in: ['In Progress', 'जांच में', 'संबंधित विभाग को सूचित'] };
        } else if (status === 'Resolved') {
          query.status = { $in: ['Resolved', 'समाधान हुआ'] };
        } else {
          query.status = status;
        }
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

      const issues = await Issue.find(query).sort({ createdAt: -1 }).limit(200).lean();

      return NextResponse.json({
        success: true,
        issues,
      });
    } else {
      let list = memoryStore.getIssues();

      if (category && category !== 'all') {
        list = list.filter((i) => i.category === category);
      }

      if (status && status !== 'all') {
        if (status === 'Pending') {
          list = list.filter((i) => ['Pending', 'नई समस्या'].includes(i.status));
        } else if (status === 'In Progress') {
          list = list.filter((i) => ['In Progress', 'जांच में', 'संबंधित विभाग को सूचित'].includes(i.status));
        } else if (status === 'Resolved') {
          list = list.filter((i) => ['Resolved', 'समाधान हुआ'].includes(i.status));
        } else {
          list = list.filter((i) => i.status === status);
        }
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
    console.error('Error in /api/admin/issues:', error);
    return NextResponse.json({ error: 'डेटा लोड करने में असमर्थ।' }, { status: 500 });
  }
}
