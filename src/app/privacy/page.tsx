import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | वार्ड 14 - श्रीमती पूजा मनीष दाधीच',
  description: 'वार्ड 14 नागरिक सेवा मंच की गोपनीयता नीति। नागरिक विवरण की सुरक्षा एवं डेटा उपयोग के नियम।',
};

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-civicgreen-50 border border-civicgreen-200 text-civicgreen-900 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-civicgreen-700" />
            <span>डेटा सुरक्षा एवं निजता</span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-charcoal-950 mb-4">
            गोपनीयता नीति (Privacy Policy)
          </h1>

          <p className="text-xs text-charcoal-500 mb-8">
            अंतिम अद्यतन: 16 सितंबर 2026
          </p>

          <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">1. परिचय</h2>
              <p>
                यह डिजिटल पोर्टल श्रीमती पूजा मनीष दाधीच (वार्ड नंबर 14, भारतीय जनता पार्टी) के कार्यालय द्वारा वार्ड के नागरिकों की समस्याओं, सुझावों एवं विकास प्राथमिकताओं के संकलन हेतु संचालित है। हम आपके व्यक्तिगत डेटा की गोपनीयता का पूर्ण सम्मान करते हैं।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">2. कौन सी जानकारी संकलित की जाती है?</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>समस्या निवारण प्रपत्र:</strong> स्थान, समस्या की श्रेणी, विवरण, वैकल्पिक रूप से नाम व मोबाइल नंबर तथा समस्या की फोटो।</li>
                <li><strong>नागरिक प्रतिक्रिया प्रपत्र:</strong> स्वैच्छिक राय, सहमति अथवा सुझाव, तथा वैकल्पिक संपर्क विवरण।</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">3. व्यक्तिगत जानकारी की सुरक्षा</h2>
              <p>
                सार्वजनिक स्टेटस ट्रैकिंग (Track ID) पृष्ठ पर शिकायतकर्ता का नाम, मोबाइल नंबर अथवा अन्य पहचान उजागर नहीं की जाती। केवल संदर्भ संख्या, समस्या की श्रेणी, स्थिति और तारीख दिखाई देती है।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">4. डेटा का उपयोग</h2>
              <p>
                एकत्रित जानकारी का उपयोग केवल संबंधित प्रशासनिक अधिकारियों, नगर निगम विंग अथवा वार्ड विकास टीम के साथ समन्वय कर समस्याओं के समाधान हेतु किया जाता है। डेटा किसी भी व्यावसायिक तीसरे पक्ष को नहीं बेचा जाता।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal-900">5. संपर्क</h2>
              <p>
                यदि आपके पास डेटा सुरक्षा अथवा गोपनीयता के संबंध में कोई प्रश्न है, तो आप वार्ड 14 जनसंपर्क कार्यालय में संपर्क कर सकते हैं।
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
