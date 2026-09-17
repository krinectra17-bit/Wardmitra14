'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft, Clock, Calendar, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Tag } from 'lucide-react';

interface TrackedIssue {
  referenceId: string;
  category: string;
  status: 'नई समस्या' | 'जांच में' | 'संबंधित विभाग को सूचित' | 'समाधान हुआ';
  createdAt: string;
  updatedAt: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [referenceId, setReferenceId] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState<TrackedIssue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [initialRef]);

  const handleSearch = async (refToSearch?: string) => {
    const targetRef = (refToSearch || referenceId).trim().toUpperCase();
    if (!targetRef) {
      setError('कृपया अपनी समस्या ID दर्ज करें (उदा. WARD14-XXXXXX)।');
      return;
    }

    setLoading(true);
    setError(null);
    setIssue(null);

    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(targetRef)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setIssue(data.issue);
      } else {
        setError(data.error || 'समस्या रिकॉर्ड नहीं मिला। कृपया ID की जांच करें।');
      }
    } catch {
      setError('सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'नई समस्या':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            नई समस्या (पंजीकृत)
          </span>
        );
      case 'जांच में':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            जांच में (कार्यालय द्वारा समीक्षा जारी)
          </span>
        );
      case 'संबंधित विभाग को सूचित':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            संबंधित विभाग को अग्रेषित
          </span>
        );
      case 'समाधान हुआ':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-civicgreen-100 text-civicgreen-900 border border-civicgreen-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-civicgreen-700" />
            समाधान हुआ (कार्य संपन्न)
          </span>
        );
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2] min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
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

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cream-200 border border-charcoal-900/10 text-charcoal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Search className="w-3.5 h-3.5 text-saffron-700" />
            <span>पारदर्शी नागरिक सेवा</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-950 mb-3">
            अपनी समस्या की स्थिति देखें
          </h1>
          <p className="text-charcoal-600 text-sm sm:text-base max-w-lg mx-auto">
            समस्या दर्ज करते समय मिली 6 अंकों की संदर्भ संख्या (उदा. WARD14-123456) दर्ज करके वर्तमान प्रगति देखें।
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-charcoal-900/10 shadow-editorial mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                placeholder="उदा. WARD14-123456"
                className="w-full px-4 py-3 rounded-md border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 font-mono text-base tracking-wider uppercase bg-[#FAF7F2]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-saffron-700 hover:bg-saffron-800 disabled:bg-saffron-400 text-white font-semibold px-6 py-3 rounded-md shadow-xs transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>खोज रहे हैं...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>स्थिति देखें</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Issue Details Card (Safe Public Display) */}
        {issue && (
          <div className="bg-white rounded-xl border border-charcoal-900/10 shadow-lifted overflow-hidden animate-in fade-in duration-200">
            <div className="p-6 bg-[#FAF7F2] border-b border-charcoal-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-charcoal-500 font-medium block">समस्या संदर्भ संख्या</span>
                <span className="text-xl font-mono font-bold text-charcoal-950">{issue.referenceId}</span>
              </div>
              <div>{getStatusBadge(issue.status)}</div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Category & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-charcoal-900/5">
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>श्रेणी</span>
                  </div>
                  <span className="text-sm font-bold text-charcoal-900">{issue.category}</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-charcoal-900/5">
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>दर्ज करने की तिथि</span>
                  </div>
                  <span className="text-sm font-bold text-charcoal-900">
                    {new Date(issue.createdAt).toLocaleDateString('hi-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-charcoal-900/5">
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>अंतिम अद्यतन</span>
                  </div>
                  <span className="text-sm font-bold text-charcoal-900">
                    {new Date(issue.updatedAt).toLocaleDateString('hi-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Status Explanation Step Progression */}
              <div className="pt-4 border-t border-charcoal-900/10">
                <span className="text-xs font-bold text-charcoal-700 block uppercase tracking-wider mb-4">
                  समाधान प्रक्रिया के चरण:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className={`p-2.5 rounded border ${issue.status === 'नई समस्या' ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-gray-50 text-gray-500'}`}>
                    1. नई समस्या दर्ज
                  </div>
                  <div className={`p-2.5 rounded border ${issue.status === 'जांच में' ? 'bg-blue-50 border-blue-300 font-bold text-blue-900' : 'bg-gray-50 text-gray-500'}`}>
                    2. कार्यालय जांच
                  </div>
                  <div className={`p-2.5 rounded border ${issue.status === 'संबंधित विभाग को सूचित' ? 'bg-purple-50 border-purple-300 font-bold text-purple-900' : 'bg-gray-50 text-gray-500'}`}>
                    3. विभाग को प्रेषित
                  </div>
                  <div className={`p-2.5 rounded border ${issue.status === 'समाधान हुआ' ? 'bg-civicgreen-50 border-civicgreen-300 font-bold text-civicgreen-900' : 'bg-gray-50 text-gray-500'}`}>
                    4. समाधान संपन्न
                  </div>
                </div>
              </div>

              {/* Privacy Badge */}
              <div className="p-3 bg-cream-200 rounded text-[11px] text-charcoal-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-civicgreen-700 shrink-0" />
                <span>नागरिक सुरक्षा: गोपनीयता नियमों के तहत शिकायतकर्ता का नाम एवं फोन नंबर सार्वजनिक नहीं किया जाता है।</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-charcoal-500">लोड हो रहा है...</div>}>
      <TrackContent />
    </Suspense>
  );
}
