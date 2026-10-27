import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchRASilverOverview,
  updateRASilverOverview,
  uploadImageFile,
} from '../../services/api';

const RASilverOverviewEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Rockwell Automation System Integration',
    paragraph_1: '',
    image_url: '',
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRASilverOverview()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData((prev) => ({
            ...prev,
            ...content,
            title: content.title || 'Rockwell Automation System Integration',
          }));
        }
      })
      .catch((err) => {
        console.error('Failed to load RA Silver overview:', err);
        showToast('Failed to load overview details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes.url || uploadRes.file_path;

      setFormData((prev) => ({
        ...prev,
        image_url: uploadedUrl,
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
      image_url: '',
    }));
    showToast('Image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateRASilverOverview(formData);
      showToast('RA Silver overview updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update RA Silver overview:', err);
      showToast(
        err.response?.data?.detail || 'Failed to save changes.',
        'error'
      );
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
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          RA Silver Overview Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit section heading, overview text, and partner logo image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            OVERVIEW CONTENT & MEDIA
          </h2>

          {/* SECTION TITLE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION HEADING
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Rockwell Automation System Integration"
              required
            />
          </div>

          {/* PARAGRAPH 1 */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              OVERVIEW DESCRIPTION PARAGRAPH
            </label>
            <textarea
              name="paragraph_1"
              rows={5}
              value={formData.paragraph_1 || ''}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="As a certified Silver Level System Integrator..."
              required
            />
          </div>

          {/* MEDIA BOX */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* PREVIEW */}
              <div>
                <label className="mb-3 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  SIDE IMAGE PREVIEW
                </label>
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#081b2c] p-4 text-center shadow-2xs">
                  {formData.image_url ? (
                    <>
                      <img
                        src={formData.image_url}
                        alt="RA Silver Overview Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 cursor-pointer rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 px-4">
                      No Image Set (Placeholder active)
                    </span>
                  )}
                </div>
              </div>

              {/* UPLOAD BOX */}
              <div>
                <label className="mb-3 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  UPLOAD NEW LOGO / BADGE IMAGE
                </label>
                <div
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="group flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-white p-4 transition hover:border-sky-400 hover:bg-slate-50/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <span className="text-2xl transition-transform group-hover:scale-110">
                    🖼️
                  </span>
                  <span className="mt-2 text-xs font-bold text-slate-600">
                    {uploadingImg
                      ? 'Uploading Image...'
                      : 'Click to Upload Image'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH OVERVIEW SECTION'}
        </button>
      </form>
    </div>
  );
};

export default RASilverOverviewEditor;