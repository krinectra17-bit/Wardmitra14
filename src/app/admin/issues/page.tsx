'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import {
  Search,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  X,
  FileText,
  Camera,
  ExternalLink,
  Phone,
  MapPin,
  Calendar,
  Check,
} from 'lucide-react';

interface IssueItem {
  _id: string;
  referenceId: string;
  citizenName?: string;
  name?: string;
  mobile?: string;
  category: string;
  description: string;
  location: string;
  photoUrl?: string;
  imageUrl?: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  'सभी श्रेणियां (All)',
  'सड़क',
  'पानी',
  'नाली / सीवरेज',
  'सफाई',
  'स्ट्रीट लाइट',
  'पार्क',
  'बिजली',
  'ट्रैफिक / पार्किंग',
  'सरकारी सुविधा',
  'अन्य',
];

function AdminIssuesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || 'all';

  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Selected Issue for modal inspection
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);
  const [editStatus, setEditStatus] = useState<string>('Pending');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Photo enlargement modal
  const [viewPhotoUrl, setViewPhotoUrl] = useState<string | null>(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (categoryFilter && categoryFilter !== 'all' && !categoryFilter.includes('सभी')) {
        params.set('category', categoryFilter);
      }

      const res = await fetch(`/api/admin/issues?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setIssues(data.issues || []);
      }
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIssues();
  };

  const openIssueDetail = (issue: IssueItem) => {
    setSelectedIssue(issue);
    setEditStatus(issue.status);
    setEditNotes(issue.internalNotes || '');
    setUpdateMessage(null);
  };

  const closeIssueDetail = () => {
    setSelectedIssue(null);
    setUpdateMessage(null);
  };

  const handleUpdateIssue = async () => {
    if (!selectedIssue) return;
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const res = await fetch(`/api/admin/issues/${selectedIssue.referenceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          internalNotes: editNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUpdateMessage('स्थिति एवं नोट्स सफलतापूर्वक अपडेट किए गए!');
        // Update local issue state
        setIssues((prev) =>
          prev.map((item) =>
            item.referenceId === selectedIssue.referenceId
              ? { ...item, status: editStatus, internalNotes: editNotes, updatedAt: new Date().toISOString() }
              : item
          )
        );
        setSelectedIssue((prev) =>
          prev ? { ...prev, status: editStatus, internalNotes: editNotes } : null
        );
      } else {
        setUpdateMessage(data.error || 'अपडेट करने में त्रुटि हुई।');
      }
    } catch {
      setUpdateMessage('सर्वर से संपर्क करने में समस्या आई।');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteIssue = async (referenceId: string) => {
    if (!confirm(`क्या आप संदर्भ ID ${referenceId} को निश्चित रूप से हटाना चाहते हैं?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/issues/${referenceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIssues((prev) => prev.filter((i) => i.referenceId !== referenceId));
        if (selectedIssue?.referenceId === referenceId) {
          closeIssueDetail();
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

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
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-950">
              नागरिक समस्या प्रबंधन (Issue Management)
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              संदर्भ संख्या, श्रेणी और स्थिति अनुसार समस्याओं की खोज व निस्तारण।
            </p>
          </div>

          <button
            onClick={fetchIssues}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-white hover:bg-cream-100 text-charcoal-800 text-xs font-semibold px-3.5 py-2 rounded-lg border border-charcoal-900/15 shadow-2xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>रिफ्रेश सूची</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-charcoal-900/10 shadow-2xs mb-6">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="संदर्भ ID (उदा. WARD14-XXXXXX), नाम, स्थान या विवरण..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-cream-50/40 text-charcoal-900"
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-cream-50/40 text-charcoal-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-cream-50/40 text-charcoal-900"
              >
                <option value="all">सभी स्थितियां (All Status)</option>
                <option value="Pending">Pending (लंबित)</option>
                <option value="In Progress">In Progress (प्रगति पर)</option>
                <option value="Resolved">Resolved (समाधान हुआ)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-1">
              <button
                type="submit"
                className="w-full h-full min-h-[34px] bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center transition-colors"
              >
                खोजें
              </button>
            </div>

          </form>
        </div>

        {/* Issues List Table */}
        <div className="bg-white rounded-xl border border-charcoal-900/10 shadow-2xs overflow-hidden">
          
          <div className="px-5 py-3.5 bg-cream-100/40 border-b border-charcoal-100 flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-700">
              कुल परिणाम: {issues.length} समस्याएं
            </span>
            <span className="text-[11px] text-charcoal-500">
              विस्तृत विवरण और स्थिति बदलने के लिए 'देखें' पर क्लिक करें
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-charcoal-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-saffron-600" />
              <span className="text-xs">समस्याएं लोड हो रही हैं...</span>
            </div>
          ) : issues.length === 0 ? (
            <div className="p-16 text-center text-charcoal-500">
              <p className="text-sm font-semibold">कोई समस्या नहीं मिली।</p>
              <p className="text-xs mt-1">खोज शब्द अथवा फिल्टर बदलकर पुनः प्रयास करें।</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal-800">
                <thead className="bg-cream-100/80 text-charcoal-700 font-bold uppercase tracking-wider text-[11px] border-b border-charcoal-200">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">नागरिक / फोन</th>
                    <th className="py-3 px-4">श्रेणी</th>
                    <th className="py-3 px-4">स्थान</th>
                    <th className="py-3 px-4 max-w-xs">विवरण</th>
                    <th className="py-3 px-4">फोटो</th>
                    <th className="py-3 px-4">स्थिति</th>
                    <th className="py-3 px-4">दिनांक</th>
                    <th className="py-3 px-4 text-right">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100">
                  {issues.map((issue) => {
                    const photo = issue.photoUrl || issue.imageUrl;
                    return (
                      <tr key={issue.referenceId} className="hover:bg-cream-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-saffron-900 whitespace-nowrap">
                          {issue.referenceId}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-charcoal-900">
                            {issue.citizenName || issue.name || 'नागरिक'}
                          </div>
                          {issue.mobile && (
                            <div className="text-[11px] text-charcoal-500 font-mono">
                              {issue.mobile}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-800 font-medium">
                            {issue.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-charcoal-700 truncate max-w-[140px]">
                          {issue.location}
                        </td>
                        <td className="py-3 px-4 text-charcoal-600 truncate max-w-xs">
                          {issue.description}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {photo ? (
                            <button
                              onClick={() => setViewPhotoUrl(photo)}
                              className="inline-flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 font-semibold underline"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>फोटो देखें</span>
                            </button>
                          ) : (
                            <span className="text-charcoal-300 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(issue.status)}
                        </td>
                        <td className="py-3 px-4 text-charcoal-500 whitespace-nowrap">
                          {new Date(issue.createdAt).toLocaleDateString('hi-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => openIssueDetail(issue)}
                            className="inline-flex items-center gap-1 bg-cream-200 hover:bg-cream-300 text-charcoal-900 px-2.5 py-1 rounded text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>देखें</span>
                          </button>
                          <button
                            onClick={() => handleDeleteIssue(issue.referenceId)}
                            className="inline-flex items-center text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Detail & Status Change Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-charcoal-900/20 shadow-2xl p-6 sm:p-8 my-8 relative">
            
            {/* Close */}
            <button
              onClick={closeIssueDetail}
              className="absolute right-5 top-5 text-charcoal-400 hover:text-charcoal-700 p-1.5 rounded-lg hover:bg-charcoal-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="border-b border-charcoal-100 pb-4 mb-5">
              <div className="flex items-center gap-2 text-xs font-bold text-saffron-800 uppercase tracking-wider">
                <span>समस्या संदर्भ ID</span>
                <span>•</span>
                <span className="font-mono text-sm">{selectedIssue.referenceId}</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-charcoal-950 mt-1">
                {selectedIssue.category} — {selectedIssue.location}
              </h2>
            </div>

            {/* Issue Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream-50/70 p-4 rounded-xl border border-charcoal-100 mb-5 text-xs">
              <div>
                <span className="text-charcoal-500 block mb-0.5">नागरिक का नाम:</span>
                <span className="font-bold text-charcoal-900">
                  {selectedIssue.citizenName || selectedIssue.name || 'गुमनाम नागरिक'}
                </span>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">संपर्क नंबर:</span>
                <span className="font-mono font-bold text-charcoal-900">
                  {selectedIssue.mobile || 'उपलब्ध नहीं'}
                </span>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">पंजीकरण दिनांक:</span>
                <span className="text-charcoal-800">
                  {new Date(selectedIssue.createdAt).toLocaleString('hi-IN')}
                </span>
              </div>
              <div>
                <span className="text-charcoal-500 block mb-0.5">अंतिम अद्यतन:</span>
                <span className="text-charcoal-800">
                  {new Date(selectedIssue.updatedAt).toLocaleString('hi-IN')}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                समस्या का पूर्ण विवरण:
              </label>
              <div className="p-3.5 rounded-lg bg-cream-50 border border-charcoal-200 text-xs text-charcoal-900 leading-relaxed whitespace-pre-wrap">
                {selectedIssue.description}
              </div>
            </div>

            {/* Photo Attachment if available */}
            {(selectedIssue.photoUrl || selectedIssue.imageUrl) && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                  संलग्न फोटो:
                </label>
                <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-charcoal-300 shadow-2xs group cursor-pointer"
                     onClick={() => setViewPhotoUrl(selectedIssue.photoUrl || selectedIssue.imageUrl || '')}>
                  <img
                    src={selectedIssue.photoUrl || selectedIssue.imageUrl}
                    alt="Issue attachment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                    क्लिक कर बड़ा देखें
                  </div>
                </div>
              </div>
            )}

            {/* Status Changer (Pending, In Progress, Resolved) */}
            <div className="border-t border-charcoal-200 pt-5 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wider mb-1.5">
                  स्थिति बदलें (Change Status):
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { val: 'Pending', label: 'Pending (लंबित)', color: 'border-amber-400 bg-amber-50 text-amber-900' },
                    { val: 'In Progress', label: 'In Progress (प्रगति पर)', color: 'border-blue-400 bg-blue-50 text-blue-900' },
                    { val: 'Resolved', label: 'Resolved (समाधान हुआ)', color: 'border-emerald-400 bg-emerald-50 text-emerald-900' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setEditStatus(s.val)}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        editStatus === s.val || (editStatus === 'नई समस्या' && s.val === 'Pending')
                          ? `${s.color} ring-2 ring-saffron-500 font-extrabold shadow-xs`
                          : 'border-charcoal-200 bg-white text-charcoal-700 hover:bg-cream-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div>
                <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wider mb-1.5">
                  कार्यालय आंतरिक टिप्पणी (Internal Admin Notes):
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="उदा. 'सहायक अभियंता को निर्देशित किया गया', 'सामग्री स्वीकृत', आदि..."
                  className="w-full p-3 text-xs rounded-lg border border-charcoal-900/20 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-cream-50/50"
                />
                <span className="text-[10px] text-charcoal-400">
                  * यह टिप्पणी केवल व्यवस्थापकों के लिए है और सार्वजनिक रूप से प्रकट नहीं की जाती।
                </span>
              </div>

              {updateMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{updateMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={closeIssueDetail}
                  className="px-4 py-2 text-xs font-semibold text-charcoal-700 hover:bg-cream-200 rounded-lg transition-colors"
                >
                  बंद करें
                </button>
                <button
                  onClick={handleUpdateIssue}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 bg-saffron-700 hover:bg-saffron-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>सहेजा जा रहा है...</span>
                    </>
                  ) : (
                    <span>स्थिति व टिप्पणी सहेजें</span>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {viewPhotoUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setViewPhotoUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white p-2 rounded-xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewPhotoUrl(null)}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={viewPhotoUrl}
              alt="Full Issue Attachment"
              className="max-h-[75vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminIssuesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-saffron-700" />
        </div>
      }
    >
      <AdminIssuesContent />
    </Suspense>
  );
}
