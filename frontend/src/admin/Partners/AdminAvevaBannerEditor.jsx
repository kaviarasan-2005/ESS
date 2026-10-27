import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAVEVABanner, updateAVEVABanner } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const LABEL_STYLE = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2';
const INPUT_STYLE =
  'w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-500';

// Same ratio and overlay as the live banner, so the preview matches
const PREVIEW_HEIGHT = 'aspect-[16/8] sm:aspect-[16/6] lg:aspect-[3/1]';
const PREVIEW_OVERLAY = 'bg-[#0B192C]/55';

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AdminAvevaBannerEditor = () => {
  const [bannerData, setBannerData] = useState({
    title: 'Aveva',
    subtitle: 'Industrial Software & Digital Transformation Solutions',
    bg_image: '',
    bg_image_url: ''
  });
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAVEVABanner()
      .then((res) => {
        const payload = res?.data || res || {};
        if (payload) {
          setBannerData({
            title: payload.title ?? 'Aveva',
            subtitle: payload.subtitle ?? 'Industrial Software & Digital Transformation Solutions',
            bg_image: payload.bg_image || payload.bg_image_url || '',
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching AVEVA banner:', err);
        showToast('Failed to load banner data.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setBannerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (url) => {
    setBannerData((prev) => ({
      ...prev,
      bg_image: url,
      bg_image_url: url
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAVEVABanner(bannerData);
      showToast('AVEVA Banner updated successfully!', 'success');
      window.dispatchEvent(new Event('homeDataUpdated'));
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save AVEVA Banner settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const previewImageUrl = formatImageUrl(bannerData.bg_image_url || bannerData.bg_image);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading AVEVA Banner Editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 font-sans">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">AVEVA Brand Banner Editor</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage banner title, tagline subtitle, and optional header background image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={LABEL_STYLE}>Main Title Text</label>
          <input
            type="text"
            value={bannerData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`${INPUT_STYLE} font-bold`}
            placeholder="e.g. Aveva"
          />
        </div>

        <div>
          <label className={LABEL_STYLE}>Subtitle / Tagline (Optional)</label>
          <input
            type="text"
            value={bannerData.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className={INPUT_STYLE}
            placeholder="e.g. Industrial Software & Digital Transformation Solutions"
          />
        </div>

        <div>
          {/* BACKGROUND IMAGE CARD */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">

            {/* PREVIEW — full width on top */}
            <div>
              <label className={LABEL_STYLE}>Background Image Preview</label>
              <div
                className={`relative w-full ${PREVIEW_HEIGHT} overflow-hidden rounded-xl border border-slate-200 bg-[#0B192C] flex items-center justify-center`}
              >
                {previewImageUrl ? (
                  <>
                    <img
                      src={previewImageUrl}
                      alt="AVEVA Banner Preview"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className={`absolute inset-0 ${PREVIEW_OVERLAY}`} />
                    <button
                      type="button"
                      onClick={() => handleImageChange('')}
                      className="absolute top-2 right-2 z-20 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded shadow cursor-pointer"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="absolute top-2 right-2 text-[10px] font-bold uppercase text-white/60">
                    No Background Image Set
                  </span>
                )}

                <div className="relative z-10 px-4 text-center">
                  <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    {bannerData.title || 'Banner Title'}
                  </h3>
                  {bannerData.subtitle && (
                    <p className="mt-2 text-xs sm:text-sm text-white/90 font-medium tracking-wide">
                      {bannerData.subtitle}
                    </p>
                  )}
                </div>
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

            {/* UPLOAD BOX */}
            <ImageUploader
              label="Upload New Background Image"
              value={bannerData.bg_image_url || bannerData.bg_image}
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* FULL WIDTH SAVE BUTTON */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="w-full px-8 py-3 bg-[#0B192C] hover:bg-[#152a47] disabled:bg-slate-300 text-white font-bold text-xs text-center rounded-xl shadow-md transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Aveva Banner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAvevaBannerEditor;