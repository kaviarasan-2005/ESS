import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchEcoPhysicsOverview,
  updateEcoPhysicsOverview,
  uploadImageFile,
} from '../../services/api';

const EcoPhysicsOverviewAdminEditor = () => {
  const [formData, setFormData] = useState({
    description:
      'ESS-ME is the authorized Middle Eastern distributor for ECO Physics, a global pioneer in ultra-precise nitrogen oxide (NOx) analyzers. For industries and research institutions where accuracy is non-negotiable, ECO Physics provides the definitive solution. Our analyzers deliver unmatched reliability for the most demanding applications, from stringent continuous emissions monitoring systems (CEMS) in industrial stacks to sensitive ambient air quality networks and advanced atmospheric research across the GCC region.',
    product_image_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);


  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchEcoPhysicsOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setFormData((prev) => ({
          ...prev,
          description: content.description || prev.description,
          product_image_url: content.product_image_url || '',
        }));
      }
    } catch (err) {
      console.error('Failed to load Eco Physics Overview:', err);
      showToast('Failed to load Eco Physics Overview.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload handler with feedback
  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes?.url || uploadRes?.file_path || uploadRes?.data?.url || uploadRes;

      if (uploadedUrl && typeof uploadedUrl === 'string') {
        setFormData((prev) => ({
          ...prev,
          product_image_url: uploadedUrl,
        }));
        showToast('Product image uploaded successfully!', 'success');
      } else {
        showToast('Failed to process uploaded image URL.', 'error');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      product_image_url: '',
    }));
    showToast('Product image removed.', 'info');
  };

  // Triggers Popup Modal upon Save & Publish
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateEcoPhysicsOverview(formData);
      const updatedContent = res?.data?.data || res?.data || formData;
      setFormData((prev) => ({
        ...prev,
        description: updatedContent.description || prev.description,
        product_image_url: updatedContent.product_image_url || prev.product_image_url,
      }));
      showToast('Eco Physics Overview saved and published successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Eco Physics Overview:', err);
      showToast(err.response?.data?.detail || 'Failed to save changes to server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-500">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#051124] border-r-transparent"></div>
        <span className="ml-3 text-sm font-medium">Loading Overview Editor...</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl rounded-2xl border border-gray-100 bg-white p-8 font-sans text-gray-800 shadow-xs">

      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#051124]">
          Eco Physics Overview Editor
        </h1>
        <p className="mt-1.5 text-sm font-medium text-gray-400">
          Edit main description text and featured brand logo image card.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION CONTENT & ASSETS OUTER CARD */}
        <div className="rounded-2xl border border-gray-200/60 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="mb-6 text-xs font-bold tracking-wider text-slate-500 uppercase">
            SECTION CONTENT & ASSETS
          </h2>

          {/* MEDIA BOX */}
          <div className="mb-8 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* LEFT COLUMN: FEATURED BRAND LOGO CARD */}
              <div>
                <label className="mb-3 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                  FEATURED BRAND LOGO CARD
                </label>
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 shadow-2xs">
                  {formData.product_image_url ? (
                    <>
                      <img
                        src={formData.product_image_url}
                        alt="Featured Preview"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://via.placeholder.com/400x200?text=Eco+Physics+Overview';
                        }}
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-4 right-4 rounded-lg bg-[#e11d48] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400">
                      No featured image selected
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: UPLOAD NEW LOGO / IMAGE */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    UPLOAD NEW LOGO / IMAGE
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Min: 600x300px (16:9 Landscape)
                  </span>
                </div>
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="group flex h-48 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-white transition hover:border-sky-400 hover:bg-slate-50/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  
                  {/* UPLOAD BUTTON LAYOUT */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📁</span>
                    <span className="text-xs font-bold text-slate-600">
                      {uploadingImg ? 'Uploading Image...' : 'Click to Upload Background Image'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION DESCRIPTION TEXT AREA */}
          <div>
            <label className="mb-3 block text-xs font-bold tracking-wider text-slate-400 uppercase">
              SECTION DESCRIPTION
            </label>
            <textarea
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200/90 bg-white p-5 text-sm leading-relaxed text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
              placeholder="Enter section description..."
              required
            />
          </div>
        </div>

        {/* FULL-WIDTH ACTION BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center rounded-xl bg-[#051124] py-4 text-center text-xs font-bold tracking-widest text-white uppercase shadow-md transition hover:bg-[#0a1e3f] disabled:opacity-50"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                SAVING CHANGES...
              </div>
            ) : (
              'SAVE & PUBLISH ECO PHYSICS OVERVIEW'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EcoPhysicsOverviewAdminEditor;
