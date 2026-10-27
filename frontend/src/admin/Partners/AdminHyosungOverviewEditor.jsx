import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchHyosungOverview,
  updateHyosungOverview,
  uploadImageFile,
} from '../../services/api';

const AdminHyosungOverviewEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Hyosung Goodsprings Industrial Pumps',
    description:
      "From the heart of an industrial plant to the core of a city's infrastructure, reliable pumping is fundamental. ESS-ME supplies Hyosung Goodsprings industrial pumps, a comprehensive range of robust and efficient pumping solutions trusted across the Middle East. We provide the hydraulic backbone for power generation, oil & gas facilities, and large-scale building services, ensuring continuous flow and operational dependability.",
    card_image: '',
    card_image_url: '',
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHyosungOverview()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const imgUrl = payload.card_image_url || payload.card_image || '';
        setFormData({
          title: payload.title || 'Hyosung Goodsprings Industrial Pumps',
          description: payload.description || '',
          card_image: imgUrl,
          card_image_url: imgUrl,
        });
      })
      .catch((err) => {
        console.error('Error fetching Hyosung Overview:', err);
        showToast('Failed to load Hyosung overview details.', 'error');
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
        card_image: uploadedUrl,
        card_image_url: uploadedUrl,
      }));
      showToast('Card image uploaded successfully!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload card image.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      card_image: '',
      card_image_url: '',
    }));
    showToast('Graphic image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHyosungOverview(formData);
      showToast('Hyosung Overview section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Hyosung overview:', err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 shadow-sm">
        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Loading Overview Editor...</span>
      </div>
    );
  }

  const rawUrl = formData.card_image_url || formData.card_image || '';
  const hasCustomImage =
    rawUrl &&
    rawUrl.trim() !== '' &&
    rawUrl !== 'undefined' &&
    rawUrl !== 'null';

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 font-sans shadow-sm">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Hyosung Goodsprings Overview Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit section title, descriptive body text, and featured brand graphic asset.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION CONTENT & ASSETS */}
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            OVERVIEW CONTENT & MEDIA
          </h2>

          {/* MAIN TITLE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION TITLE
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Hyosung Goodsprings Industrial Pumps"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              DESCRIPTION BODY TEXT
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="From the heart of an industrial plant..."
              required
            />
          </div>

          {/* MEDIA BOX */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <h3 className="mb-4 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              FEATURED BRAND GRAPHIC
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* GRAPHIC PREVIEW BOX */}
              <div>
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  GRAPHIC PREVIEW
                </label>
                <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#081b2c] p-4 text-center">
                  {hasCustomImage ? (
                    <>
                      <img
                        src={rawUrl}
                        alt="Graphic Preview"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 cursor-pointer rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    /* CENTERED DEFAULT HTML TEXT (NO BROKEN IMG TAG) */
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <span className="text-base font-normal tracking-wider text-white uppercase">
                        HYOSUNG GOODSPRINGS
                      </span>
                      <span className="text-xs font-medium tracking-wide text-slate-400">
                        Pumps & Water
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* UPLOAD BOX */}
              <div>
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  UPLOAD BRAND GRAPHIC
                </label>
                <div
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="group flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-white p-4 transition hover:border-sky-400 hover:bg-slate-50/50"
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
                      : 'Click to Upload Graphic Image'}
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH HYOSUNG OVERVIEW'}
        </button>
      </form>
    </div>
  );
};

export default AdminHyosungOverviewEditor;