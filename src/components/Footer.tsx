import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-100 border-t border-charcoal-800">
      {/* Tricolor top border accent */}
      <div className="tricolor-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Candidate & Ward Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-saffron-600/20 border border-saffron-500/30 flex items-center justify-center text-saffron-400 font-bold">
                <span>🪷</span>
              </div>
              <div>
                <span className="text-xl font-serif font-bold text-white block">
                  श्रीमती पूजा मनीष दाधीच
                </span>
                <span className="text-xs font-medium text-saffron-400">
                  वार्ड नंबर 14 • भारतीय जनता पार्टी (भाजपा)
                </span>
              </div>
            </div>

            <p className="text-sm text-charcoal-300 leading-relaxed max-w-md">
              वार्ड नंबर 14 के समग्र विकास, स्वच्छ परिवेश और सुरक्षित वातावरण के निर्माण हेतु समर्पित नागरिक मंच।
              सेवा, सुशासन और विकास के साथ सबका साथ, सबका विकास।
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-charcoal-400">
              <span className="inline-block w-2 h-2 rounded-full bg-civicgreen-500" />
              <span>मेरा वार्ड 14 • मेरा परिवार</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 block mb-4">
              महत्वपूर्ण लिंक
            </span>
            <ul className="space-y-2.5 text-sm text-charcoal-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  होमपेज (मुख्य पृष्ठ)
                </Link>
              </li>
              <li>
                <Link href="/candidate" className="hover:text-white transition-colors">
                  उम्मीदवार के बारे में (परिचय व विज़न)
                </Link>
              </li>
              <li>
                <Link href="/priorities" className="hover:text-white transition-colors">
                  वार्ड 14 की प्राथमिकताएं (7 कार्यक्षेत्र)
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  अपनी समस्या बताएं (ऑनलाइन जनसुनवाई)
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  समस्या ट्रैक करें (Track Reference ID)
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-white transition-colors">
                  नागरिक प्रतिक्रिया (स्वैच्छिक सुझाव)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Transparency & Legal */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 block mb-4">
              पारदर्शिता एवं नीति
            </span>
            <ul className="space-y-2.5 text-sm text-charcoal-300">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  गोपनीयता नीति (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  नियम एवं शर्तें (Terms & Conditions)
                </Link>
              </li>
              <li className="pt-3 border-t border-charcoal-800">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-saffron-400 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>कार्यालय प्रबंधन लॉगिन (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>
            © {new Date().getFullYear()} श्रीमती पूजा मनीष दाधीच | वार्ड नंबर 14 | भारतीय जनता पार्टी (भाजपा)
          </p>
          <p className="flex items-center gap-1 text-charcoal-400">
            <span>नागरिक सेवा व सुशासन हेतु निर्मित</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
