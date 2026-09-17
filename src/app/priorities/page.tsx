import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import WardPriorities from '@/components/WardPriorities';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'वार्ड 14 की प्राथमिकताएं | श्रीमती पूजा मनीष दाधीच',
  description: 'सड़क, पानी, सफाई, स्ट्रीट लाइट, सीवरेज और नागरिक सुविधाओं पर केंद्रित वार्ड नंबर 14 का विकास खाका।',
};

export default function PrioritiesPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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

        {/* Priorities Component */}
        <WardPriorities />

        {/* Civic Note Banner */}
        <div className="mt-12 p-6 sm:p-8 bg-white rounded-xl border border-charcoal-900/10 shadow-editorial text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-2">
            क्या आपके क्षेत्र में कोई अन्य प्राथमिकता है?
          </h3>
          <p className="text-sm text-charcoal-600 mb-6 leading-relaxed">
            यह प्राथमिक सूची वार्डवासियों से प्राप्त प्राथमिक सुझावों पर आधारित है। यदि आपके मोहल्ले या गली में कोई अन्य बुनियादी आवश्यकता है, तो कृपया अवश्य बताएं।
          </p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 bg-saffron-700 hover:bg-saffron-800 text-white font-semibold text-sm px-6 py-3 rounded-md shadow-xs transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span>सुझाव अथवा समस्या दर्ज करें</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
