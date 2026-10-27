import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAboutHeader, updateAboutHeader } from '../../services/aboutService';
import ImageUploader from '../../components/ImageUploader';

// Module-level cache for instant load on re-mounts
let cachedAboutHeader = null;

const AdminAboutHeaderEditor = () => {
  // 1. Initialize state instantly using in-memory cache if available
  const [formData, setFormData] = useState(() => {
    if (cachedAboutHeader) {
      return cachedAboutHeader;
    }
    return {
      title: 'About Us',
      subtitle: 'Learn more about our heritage and engineering capabilities.',
      bg_image_url: '',
    };
  });

  const { showToast } = useToast();
  const [fetching, setFetching] = useState(!cachedAboutHeader);
  const [saving, setSaving] = useState(false);

  // 2. Background non-blocking sync on mount via dedicated GET /about/header API
  useEffect(() => {
    let isMounted = true;

    fetchAboutHeader()
      .then((res) => {
        if (!isMounted) return;

        const headerData = res?.data || res || {};

        const freshData = {
          title: headerData.title || 'About Us',
          subtitle:
            headerData.subtitle ||
            'Learn more about our heritage and engineering capabilities.',
          bg_image_url:
            headerData.bg_image_url || headerData.image_url || '',
        };

        // Sync local state and module cache
        cachedAboutHeader = freshData;
        setFormData(freshData);
      })
      .catch((err) =>
        console.error('Error fetching About Header settings:', err)
      )
      .finally(() => {
        if (isMounted) setFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Instant Image Handler
  const handleImageChange = (newUrl) => {
    const updatedUrl = newUrl || '';
    setFormData((prev) => {
      const nextState = { ...prev, bg_image_url: updatedUrl };
      cachedAboutHeader = nextState;
      return nextState;
    });
  };

  // 4. Fast Save Execution via dedicated PUT /about/header API
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payloadToSave = {
      ...formData,
      image_url: formData.bg_image_url, // Dual-key compatibility
      bg_image_url: formData.bg_image_url,
    };

    // Update in-memory cache immediately
    cachedAboutHeader = { ...formData };

    try {
      await updateAboutHeader(payloadToSave);
      showToast('About header updated successfully!', 'success');
    } catch (err) {
      console.error('Error saving About header:', err);
      showToast('Failed to update About header settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8 font-sans">
      {/* PAGE HEADER */}
      <div className="flex items-start justify-between border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            About Header Banner
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the main banner title and background image for the About Us page.
          </p>
        </div>
        {fetching && (
          <span className="flex items-center gap-2 text-xs font-semibold text-blue-600">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            Syncing…
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* TEXT SETTINGS CARD */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Banner Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                const next = { ...formData, title: e.target.value };
                setFormData(next);
                cachedAboutHeader = next;
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/80 p-3.5 text-base font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. About Us"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => {
                const next = { ...formData, subtitle: e.target.value };
                setFormData(next);
                cachedAboutHeader = next;
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/80 p-3.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Learn more about our engineering capabilities."
            />
          </div>
        </div>

        {/* IMAGE UPLOADER & REAL-TIME PREVIEW CARD */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          {/* PREVIEW ON TOP */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Background Image Preview
            </span>
            <div className="group relative h-48 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner md:h-56 flex items-center justify-center">
              {formData.bg_image_url ? (
                <img
                  key={formData.bg_image_url}
                  src={formData.bg_image_url}
                  alt="Banner Background Preview"
                  className="h-full w-full object-cover opacity-60 transition-opacity"
                />
              ) : (
                <span className="text-xs font-semibold text-slate-400">No Background Image Set</span>
              )}
            </div>
          </div>

          {/* DIMENSION REQUIREMENT NOTE */}
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <span className="text-amber-500 text-base mt-0.5" aria-hidden="true">⚠️</span>
            <div>
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Required Image Dimensions</p>
              <p className="text-[11px] text-amber-600 mt-0.5">Upload images at exactly <strong>1024px × 441px</strong> for best display.</p>
            </div>
          </div>

          <ImageUploader
            label="Upload New Background Image"
            value={formData.bg_image_url}
            onChange={handleImageChange}
          />

        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#1e2738] py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-[#151c28] disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving Header...</span>
            </>
          ) : (
            <span>Save Header Changes</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminAboutHeaderEditor;