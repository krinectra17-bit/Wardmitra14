import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle, Compass } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-[#FAF6F0] overflow-hidden">
      
      {/* ========================================================================= */}
      {/* DESKTOP HERO (lg:flex, 85–94vh height)                                    */}
      {/* Photography & text integrated into one full-width editorial composition   */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex relative min-h-[86vh] xl:min-h-[92vh] items-center">
        
        {/* Atmospheric warm background lighting */}
        <div className="absolute top-1/3 right-[20%] w-[500px] h-[500px] rounded-full bg-saffron-100/30 blur-3xl pointer-events-none -z-10" />

        {/* Right Photographic Layer (NO cards, NO borders, NO box shadows) */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] xl:w-[52%] h-full pointer-events-none overflow-hidden select-none flex items-end justify-end">
          <div className="relative w-full h-[92%] max-h-[720px]">
            <Image
              src="/images/ward14-perfect-hero.png"
              alt="श्रीमती पूजा मनीष दाधीच - वार्ड नंबर 14"
              fill
              priority
              quality={100}
              className="object-contain object-bottom"
            />
          </div>
        </div>

        {/* Foreground Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="max-w-xl xl:max-w-2xl text-left">
            
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-5 text-xs font-bold uppercase tracking-widest text-charcoal-700">
              <span className="w-8 h-[2px] bg-saffron-600 inline-block" />
              <span>वार्ड नंबर 14</span>
              <span className="text-charcoal-400">•</span>
              <span className="text-civicgreen-800 font-semibold tracking-normal">स्थानीय नागरिक सेवा मंच</span>
            </div>

            {/* Main Editorial Heading */}
            <h1 className="font-editorial-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-charcoal-950 leading-[1.12] mb-4">
              श्रीमती पूजा मनीष दाधीच
            </h1>

            {/* Sub-Information */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-lg lg:text-xl font-bold text-saffron-800 tracking-tight">
                भारतीय जनता पार्टी (भाजपा)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-civicgreen-700 inline-block" />
              <span className="text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                सेवा | सुशासन | विकास
              </span>
            </div>

            {/* Short Factual Description */}
            <p className="text-base lg:text-lg text-charcoal-700 leading-relaxed mb-8 max-w-lg font-normal">
              वार्ड 14 के नागरिकों की समस्याओं, सुझावों और स्थानीय मुद्दों को सामने लाने के लिए यह मंच बनाया गया है।
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex items-center gap-4">
              <Link
                href="/report"
                className="inline-flex items-center gap-2.5 bg-saffron-700 hover:bg-saffron-800 text-white font-semibold px-6 py-3.5 rounded-md shadow-xs transition-all duration-200 hover:shadow-md text-sm sm:text-base"
              >
                <AlertCircle className="w-4 h-4" />
                <span>अपनी समस्या बताएं</span>
              </Link>

              <Link
                href="/priorities"
                className="inline-flex items-center gap-2 bg-[#FAF6F0] hover:bg-cream-300 text-charcoal-900 font-semibold px-6 py-3.5 rounded-md border border-charcoal-900/25 transition-colors text-sm sm:text-base"
              >
                <Compass className="w-4 h-4 text-civicgreen-800" />
                <span>वार्ड की जानकारी देखें</span>
              </Link>
            </div>

            {/* Direct Tracking Callout */}
            <div className="mt-8 pt-6 border-t border-charcoal-900/10 flex items-center gap-2 text-xs text-charcoal-500">
              <span>पूर्व में दर्ज समस्या का स्टेटस देखना चाहते हैं?</span>
              <Link
                href="/track"
                className="text-saffron-800 font-bold underline underline-offset-2 hover:text-saffron-900"
              >
                यहाँ ट्रैक करें →
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE HERO (Rendered on mobile & tablet < 1024px)                         */}
      {/* 1. Candidate photo first (crisp, both people visible, zero cards)         */}
      {/* 2. Candidate name                                                         */}
      {/* 3. Ward info                                                              */}
      {/* 4. Description                                                            */}
      {/* 5. CTAs                                                                   */}
      {/* ========================================================================= */}
      <div className="block lg:hidden w-full">
        
        {/* Full-width Photograph Layer with Natural Bottom Fade into Canvas */}
        <div className="relative w-full h-[340px] sm:h-[420px] overflow-hidden select-none flex items-center justify-center">
          <div className="relative w-full h-full max-w-md">
            <Image
              src="/images/ward14-perfect-hero.png"
              alt="श्रीमती पूजा मनीष दाधीच - वार्ड नंबर 14"
              fill
              priority
              quality={100}
              className="object-contain object-bottom"
            />
          </div>
        </div>

        {/* Content Block below photo */}
        <div className="px-5 sm:px-8 pt-4 pb-12 text-left relative z-10">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-charcoal-700">
            <span className="w-5 h-[2px] bg-saffron-600 inline-block" />
            <span>वार्ड नंबर 14</span>
          </div>

          {/* Candidate Name */}
          <h1 className="font-editorial-heading text-3xl sm:text-4xl font-bold text-charcoal-950 leading-[1.18] mb-2">
            श्रीमती पूजा मनीष दाधीच
          </h1>

          {/* Ward & Party Information */}
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-saffron-800 mb-4">
            <span>भारतीय जनता पार्टी (भाजपा)</span>
            <span className="text-charcoal-400">•</span>
            <span className="text-xs text-civicgreen-800 font-semibold">सेवा | सुशासन | विकास</span>
          </div>

          {/* Short Factual Description */}
          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed mb-6 font-normal">
            वार्ड 14 के नागरिकों की समस्याओं, सुझावों और स्थानीय मुद्दों को सामने लाने के लिए यह मंच बनाया गया है।
          </p>

          {/* CTA Buttons (Thumb-friendly & full-width on mobile) */}
          <div className="flex flex-col gap-3">
            <Link
              href="/report"
              className="w-full flex items-center justify-center gap-2 bg-saffron-700 hover:bg-saffron-800 text-white font-semibold py-3.5 px-5 rounded-md shadow-xs text-sm transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              <span>अपनी समस्या बताएं</span>
            </Link>

            <Link
              href="/priorities"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-cream-200 text-charcoal-900 font-semibold py-3.5 px-5 rounded-md border border-charcoal-900/20 text-sm transition-colors"
            >
              <Compass className="w-4 h-4 text-civicgreen-800" />
              <span>वार्ड की जानकारी देखें</span>
            </Link>
          </div>

          {/* Quick Tracking Link */}
          <p className="mt-4 text-xs text-center text-charcoal-500">
            दर्ज समस्या का स्टेटस जांचें:{' '}
            <Link href="/track" className="text-saffron-800 font-bold underline underline-offset-2">
              यहाँ ट्रैक करें
            </Link>
          </p>

        </div>

      </div>

    </section>
  );
}
