import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import CandidateIntro from '@/components/CandidateIntro';
import WardPriorities from '@/components/WardPriorities';
import IssueForm from '@/components/IssueForm';
import CitizenFeedbackSection from '@/components/CitizenFeedbackSection';
import ContactSection from '@/components/ContactSection';
import { AlertCircle, Search, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Candidate Introduction */}
      <CandidateIntro />

      {/* 3. Ward 14 Civic Priorities */}
      <WardPriorities />

      {/* 4. Citizen Issue Reporting Section */}
      <section id="report" className="py-20 lg:py-28 bg-white border-t border-charcoal-900/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left side text and instructions */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-saffron-800 block mb-2">
                  जनसुनवाई व समस्या निवारण
                </span>
                <h2 className="font-editorial-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-950 mb-3">
                  अपनी समस्या बताएं
                </h2>
                <p className="text-charcoal-700 text-base leading-relaxed font-normal">
                  वार्ड 14 से जुड़ी स्थानीय समस्या या सुझाव साझा करें। आपके द्वारा दर्ज की गई समस्या सीधे वार्ड सेवा टीम तक पहुंचती है, जिससे संबंधित विभाग से त्वरित समाधान हेतु समन्वय किया जा सके।
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-charcoal-900/10 text-xs text-charcoal-700">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-charcoal-900 shrink-0">🔒 गोपनीयता:</span>
                  <span>आपकी व्यक्तिगत जानकारी (नाम, फोन) कभी सार्वजनिक नहीं की जाती।</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-charcoal-900 shrink-0">🔍 ट्रैकिंग:</span>
                  <span>समस्या दर्ज होने पर 6 अंकों की Reference ID प्राप्त होगी जिससे आप कभी भी स्थिति देख सकते हैं।</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-800 hover:text-saffron-900 border-b border-saffron-800/40 pb-0.5"
                >
                  <span>पहले से दर्ज समस्या का स्टेटस चेक करें →</span>
                </Link>
              </div>
            </div>

            {/* Right side form */}
            <div className="lg:col-span-7">
              <IssueForm />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Citizen Feedback Section (Voluntary + Non-voting Disclaimer) */}
      <CitizenFeedbackSection />

      {/* 6. Contact & Ward Office */}
      <ContactSection />
    </>
  );
}
