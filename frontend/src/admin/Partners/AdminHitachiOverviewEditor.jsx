import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchHitachiOverview,
  updateHitachiOverview,
  uploadImageFile,
} from '../../services/api';

const DEFAULT_BRAND_GRAPHIC =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22360%22%20viewBox%3D%220%200%20600%20360%22%3E%3Crect%20fill%3D%22%23081b2c%22%20width%3D%22600%22%20height%3D%22360%22%2F%3E%3Ctext%20fill%3D%22%23ffffff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2226%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20text-anchor%3D%22middle%22%3EHITACHI%3C%2Ftext%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2258%25%22%20text-anchor%3D%22middle%22%3EInspire%20the%20Next%3C%2Ftext%3E%3C%2Fsvg%3E";

const AdminHitachiOverviewEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Hitachi Compressors & Pumps',
    description:
      "For the world's most demanding industrial environments, equipment reliability isn't just a preference—it's a prerequisite. ESS-ME is the regional supplier for Hitachi industrial compressors and pumps, delivering the pinnacle of Japanese engineering and precision to the Middle East's core sectors. We provide the high-performance heart for your critical processes, from the massive centrifugal compressors in LNG plants to the high-pressure pumps in power stations, ensuring unmatched reliability and efficiency.",
    card_image: '',
    card_image_url: '',
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHitachiOverview()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const imgUrl = payload.card_image_url || payload.card_image || '';
        setFormData({
          title: payload.title || 'Hitachi Compressors & Pumps',
          description: payload.description || '',
          card_image: imgUrl,
          card_image_url: imgUrl,
        });
      })
      .catch((err) => {
        console.error('Error fetching Hitachi Overview:', err);
        showToast('Failed to load Hitachi overview details.', 'error');
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
    showToast('Background image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHitachiOverview(formData);
      showToast('Hitachi Overview section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Hitachi overview:', err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Hitachi Overview Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit section title, descriptive body text, and featured brand graphic asset.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION CONTENT & ASSETS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
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
              placeholder="Hitachi Compressors & Pumps"
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
              placeholder="For the world's most demanding industrial environments..."
              required
            />
          </div>

          {/* MEDIA BOX */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <h3 className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              FEATURED BRAND GRAPHIC
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* GRAPHIC PREVIEW */}
              <div>
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  GRAPHIC PREVIEW
                </label>
                <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#081b2c] p-2">
                  <img
                    src={
                      formData.card_image_url && formData.card_image_url.trim() !== ''
                        ? formData.card_image_url
                        : DEFAULT_BRAND_GRAPHIC
                    }
                    alt="Graphic Preview"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_BRAND_GRAPHIC;
                    }}
                    className="h-full w-full object-cover"
                  />
                  {formData.card_image_url && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 cursor-pointer rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
                    >
                      Remove
                    </button>
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH HITACHI OVERVIEW'}
        </button>
      </form>
    </div>
  );
};

export default AdminHitachiOverviewEditor;