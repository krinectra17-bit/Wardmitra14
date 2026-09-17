'use client';

import React, { useState } from 'react';
import { MessageSquareText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const FEEDBACK_OPTIONS = [
  'मैं समर्थन के संबंध में अपनी सहमति दर्ज करना चाहता/चाहती हूँ।',
  'मैं अपनी राय या सुझाव साझा करना चाहता/चाहती हूँ।',
  'मैं अभी कोई राय दर्ज नहीं करना चाहता/चाहती हूँ।',
];

export default function CitizenFeedbackSection() {
  const [selectedOption, setSelectedOption] = useState(FEEDBACK_OPTIONS[0]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          mobile: mobile.trim() || undefined,
          response: selectedOption,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'प्रतिक्रिया दर्ज करने में त्रुटि हुई।');
      }
    } catch {
      setErrorMsg('सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-20 lg:py-28 bg-[#FAF6F0] border-t border-charcoal-900/10">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        
        {/* Centered Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-800 block mb-2">
            स्वैच्छिक जनसंवाद
          </span>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-950 mb-3">
            नागरिक प्रतिक्रिया
          </h2>
          <p className="text-base text-charcoal-700 leading-relaxed font-normal">
            वार्ड 14 के नागरिक के रूप में आपकी राय और सुझाव हमारे लिए अत्यंत महत्वपूर्ण हैं। आप स्वतंत्र रूप से अपना विचार साझा कर सकते हैं।
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-[#FAF7F2] rounded-xl border border-civicgreen-300 text-center max-w-md mx-auto shadow-editorial animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-civicgreen-100 text-civicgreen-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-2">
              आपकी प्रतिक्रिया प्राप्त हुई
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              सहमति एवं सुझाव दर्ज करने हेतु धन्यवाद। आपकी आवाज वार्ड 14 के सुनियोजित विकास की दिशा तय करने में सहायक होगी।
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
                setName('');
                setMobile('');
              }}
              className="mt-5 text-xs text-saffron-800 font-bold underline underline-offset-2"
            >
              अन्य सुझाव साझा करें
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-charcoal-900/10 shadow-editorial"
          >
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Mandatory Radio Options */}
            <div className="space-y-3 mb-6">
              <span className="block text-sm font-bold text-charcoal-900">
                कृपया अपनी राय का चयन करें:
              </span>
              {FEEDBACK_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    selectedOption === opt
                      ? 'bg-saffron-50 border-saffron-300 shadow-2xs'
                      : 'bg-white border-charcoal-900/10 hover:bg-cream-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="feedbackOption"
                    value={opt}
                    checked={selectedOption === opt}
                    onChange={() => setSelectedOption(opt)}
                    className="mt-1 text-saffron-700 focus:ring-saffron-500 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-charcoal-800 leading-snug">
                    {opt}
                  </span>
                </label>
              ))}
            </div>

            {/* Message / Suggestion text */}
            <div className="mb-5">
              <label htmlFor="feedback-msg" className="block text-sm font-bold text-charcoal-900 mb-1">
                कोई विशेष सुझाव या संदेश <span className="text-xs text-charcoal-500 font-normal">(वैकल्पिक)</span>
              </label>
              <textarea
                id="feedback-msg"
                rows={3}
                placeholder="वार्ड 14 के सुधार अथवा जनहित से जुड़ा कोई भी सुझाव यहाँ लिख सकते हैं..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-white"
              />
            </div>

            {/* Citizen Details (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="fb-name" className="block text-xs font-semibold text-charcoal-700 mb-1">
                  नाम (वैकल्पिक)
                </label>
                <input
                  id="fb-name"
                  type="text"
                  placeholder="आपका नाम"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md border border-charcoal-900/20 text-sm bg-white"
                />
              </div>

              <div>
                <label htmlFor="fb-mobile" className="block text-xs font-semibold text-charcoal-700 mb-1">
                  मोबाइल नंबर (वैकल्पिक)
                </label>
                <input
                  id="fb-mobile"
                  type="tel"
                  placeholder="मोबाइल नंबर"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md border border-charcoal-900/20 text-sm bg-white"
                />
              </div>
            </div>

            {/* Statutory Disclaimer - Explicitly Required by Spec */}
            <div className="p-3 bg-amber-50/80 rounded border border-amber-200/80 text-[11px] text-amber-950 mb-6 leading-relaxed">
              ⚠️ <strong>वैधानिक सूचना:</strong> यह फॉर्म केवल स्वैच्छिक नागरिक प्रतिक्रिया के लिए है। यह वास्तविक मतदान नहीं है और किसी व्यक्ति के मतदान को निर्धारित नहीं करता।
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 disabled:bg-charcoal-500 text-white text-sm font-semibold px-6 py-3 rounded-md shadow-xs transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>दर्ज हो रहा है...</span>
                </>
              ) : (
                <span>प्रतिक्रिया दर्ज करें</span>
              )}
            </button>
          </form>
        )}

      </div>
    </section>
  );
}
