import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAKAYBanner, updateAKAYBanner, uploadImageFile } from '../../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const DEFAULT_TITLE = 'AKAY Industries';
const DEFAULT_SUBTITLE = 'Centrifugal Pumps & Chemical Process Solutions';

const LABEL_STYLE = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2';
const INPUT_STYLE =
  'w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-500';

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AdminAKAYBannerEditor = () => {
  const [formData, setFormData] = useState({
    title: DEFAULT_TITLE,
    subtitle: DEFAULT_SUBTITLE,
    bg_image: '',
    bg_image_url: ''
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAKAYBanner()
      .then((res) => {
        const payload = res?.data || res || {};
        if (payload) {
          setFormData({
            title: payload.title ?? DEFAULT_TITLE,
            subtitle: payload.subtitle ?? DEFAULT_SUBTITLE,
            bg_image: payload.bg_image || payload.bg_image_url || '',
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching AKAY banner:', err);
        showToast('Failed to load banner settings.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const res = await uploadImageFile(file);
      const uploadedUrl = res?.url || res?.image_url || res?.data?.url || '';

      setFormData((prev) => ({
        ...prev,
        bg_image: uploadedUrl,
        bg_image_url: uploadedUrl
      }));

      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload background image.', 'error');
    } finally {
      setUploading(false);
      // reset the input so the same file can be picked again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      bg_image: '',
      bg_image_url: ''
    }));

    // reset the input so the same file can be picked again
    if (fileInputRef.current) fileInputRef.current.value = '';

    showToast('Image removed. Click "Save & Publish Banner" to apply.', 'success');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payloadToSave = {
      ...formData,
      bg_image: formData.bg_image_url || formData.bg_image,
      bg_image_url: formData.bg_image_url || formData.bg_image
    };

    try {
      await updateAKAYBanner(payloadToSave);
      showToast('AKAY Industries banner published successfully!', 'success');
    } catch (err) {
      console.error('Banner update failed:', err);
      showToast('Failed to update AKAY banner.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading AKAY Banner Editor...</span>
      </div>
    );
  }

  const previewBgUrl = formatImageUrl(formData.bg_image_url || formData.bg_image);
  const hasImage = Boolean(previewBgUrl);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 font-sans">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">AKAY Industries Hero Banner Editor</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage the hero title, subtitle, and background image for the AKAY Industries partner page.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TITLE */}
        <div>
          <label className={LABEL_STYLE}>Banner Title</label>
          <input
            type="text"
            placeholder="e.g. AKAY Industries"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`${INPUT_STYLE} font-bold`}
            required
          />
        </div>

        {/* SUBTITLE */}
        <div>
          <label className={LABEL_STYLE}>Banner Subtitle / Tagline</label>
          <input
            type="text"
            placeholder="e.g. Centrifugal Pumps & Chemical Process Solutions"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className={INPUT_STYLE}
          />
        </div>

        {/* BACKGROUND IMAGE CARD */}
        <div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">

            {/* PREVIEW — full width on top */}
            <div>
              <label className={LABEL_STYLE}>Background Image Preview</label>
              <div className="relative w-full h-48 md:h-60 bg-[#0B192C] border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                {hasImage ? (
                  <>
                    <img
                      key={previewBgUrl}
                      src={previewBgUrl}
                      alt="Banner Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-[#0B192C]/60" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={uploading || saving}
                      className="absolute top-2 right-2 z-20 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="absolute top-2 right-2 text-[10px] font-bold uppercase text-white/60">
                    No Background Image Set
                  </span>
                )}

                {/* title + subtitle overlay, mimics the real hero */}
                <div className="relative z-10 text-center px-6">
                  <div className="text-white font-extrabold text-xl md:text-3xl drop-shadow">
                    {formData.title || DEFAULT_TITLE}
                  </div>
                  {formData.subtitle && (
                    <div className="text-slate-200 text-[11px] md:text-sm font-medium mt-1 drop-shadow">
                      {formData.subtitle}
                    </div>
                  )}
                </div>

                {uploading && (
                  <div className="absolute inset-0 z-30 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-white text-xs font-semibold">Uploading...</span>
                  </div>
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

            {/* UPLOAD BOX */}
            <div>
              <label className={LABEL_STYLE}>
                {hasImage ? 'Replace Background Image' : 'Upload New Background Image'}
              </label>
              <label
                className={`flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 p-3 rounded-xl cursor-pointer transition-all text-slate-600 hover:text-blue-600 ${
                  uploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                }`}
              >
                <span className="text-base">{uploading ? '⏳' : '📁'}</span>
                <span className="text-xs font-bold">
                  {uploading ? 'Uploading...' : 'Click to Upload / Change Image'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full px-8 py-3 bg-[#0B192C] hover:bg-[#152a47] disabled:bg-slate-300 text-white font-bold text-xs text-center rounded-xl shadow-md transition-all cursor-pointer"
          >
            {saving ? 'Publishing Updates...' : 'Save & Publish Banner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAKAYBannerEditor;