import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchProductsPage, updateProductsHeader, uploadImageFile } from '../../services/api';

const AdminProductsEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Products',
    subtitle: 'Explore Our Industrial Grade Hardware & Equipment',
    bg_image: '',
  });
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [uploadingHeroImg, setUploadingHeroImg] = useState(false);

  useEffect(() => {
    fetchProductsPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const headerData = payload.header || {};

        // Extract background image checking all potential fallback keys
        const savedBgImage =
          headerData.bg_image ||
          headerData.bg_url ||
          headerData.image_url ||
          headerData.image ||
          '';

        setFormData({
          title: headerData.title || 'Products',
          subtitle: headerData.subtitle || 'Explore Our Industrial Grade Hardware & Equipment',
          bg_image: savedBgImage,
        });
      })
      .catch((err) => console.error('Error loading products header data:', err));
  }, []);

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
      // Send header payload directly to PATCH /products/section/header
      const headerPayload = {
        title: formData.title,
        subtitle: formData.subtitle,
        bg_image: formData.bg_image,
        bg_url: formData.bg_image,
        image_url: formData.bg_image,
        bg_color: '#0b1727',
      };

      await updateProductsHeader(headerPayload);
      showToast('Products Hero Header saved successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to update Products Hero Header.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* HEADER TITLE */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Products Hero Header Editor</h2>
        <p className="text-xs text-slate-500 mt-0.5">Edit title, subtitle, and background image for the Products page top banner.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* HERO BANNER CONTAINER */}
        <div className="bg-slate-50/80 p-6 border border-slate-200 rounded-2xl space-y-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            HERO HEADER SETTINGS
          </h3>

          {/* HERO BACKGROUND IMAGE UPLOAD BLOCK */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-xl space-y-3 shadow-xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              HERO BACKGROUND IMAGE
            </span>

            {/* DIMENSION REQUIREMENT NOTE */}
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <span className="text-amber-500 text-base mt-0.5" aria-hidden="true">⚠️</span>
              <div>
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Required Image Dimensions</p>
                <p className="text-[11px] text-amber-600 mt-0.5">Upload images at exactly <strong>1024px × 441px</strong> for best display.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* IMAGE PREVIEW */}
              <div className="w-48 h-28 shrink-0 rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100 flex items-center justify-center relative">
                {formData.bg_image ? (
                  <>
                    <img
                      src={formData.bg_image}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, bg_image: '' }));
                        showToast('Hero image removed.', 'info');
                      }}
                      className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow"
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
          {saving ? 'Saving Changes...' : 'Save & Publish Hero Header'}
        </button>

      </form>
    </div>
  );
};

export default AdminProductsEditor;
