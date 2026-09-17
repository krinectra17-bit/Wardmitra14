import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'नियम एवं शर्तें (Terms & Conditions) | वार्ड 14 - श्रीमती पूजा मनीष दाधीच',
  description: 'वार्ड 14 नागरिक सेवा मंच के नियम व शर्तें। नागरिक भागीदारी एवं विधिक अस्वीकरण।',
};

export default function TermsPage() {
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

        <div className="bg-white p-6 sm:p-10 rounded-xl border border-charcoal-900/10 shadow-editorial">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cream-200 border border-charcoal-900/10 text-charcoal-800 text-xs font-bold uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4 text-saffron-700" />
            <span>विधिक नियम व अस्वीकरण</span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-charcoal-950 mb-4">
            नियम एवं शर्तें (Terms & Conditions)
          </h1>

          <p className="text-xs text-charcoal-500 mb-8">
            अंतिम अद्यतन: 16 सितंबर 2026
          </p>

          <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>महत्वपूर्ण विधिक अस्वीकरण:</span>
              </div>
              यह वेबसाइट वार्ड 14 के नागरिकों की सुविधा, स्थानीय समस्याओं के समाधान एवं जनसंवाद हेतु एक स्वैच्छिक नागरिक मंच है। इस वेबसाइट पर प्रतिक्रिया दर्ज करना वास्तविक मतदान नहीं है और यह किसी भी नागरिक के मताधिकार को निर्धारित अथवा प्रभावित नहीं करता।
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">1. मंच का उद्देश्य</h2>
              <p>
                इस मंच का उद्देश्य वार्ड नंबर 14 में स्थानीय विकास कार्यों, स्वच्छता, मार्ग सुधार, पेयजल आदि नागरिक सुविधाओं में पारदर्शिता और त्वरित सहयोग उपलब्ध कराना है।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">2. नागरिक आचरण एवं जिम्मेदारी</h2>
              <p>
                उपयोगकर्ता से अपेक्षा की जाती है कि वह केवल वास्तविक व स्थानीय समस्याओं को ही दर्ज करें। किसी भी प्रकार की आपत्तिजनक, भ्रामक, अथवा असत्य जानकारी अपलोड करना वर्जित है। ऐसी प्रविष्टियों को कार्यालय द्वारा हटाया जा सकता है।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">3. बौद्धिक संपदा</h2>
              <p>
                वेबसाइट पर उपलब्ध सभी लोगो, चित्र, एवं सामग्री जनसूचना एवं प्रचार-प्रसार के लिए हैं। किसी भी भ्रामक प्रयोजन हेतु इनका अनाधिकृत उपयोग वर्जित है।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">4. परिवर्तनों का अधिकार</h2>
              <p>
                कार्यालय के पास इन शर्तों को समय-समय पर अद्यतन करने का अधिकार सुरक्षित है।
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
