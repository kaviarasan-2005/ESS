import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchProminentMeteringBanner,
  updateProminentMeteringBanner,
  uploadImageFile,
} from '../../services/api';

const ProminentBannerEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Prominent Metering',
    subtitle: 'Precision Chemical Dosing & Metering Pump Solutions',
    bg_image_url: '',
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProminentMeteringBanner()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          const imgUrl = content.bg_image_url || content.bg_image || '';
          setFormData((prev) => ({
            ...prev,
            ...content,
            title: content.title || 'Prominent Metering',
            bg_image_url: imgUrl,
          }));
        }
      })
      .catch((err) => {
        console.error('Failed to load Prominent Metering banner:', err);
        showToast('Failed to load banner details.', 'error');
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
        bg_image_url: uploadedUrl,
      }));
      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload background image.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      bg_image_url: '',
    }));
    showToast('Background image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProminentMeteringBanner(formData);
      showToast('Prominent Metering banner saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Prominent Metering banner:', err);
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
          Prominent Metering Banner Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit main banner header title, tagline, and background overlay image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            BANNER CONTENT & MEDIA
          </h2>

          {/* MAIN TITLE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              BANNER MAIN TITLE
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Prominent Metering"
              required
            />
          </div>

          {/* SUBTITLE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SUBTITLE / TAGLINE
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle || ''}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Precision Chemical Dosing & Metering Pump Solutions"
            />
          </div>

          {/* MEDIA BOX */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">BACKGROUND IMAGE PREVIEW</label>
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#081b2c] text-center shadow-2xs">
                {formData.bg_image_url ? (<><img src={formData.bg_image_url} alt="Prominent Metering Preview" className="h-full w-full object-cover opacity-50" /><button type="button" onClick={handleRemoveImage} className="absolute top-3 right-3 cursor-pointer rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700">Remove</button></>) : (<span className="text-xs font-semibold text-slate-400 px-4">Default Dark Blue Background Active</span>)}
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <span className="text-amber-500 text-base mt-0.5" aria-hidden="true">⚠️</span>
              <div><p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Required Image Dimensions</p><p className="text-[11px] text-amber-600 mt-0.5">Upload images at exactly <strong>1024px × 441px</strong> for best display.</p></div>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">UPLOAD NEW BACKGROUND IMAGE</label>
              <div onClick={() => fileInputRef.current && fileInputRef.current.click()} className="group flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-white p-4 transition hover:border-sky-400 hover:bg-slate-50/50">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} className="hidden" />
                <span className="text-2xl transition-transform group-hover:scale-110">📁</span>
                <span className="mt-2 text-xs font-bold text-slate-600">{uploadingImg ? 'Uploading Image...' : 'Click to Upload Image'}</span>
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH BANNER'}
        </button>
      </form>
    </div>
  );
};

export default ProminentBannerEditor;