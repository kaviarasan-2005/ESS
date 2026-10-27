import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchEcoPhysicsPrecision,
  updateEcoPhysicsPrecision,
  uploadImageFile,
} from '../../services/api';

const EcoPhysicsPrecisionAdminEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Unmatched Precision in NOx Analysis',
    paragraph_1:
      'ECO Physics sets the industry benchmark for accuracy and range in NOx detection. Utilizing the gold-standard Chemiluminescence detection method (CLD), these analyzers provide definitive measurements that other technologies cannot match.',
    paragraph_2:
      'They are engineered to handle challenging sample conditions, including high humidity and complex gas matrices, ensuring data integrity you can trust for compliance reporting and critical research. With measurement capabilities spanning an incredible range—from trace-level 1 ppt (parts-per-trillion) to high-concentration 10,000 ppm (parts-per-million)—a single ECO Physics analyzer can be configured for virtually any application.',
    image_url: '',
    image_caption:
      'Chemiluminescence Detection Method based Eco Physics Analyzers',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  // Popup Modal Alert State

  useEffect(() => {
    loadPrecisionData();
  }, []);

  const loadPrecisionData = async () => {
    try {
      setLoading(true);
      const res = await fetchEcoPhysicsPrecision();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setFormData((prev) => ({
          ...prev,
          ...content,
        }));
      }
    } catch (err) {
      console.error('Failed to load Eco Physics Precision section:', err);
      showToast('Failed to load Eco Physics Precision section.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes?.url || uploadRes?.file_path || uploadRes?.data?.url || uploadRes;

      if (uploadedUrl && typeof uploadedUrl === 'string') {
        setFormData((prev) => ({
          ...prev,
          image_url: uploadedUrl,
        }));
        showToast('Precision image uploaded successfully!', 'success');
      } else {
        showToast('Failed to process uploaded image URL.', 'error');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: '',
    }));
    showToast('Image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateEcoPhysicsPrecision(formData);
      const updatedContent = res?.data?.data || res?.data || formData;
      setFormData((prev) => ({
        ...prev,
        ...updatedContent,
      }));
      showToast('Precision section saved and published successfully!', 'success');
    } catch (err) {
      console.error('Failed to update precision section:', err);
      showToast(err.response?.data?.detail || 'Failed to save changes to server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-500">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#051124] border-r-transparent"></div>
        <span className="ml-3 text-sm font-medium">Loading Precision Editor...</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl rounded-2xl border border-gray-100 bg-white p-8 font-sans text-gray-800 shadow-xs">

      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#051124]">
          Eco Physics Precision Section Editor
        </h1>
        <p className="mt-1.5 text-sm font-medium text-gray-400">
          Edit header title, body paragraphs, analyzer graphic, and caption.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-gray-200/60 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="mb-6 text-xs font-bold tracking-wider text-slate-500 uppercase">
            SECTION CONTENT & ASSETS
          </h2>

          {/* TITLE INPUT */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
              SECTION TITLE
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-800 shadow-2xs focus:border-sky-500 focus:outline-none"
              placeholder="Unmatched Precision in NOx Analysis"
              required
            />
          </div>

          {/* MEDIA BOX */}
          <div className="mb-8 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* LEFT COLUMN: FEATURED CARD PREVIEW */}
              <div>
                <label className="mb-3 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                  FEATURED ANALYZER GRAPHIC
                </label>
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 shadow-2xs">
                  {formData.image_url ? (
                    <>
                      <img
                        src={formData.image_url}
                        alt="Precision Analyzer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://via.placeholder.com/400x200?text=Precision+Analyzer';
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
                      No analyzer graphic selected
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: UPLOAD NEW IMAGE */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    UPLOAD NEW IMAGE
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Min: 500x250px
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
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📁</span>
                    <span className="text-xs font-bold text-slate-600">
                      {uploadingImg ? 'Uploading Image...' : 'Click to Upload Background Image'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CAPTION INPUT */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                IMAGE CAPTION TEXT
              </label>
              <input
                type="text"
                name="image_caption"
                value={formData.image_caption}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
                placeholder="Chemiluminescence Detection Method based Eco Physics Analyzers"
              />
            </div>
          </div>

          {/* PARAGRAPH 1 */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 1 (KEY HIGHLIGHT)
            </label>
            <textarea
              name="paragraph_1"
              rows={4}
              value={formData.paragraph_1}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200/90 bg-white p-4 text-sm leading-relaxed text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
              placeholder="Enter first paragraph text..."
              required
            />
          </div>

          {/* PARAGRAPH 2 */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 2 (TECHNICAL SPECIFICATIONS)
            </label>
            <textarea
              name="paragraph_2"
              rows={5}
              value={formData.paragraph_2}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200/90 bg-white p-4 text-sm leading-relaxed text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
              placeholder="Enter second paragraph text..."
              required
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
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
              'SAVE & PUBLISH ECO PHYSICS PRECISION SECTION'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EcoPhysicsPrecisionAdminEditor;
