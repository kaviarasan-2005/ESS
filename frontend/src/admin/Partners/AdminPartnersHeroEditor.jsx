import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchPartnersPage, updatePartnersSection, uploadImageFile } from '../../services/api';

const DEFAULT_HERO = {
  title: 'Partners',
  subtitle: 'Collaborating with Global Industry Leaders',
  bg_image_url: '',
};

const AdminPartnersHeroEditor = () => {
  const [formData, setFormData] = useState(DEFAULT_HERO);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load existing hero section data on mount
  useEffect(() => {
    let isMounted = true;

    fetchPartnersPage()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.header) {
          setFormData({
            title: payload.header.title || DEFAULT_HERO.title,
            subtitle: payload.header.subtitle || DEFAULT_HERO.subtitle,
            bg_image_url: payload.header.bg_image_url || payload.header.image_url || '',
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching Partners Hero data:', err);
        if (isMounted) {
          showToast('Failed to load hero banner data.', 'error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle File Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadImageFile(file);
      const imageUrl = response?.url || response?.image_url || response?.data?.url || '';
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, bg_image_url: imageUrl }));
        showToast('Image uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, bg_image_url: '' }));
    showToast('Hero background image removed.', 'info');
  };

  // Save updated hero section
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePartnersSection('header', formData);
      showToast('Partners Hero Header updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating Partners Hero section:', err);
      showToast('Failed to update Partners Hero Header.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Partners Hero Editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-6">
      
      {/* SECTION TITLE & DESCRIPTION */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Partners Hero Header Editor</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Edit title, subtitle, and background image for the Partners page top banner.
        </p>
      </div>

      {/* ALERT FEEDBACK */}

      {/* HERO EDITOR CARD */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-6">
          
          <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
            HERO HEADER SETTINGS
          </h2>

          {/* IMAGE UPLOAD PANEL */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-3 shadow-xs">
            {/* DIMENSION REQUIREMENT NOTE */}
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <span className="text-amber-500 text-base mt-0.5" aria-hidden="true">⚠️</span>
              <div>
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Required Image Dimensions</p>
                <p className="text-[11px] text-amber-600 mt-0.5">Upload images at exactly <strong>1024px × 441px</strong> for best display.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* CURRENT IMAGE PREVIEW */}
              <div className="md:col-span-4 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  HERO BACKGROUND IMAGE
                </span>

                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs">
                  {formData.bg_image_url ? (
                    <>
                      <img
                        src={formData.bg_image_url}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                      No Image Selected
                    </div>
                  )}
                </div>
              </div>

              {/* UPLOAD DRAG & DROP DASHED AREA */}
              <div className="md:col-span-8 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  CHANGE BACKGROUND IMAGE
                </span>

                <label className="relative border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white hover:bg-blue-50/20 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />

                  {uploading ? (
                    <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading Image...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-slate-600">
                      {/* FOLDER ICON */}
                      <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H2V6z" />
                          <path d="M2 9h16v7a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        Click to Upload / Change Image
                      </span>
                    </div>
                  )}
                </label>
              </div>

            </div>

          </div>

          {/* INPUT FIELDS (TITLE & SUBTITLE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* BANNER TITLE */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                BANNER TITLE
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                placeholder="Partners"
                required
              />
            </div>

            {/* BANNER SUBTITLE */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                BANNER SUBTITLE
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                placeholder="Collaborating with Global Industry Leaders"
              />
            </div>

          </div>

        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-[#031A30] hover:bg-[#072545] text-white text-xs font-black tracking-wider uppercase py-4 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>SAVING CHANGES...</span>
            </>
          ) : (
            <span>SAVE & PUBLISH HERO HEADER</span>
          )}
        </button>

      </form>
    </div>
  );
};

export default AdminPartnersHeroEditor;
