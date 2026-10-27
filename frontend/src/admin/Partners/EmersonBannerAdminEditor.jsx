import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchEmersonBanner,
  updateEmersonBanner,
  uploadImageFile,
} from '../../services/api';

// Always read fresh data, never a cached response
const noCacheConfig = () => ({ params: { _t: Date.now() } });

// The backend schema has two image fields, so we always keep them identical
const withImage = (data, url) => ({
  ...data,
  bg_image: url,
  bg_image_url: url,
});

const EmersonBannerAdminEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Emerson',
    subtitle:
      'Process Management, Measurement Instrumentation & Automation Solutions',
    bg_image: '',
    bg_image_url: '',
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchEmersonBanner(noCacheConfig())
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          // The public page reads bg_image_url, so it is the source of truth
          setFormData((prev) =>
            withImage({ ...prev, ...content }, content.bg_image_url || '')
          );
        }
      })
      .catch((err) => {
        console.error('Failed to load Emerson banner:', err);
        showToast('Failed to load Emerson banner.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Saves the payload, then re-reads from the server so the UI shows
  // what was really saved. Warns if the backend ignored the image change.
  const saveBanner = async (payload, successMessage) => {
    setSaving(true);
    try {
      await updateEmersonBanner(payload);

      const fresh = await fetchEmersonBanner(noCacheConfig());
      const content = fresh?.data?.data || fresh?.data || fresh || {};
      const savedUrl = content.bg_image_url || '';

      setFormData((prev) => withImage({ ...prev, ...content }, savedUrl));

      if (savedUrl !== (payload.bg_image_url || '')) {
        showToast('Server did not save the image change. Check the backend.', 'error');
        return false;
      }
      showToast(successMessage, 'success');
      return true;
    } catch (err) {
      console.error('Failed to update Emerson banner:', err);
      showToast(
        err.response?.data?.detail || 'Failed to save changes.',
        'error'
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes.url || uploadRes.file_path;

      const nextData = withImage(formData, uploadedUrl);
      setFormData(nextData);

      // Auto-save right after upload
      await saveBanner(nextData, 'Image uploaded and saved!');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload background image file.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    const nextData = withImage(formData, '');
    setFormData(nextData);

    // Auto-save right after remove
    await saveBanner(nextData, 'Background image removed and saved.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveBanner(
      withImage(formData, formData.bg_image_url || ''),
      'Emerson banner published successfully!'
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 shadow-sm">
        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 font-sans shadow-sm">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Emerson Banner Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit header title, subtitle tagline, and background image asset.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            HEADER CONTENT & ASSETS
          </h2>

          {/* TITLE INPUT */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              BANNER MAIN TITLE
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none"
              placeholder="Emerson"
              required
            />
          </div>

          {/* SUBTITLE INPUT */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SUBTITLE / TAGLINE
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle || ''}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none"
              placeholder="Process Management & Measurement Instrumentation"
            />
          </div>

          {/* MEDIA BOX */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">BACKGROUND IMAGE PREVIEW</label>
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#081b2c] shadow-2xs">
                {formData.bg_image_url ? (<><img key={formData.bg_image_url} src={formData.bg_image_url} alt="Emerson Background" className="h-full w-full object-cover opacity-50" /><button type="button" onClick={handleRemoveImage} disabled={saving || uploadingImg} className="absolute top-3 right-3 cursor-pointer rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Saving...' : 'Remove'}</button></>) : (<span className="text-xs font-semibold text-slate-400">Default Dark Blue Background Active</span>)}
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <span className="text-amber-500 text-base mt-0.5" aria-hidden="true">⚠️</span>
              <div><p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Required Image Dimensions</p><p className="text-[11px] text-amber-600 mt-0.5">Upload images at exactly <strong>1024px × 441px</strong> for best display.</p></div>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">UPLOAD NEW BACKGROUND IMAGE</label>
              <div onClick={() => !uploadingImg && !saving && fileInputRef.current && fileInputRef.current.click()} className="group flex h-36 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-white transition hover:border-sky-400 hover:bg-slate-50/50">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} className="hidden" />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl transition-transform group-hover:scale-110">📁</span>
                  <span className="text-xs font-bold text-slate-600">{uploadingImg ? 'Uploading Image...' : saving ? 'Saving...' : 'Click to Upload Image'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON (still needed for title and subtitle changes) */}
        <button
          type="submit"
          disabled={saving || uploadingImg}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH EMERSON BANNER'}
        </button>
      </form>
    </div>
  );
};

export default EmersonBannerAdminEditor;