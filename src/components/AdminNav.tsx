'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // ignore
    }
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'डैशबोर्ड (Dashboard)', icon: LayoutDashboard },
    { href: '/admin/issues', label: 'समस्याएं (Issues)', icon: ClipboardList },
    { href: '/admin/feedback', label: 'प्रतिक्रिया (Feedback)', icon: MessageSquare },
  ];

  return (
    <header className="bg-charcoal-950 text-white border-b border-charcoal-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-saffron-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white">
                वार्ड 14 • व्यवस्थापक कक्ष
              </div>
              <div className="text-[10px] text-charcoal-400 font-medium">
                Smt. Pooja Manish Dadhich Admin
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-saffron-600 text-white shadow-xs'
                      : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal-300 hover:text-white hover:bg-charcoal-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>मुख्य वेबसाइट</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉग आउट</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Sub-Bar */}
      <div className="md:hidden border-t border-charcoal-800 px-4 py-2 flex items-center justify-around bg-charcoal-900">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                isActive
                  ? 'bg-saffron-600 text-white'
                  : 'text-charcoal-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
