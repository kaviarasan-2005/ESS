import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchPartnersPage, updatePartnersSection, uploadImageFile } from '../../services/api';

const AdminPartnerCtaEditor = () => {
  const [ctaData, setCtaData] = useState({
    heading: "Need Any Help? Let's Talk",
    button_text: "ENQUIRY NOW",
    button_link: "/contact",
    bg_image_url: "",
    image_url: "",
    bg_url: "",
    bg_image: ""
  });
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPartnersPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.cta) {
          const img = 
            payload.cta.bg_image_url || 
            payload.cta.image_url || 
            payload.cta.bg_url || 
            payload.cta.bg_image || 
            "";

          setCtaData({
            heading: payload.cta.heading || "Need Any Help? Let's Talk",
            button_text: payload.cta.button_text || "ENQUIRY NOW",
            button_link: payload.cta.button_link || "/contact",
            bg_image_url: img,
            image_url: img,
            bg_url: img,
            bg_image: img
          });
        }
      })
      .catch((err) => console.error('Error fetching CTA section:', err));
  }, []);

  const handleChange = (field, value) => {
    setCtaData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (url) => {
    setCtaData((prev) => ({
      ...prev,
      bg_image_url: url,
      image_url: url,
      bg_url: url,
      bg_image: url
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    try {
      const res = await uploadImageFile(file);
      const uploadedUrl = res?.url || res?.data?.url || res;
      if (uploadedUrl && typeof uploadedUrl === 'string') {
        handleImageUrlChange(uploadedUrl);
        showToast('Background image uploaded successfully!', 'success');
      } else {
        showToast('Failed to process uploaded image URL.', 'error');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload background image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Clears the background image only (heading/button stay untouched)
  const handleRemoveImage = () => {
    handleImageUrlChange('');
    showToast('Background image removed.', 'info');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePartnersSection('cta', ctaData);
      showToast('CTA section updated successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to update CTA section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Partner CTA / Enquiry Banner Editor</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage the bottom enquiry banner title, button link, and background image.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* TEXT & BUTTON CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Banner Heading
            </label>
            <input
              type="text"
              value={ctaData.heading}
              onChange={(e) => handleChange('heading', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Button Text
            </label>
            <input
              type="text"
              value={ctaData.button_text}
              onChange={(e) => handleChange('button_text', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Button Link Target
            </label>
            <input
              type="text"
              placeholder="/contact or https://..."
              value={ctaData.button_link}
              onChange={(e) => handleChange('button_link', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* BACKGROUND BANNER IMAGE */}
        <div className="space-y-3">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Background Banner Image
          </span>

          {/* UPLOAD / CHANGE DROPZONE + THUMBNAIL + REMOVE */}
          <div className="flex items-center gap-3">
            <label className="relative flex-1 flex items-center justify-center gap-2 h-14 px-4 border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/30 rounded-xl cursor-pointer transition-all">
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="hidden"
              />
              <span className="text-base">📁</span>
              <span className="text-xs font-bold text-slate-700">
                {uploading ? 'Uploading...' : ctaData.bg_image_url ? 'Click to Upload / Change Image' : 'Click to Upload Image'}
              </span>
            </label>

            {ctaData.bg_image_url && (
              <>
                <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-300 bg-white">
                  <img src={ctaData.bg_image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="shrink-0 px-3 h-14 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </>
            )}
          </div>

          {/* ACTIVE IMAGE URL */}
          {ctaData.bg_image_url && (
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Active image URL: <span className="text-slate-700 break-all">{ctaData.bg_image_url}</span>
            </p>
          )}
        </div>

        {/* LIVE PREVIEW */}
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Banner Live Preview
          </span>
          <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
            {ctaData.bg_image_url ? (
              <img
                src={ctaData.bg_image_url}
                alt="Banner background"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
            )}
            <div className="absolute inset-0 bg-black/50" />

            {ctaData.bg_image_url && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 z-10 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md cursor-pointer"
              >
                Remove Banner
              </button>
            )}

            <div className="relative z-0 h-full flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-white text-lg sm:text-xl font-black tracking-tight">
                {ctaData.heading || "Need Any Help? Let's Talk"}
              </h3>
              <span className="mt-3 inline-block bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg">
                {ctaData.button_text || 'ENQUIRY NOW'}
              </span>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#03203c] hover:bg-[#021528] text-white font-bold py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save CTA Section'}
        </button>

      </form>
    </div>
  );
};

export default AdminPartnerCtaEditor;
