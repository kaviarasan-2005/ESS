import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchContactPage, updateContactSection, uploadImageFile } from '../../services/api';

// Base API URL helper to format relative paths like /uploads/image.jpg
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

const AdminContactHeroEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Contact Us',
    subtitle: 'Get in touch with our expert technical support and sales team.',
    bg_image: '',
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHeroImg, setUploadingHeroImg] = useState(false);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    setLoading(true);
    try {
      const res = await fetchContactPage();
      const payload = res?.data?.data || res?.data || res || {};
      const headerData = payload.header || payload || {};

      // Fallback keys for image compatibility
      const savedBgImage =
        headerData.bg_image ||
        headerData.bg_image_url ||
        headerData.image_url ||
        headerData.bg_url ||
        '';

      setFormData({
        title: headerData.title || 'Contact Us',
        subtitle: headerData.subtitle || 'Get in touch with our expert technical support and sales team.',
        bg_image: savedBgImage,
      });
    } catch (err) {
      console.error('Error loading contact hero header:', err);
      showToast('Failed to load Contact Hero settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleHeroImageUpload = async (file) => {
    if (!file) return;
    setUploadingHeroImg(true);

    try {
      const res = await uploadImageFile(file);
      const uploadedUrl = res?.url || res?.secure_url || res?.data?.url || res;

      if (uploadedUrl && typeof uploadedUrl === 'string') {
        setFormData((prev) => ({
          ...prev,
          bg_image: uploadedUrl,
        }));
        showToast('Hero image uploaded successfully!', 'success');
      } else {
        showToast('Failed to process uploaded image URL.', 'error');
      }
    } catch (err) {
      console.error('File upload failed:', err);
      showToast('Failed to upload hero image file.', 'error');
    } finally {
      setUploadingHeroImg(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Structure payload to sync all image alias keys for backend and public UI
      const headerPayload = {
        title: formData.title,
        subtitle: formData.subtitle,
        bg_image: formData.bg_image,
        bg_image_url: formData.bg_image,
        image_url: formData.bg_image,
        bg_url: formData.bg_image,
      };

      // Updates section 'header' in MongoDB via PATCH /api/contact/section/header
      await updateContactSection('header', headerPayload);
      
      showToast('Contact Hero Header saved and published successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to update Contact Hero Header.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl max-w-4xl mx-auto">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-xs font-bold text-slate-500">Loading the hero banner...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* HEADER TITLE */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Contact Hero Header Editor</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Edit banner title, subtitle, and upload top background image for the Contact page.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* HERO BANNER EDIT CONTAINER */}
        <div className="bg-slate-50/80 p-6 border border-slate-200 rounded-2xl space-y-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            HERO HEADER SETTINGS
          </h3>

          {/* BACKGROUND IMAGE UPLOAD BLOCK */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                HERO BACKGROUND IMAGE
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Required: 1024px &times; 441px
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* IMAGE PREVIEW */}
              <div className="w-48 h-28 shrink-0 rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100 flex items-center justify-center relative">
                {formData.bg_image ? (
                  <>
                    <img
                      src={formatImageUrl(formData.bg_image)}
                      alt="Contact Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, bg_image: '' }));
                        showToast('Hero image removed.', 'info');
                      }}
                      className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow cursor-pointer"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="text-[11px] font-bold text-slate-400">No Image Selected</div>
                )}
              </div>

              {/* DASHED UPLOAD BOX */}
              <div className="flex-1 w-full space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  CHANGE BACKGROUND IMAGE
                </span>

                <label className="relative flex items-center justify-center gap-2.5 w-full h-20 px-4 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 rounded-xl cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingHeroImg}
                    onChange={(e) => handleHeroImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <span className="text-2xl">📁</span>
                  <span className="text-xs font-bold text-slate-700">
                    {uploadingHeroImg ? 'Uploading image...' : 'Click to Upload / Change Image'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* HEADER TEXT INPUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Banner Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Banner Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#03203c] hover:bg-[#021528] text-white font-bold py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Saving Changes...' : 'Save & Publish Contact Hero Header'}
        </button>

      </form>
    </div>
  );
};

export default AdminContactHeroEditor;
