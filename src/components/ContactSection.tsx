import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#FAF6F0] border-t border-charcoal-900/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 pb-8 border-b border-charcoal-900/10">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-800 block mb-2">
            कार्यालय एवं जनसंपर्क
          </span>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-950 mb-3">
            सदा आपके संपर्क में
          </h2>
          <p className="text-charcoal-700 text-base font-normal">
            वार्ड 14 के नागरिक किसी भी स्थानीय समस्या, परामर्श या व्यक्तिगत सहयोग हेतु कार्यालय में संपर्क कर सकते हैं।
          </p>
        </div>

        {/* Editorial Two-Column Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Physical Office and Hours */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-2">
                कार्यालय का पता
              </span>
              <h3 className="font-editorial-heading text-xl sm:text-2xl font-bold text-charcoal-950 mb-2">
                श्रीमती पूजा मनीष दाधीच जनसेवा कार्यालय
              </h3>
              <p className="text-charcoal-700 text-base leading-relaxed">
                मुख्य बाजार, वार्ड नंबर 14 (निकट नगर पालिका क्षेत्र)
              </p>
            </div>

            <div className="pt-6 border-t border-charcoal-900/10">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-2">
                जनसुनवाई एवं मिलने का समय
              </span>
              <div className="space-y-1 text-sm text-charcoal-800 font-medium">
                <p>• प्रातः: 09:00 बजे से दोपहर 01:00 बजे तक</p>
                <p>• सायं: 05:00 बजे से रात्रि 08:00 बजे तक</p>
                <p className="text-xs text-charcoal-500 pt-1 font-normal">
                  (आपात स्थिति में वार्ड स्वयंसेवक सदैव उपलब्ध)
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-charcoal-900/10">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-2">
                नागरिक सहायता डेस्क
              </span>
              <p className="text-sm text-charcoal-700">
                वार्ड सहायता केंद्र (कार्यालय समय में प्रत्यक्ष संपर्क एवं दस्तावेज सहायता)
              </p>
            </div>
          </div>

          {/* Right Column: Direct Digital Connect & WhatsApp */}
          <div className="lg:col-span-6 space-y-6 bg-white/60 p-8 sm:p-10 border-l-2 border-saffron-700">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-800 block">
              सीधा डिजिटल संवाद
            </span>

            <h3 className="font-editorial-heading text-2xl font-bold text-charcoal-950">
              व्हाट्सएप नागरिक सेवा
            </h3>

            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-normal">
              यदि आप कार्यालय आने में असमर्थ हैं, तो आप सीधे अपने मोबाइल से फोटो अथवा समस्या का विवरण भेज सकते हैं।
            </p>

            <div className="pt-2">
              <a
                href="https://api.whatsapp.com/send?text=नमस्ते%20श्रीमती%20पूजा%20मनीष%20दाधीच%20जी,%20वार्ड%2014%20की%20समस्या/सुझाव%20के%20संबंध%20में:"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#1EA952] hover:bg-[#198f45] text-white font-semibold py-3.5 px-6 rounded text-sm transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>व्हाट्सएप पर संदेश भेजें</span>
              </a>
            </div>

            <div className="pt-6 border-t border-charcoal-900/10 text-xs text-charcoal-600 leading-relaxed">
              🔒 <strong>पारदर्शिता व सुशासन:</strong> आपके संदेश को पंजीकृत कर संबंधित विंग को समाधान हेतु प्रेषित किया जाएगा।
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
