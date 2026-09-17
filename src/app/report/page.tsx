import React from 'react';
import { Metadata } from 'next';
import IssueForm from '@/components/IssueForm';
import Link from 'next/link';
import { AlertCircle, Search, ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'अपनी समस्या बताएं | वार्ड नंबर 14 - श्रीमती पूजा मनीष दाधीच',
  description: 'वार्ड 14 से जुड़ी स्थानीय समस्या या सुझाव साझा करें। सड़क, पानी, सफाई, स्ट्रीट लाइट आदि मुद्दों की ऑनलाइन रिपोर्टिंग।',
};

export default function ReportPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2] min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-saffron-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य पृष्ठ पर लौटें</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-saffron-100 text-saffron-900 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>नागरिक समस्या निवारण</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-950 mb-3">
            अपनी समस्या बताएं
          </h1>
          <p className="text-charcoal-600 text-base leading-relaxed">
            वार्ड 14 से जुड़ी स्थानीय समस्या या सुझाव साझा करें। विवरण और स्थान दर्ज करें ताकि हमारी टीम आवश्यक कदम उठा सके।
          </p>
        </div>

        {/* Issue Form */}
        <IssueForm isStandalonePage={true} />

        {/* Footer Tracking Help */}
        <div className="mt-8 text-center">
          <p className="text-xs text-charcoal-500">
            क्या आपके पास पहले से समस्या रेफरेंस ID है?{' '}
            <Link href="/track" className="text-saffron-800 font-bold underline underline-offset-2 hover:text-saffron-900">
              यहाँ क्लिक करके अपनी समस्या का स्टेटस देखें
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
