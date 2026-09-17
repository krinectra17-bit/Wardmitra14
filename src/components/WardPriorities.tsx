import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const prioritiesList = [
  {
    num: '01',
    title: 'सड़क एवं यातायात सुधार',
    tag: 'सुगम आवागमन',
    description:
      'वार्ड की मुख्य सड़कों व आंतरिक गलियों के गड्ढों की समयबद्ध मरम्मत, आवश्यकतानुसार स्पीड ब्रेकर, तथा पैदल चलने वालों व वरिष्ठ नागरिकों हेतु सुरक्षित मार्ग व्यवस्था।',
  },
  {
    num: '02',
    title: 'शुद्ध एवं नियमित पेयजल',
    tag: 'जलापूर्ति',
    description:
      'प्रत्येक मोहल्ले में समय पर शुद्ध पेयजल आपूर्ति, पुरानी व लीकेज वाली पाइपलाइनों का नवीनीकरण, तथा दूषित पानी की समस्या का त्वरित तकनीकी निवारण।',
  },
  {
    num: '03',
    title: 'स्वच्छता एवं कचरा प्रबंधन',
    tag: 'स्वच्छ वार्ड अभियान',
    description:
      'डोर-टू-डोर कचरा वाहनों के फेरों की नियमित निगरानी, खाली भूखंडों में कचरा फेंकने पर रोक, तथा वार्ड के प्रमुख सार्वजनिक स्थलों की समयबद्ध विशेष सफाई।',
  },
  {
    num: '04',
    title: 'स्ट्रीट लाइट एवं रात्रिकालीन सुरक्षा',
    tag: 'उजाले से सुरक्षा',
    description:
      'अंधेरे वाले मोड़ों व गलियों में एलईडी लाइटें लगवाना, खराब लाइटों की सूचना मिलते ही 48 घंटे में समाधान, ताकि रात्रि में महिलाएं, बच्चे व बुजुर्ग सुरक्षित आवागमन कर सकें।',
  },
  {
    num: '05',
    title: 'नाली एवं सीवरेज निकासी',
    tag: 'जलभराव रोकथाम',
    description:
      'नालियों की नियमित गाद (सिल्ट) सफाई, सीवरेज ओवरफ्लो पर त्वरित रोक, और वर्षा ऋतु से पूर्व बड़े नालों की व्यापक सफाई ताकि गलियों में गंदा पानी न भरे।',
  },
  {
    num: '06',
    title: 'पार्क एवं सार्वजनिक हरित क्षेत्र',
    tag: 'पर्यावरण व स्वास्थ्य',
    description:
      'सामुदायिक पार्कों का रखरखाव, बच्चों के खेलकूद हेतु सुरक्षित वातावरण, तथा वरिष्ठ नागरिकों के प्रातः व सांध्य भ्रमण हेतु सुव्यवस्थित व स्वच्छ परिवेश।',
  },
  {
    num: '07',
    title: 'नागरिक सुविधाएं एवं प्रशासनिक सहायता',
    tag: 'जनसहयोग डेस्क',
    description:
      'वृद्धावस्था पेंशन, राशन कार्ड, आधार सुधार, आयुष्मान योजना तथा नगर निगम से जुड़े जरूरी प्रमाण-पत्रों में नागरिकों का निःशुल्क मार्गदर्शन व सहायता।',
  },
];

export default function WardPriorities() {
  return (
    <section id="priorities" className="py-20 lg:py-28 bg-[#FAF6F0] border-t border-charcoal-900/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-charcoal-900/10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-civicgreen-800 block mb-2">
              विकास का संतुलित खाका
            </span>
            <h2 className="font-editorial-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-950 mb-3">
              वार्ड 14 की प्राथमिकताएं
            </h2>
            <p className="text-charcoal-700 text-base font-normal">
              स्थानीय स्तर पर वार्डवासियों के प्रत्यक्ष संवाद और सुझावों पर आधारित 7 मुख्य नागरिक प्राथमिकताएं।
            </p>
          </div>

          <Link
            href="/report"
            className="inline-flex items-center gap-2 text-xs font-bold text-saffron-800 hover:text-saffron-900 uppercase tracking-wider border-b-2 border-saffron-700 pb-1 self-start md:self-auto"
          >
            <span>अपनी समस्या या सुझाव जोड़ें →</span>
          </Link>
        </div>

        {/* Editorial Broadsheet List (Zero Generic Cards) */}
        <div className="divide-y divide-charcoal-900/10">
          {prioritiesList.map((item) => (
            <div
              key={item.num}
              className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-baseline group hover:bg-white/40 px-3 transition-colors"
            >
              {/* Number Index */}
              <div className="lg:col-span-2 flex items-center gap-3">
                <span className="font-mono text-2xl font-light text-charcoal-400 group-hover:text-saffron-800 transition-colors">
                  {item.num}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-civicgreen-800 bg-civicgreen-50 px-2 py-0.5 rounded-sm">
                  {item.tag}
                </span>
              </div>

              {/* Title */}
              <div className="lg:col-span-4">
                <h3 className="font-editorial-heading text-xl sm:text-2xl font-bold text-charcoal-950 group-hover:text-saffron-800 transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Description */}
              <div className="lg:col-span-5">
                <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="lg:col-span-1 text-right">
                <Link
                  href={`/report?category=${encodeURIComponent(item.title)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal-500 group-hover:text-saffron-800 transition-colors"
                  title="इस विषय पर समस्या दर्ज करें"
                >
                  <span>दर्ज करें</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
