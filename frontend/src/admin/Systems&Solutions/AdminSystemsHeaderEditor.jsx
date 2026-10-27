import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchSystemsHeader,
  updateSystemsHeader,
} from '../../services/SystemsSolutions';
import { uploadImageFile } from '../../services/uploadService';

const DEFAULT_BANNER = {
  title: 'SYSTEMS & SOLUTIONS',
  subtitle: 'Explore Our Industrial Grade Systems & Solutions',
  bg_image_url: '',
};

// Module-level memory cache for instant load on re-mounts
let cachedAdminHeader = null;

const AdminSystemsHeaderEditor = () => {
  const [formData, setFormData] = useState(() => {
    return cachedAdminHeader || DEFAULT_BANNER;
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(!cachedAdminHeader);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchSystemsHeader()
      .then((res) => {
        if (!isMounted) return;

        const content = res?.data || res || {};
        if (content) {
          const imgUrl = content.bg_image_url || content.image_url || '';
          const freshData = {
            title: content.title ?? DEFAULT_BANNER.title,
            subtitle: content.subtitle ?? DEFAULT_BANNER.subtitle,
            bg_image_url: imgUrl,
          };

          cachedAdminHeader = freshData;
          setFormData(freshData);
        }
      })
      .catch((err) => {
        console.error('Failed to load Systems & Solutions banner:', err);
        showToast('Failed to load banner details.', 'error');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextState = { ...prev, [name]: value };
      cachedAdminHeader = nextState;
      return nextState;
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes.url || uploadRes.file_path;

      setFormData((prev) => {
        const nextState = { ...prev, bg_image_url: uploadedUrl };
        cachedAdminHeader = nextState;
        return nextState;
      });
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
    setFormData((prev) => {
      const nextState = { ...prev, bg_image_url: '' };
      cachedAdminHeader = nextState;
      return nextState;
    });
    showToast('Background image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payloadToSave = {
      ...formData,
      image_url: formData.bg_image_url,
    };

    cachedAdminHeader = { ...formData };

    try {
      await updateSystemsHeader(payloadToSave);
      showToast('Systems & Solutions banner saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Systems & Solutions banner:', err);
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
        <span className="text-xs font-medium text-slate-500">
          Loading Editor...
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 font-sans shadow-xs">
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Systems & Solutions Banner Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit main banner title, subtitle, and background overlay image for the Systems & Solutions section.
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
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="SYSTEMS & SOLUTIONS"
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
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Explore Our Industrial Grade Systems & Solutions"
            />
          </div>

          {/* MEDIA BOX */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                BACKGROUND IMAGE PREVIEW
              </label>
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#081b2c] p-4 text-center shadow-2xs">
                {formData.bg_image_url ? (
                  <>
                    <img
                      src={formData.bg_image_url}
                      alt="Systems Banner Background Preview"
                      className="h-full w-full object-cover opacity-50"
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
                  <span className="px-4 text-xs font-semibold text-slate-400">
                    Default Dark Blue Background Active
                  </span>
                )}
              </div>
            </div>

            {/* REQUIRED DIMENSIONS WARNING CALLOUT */}
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="mt-0.5 text-base text-amber-500" aria-hidden="true">
                ⚠️
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-wide text-amber-700 uppercase">
                  Required Image Dimensions
                </p>
                <p className="mt-0.5 text-[11px] text-amber-600">
                  Upload images at exactly <strong>1024px × 441px</strong> for best display.
                </p>
              </div>
            </div>

            {/* UPLOAD FILE DROPZONE */}
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                UPLOAD NEW BACKGROUND IMAGE
              </label>
              <div
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                className="group flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-white p-4 transition hover:border-sky-400 hover:bg-slate-50/50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <span className="text-2xl transition-transform group-hover:scale-110">
                  📁
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

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH BANNER'}
        </button>
      </form>
    </div>
  );
};

export default AdminSystemsHeaderEditor;