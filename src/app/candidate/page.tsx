import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CandidateIntro from '@/components/CandidateIntro';
import { ArrowLeft, CheckCircle2, Shield, HeartHandshake, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'उम्मीदवार के बारे में | श्रीमती पूजा मनीष दाधीच - वार्ड 14',
  description: 'श्रीमती पूजा मनीष दाधीच, वार्ड नंबर 14, भारतीय जनता पार्टी (भाजपा)। परिचय, सामाजिक कार्य और स्थानीय विकास विज़न।',
};

export default function CandidatePage() {
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

        {/* Hero Header for Candidate */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-charcoal-900/10 shadow-editorial mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-xl overflow-hidden shadow-card border border-charcoal-900/10">
                <Image
                  src="/images/ward14-perfect-hero.png"
                  alt="श्रीमती पूजा मनीष दाधीच"
                  width={485}
                  height={435}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-saffron-50 border border-saffron-200 text-saffron-900 text-xs font-bold uppercase tracking-wider">
                <span>वार्ड नंबर 14 • प्रत्याशी परिचय</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-charcoal-950">
                श्रीमती पूजा मनीष दाधीच
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-semibold text-civicgreen-800">
                <span>भारतीय जनता पार्टी (भाजपा)</span>
                <span>•</span>
                <span>वार्ड नंबर 14</span>
                <span>•</span>
                <span className="text-saffron-800 font-bold">सेवा | सुशासन | विकास</span>
              </div>

              <p className="text-charcoal-700 text-base leading-relaxed">
                वार्ड नंबर 14 की निरंतर प्रगति, स्वच्छता और नागरिक कल्याण हेतु समर्पित। हमारा उद्देश्य प्रत्येक नागरिक की आवाज को सीधे प्रशासन तक पहुंचाना और पारदर्शी तरीके से वार्ड की हर समस्या का समाधान सुनिश्चित करना है।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-charcoal-900/5 text-xs">
                  <span className="font-bold text-charcoal-900 block mb-0.5">मूल मंत्र</span>
                  <span className="text-charcoal-600">साफ वार्ड, सुरक्षित वार्ड, विकसित वार्ड</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-charcoal-900/5 text-xs">
                  <span className="font-bold text-charcoal-900 block mb-0.5">जनसंपर्क</span>
                  <span className="text-charcoal-600">सदा सुलभ एवं निरंतर संवाद</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-charcoal-900/5 text-xs">
                  <span className="font-bold text-charcoal-900 block mb-0.5">दृष्टिकोण</span>
                  <span className="text-charcoal-600">पारदर्शिता एवं त्वरित समस्या निवारण</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/report"
                  className="inline-flex items-center gap-2 bg-saffron-700 hover:bg-saffron-800 text-white font-semibold text-sm px-5 py-2.5 rounded-md shadow-xs transition-colors"
                >
                  <span>अपनी समस्या बताएं</span>
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-cream-300 hover:bg-cream-400 text-charcoal-900 font-semibold text-sm px-5 py-2.5 rounded-md border border-charcoal-900/10 transition-colors"
                >
                  <span>कार्यालय में संपर्क करें</span>
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Detailed Tabs & Areas Component */}
        <CandidateIntro />

      </div>
    </div>
  );
}
