'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, AlertCircle, Search, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'होम' },
    { href: '/candidate', label: 'उम्मीदवार' },
    { href: '/priorities', label: 'वार्ड की प्राथमिकताएं' },
    { href: '/report', label: 'समस्या बताएं' },
    { href: '/track', label: 'समस्या ट्रैक करें' },
    { href: '/feedback', label: 'नागरिक प्रतिक्रिया' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-charcoal-900/10">
      {/* Top subtle tricolor stripe */}
      <div className="tricolor-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Branding */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            {/* BJP Lotus Symbol Badge / Emblem */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-saffron-50 border border-saffron-300 flex items-center justify-center text-saffron-700 font-bold shadow-xs">
              <span className="text-lg">🪷</span>
            </div>
            <div className="flex flex-col">
              <span className="font-editorial-heading text-lg sm:text-xl font-bold tracking-tight text-charcoal-900 group-hover:text-saffron-700 transition-colors">
                श्रीमती पूजा मनीष दाधीच
              </span>
              <span className="text-xs font-semibold text-civicgreen-800 tracking-wider">
                वार्ड नंबर 14 • भारतीय जनता पार्टी (भाजपा)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors py-1 relative ${
                    isActive
                      ? 'text-saffron-700 font-semibold'
                      : 'text-charcoal-800 hover:text-saffron-700'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-saffron-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 bg-saffron-700 hover:bg-saffron-800 text-white text-sm font-semibold px-4 py-2.5 rounded-md shadow-xs transition-all duration-200 hover:shadow-md"
            >
              <AlertCircle className="w-4 h-4" />
              <span>अपनी समस्या बताएं</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/report"
              className="bg-saffron-700 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1 sm:hidden"
            >
              समस्या दर्ज करें
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-charcoal-800 hover:bg-cream-300 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500"
              aria-label="मेनू खोलें"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slideout / Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-charcoal-900/10 bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in duration-200">
          <div className="px-2 py-1 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
            नेविगेशन
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-saffron-100 text-saffron-900 font-semibold'
                    : 'text-charcoal-800 hover:bg-cream-300'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-charcoal-900/10 flex flex-col gap-2">
            <Link
              href="/report"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-saffron-700 text-white text-sm font-semibold py-3 rounded-md shadow-xs"
            >
              <AlertCircle className="w-4 h-4" />
              <span>अपनी समस्या बताएं</span>
            </Link>
            <Link
              href="/track"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-cream-300 text-charcoal-900 text-sm font-semibold py-2.5 rounded-md"
            >
              <Search className="w-4 h-4 text-charcoal-600" />
              <span>समस्या की स्थिति देखें (Track ID)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
