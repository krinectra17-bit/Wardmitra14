'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store token in localStorage for client bearer calls
        localStorage.setItem('ward14_admin_token', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'गलत पासवर्ड।');
      }
    } catch {
      setError('सर्वर से संपर्क नहीं हो पाया।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 bg-[#FAF7F2] min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6">
        
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

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-charcoal-900/10 shadow-lifted">
          <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron-700 flex items-center justify-center mx-auto mb-4 border border-saffron-200">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-center text-charcoal-900 mb-1">
            कार्यालय प्रशासन लॉगिन
          </h1>
          <p className="text-xs text-center text-charcoal-500 mb-6">
            श्रीमती पूजा मनीष दाधीच • वार्ड 14 प्रबंधन पोर्टल
          </p>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold text-charcoal-800 mb-1">
                प्रशासन पासवर्ड (Admin Password)
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  required
                  placeholder="पासवर्ड दर्ज करें"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-[#FAF7F2]"
                />
                <Lock className="w-4 h-4 text-charcoal-400 absolute right-3 top-3" />
              </div>
              <span className="text-[11px] text-charcoal-400 mt-1 block">
                डिफ़ॉल्ट विकास पासवर्ड: <code className="font-mono text-saffron-800">ward14admin2026</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-saffron-700 hover:bg-saffron-800 disabled:bg-saffron-400 text-white font-semibold py-2.5 rounded-md text-sm transition-colors shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>प्रमाणीकरण हो रहा है...</span>
                </>
              ) : (
                <span>डैशबोर्ड में प्रवेश करें</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-charcoal-900/10 text-center text-[11px] text-charcoal-500">
            सुरक्षित एवं गोपनीय प्रशासनिक प्रवेश द्वार
          </div>
        </div>

      </div>
    </div>
  );
}
