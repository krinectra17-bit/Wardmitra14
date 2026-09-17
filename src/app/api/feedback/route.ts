import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';
import { Feedback } from '@/lib/models/Feedback';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, response, message } = body;

    const validResponses = [
      'मैं समर्थन के संबंध में अपनी सहमति दर्ज करना चाहता/चाहती हूँ।',
      'मैं अपनी राय या सुझाव साझा करना चाहता/चाहती हूँ।',
      'मैं अभी कोई राय दर्ज नहीं करना चाहता/चाहती हूँ।',
    ];

    if (!response || !validResponses.includes(response)) {
      return NextResponse.json({ error: 'कृपया मान्य प्रतिक्रिया विकल्प चुनें।' }, { status: 400 });
    }

    const db = await connectToDatabase();

    if (db) {
      const fb = await Feedback.create({
        name: name ? String(name).trim() : 'नागरिक',
        mobile: mobile ? String(mobile).trim() : '',
        response,
        message: message ? String(message).trim() : '',
      });

      return NextResponse.json({
        success: true,
        message: 'आपकी प्रतिक्रिया सफलतापूर्वक दर्ज कर ली गई है। धन्यवाद!',
        feedbackId: fb._id,
      });
    } else {
      const fb = memoryStore.addFeedback({
        _id: 'fb-' + Date.now(),
        name: name ? String(name).trim() : 'नागरिक',
        mobile: mobile ? String(mobile).trim() : '',
        response,
        message: message ? String(message).trim() : '',
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'आपकी प्रतिक्रिया सफलतापूर्वक दर्ज कर ली गई है। धन्यवाद!',
        feedbackId: fb._id,
      });
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'प्रतिक्रिया दर्ज करने में समस्या आई।' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const isAdmin = verifyAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'अनधिकृत पहुंच' }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (db) {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, feedbacks });
    } else {
      const feedbacks = memoryStore.getFeedback();
      return NextResponse.json({ success: true, feedbacks });
    }
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json({ error: 'डेटा लोड करने में त्रुटि' }, { status: 500 });
  }
}
