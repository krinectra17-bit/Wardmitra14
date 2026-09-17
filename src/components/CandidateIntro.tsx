'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function CandidateIntro() {
  const [activeSection, setActiveSection] = useState<'profile' | 'welfare' | 'groundwork' | 'priorities'>('profile');

  return (
    <section id="candidate" className="py-20 lg:py-28 bg-[#FAF6F0] border-t border-charcoal-900/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-baseline pb-8 border-b border-charcoal-900/10">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-800 block mb-2">
              जनप्रतिनिधि परिचय
            </span>
            <h2 className="font-editorial-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-950">
              उम्मीदवार के बारे में
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed font-normal">
              श्रीमती पूजा मनीष दाधीच • वार्ड नंबर 14, भारतीय जनता पार्टी (भाजपा)।
              वार्ड के प्रत्येक नागरिक, परिवार और क्षेत्र के सर्वांगीण विकास हेतु निरंतर समर्पित।
            </p>
          </div>
        </div>

        {/* Asymmetric Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Navigation & Civic Values */}
          <div className="lg:col-span-4 space-y-8">
            <nav className="space-y-1">
              {[
                { key: 'profile', title: '01. परिचय एवं पृष्ठभूमि' },
                { key: 'welfare', title: '02. सामाजिक सरोकार' },
                { key: 'groundwork', title: '03. जमीनी अनुभव' },
                { key: 'priorities', title: '04. वार्ड विकास दृष्टिकोण' },
              ].map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key as any)}
                    className={`w-full text-left py-3 px-4 text-sm font-semibold transition-all flex items-center justify-between border-l-2 ${
                      isActive
                        ? 'border-saffron-700 text-charcoal-950 bg-white/60 pl-5'
                        : 'border-charcoal-900/10 text-charcoal-600 hover:text-charcoal-900 hover:border-charcoal-900/30'
                    }`}
                  >
                    <span>{item.title}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-saffron-700" />}
                  </button>
                );
              })}
            </nav>

            {/* Editorial Quote Box (Natural whitespace, no generic card) */}
            <div className="pt-6 border-t border-charcoal-900/10">
              <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">
                मूल प्रेरणा
              </span>
              <blockquote className="font-editorial-heading text-lg text-charcoal-900 leading-snug italic border-l-2 border-civicgreen-700 pl-4">
                &ldquo;मेरा वार्ड 14, मेरा परिवार — हर नागरिक का सम्मान, हर समस्या का त्वरित समाधान।&rdquo;
              </blockquote>
              <span className="text-xs text-charcoal-500 mt-2 block pl-4 font-medium">
                — श्रीमती पूजा मनीष दाधीच
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Body Text (Book-like clarity) */}
          <div className="lg:col-span-8 space-y-8">
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-saffron-800 uppercase tracking-wider block mb-1">
                    समर्पण और निष्ठा
                  </span>
                  <h3 className="font-editorial-heading text-2xl sm:text-3xl font-bold text-charcoal-950 mb-4">
                    वार्ड नंबर 14 की सेवा में सक्रिय भागीदारी
                  </h3>
                </div>

                <div className="prose prose-stone max-w-none text-charcoal-800 space-y-4 text-base leading-relaxed">
                  <p>
                    श्रीमती पूजा मनीष दाधीच वार्ड नंबर 14 के स्थानीय निवासियों के सुख-दुख में सदैव तत्पर रहती हैं। भारतीय जनता पार्टी के राष्ट्रहित और जनकल्याण के सिद्धांतों से प्रेरित होकर वे स्थानीय स्तर पर सुशासन और विकास के संकल्प को धरातल पर उतारने हेतु प्रयासरत हैं।
                  </p>
                  <p>
                    उनका स्पष्ट मानना है कि स्थानीय वार्ड का विकास केवल वादों से नहीं, बल्कि नागरिकों के साथ सीधे संवाद, निरंतर जनसुनवाई और पारदर्शिता से ही संभव है।
                  </p>
                </div>

                {/* Key Facts List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-charcoal-900/10 text-xs">
                  <div>
                    <span className="text-charcoal-500 block mb-1">उम्मीदवार</span>
                    <strong className="text-charcoal-900 text-sm block">श्रीमती पूजा मनीष दाधीच</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block mb-1">निर्वाचन क्षेत्र</span>
                    <strong className="text-charcoal-900 text-sm block">वार्ड नंबर 14</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block mb-1">दल संबद्धता</span>
                    <strong className="text-saffron-800 text-sm block">भारतीय जनता पार्टी (भाजपा)</strong>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'welfare' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-civicgreen-800 uppercase tracking-wider block mb-1">
                    जनसेवा अभियान
                  </span>
                  <h3 className="font-editorial-heading text-2xl sm:text-3xl font-bold text-charcoal-950 mb-4">
                    सामुदायिक स्वच्छता एवं महिला सहयोग
                  </h3>
                </div>

                <div className="prose prose-stone max-w-none text-charcoal-800 space-y-4 text-base leading-relaxed">
                  <p>
                    वार्ड में स्वच्छता अभियानों, पौधारोपण, तथा महिलाओं व बालिकाओं के स्वास्थ्य व शिक्षा संबंधी कार्यक्रमों में निरंतर सक्रियता।
                  </p>
                  <p>
                    सरकारी जनकल्याणकारी योजनाओं — जैसे उज्ज्वला, पीएम आवास, जन-धन, आयुष्मान भारत — की जानकारी वार्ड के अंतिम छोर तक के पात्र परिवारों तक पहुंचाने का निरंतर प्रयास।
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'groundwork' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-charcoal-600 uppercase tracking-wider block mb-1">
                    जमीनी समझ
                  </span>
                  <h3 className="font-editorial-heading text-2xl sm:text-3xl font-bold text-charcoal-950 mb-4">
                    हर मोहल्ले और गली की समस्याओं का प्रत्यक्ष अध्ययन
                  </h3>
                </div>

                <div className="prose prose-stone max-w-none text-charcoal-800 space-y-4 text-base leading-relaxed">
                  <p>
                    वार्ड 14 के विभिन्न मोहल्लों, कॉलोनियों और बाजारों में निरंतर संवाद के माध्यम से सड़क की स्थिति, जल निकासी (सीवरेज), पेयजल आपूर्ति, तथा स्ट्रीट लाइटों की वास्तविक स्थिति का जमीनी आकलन किया गया है।
                  </p>
                  <p>
                    प्रशासनिक अधिकारियों और नगर पालिका/निगम के साथ समन्वय स्थापित कर स्थानीय समस्याओं को प्राथमिकता से हल करवाने की स्पष्ट कार्ययोजना।
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'priorities' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-saffron-800 uppercase tracking-wider block mb-1">
                    भावी रूपरेखा
                  </span>
                  <h3 className="font-editorial-heading text-2xl sm:text-3xl font-bold text-charcoal-950 mb-4">
                    संतुलित, स्वच्छ एवं सुरक्षित वार्ड का निर्माण
                  </h3>
                </div>

                <div className="prose prose-stone max-w-none text-charcoal-800 space-y-4 text-base leading-relaxed">
                  <p>
                    वार्ड के बुनियादी ढांचे का सुदृढ़ीकरण, नियमित कचरा संग्रहण वाहनों की निगरानी, मुख्य मार्गों से लेकर आंतरिक गलियों तक आधुनिक एलईडी रोशनी, और जनसमस्याओं के निवारण हेतु स्थायी हेल्पलाइन की स्थापना।
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/priorities"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-800 hover:text-saffron-900 border-b border-saffron-800/40 pb-0.5"
                  >
                    <span>वार्ड 14 की विस्तृत 7 प्राथमिकताएं देखें</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
