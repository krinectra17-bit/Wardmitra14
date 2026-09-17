import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Issue } from '@/lib/models/Issue';
import { generateReferenceId } from '@/lib/idGenerator';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, category, description, location, imageUrl } = body;

    if (!category || !description || !location) {
      return NextResponse.json(
        { error: 'श्रेणी, विवरण एवं स्थान अनिवार्य हैं।' },
        { status: 400 }
      );
    }

    const referenceId = generateReferenceId();
    const db = await connectToDatabase();

    if (db) {
      const newIssue = await Issue.create({
        referenceId,
        name: name ? String(name).trim() : 'गुमनाम नागरिक',
        mobile: mobile ? String(mobile).trim() : '',
        category: String(category).trim(),
        description: String(description).trim(),
        location: String(location).trim(),
        imageUrl: imageUrl || '',
        status: 'नई समस्या',
      });

      return NextResponse.json({
        success: true,
        referenceId: newIssue.referenceId,
        message: 'आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है।',
        issue: {
          referenceId: newIssue.referenceId,
          category: newIssue.category,
          status: newIssue.status,
          createdAt: newIssue.createdAt,
        },
      });
    } else {
      // Memory store fallback
      const newIssue = memoryStore.addIssue({
        _id: 'local-' + Date.now(),
        referenceId,
        name: name ? String(name).trim() : 'गुमनाम नागरिक',
        mobile: mobile ? String(mobile).trim() : '',
        category: String(category).trim(),
        description: String(description).trim(),
        location: String(location).trim(),
        imageUrl: imageUrl || '',
        status: 'नई समस्या',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        referenceId: newIssue.referenceId,
        message: 'आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है।',
        issue: {
          referenceId: newIssue.referenceId,
          category: newIssue.category,
          status: newIssue.status,
          createdAt: newIssue.createdAt,
        },
      });
    }
  } catch (error) {
    console.error('Issue creation error:', error);
    return NextResponse.json(
      { error: 'समस्या दर्ज करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const isAdmin = verifyAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच' }, { status: 401 });
    }

    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const db = await connectToDatabase();

    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      if (category && category !== 'सभी') query.category = category;
      if (status && status !== 'सभी') query.status = status;
      if (search) {
        query.$or = [
          { referenceId: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const issues = await Issue.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, issues });
    } else {
      let issues = memoryStore.getIssues();
      if (category && category !== 'सभी') {
        issues = issues.filter((i) => i.category === category);
      }
      if (status && status !== 'सभी') {
        issues = issues.filter((i) => i.status === status);
      }
      if (search) {
        const s = search.toLowerCase();
        issues = issues.filter(
          (i) =>
            i.referenceId.toLowerCase().includes(s) ||
            i.location.toLowerCase().includes(s) ||
            i.description.toLowerCase().includes(s)
        );
      }
      return NextResponse.json({ success: true, issues });
    }
  } catch (error) {
    console.error('Get issues error:', error);
    return NextResponse.json({ error: 'डेटा लोड करने में त्रुटि' }, { status: 500 });
  }
}
