import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAGCBanner, updateAGCBanner, uploadImageFile } from '../../services/api';

const AdminAGCBannerEditor = () => {
  const [formData, setFormData] = useState({
    title: 'AGC Instruments',
    subtitle: 'Gas Chromatographs & Analysers',
    bg_image: '',
    bg_image_url: ''
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1. Fetch current AGC Banner data using API service
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetchAGCBanner();
        const payload = response?.data || response || {};

        setFormData({
          title: payload.title || 'AGC Instruments',
          subtitle: payload.subtitle || 'Gas Chromatographs & Analysers',
          bg_image: payload.bg_image || payload.bg_image_url || '',
          bg_image_url: payload.bg_image_url || payload.bg_image || ''
        });
      } catch (err) {
        console.error('Error fetching AGC banner data:', err);
        showToast('Failed to load AGC Banner data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  // 2. Image File Upload Handler using central uploadImageFile
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
      console.error('Image upload failed:', err);
      showToast('Failed to upload background image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // 3. Save Banner Changes to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAGCBanner(formData);
      showToast('AGC Banner updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update AGC banner:', err);
      showToast('Failed to save banner updates.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading AGC Banner Settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">AGC Instruments Banner Editor</h1>
        <p className="text-xs text-slate-500 mt-1">
          Update header title, subtitle, and upload custom background banner image.
        </p>
      </div>

      {/* FEEDBACK MESSAGES */}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* TITLE FIELD */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Banner Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600"
            placeholder="AGC Instruments"
            required
          />
        </div>

        {/* SUBTITLE FIELD */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Banner Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600"
            placeholder="Gas Chromatographs & Analysers"
          />
        </div>

        {/* BACKGROUND IMAGE UPLOAD & PREVIEW */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">

          {/* PREVIEW — full width on top */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Background Image Preview
            </label>
            <div className="w-full h-48 bg-slate-900 rounded-xl border border-slate-300 overflow-hidden flex items-center justify-center relative shadow-inner">
              {formData.bg_image_url ? (
                <>
                  <img
                    src={formData.bg_image_url}
                    alt="Banner Background Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, bg_image: '', bg_image_url: '' }))}
                    className="absolute top-2 right-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded cursor-pointer"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <div className="text-center p-3">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">No Background Image</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">(Default Navy Banner Active)</span>
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

          {/* UPLOAD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Upload New Background Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {uploading && (
              <span className="text-xs text-blue-600 font-bold block animate-pulse mt-1">
                Uploading image...
              </span>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-[#0B192C] hover:bg-[#152a47] text-white text-xs font-bold py-4 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider"
        >
          {saving ? 'Saving Changes...' : 'Save AGC Banner'}
        </button>

      </form>
    </div>
  );
};

export default AdminAGCBannerEditor;
