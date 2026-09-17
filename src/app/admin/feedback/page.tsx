'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import {
  MessageSquare,
  RefreshCw,
  Loader2,
  ThumbsUp,
  HelpCircle,
  MinusCircle,
  User,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface FeedbackItem {
  _id: string;
  name?: string;
  mobile?: string;
  response: string;
  message?: string;
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data.feedback || []);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const supportCount = feedbackList.filter((f) =>
    f.response.includes('सहमति') || f.response.includes('समर्थन')
  ).length;

  const suggestionCount = feedbackList.filter((f) =>
    f.response.includes('सुझाव') || f.response.includes('राय')
  ).length;

  const neutralCount = feedbackList.filter((f) =>
    f.response.includes('नहीं')
  ).length;

  const getResponseBadge = (response: string) => {
    if (response.includes('सहमति') || response.includes('समर्थन')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ThumbsUp className="w-3 h-3 text-emerald-600" />
          समर्थन / सहमति
        </span>
      );
    }
    if (response.includes('सुझाव') || response.includes('राय')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <HelpCircle className="w-3 h-3 text-blue-600" />
          सुझाव / राय
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        <MinusCircle className="w-3 h-3 text-gray-500" />
        तटस्थ
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-950">
              नागरिक जनसंवाद व प्रतिक्रिया (Citizen Feedback)
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              वार्ड 14 के सम्मानित नागरिकों द्वारा साझा की गई स्वैच्छिक राय व सुझाव।
            </p>
          </div>

          <button
            onClick={fetchFeedback}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-white hover:bg-cream-100 text-charcoal-800 text-xs font-semibold px-3.5 py-2 rounded-lg border border-charcoal-900/15 shadow-2xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>रिफ्रेश करें</span>
          </button>
        </div>

        {/* Disclaimer Notice */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>वैधानिक सूचना:</strong> यह डेटा केवल स्वैच्छिक नागरिक प्रतिक्रिया और जनसंवाद के लिए है। यह आधिकारिक मतदान नहीं है और किसी भी नागरिक का वास्तविक मतदान निर्धारित नहीं करता। यह जानकारी सार्वजनिक नहीं की जाती।
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl border border-charcoal-900/10 shadow-2xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              समर्थन सहमति
            </span>
            <div className="text-3xl font-bold text-emerald-950 mt-2 font-serif">
              {supportCount}
            </div>
            <div className="text-xs text-charcoal-500 mt-1">
              विकास दृष्टिकोण पर सहमति व्यक्त करने वाले नागरिक
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-charcoal-900/10 shadow-2xs">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              सुझाव व राय
            </span>
            <div className="text-3xl font-bold text-blue-950 mt-2 font-serif">
              {suggestionCount}
            </div>
            <div className="text-xs text-charcoal-500 mt-1">
              स्थानीय सुधारों हेतु विशिष्ट संदेश व विचार
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-charcoal-900/10 shadow-2xs">
            <span className="text-xs font-bold text-charcoal-600 uppercase tracking-wider">
              तटस्थ / अन्य
            </span>
            <div className="text-3xl font-bold text-charcoal-900 mt-2 font-serif">
              {neutralCount}
            </div>
            <div className="text-xs text-charcoal-500 mt-1">
              बिना राय के दर्ज प्रविष्टियां
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-xl border border-charcoal-900/10 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-charcoal-100 flex items-center justify-between bg-cream-100/40">
            <span className="text-xs font-bold text-charcoal-800">
              कुल प्रविष्टियां: {feedbackList.length}
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-charcoal-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-saffron-600" />
              <span className="text-xs">प्रतिक्रियाएं लोड हो रही हैं...</span>
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="p-16 text-center text-charcoal-500 text-xs">
              अभी कोई प्रतिक्रिया प्राप्त नहीं हुई है।
            </div>
          ) : (
            <div className="divide-y divide-charcoal-100">
              {feedbackList.map((fb) => (
                <div key={fb._id} className="p-5 hover:bg-cream-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-charcoal-700 font-bold text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-sm text-charcoal-900">
                        {fb.name || 'नागरिक'}
                      </span>
                      {fb.mobile && (
                        <span className="text-xs text-charcoal-500 font-mono">
                          • {fb.mobile}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {getResponseBadge(fb.response)}
                      <span className="text-xs text-charcoal-400">
                        {new Date(fb.createdAt).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {fb.message ? (
                    <div className="mt-2.5 p-3 rounded-lg bg-cream-50 border border-charcoal-100 text-xs text-charcoal-800 leading-relaxed whitespace-pre-wrap">
                      "{fb.message}"
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-charcoal-400 italic">
                      कोई अतिरिक्त संदेश नहीं लिखा गया।
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
