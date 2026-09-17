'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  ListFilter,
  MessageSquare,
  ArrowUpRight,
  RefreshCw,
  Loader2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  feedbackCount: number;
}

interface RecentSubmission {
  referenceId: string;
  citizenName?: string;
  name?: string;
  category: string;
  location: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    feedbackCount: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.recentSubmissions) {
          setRecentSubmissions(data.recentSubmissions);
        }
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'Pending' || status === 'नई समस्या') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Pending (लंबित)
        </span>
      );
    }
    if (status === 'In Progress' || status === 'जांच में' || status === 'संबंधित विभाग को सूचित') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          In Progress (प्रगति पर)
        </span>
      );
    }
    if (status === 'Resolved' || status === 'समाधान हुआ') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Resolved (समाधान हुआ)
        </span>
      );
    }
    return <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{status}</span>;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-950">
              प्रशासनिक डैशबोर्ड (Overview)
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              वार्ड 14 नागरिक समस्याओं, समाधान प्रगति और जनसंवाद की समग्र स्थिति।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white hover:bg-cream-100 text-charcoal-800 text-xs font-semibold px-3.5 py-2 rounded-lg border border-charcoal-900/15 shadow-2xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>रिफ्रेश करें</span>
            </button>

            <Link
              href="/admin/issues"
              className="inline-flex items-center gap-2 bg-saffron-700 hover:bg-saffron-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
            >
              <span>समस्या प्रबंधन खोलें</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Total Issues */}
          <div className="bg-white p-5 rounded-xl border border-charcoal-900/10 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                कुल समस्याएं (Total Issues)
              </span>
              <div className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center text-charcoal-700">
                <ListFilter className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-charcoal-950 mt-3 font-serif">
              {stats.total}
            </div>
            <div className="text-xs text-charcoal-500 mt-1">
              पोर्टल पर पंजीकृत समस्त नागरिक मामले
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-5 rounded-xl border border-charcoal-900/10 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                लंबित (Pending)
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-900 mt-3 font-serif">
              {stats.pending}
            </div>
            <div className="text-xs text-amber-700/80 mt-1">
              समीक्षा व प्राथमिक कार्रवाई हेतु प्रतीक्षारत
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white p-5 rounded-xl border border-charcoal-900/10 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                प्रगति पर (In Progress)
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-950 mt-3 font-serif">
              {stats.inProgress}
            </div>
            <div className="text-xs text-blue-700/80 mt-1">
              विभाग स्तर पर समाधान प्रक्रिया जारी
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white p-5 rounded-xl border border-charcoal-900/10 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                समाधान हुआ (Resolved)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-950 mt-3 font-serif">
              {stats.resolved}
            </div>
            <div className="text-xs text-emerald-700/80 mt-1">
              सफलतापूर्वक पूर्ण एवं निस्तारित मामले
            </div>
          </div>

        </div>

        {/* Quick Hub Navigation & Feedback Stat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Feedback Summary Card */}
          <div className="bg-white p-6 rounded-xl border border-charcoal-900/10 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
                  नागरिक जनसंवाद
                </span>
                <MessageSquare className="w-4 h-4 text-civicgreen-700" />
              </div>
              <div className="text-2xl font-bold text-charcoal-950 font-serif">
                {stats.feedbackCount} प्रतिक्रियाएं
              </div>
              <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
                वार्ड के नागरिकों द्वारा दर्ज स्वैच्छिक राय, सुझाव एवं सहमति।
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-charcoal-100">
              <Link
                href="/admin/feedback"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-800 hover:text-saffron-900"
              >
                <span>सभी प्रतिक्रियाएं देखें</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Fast Actions */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-charcoal-900/10 shadow-2xs">
            <h2 className="text-sm font-bold text-charcoal-900 mb-4">त्वरित व्यवस्थापक कार्य (Quick Actions)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/issues?status=Pending"
                className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                  <span>लंबित समस्याएं देखें</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
                  सीधे {stats.pending} अनसुलझे मामलों की समीक्षा करें
                </div>
              </Link>

              <Link
                href="/admin/issues"
                className="p-3.5 rounded-lg border border-charcoal-200 hover:border-saffron-500 hover:bg-cream-50 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-charcoal-900 flex items-center justify-between">
                  <span>समस्या खोज एवं स्थिति बदलें</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-charcoal-500 mt-1">
                  आईडी खोजें, श्रेणी फिल्टर करें और स्टेटस अपडेट करें
                </div>
              </Link>

              <Link
                href="/report"
                target="_blank"
                className="p-3.5 rounded-lg border border-charcoal-200 hover:border-saffron-500 hover:bg-cream-50 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-charcoal-900 flex items-center justify-between">
                  <span>कार्यालय की ओर से नई शिकायत दर्ज करें</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-charcoal-500 mt-1">
                  नागरिक फॉर्म के माध्यम से तुरंत समस्या दर्ज करें
                </div>
              </Link>

              <Link
                href="/track"
                target="_blank"
                className="p-3.5 rounded-lg border border-charcoal-200 hover:border-saffron-500 hover:bg-cream-50 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-charcoal-900 flex items-center justify-between">
                  <span>नागरिक ट्रैकिंग पोर्टल जांचें</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-charcoal-500 mt-1">
                  जांचें कि नागरिक अपनी समस्या का स्टेटस कैसे देखते हैं
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Recent Submissions Section */}
        <div className="bg-white rounded-xl border border-charcoal-900/10 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-charcoal-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-charcoal-950 font-serif">
                हालिया नागरिक समस्याएं (Recent Submissions)
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                वार्ड 14 से हाल ही में दर्ज किए गए नवीनतम 5 मामले
              </p>
            </div>
            <Link
              href="/admin/issues"
              className="text-xs font-bold text-saffron-800 hover:text-saffron-900"
            >
              सभी समस्याएं देखें →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-charcoal-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-saffron-600" />
              <span className="text-xs">डेटा लोड हो रहा है...</span>
            </div>
          ) : recentSubmissions.length === 0 ? (
            <div className="p-12 text-center text-charcoal-500 text-xs">
              अभी कोई समस्या दर्ज नहीं हुई है।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal-800">
                <thead className="bg-cream-100/60 text-charcoal-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">संदर्भ ID (Reference ID)</th>
                    <th className="py-3 px-4">नागरिक (Citizen)</th>
                    <th className="py-3 px-4">श्रेणी (Category)</th>
                    <th className="py-3 px-4">स्थान (Location)</th>
                    <th className="py-3 px-4">स्थिति (Status)</th>
                    <th className="py-3 px-4">दिनांक (Date)</th>
                    <th className="py-3 px-4 text-right">कार्य (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.referenceId} className="hover:bg-cream-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-saffron-900">
                        {sub.referenceId}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {sub.citizenName || sub.name || 'नागरिक'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-800 font-medium">
                          {sub.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-charcoal-600 truncate max-w-[180px]">
                        {sub.location}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="py-3 px-4 text-charcoal-500">
                        {new Date(sub.createdAt).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/issues?search=${sub.referenceId}`}
                          className="text-xs font-bold text-saffron-800 hover:text-saffron-900 underline underline-offset-2"
                        >
                          विवरण देखें
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
