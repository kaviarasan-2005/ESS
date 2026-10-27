import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchBartecBanner, updateBartecBanner } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

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

const AdminBartecBannerEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Bartec',
    subtitle: 'Explosion Protection & Safety Systems',
    bg_image: '',
    bg_image_url: ''
  });
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBartecBanner()
      .then((res) => {
        const payload = res?.data?.data || res?.data || {};
        if (payload) {
          setFormData({
            title: payload.title || 'Bartec',
            subtitle: payload.subtitle || 'Explosion Protection & Safety Systems',
            bg_image: payload.bg_image || payload.bg_image_url || '',
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => {
        console.error('Error loading Bartec banner:', err);
        showToast('Failed to load banner data.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      bg_image: url,
      bg_image_url: url
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateBartecBanner(formData);
      showToast('Bartec Banner updated successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save Bartec banner.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const previewImageUrl = formatImageUrl(formData.bg_image_url || formData.bg_image);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Bartec Banner Editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 font-sans">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Bartec Banner Header Editor</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage header title, tagline, and background image for Bartec page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500"
            placeholder="Bartec"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subtitle / Tagline</label>
          <input
            type="text"
            value={formData.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-500"
            placeholder="Explosion Protection & Safety Systems"
          />
        </div>

        <div>
          {/* BACKGROUND IMAGE UPLOADER */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">

            {/* PREVIEW — full width on top */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Background Image Preview
              </label>
              <div className="w-full h-48 bg-slate-900 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center">
                {formData.bg_image_url || formData.bg_image ? (
                  <>
                    <img
                      src={formatImageUrl(formData.bg_image_url || formData.bg_image)}
                      alt="Bartec Banner Preview"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageChange('')}
                      className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded shadow cursor-pointer"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    No Background Image Set
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
            <ImageUploader
              label="Upload New Background Image"
              value={formData.bg_image_url || formData.bg_image}
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="w-full px-8 py-3 bg-[#0B192C] hover:bg-[#152a47] disabled:bg-slate-300 text-white font-bold text-xs text-center rounded-xl shadow-md transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Bartec Banner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBartecBannerEditor;
