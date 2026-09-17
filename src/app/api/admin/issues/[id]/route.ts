import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Issue } from '@/lib/models/Issue';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

/**
 * PATCH /api/admin/issues/[id]
 * Updates status (Pending, In Progress, Resolved) and internalNotes
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच (Unauthorized)' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, internalNotes } = body;

    const allowedStatuses = [
      'Pending',
      'In Progress',
      'Resolved',
      'नई समस्या',
      'जांच में',
      'संबंधित विभाग को सूचित',
      'समाधान हुआ',
    ];

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'अमान्य स्थिति (Invalid Status)' }, { status: 400 });
    }

    const db = await connectToDatabase();

    if (db) {
      const updateData: Record<string, unknown> = {};
      if (status) updateData.status = status;
      if (internalNotes !== undefined) updateData.internalNotes = String(internalNotes).trim();

      const updated = await Issue.findOneAndUpdate(
        { $or: [{ referenceId: id.toUpperCase() }, { _id: id }] },
        { $set: updateData },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ error: 'समस्या नहीं मिली।' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'समस्या की स्थिति सफलतापूर्वक अपडेट कर दी गई।',
        issue: updated,
      });
    } else {
      const updated = memoryStore.updateIssue(id, {
        ...(status && { status }),
        ...(internalNotes !== undefined && { internalNotes }),
      });

      if (!updated) {
        return NextResponse.json({ error: 'समस्या नहीं मिली।' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'समस्या की स्थिति सफलतापूर्वक अपडेट कर दी गई।',
        issue: updated,
      });
    }
  } catch (error) {
    console.error('Update issue error:', error);
    return NextResponse.json({ error: 'अपडेट करने में असमर्थ।' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/issues/[id]
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच (Unauthorized)' }, { status: 401 });
    }

    const { id } = params;
    const db = await connectToDatabase();

    if (db) {
      const deleted = await Issue.findOneAndDelete({
        $or: [{ referenceId: id.toUpperCase() }, { _id: id }],
      });

      if (!deleted) {
        return NextResponse.json({ error: 'समस्या नहीं मिली।' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'समस्या सफलतापूर्वक हटा दी गई।' });
    } else {
      memoryStore.deleteIssue(id);
      return NextResponse.json({ success: true, message: 'समस्या सफलतापूर्वक हटा दी गई।' });
    }
  } catch (error) {
    console.error('Delete issue error:', error);
    return NextResponse.json({ error: 'हटाने में असमर्थ।' }, { status: 500 });
  }
}
