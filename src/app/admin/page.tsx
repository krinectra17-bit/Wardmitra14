'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  LogOut,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Eye,
  X,
  MessageSquare,
  FileText,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface IssueItem {
  _id: string;
  referenceId: string;
  name?: string;
  mobile?: string;
  category: string;
  description: string;
  location: string;
  imageUrl?: string;
  status: 'नई समस्या' | 'जांच में' | 'संबंधित विभाग को सूचित' | 'समाधान हुआ';
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackItem {
  _id: string;
  name?: string;
  mobile?: string;
  response: string;
  message?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  newIssues: number;
  inReview: number;
  forwarded: number;
  resolved: number;
  feedbackCount: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'issues' | 'feedback'>('issues');

  // Stats
  const [stats, setStats] = useState<Stats>({
    total: 0,
    newIssues: 0,
    inReview: 0,
    forwarded: 0,
    resolved: 0,
    feedbackCount: 0,
  });

  // Issues Data
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('सभी');
  const [filterStatus, setFilterStatus] = useState('सभी');

  // Feedback Data
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  // Selected Photo Modal
  const [viewPhotoUrl, setViewPhotoUrl] = useState<string | null>(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notesState, setNotesState] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const token = localStorage.getItem('ward14_admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthToken(token);
      loadDashboardData(token);
    }
  }, [router]);

  const loadDashboardData = async (token: string) => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      } else if (statsRes.status === 401) {
        handleLogout();
        return;
      }

      // 2. Fetch Issues
      await fetchIssues(token);

      // 3. Fetch Feedbacks
      const fbRes = await fetch('/api/feedback', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        if (fbData.success) setFeedbacks(fbData.feedbacks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async (token = authToken) => {
    if (!token) return;
    try {
      let url = `/api/issues?category=${encodeURIComponent(filterCategory)}&status=${encodeURIComponent(filterStatus)}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIssues(data.issues || []);
          // init notes state
          const notes: { [key: string]: string } = {};
          (data.issues || []).forEach((item: IssueItem) => {
            notes[item.referenceId] = item.internalNotes || '';
          });
          setNotesState(notes);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (issueRef: string, newStatus: string) => {
    if (!authToken) return;
    setUpdatingId(issueRef);
    try {
      const res = await fetch(`/api/issues/${issueRef}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setIssues((prev) =>
          prev.map((i) => (i.referenceId === issueRef ? { ...i, status: newStatus as any } : i))
        );
        // Refresh stats
        const statsRes = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) setStats(statsData.stats);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (issueRef: string) => {
    if (!authToken) return;
    const notes = notesState[issueRef] || '';
    setUpdatingId(issueRef);
    try {
      await fetch(`/api/issues/${issueRef}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ internalNotes: notes }),
      });
      alert('कार्यालय नोट सहेज लिया गया।');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteIssue = async (issueRef: string) => {
    if (!authToken) return;
    if (!confirm('क्या आप वाकई इस प्रविष्टि को हटाना चाहते हैं?')) return;

    try {
      const res = await fetch(`/api/issues/${issueRef}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setIssues((prev) => prev.filter((i) => i.referenceId !== issueRef));
        alert('प्रविष्टि हटा दी गई।');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('ward14_admin_token');
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-900/10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-civicgreen-600" />
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
                वार्ड 14 कार्यालय प्रबंधन डैशबोर्ड
              </h1>
            </div>
            <p className="text-xs text-charcoal-600">
              श्रीमती पूजा मनीष दाधीच • भारतीय जनता पार्टी (भाजपा)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadDashboardData(authToken!)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white border border-charcoal-900/10 text-xs font-semibold text-charcoal-700 hover:bg-cream-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>रिफ्रेश</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-red-50 border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-4 bg-white rounded-lg border border-charcoal-900/10 shadow-editorial">
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
              कुल समस्याएं
            </span>
            <span className="text-2xl font-bold text-charcoal-900">{stats.total}</span>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 shadow-editorial">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
              नई समस्याएं
            </span>
            <span className="text-2xl font-bold text-amber-950">{stats.newIssues}</span>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-editorial">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
              जांच में
            </span>
            <span className="text-2xl font-bold text-blue-950">{stats.inReview}</span>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 shadow-editorial">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-1">
              विभाग को प्रेषित
            </span>
            <span className="text-2xl font-bold text-purple-950">{stats.forwarded}</span>
          </div>

          <div className="p-4 bg-civicgreen-50 rounded-lg border border-civicgreen-200 shadow-editorial">
            <span className="text-[11px] font-bold text-civicgreen-800 uppercase tracking-wider block mb-1">
              समाधान हुआ
            </span>
            <span className="text-2xl font-bold text-civicgreen-950">{stats.resolved}</span>
          </div>

          <div className="p-4 bg-cream-200 rounded-lg border border-charcoal-900/10 shadow-editorial">
            <span className="text-[11px] font-bold text-charcoal-600 uppercase tracking-wider block mb-1">
              नागरिक प्रतिक्रिया
            </span>
            <span className="text-2xl font-bold text-charcoal-900">{stats.feedbackCount}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-charcoal-900/10 mb-6">
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'issues'
                ? 'border-saffron-700 text-saffron-900 bg-white/60'
                : 'border-transparent text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>दर्ज समस्याएं ({issues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'feedback'
                ? 'border-saffron-700 text-saffron-900 bg-white/60'
                : 'border-transparent text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>नागरिक प्रतिक्रिया ({feedbacks.length})</span>
          </button>
        </div>

        {/* TAB 1: ISSUES LIST */}
        {activeTab === 'issues' && (
          <div className="space-y-6">
            {/* Filter & Search Toolbar */}
            <div className="p-4 bg-white rounded-lg border border-charcoal-900/10 shadow-editorial flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="ID, स्थान अथवा विवरण से खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchIssues()}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded border border-charcoal-900/15 bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                  }}
                  className="px-3 py-2 text-xs rounded border border-charcoal-900/15 bg-[#FAF7F2] focus:outline-none"
                >
                  <option value="सभी">सभी श्रेणियां</option>
                  <option value="सड़क">सड़क</option>
                  <option value="पानी">पानी</option>
                  <option value="नाली / सीवरेज">नाली / सीवरेज</option>
                  <option value="सफाई">सफाई</option>
                  <option value="स्ट्रीट लाइट">स्ट्रीट लाइट</option>
                  <option value="पार्क">पार्क</option>
                  <option value="बिजली">बिजली</option>
                  <option value="ट्रैफिक / पार्किंग">ट्रैफिक / पार्किंग</option>
                  <option value="सरकारी सुविधा">सरकारी सुविधा</option>
                  <option value="अन्य">अन्य</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                  }}
                  className="px-3 py-2 text-xs rounded border border-charcoal-900/15 bg-[#FAF7F2] focus:outline-none"
                >
                  <option value="सभी">सभी स्थितियां</option>
                  <option value="नई समस्या">नई समस्या</option>
                  <option value="जांच में">जांच में</option>
                  <option value="संबंधित विभाग को सूचित">संबंधित विभाग को सूचित</option>
                  <option value="समाधान हुआ">समाधान हुआ</option>
                </select>

                <button
                  onClick={() => fetchIssues()}
                  className="bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold px-4 py-2 rounded"
                >
                  लागू करें
                </button>
              </div>
            </div>

            {/* Issues Cards List */}
            {issues.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-lg border border-charcoal-900/10 text-charcoal-500">
                कोई समस्या नहीं मिली।
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((item) => (
                  <div
                    key={item._id}
                    className="p-5 bg-white rounded-xl border border-charcoal-900/10 shadow-editorial hover:shadow-card transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-900/5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-saffron-900 bg-saffron-50 px-2.5 py-1 rounded border border-saffron-200">
                          {item.referenceId}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-cream-200 text-charcoal-800 border border-charcoal-900/10">
                          {item.category}
                        </span>
                        <span className="text-xs text-charcoal-400">
                          {new Date(item.createdAt).toLocaleDateString('hi-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-charcoal-500 font-medium">स्थिति:</span>
                        <select
                          value={item.status}
                          disabled={updatingId === item.referenceId}
                          onChange={(e) => handleStatusChange(item.referenceId, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded border focus:outline-none ${
                            item.status === 'नई समस्या'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : item.status === 'जांच में'
                              ? 'bg-blue-50 text-blue-900 border-blue-300'
                              : item.status === 'संबंधित विभाग को सूचित'
                              ? 'bg-purple-50 text-purple-900 border-purple-300'
                              : 'bg-civicgreen-50 text-civicgreen-900 border-civicgreen-300'
                          }`}
                        >
                          <option value="नई समस्या">नई समस्या</option>
                          <option value="जांच में">जांच में</option>
                          <option value="संबंधित विभाग को सूचित">संबंधित विभाग को सूचित</option>
                          <option value="समाधान हुआ">समाधान हुआ</option>
                        </select>
                      </div>
                    </div>

                    {/* Citizen Info & Location */}
                    <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-charcoal-600 bg-[#FAF7F2] p-3 rounded-md my-3 border border-charcoal-900/5">
                      <div>
                        <strong className="text-charcoal-900">नागरिक नाम:</strong> {item.name || 'गुमनाम'}
                      </div>
                      <div>
                        <strong className="text-charcoal-900">मोबाइल:</strong>{' '}
                        {item.mobile ? (
                          <a href={`tel:${item.mobile}`} className="text-saffron-800 underline">
                            {item.mobile}
                          </a>
                        ) : (
                          'उल्लेखित नहीं'
                        )}
                      </div>
                      <div>
                        <strong className="text-charcoal-900">स्थान:</strong> {item.location}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-charcoal-800 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Photo if present */}
                    {item.imageUrl && (
                      <div className="mb-3">
                        <button
                          onClick={() => setViewPhotoUrl(item.imageUrl || null)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-800 bg-saffron-50 border border-saffron-200 px-3 py-1.5 rounded hover:bg-saffron-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>संलग्न फोटो देखें</span>
                        </button>
                      </div>
                    )}

                    {/* Internal Notes & Action */}
                    <div className="pt-3 border-t border-charcoal-900/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder="कार्यालय आंतरिक नोट जोड़ें (उदा. निगम जेई को सूचना दी गई)..."
                        value={notesState[item.referenceId] ?? item.internalNotes ?? ''}
                        onChange={(e) =>
                          setNotesState({ ...notesState, [item.referenceId]: e.target.value })
                        }
                        className="flex-grow px-3 py-1.5 text-xs rounded border border-charcoal-900/15 bg-[#FAF7F2] focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveNotes(item.referenceId)}
                        disabled={updatingId === item.referenceId}
                        className="px-3 py-1.5 rounded bg-charcoal-800 text-white text-xs font-semibold hover:bg-charcoal-900 transition-colors"
                      >
                        नोट सहेजें
                      </button>
                      <button
                        onClick={() => handleDeleteIssue(item.referenceId)}
                        className="px-2.5 py-1.5 rounded text-red-600 hover:bg-red-50 text-xs transition-colors"
                        title="हटाएं (स्पैम)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CITIZEN FEEDBACK LIST */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-xl border border-charcoal-900/10 shadow-editorial overflow-hidden">
            <div className="p-4 bg-[#FAF7F2] border-b border-charcoal-900/10">
              <h3 className="font-serif font-bold text-charcoal-900 text-base">
                नागरिकों द्वारा दर्ज स्वैच्छिक राय व सुझाव
              </h3>
            </div>

            {feedbacks.length === 0 ? (
              <div className="p-8 text-center text-charcoal-500 text-sm">
                अभी तक कोई प्रतिक्रिया दर्ज नहीं हुई है।
              </div>
            ) : (
              <div className="divide-y divide-charcoal-900/5">
                {feedbacks.map((fb) => (
                  <div key={fb._id} className="p-4 sm:p-5 hover:bg-[#FAF7F2]/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-charcoal-900 text-sm">
                          {fb.name || 'नागरिक'}
                        </span>
                        {fb.mobile && (
                          <span className="text-xs text-charcoal-500 font-mono">
                            ({fb.mobile})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-charcoal-400">
                        {new Date(fb.createdAt).toLocaleString('hi-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="inline-block px-3 py-1 rounded bg-saffron-50 border border-saffron-200 text-saffron-900 font-semibold text-xs mb-2">
                      {fb.response}
                    </div>

                    {fb.message && (
                      <p className="text-xs text-charcoal-700 bg-[#FAF7F2] p-3 rounded border border-charcoal-900/5 mt-1">
                        &ldquo;{fb.message}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Photo Modal */}
      {viewPhotoUrl && (
        <div
          onClick={() => setViewPhotoUrl(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-xl overflow-hidden max-w-2xl w-full p-2 shadow-2xl"
          >
            <button
              onClick={() => setViewPhotoUrl(null)}
              className="absolute top-4 right-4 bg-charcoal-900/80 text-white rounded-full p-1.5 hover:bg-charcoal-900"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={viewPhotoUrl}
              alt="संलग्न फोटो"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
