import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import CitizenFeedbackSection from '@/components/CitizenFeedbackSection';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'नागरिक प्रतिक्रिया | श्रीमती पूजा मनीष दाधीच - वार्ड 14',
  description: 'वार्ड 14 के नागरिक के रूप में स्वैच्छिक राय, सुझाव अथवा समर्थन दर्ज करने हेतु नागरिक संवाद मंच।',
};

export default function FeedbackPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2]">
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

        {/* Feedback Section Component */}
        <CitizenFeedbackSection />

      </div>
    </div>
  );
}
