import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchEatonMedcBanner, updateEatonMedcBanner, uploadImageFile } from '../../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AdminEatonMedcBannerEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Eaton MEDC',
    carousel_titles: ['Eaton MEDC', 'Explosion-Proof Visual & Audible Signals'],
    subtitle: 'Explosion Proof Visual & Audible Warning Signals',
    bg_image: '',
    bg_image_url: ''
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEatonMedcBanner()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const titles = payload.carousel_titles?.length >= 2
          ? payload.carousel_titles
          : [payload.title || 'Eaton MEDC', 'Explosion-Proof Visual & Audible Signals'];

        setFormData({
          title: payload.title || 'Eaton MEDC',
          carousel_titles: titles,
          subtitle: payload.subtitle || 'Explosion Proof Visual & Audible Warning Signals',
          bg_image: payload.bg_image || payload.bg_image_url || '',
          bg_image_url: payload.bg_image_url || payload.bg_image || ''
        });
      })
      .catch((err) => {
        console.error('Error loading Eaton MEDC banner:', err);
        showToast('Failed to load banner data.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCarouselTitleChange = (index, value) => {
    const updated = [...formData.carousel_titles];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      title: updated[0] || prev.title,
      carousel_titles: updated
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const res = await uploadImageFile(file);
      const uploadedUrl = res?.url || res?.image_url || res?.data?.url || '';

      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          bg_image: uploadedUrl,
          bg_image_url: uploadedUrl
        }));
        showToast('Banner background image uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Failed to upload background image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      bg_image: '',
      bg_image_url: ''
    }));
    showToast('Banner background image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateEatonMedcBanner(formData);
      showToast('Eaton MEDC Banner saved successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save banner.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Banner Editor...</span>
      </div>
    );
  }

  const previewUrl = formatImageUrl(formData.bg_image_url || formData.bg_image);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Eaton MEDC Banner Editor</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure two-title rotating text carousel, tagline, and background overlay image.
        </p>
      </div>

      {/* FEEDBACK MESSAGE */}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* MAIN SETTINGS BOX */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-6">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            HERO BANNER CONFIGURATION
          </h2>

          {/* TWO-TITLE TEXT CAROUSEL FIELDS */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              TWO-TITLE TEXT CAROUSEL (ROTATING HEADINGS)
            </label>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">
                Carousel Title 1 (Primary Heading)
              </label>
              <input
                type="text"
                value={formData.carousel_titles[0] || ''}
                onChange={(e) => handleCarouselTitleChange(0, e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                placeholder="Eaton MEDC"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">
                Carousel Title 2 (Secondary Heading)
              </label>
              <input
                type="text"
                value={formData.carousel_titles[1] || ''}
                onChange={(e) => handleCarouselTitleChange(1, e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                placeholder="Explosion-Proof Visual & Audible Signals"
                required
              />
            </div>
          </div>

          {/* SUBTITLE FIELD */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              BANNER SUBTITLE / TAGLINE
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              placeholder="Explosion Proof Visual & Audible Warning Signals"
            />
          </div>

          {/* BACKGROUND IMAGE UPLOADER */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-4">

            {/* PREVIEW — full width on top */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                BACKGROUND IMAGE PREVIEW
              </label>
              <div className="w-full h-48 bg-slate-900 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center">
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    No Background Image
                  </span>
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
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                UPLOAD NEW BACKGROUND IMAGE
              </label>
              <label className="w-full h-36 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/20 hover:bg-blue-50/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? (
                  <span className="text-xs font-bold text-blue-600 animate-pulse">
                    Uploading image...
                  </span>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📁</span>
                    <span className="text-xs font-bold text-slate-600">
                      Click to Upload Image
                    </span>
                  </div>
                )}
              </label>
            </div>

          </div>

        </div>

        {/* SAVE & PUBLISH BUTTON */}
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-[#031527] hover:bg-[#071d34] text-white text-xs font-bold py-4 rounded-xl shadow transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH EATON MEDC BANNER'}
        </button>

      </form>
    </div>
  );
};

export default AdminEatonMedcBannerEditor;
