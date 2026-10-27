import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchHoneywellGasDetectionDetails,
  updateHoneywellGasDetectionDetails,
  uploadImageFile,
} from '../../services/api';

const AdminHoneywellGasDetectionDetailsEditor = () => {
  const [formData, setFormData] = useState({
    header_title: '',
    header_description: '',
    range_title: '',
    range_image_url: '',
    range_paragraph_1: '',
    range_paragraph_2: '',
    cards: [],
    support_title: '',
    support_points: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHoneywellGasDetectionDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            header_title: content.header_title || 'Trusted Honeywell Gas Detection Solutions',
            header_description: content.header_description || '',
            range_title: content.range_title || 'Our Honeywell Product Range',
            range_image_url: content.range_image_url || '',
            range_paragraph_1: content.range_paragraph_1 || '',
            range_paragraph_2: content.range_paragraph_2 || '',
            cards: content.cards || [],
            support_title: content.support_title || 'Honeywell Analytics Distributor Support',
            support_points: content.support_points || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load details:', err);
        showToast('Failed to load details content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* IMAGE UPLOAD */
  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes.url || uploadRes.file_path;

      setFormData((prev) => ({
        ...prev,
        range_image_url: uploadedUrl,
      }));
      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload image file.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      range_image_url: '',
    }));
    showToast('Image removed.', 'info');
  };

  /* FIXED 2 CARDS MANAGEMENT */
  const handleCardChange = (index, field, value) => {
    const updatedCards = [...formData.cards];
    updatedCards[index][field] = value;
    setFormData((prev) => ({ ...prev, cards: updatedCards }));
  };

  /* DISTRIBUTOR SUPPORT BULLETS */
  const handleSupportPointChange = (index, value) => {
    const updatedPoints = [...formData.support_points];
    updatedPoints[index] = value;
    setFormData((prev) => ({ ...prev, support_points: updatedPoints }));
  };

  const handleAddSupportPoint = () => {
    setFormData((prev) => ({
      ...prev,
      support_points: [...prev.support_points, 'New Support Point: Description...'],
    }));
  };

  const handleRemoveSupportPoint = (index) => {
    const updatedPoints = formData.support_points.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, support_points: updatedPoints }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHoneywellGasDetectionDetails(formData);
      showToast('Details section updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update details:', err);
      showToast(err.response?.data?.detail || 'Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 shadow-xs">
        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 font-sans shadow-xs">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Honeywell Gas Detection Details Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage header text, product range photo and descriptions, 2 feature cards, and support bullet points.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: HEADER */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. SECTION HEADER
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              HEADER TITLE
            </label>
            <input
              type="text"
              name="header_title"
              value={formData.header_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              HEADER DESCRIPTION
            </label>
            <textarea
              name="header_description"
              rows={3}
              value={formData.header_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 2: PRODUCT RANGE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. PRODUCT RANGE SECTION
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PRODUCT RANGE TITLE
            </label>
            <input
              type="text"
              name="range_title"
              value={formData.range_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* RANGE IMAGE */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  PRODUCT RANGE PHOTO PREVIEW
                </label>
                <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#081b2c] p-2 text-center shadow-2xs">
                  {formData.range_image_url ? (
                    <>
                      <img
                        src={formData.range_image_url}
                        alt="Product Range Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 cursor-pointer rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      No Photo Set
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  UPLOAD NEW PHOTO
                </label>
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="group flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-white p-4 transition hover:border-sky-400 hover:bg-slate-50/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <span className="text-2xl transition-transform group-hover:scale-110">📷</span>
                  <span className="mt-2 text-xs font-bold text-slate-600">
                    {uploadingImg ? 'Uploading...' : 'Click to Upload Photo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 1
            </label>
            <textarea
              name="range_paragraph_1"
              rows={2}
              value={formData.range_paragraph_1}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 2
            </label>
            <textarea
              name="range_paragraph_2"
              rows={3}
              value={formData.range_paragraph_2}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 3: FIXED 2 CARDS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. FEATURE CARDS (2 CARDS)
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {formData.cards.map((card, index) => (
              <div key={card.id || index} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <span className="mb-2 block text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  CARD #{index + 1}
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      CARD TITLE
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      CARD DESCRIPTION
                    </label>
                    <textarea
                      rows={6}
                      value={card.description}
                      onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none resize-y"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: DISTRIBUTOR SUPPORT */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              4. DISTRIBUTOR SUPPORT BULLETS
            </h2>
            <button
              type="button"
              onClick={handleAddSupportPoint}
              className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              + Add Item
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION TITLE
            </label>
            <input
              type="text"
              name="support_title"
              value={formData.support_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            {formData.support_points.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleSupportPointChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSupportPoint(index)}
                  className="rounded-lg bg-rose-600/10 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH DETAILS SECTION'}
        </button>
      </form>
    </div>
  );
};

export default AdminHoneywellGasDetectionDetailsEditor;