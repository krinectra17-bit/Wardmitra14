'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Loader2,
  Share2,
  Search,
  X
} from 'lucide-react';

const CATEGORIES = [
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

interface IssueFormProps {
  initialCategory?: string;
  isStandalonePage?: boolean;
}

export default function IssueForm({ initialCategory = '', isStandalonePage = false }: IssueFormProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState(initialCategory || 'सड़क');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedReferenceId, setSubmittedReferenceId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('फोटो 5MB से छोटी होनी चाहिए।');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setSubmitError(null);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!category) {
      setSubmitError('कृपया समस्या की श्रेणी चुनें।');
      return;
    }
    if (!location.trim()) {
      setSubmitError('कृपया स्थान / गली / क्षेत्र दर्ज करें।');
      return;
    }
    if (!description.trim()) {
      setSubmitError('कृपया समस्या का विवरण दर्ज करें।');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';

      // Upload photo if selected
      if (photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.imageUrl;
        } else {
          console.warn('Photo upload skipped due to error');
        }
      }

      // Submit issue to API
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: name.trim() || undefined,
          name: name.trim() || undefined,
          mobile: mobile.trim() || undefined,
          category,
          location: location.trim(),
          description: description.trim(),
          photoUrl: imageUrl,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmittedReferenceId(data.referenceId);
      } else {
        setSubmitError(data.error || 'समस्या दर्ज करने में त्रुटि हुई।');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('सर्वर से संपर्क करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefId = () => {
    if (submittedReferenceId) {
      navigator.clipboard.writeText(submittedReferenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!submittedReferenceId) return '';
    const text = encodeURIComponent(
      `नमस्ते, मैंने वार्ड नंबर 14 पोर्टल पर श्रीमती पूजा मनीष दाधीच जी के कार्यालय को स्थानीय समस्या दर्ज कराई है।\nरेफरेंस ID: ${submittedReferenceId}\nश्रेणी: ${category}\nक्षेत्र: ${location}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <div className={`w-full ${isStandalonePage ? 'max-w-3xl mx-auto' : ''}`}>
      {/* Success Modal / Card */}
      {submittedReferenceId ? (
        <div className="bg-white p-6 sm:p-10 rounded-xl border border-civicgreen-300 shadow-lifted text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-civicgreen-100 text-civicgreen-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mb-2">
            आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है
          </h3>

          <p className="text-sm sm:text-base text-charcoal-600 mb-6 max-w-md mx-auto">
            वार्ड 14 की नागरिक सेवा टीम आपकी समस्या की जांच कर उचित प्रशासनिक कार्रवाई सुनिश्चित करेगी।
          </p>

          {/* Reference ID Banner */}
          <div className="p-4 bg-saffron-50 rounded-lg border border-saffron-200 mb-6 max-w-md mx-auto">
            <span className="text-xs font-semibold text-charcoal-500 block uppercase tracking-wider mb-1">
              आपकी समस्या संदर्भ संख्या (Reference ID)
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold text-saffron-900 tracking-wider">
                {submittedReferenceId}
              </span>
              <button
                onClick={copyRefId}
                className="p-2 rounded bg-white hover:bg-saffron-100 text-saffron-800 border border-saffron-300 transition-colors"
                title="ID कॉपी करें"
              >
                {copied ? <Check className="w-5 h-5 text-civicgreen-700" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copied && (
              <span className="text-xs font-semibold text-civicgreen-700 block mt-1">
                ID क्लिपबोर्ड पर कॉपी हो गई है!
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>व्हाट्सएप पर शेयर करें</span>
            </a>

            <Link
              href={`/track?ref=${submittedReferenceId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>स्थिति ट्रैक करें</span>
            </Link>
          </div>

          <button
            onClick={() => {
              setSubmittedReferenceId(null);
              setDescription('');
              setLocation('');
              setName('');
              setMobile('');
              setPhotoFile(null);
              setPhotoPreview(null);
            }}
            className="mt-6 text-xs font-medium text-charcoal-500 hover:text-charcoal-800 underline underline-offset-2"
          >
            दूसरी समस्या दर्ज करें
          </button>
        </div>
      ) : (
        /* The Reporting Form */
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-xl border border-charcoal-900/10 shadow-editorial"
        >
          {submitError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Category Select */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-charcoal-900 mb-2">
              समस्या की श्रेणी <span className="text-saffron-700">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 text-xs font-medium rounded-md border transition-all text-center ${
                    category === cat
                      ? 'bg-saffron-50 text-saffron-900 border-saffron-400 font-bold shadow-2xs'
                      : 'bg-[#FAF7F2] text-charcoal-700 border-charcoal-900/10 hover:bg-cream-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location Field */}
          <div className="mb-5">
            <label htmlFor="location" className="block text-sm font-bold text-charcoal-900 mb-1">
              स्थान / क्षेत्र / गली नंबर <span className="text-saffron-700">*</span>
            </label>
            <input
              id="location"
              type="text"
              required
              placeholder="उदा. गली नं. 4, शिव मंदिर के पास, वार्ड 14"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-[#FAF7F2]"
            />
          </div>

          {/* Description Field */}
          <div className="mb-5">
            <label htmlFor="description" className="block text-sm font-bold text-charcoal-900 mb-1">
              समस्या का विस्तृत विवरण <span className="text-saffron-700">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              placeholder="समस्या के बारे में विस्तार से बताएं ताकि उचित विभाग को सूचित किया जा सके..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-[#FAF7F2] resize-y"
            />
          </div>

          {/* Optional Citizen Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-charcoal-900 mb-1">
                आपका नाम <span className="text-xs text-charcoal-500 font-normal">(वैकल्पिक)</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="नाम (यदि बताना चाहें)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-bold text-charcoal-900 mb-1">
                मोबाइल नंबर <span className="text-xs text-charcoal-500 font-normal">(वैकल्पिक - अपडेट हेतु)</span>
              </label>
              <input
                id="mobile"
                type="tel"
                placeholder="10 अंकों का मोबाइल नंबर"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-charcoal-900/20 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-[#FAF7F2]"
              />
            </div>
          </div>

          {/* Photo Attachment (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-charcoal-900 mb-1">
              समस्या की फोटो संलग्न करें <span className="text-xs text-charcoal-500 font-normal">(वैकल्पिक, अधिकतम 5MB)</span>
            </label>

            {photoPreview ? (
              <div className="relative inline-block mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="समस्या फोटो प्रीव्यू"
                  className="w-36 h-28 object-cover rounded-md border border-charcoal-900/20 shadow-xs"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                  title="फोटो हटाएं"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="mt-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-charcoal-900/20 rounded-lg cursor-pointer hover:bg-cream-200 transition-colors">
                <Camera className="w-6 h-6 text-charcoal-500 mb-1" />
                <span className="text-xs font-semibold text-charcoal-700">फोटो चुनें या खींचें</span>
                <span className="text-[11px] text-charcoal-400">JPG, PNG, WebP (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-cream-200 rounded text-xs text-charcoal-600 mb-6 leading-relaxed">
            🔒 <strong>गोपनीयता आश्वासन:</strong> आपका नाम व मोबाइल नंबर केवल समस्या समाधान एवं संपर्क के लिए उपयोग होगा। यह किसी सार्वजनिक पृष्ठ पर प्रदर्शित नहीं किया जाएगा।
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-saffron-700 hover:bg-saffron-800 disabled:bg-saffron-400 text-white font-semibold py-3.5 px-6 rounded-md shadow-xs transition-all text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>समस्या दर्ज की जा रही है...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>समस्या दर्ज करें</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
