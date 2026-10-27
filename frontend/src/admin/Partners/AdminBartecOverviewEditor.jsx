import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchBartecOverview, updateBartecOverview, uploadImageFile } from '../../services/api';

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

const AdminBartecOverviewEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Bartec Analyzer Shelters & Sample Systems',
    description: '',
    image_url: '',
    image: ''
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load Bartec Overview Data
  useEffect(() => {
    fetchBartecOverview()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        setFormData({
          title: payload.title || 'Bartec Analyzer Shelters & Sample Systems',
          description: payload.description || '',
          image_url: payload.image_url || payload.image || '',
          image: payload.image || payload.image_url || ''
        });
      })
      .catch((err) => {
        console.error('Error fetching Bartec Overview:', err);
        showToast('Failed to load Bartec Overview data.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle File Upload
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
          image_url: uploadedUrl,
          image: uploadedUrl
        }));
        showToast('Overview image uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Remove Image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: '',
      image: ''
    }));
    showToast('Image removed.', 'info');
  };

  // Save Settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateBartecOverview(formData);
      showToast('Bartec Overview section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Bartec overview:', err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Settings...</span>
      </div>
    );
  }

  const previewUrl = formatImageUrl(formData.image_url);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-6">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bartec Shelters Overview Editor</h1>
        <p className="text-xs text-slate-400 mt-1">
          Edit section title, main description text, and featured analyzer shelters overview image.
        </p>
      </div>

      {/* FEEDBACK NOTIFICATION */}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* OVERVIEW SETTINGS CONTAINER */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-6">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            OVERVIEW SECTION SETTINGS
          </h2>

          {/* INNER WHITE CARD FOR IMAGE UPLOADS */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              
              {/* LEFT COLUMN: FEATURED IMAGE PREVIEW */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  FEATURED OVERVIEW IMAGE
                </label>

                <div className="w-full h-36 bg-slate-900 rounded-2xl border border-slate-200 overflow-hidden relative shadow-sm flex items-center justify-center p-2">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Overview Preview"
                        className="w-full h-full object-contain"
                      />
                      {/* Floating Red Remove Badge */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 bg-[#f43f5e] hover:bg-rose-700 text-white text-[10px] font-bold px-3 py-1 rounded-md shadow transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      No Image Set
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: DASHED UPLOAD DROPZONE */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  CHANGE FEATURED IMAGE
                </label>

                <label className="w-full h-36 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/20 hover:bg-blue-50/50 transition-colors flex flex-col items-center justify-center cursor-pointer relative group">
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
                    <div className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">📁</span>
                      <span className="text-xs font-bold text-slate-600">
                        Click to Upload / Change Image
                      </span>
                    </div>
                  )}
                </label>
              </div>

            </div>
          </div>

          {/* SECTION TITLE */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              SECTION TITLE
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              placeholder="Bartec Analyzer Shelters & Sample Systems"
              required
            />
          </div>

          {/* SECTION DESCRIPTION */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              SECTION DESCRIPTION
            </label>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs font-normal text-slate-700 leading-relaxed focus:outline-none focus:border-blue-500"
              placeholder="In the demanding environments of the Middle East's oil & gas and petrochemical sectors..."
              required
            />
          </div>

        </div>

        {/* BOTTOM DARK ACTION BUTTON */}
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-[#031527] hover:bg-[#071d34] text-white text-xs font-bold py-4 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH OVERVIEW SECTION'}
        </button>

      </form>
    </div>
  );
};

export default AdminBartecOverviewEditor;
