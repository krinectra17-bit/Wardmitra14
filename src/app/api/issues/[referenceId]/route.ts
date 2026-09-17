import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Issue } from '@/lib/models/Issue';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    referenceId: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { referenceId } = params;
    if (!referenceId) {
      return NextResponse.json({ error: 'समस्या ID आवश्यक है।' }, { status: 400 });
    }

    const cleanRef = referenceId.trim().toUpperCase();
    const db = await connectToDatabase();

    if (db) {
      const issue = await Issue.findOne({ referenceId: cleanRef });
      if (!issue) {
        return NextResponse.json({ error: 'यह समस्या ID नहीं मिली। कृपया पुनः जांचें।' }, { status: 404 });
      }

      // Return strictly public, non-sensitive data
      return NextResponse.json({
        success: true,
        issue: {
          referenceId: issue.referenceId,
          category: issue.category,
          status: issue.status,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        },
      });
    } else {
      const issue = memoryStore.findIssueByRef(cleanRef);
      if (!issue) {
        return NextResponse.json({ error: 'यह समस्या ID नहीं मिली। कृपया पुनः जांचें।' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        issue: {
          referenceId: issue.referenceId,
          category: issue.category,
          status: issue.status,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        },
      });
    }
  } catch (error) {
    console.error('Issue lookup error:', error);
    return NextResponse.json({ error: 'समस्या खोजने में त्रुटि' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const isAdmin = verifyAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच' }, { status: 401 });
    }

    const { referenceId } = params;
    const body = await req.json();
    const { status, internalNotes } = body;

    const db = await connectToDatabase();

    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      if (status) updateData.status = status;
      if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

      const updated = await Issue.findOneAndUpdate(
        { $or: [{ referenceId: referenceId }, { _id: referenceId }] },
        updateData,
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ error: 'समस्या रिकॉर्ड नहीं मिला' }, { status: 404 });
      }

      return NextResponse.json({ success: true, issue: updated });
    } else {
      const updated = memoryStore.updateIssue(referenceId, {
        ...(status ? { status } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
      });

      if (!updated) {
        return NextResponse.json({ error: 'समस्या रिकॉर्ड नहीं मिला' }, { status: 404 });
      }

      return NextResponse.json({ success: true, issue: updated });
    }
  } catch (error) {
    console.error('Update issue error:', error);
    return NextResponse.json({ error: 'अपडेट करने में त्रुटि' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const isAdmin = verifyAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच' }, { status: 401 });
    }

    const { referenceId } = params;
    const db = await connectToDatabase();

    if (db) {
      await Issue.findOneAndDelete({
        $or: [{ referenceId: referenceId }, { _id: referenceId }],
      });
      return NextResponse.json({ success: true, message: 'रिकॉर्ड हटा दिया गया।' });
    } else {
      memoryStore.deleteIssue(referenceId);
      return NextResponse.json({ success: true, message: 'रिकॉर्ड हटा दिया गया।' });
    }
  } catch (error) {
    console.error('Delete issue error:', error);
    return NextResponse.json({ error: 'हटाने में त्रुटि' }, { status: 500 });
  }
}
