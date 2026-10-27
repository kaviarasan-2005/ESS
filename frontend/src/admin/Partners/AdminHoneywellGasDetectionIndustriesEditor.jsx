import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchHoneywellGasDetectionIndustries,
  updateHoneywellGasDetectionIndustries,
  uploadImageFile,
} from '../../services/api';

const AdminHoneywellGasDetectionIndustriesEditor = () => {
  const [formData, setFormData] = useState({
    section_title: 'Industries We Serve',
    intro_text: '',
    industry_list: [],
    poster_image_url: '',
    poster_caption: '',
    footer_text: '',
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHoneywellGasDetectionIndustries()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            section_title: content.section_title || 'Industries We Serve',
            intro_text: content.intro_text || '',
            industry_list: content.industry_list || [],
            poster_image_url: content.poster_image_url || '',
            poster_caption: content.poster_caption || 'Honeywell in Oil & Gas Applications',
            footer_text: content.footer_text || '',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load industries section:', err);
        showToast('Failed to load industries section content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* INDUSTRY LIST MANAGEMENT */
  const handleIndustryChange = (index, value) => {
    const updatedList = [...formData.industry_list];
    updatedList[index] = value;
    setFormData((prev) => ({ ...prev, industry_list: updatedList }));
  };

  const handleAddIndustry = () => {
    setFormData((prev) => ({
      ...prev,
      industry_list: [...prev.industry_list, 'New Target Industry Sector'],
    }));
  };

  const handleRemoveIndustry = (index) => {
    const updatedList = formData.industry_list.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, industry_list: updatedList }));
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
        poster_image_url: uploadedUrl,
      }));
      showToast('Poster image uploaded successfully!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload poster image.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      poster_image_url: '',
    }));
    showToast('Poster image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHoneywellGasDetectionIndustries(formData);
      showToast('Industries section updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update industries section:', err);
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
          Honeywell Gas Detection Industries Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage target industry sectors list, brochure poster image, captions, and footer contact text.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* MAIN SECTION TITLE & INTRO */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. SECTION HEADINGS
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION TITLE
            </label>
            <input
              type="text"
              name="section_title"
              value={formData.section_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              INTRO TEXT
            </label>
            <textarea
              name="intro_text"
              rows={2}
              value={formData.intro_text}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* INDUSTRIES BULLET LIST */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              2. INDUSTRIES LIST ({formData.industry_list.length})
            </h2>
            <button
              type="button"
              onClick={handleAddIndustry}
              className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              + Add Industry
            </button>
          </div>

          <div className="space-y-2">
            {formData.industry_list.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleIndustryChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIndustry(index)}
                  className="rounded-lg bg-rose-600/10 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POSTER IMAGE & CAPTION */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. BROCHURE POSTER MEDIA & CAPTION
          </h2>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  POSTER PREVIEW
                </label>
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#081b2c] p-2 text-center shadow-2xs">
                  {formData.poster_image_url ? (
                    <>
                      <img
                        src={formData.poster_image_url}
                        alt="Poster Preview"
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
                      No Poster Set
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  UPLOAD NEW POSTER IMAGE
                </label>
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="group flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-white p-4 transition hover:border-sky-400 hover:bg-slate-50/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <span className="text-2xl transition-transform group-hover:scale-110">🖼️</span>
                  <span className="mt-2 text-xs font-bold text-slate-600">
                    {uploadingImg ? 'Uploading...' : 'Click to Upload Image'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              POSTER CAPTION
            </label>
            <input
              type="text"
              name="poster_caption"
              value={formData.poster_caption}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Honeywell in Oil & Gas Applications"
            />
          </div>
        </div>

        {/* FOOTER TEXT */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            4. FOOTER CONTACT PARAGRAPH
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              FOOTER TEXT
            </label>
            <textarea
              name="footer_text"
              rows={3}
              value={formData.footer_text}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH INDUSTRIES SECTION'}
        </button>
      </form>
    </div>
  );
};

export default AdminHoneywellGasDetectionIndustriesEditor;