'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('कृपया व्यवस्थापक पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(redirectUrl);
      } else {
        setError(data.error || 'अमान्य पासवर्ड अथवा क्रेडेंशियल।');
      }
    } catch {
      setError('सर्वर से संपर्क करने में असमर्थ। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-saffron-700 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-charcoal-950">
            वार्ड 14 • व्यवस्थापक कक्ष
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            श्रीमती पूजा मनीष दाधीच — आधिकारिक नागरिक सेवा प्रबंधन
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-charcoal-900/10 shadow-editorial p-6 sm:p-8">
          
          <div className="mb-6">
            <h2 className="text-lg font-bold text-charcoal-900">सुरक्षित लॉगिन (Admin Access)</h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              नागरिक समस्याओं व सुझावों के प्रबंधन हेतु अधिकृत क्रेडेंशियल दर्ज करें।
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                व्यवस्थापक ईमेल (वैकल्पिक)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ward14.local"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-charcoal-900/15 text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-cream-50/50"
                />
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                सुरक्षित पासवर्ड <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-charcoal-900/15 text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-cream-50/50"
                />
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-saffron-700 hover:bg-saffron-800 text-white font-semibold py-3 px-4 rounded-lg shadow-xs text-sm transition-all duration-150 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>प्रमाणित किया जा रहा है...</span>
                </>
              ) : (
                <>
                  <span>लॉग इन करें</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-charcoal-100 text-center">
            <Link
              href="/"
              className="text-xs text-charcoal-500 hover:text-saffron-800 transition-colors"
            >
              ← मुख्य वेबसाइट पर वापस जाएं
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-[#FAF7F2] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-saffron-700" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
