import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchProjectsServicesOverview,
  updateProjectsServicesOverview,
} from '../../services/projectsServices';
import { uploadImageFile } from '../../services/uploadService';

const DEFAULT_OVERVIEW = {
  paragraph_1:
    'ESS Saudi embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.',
  paragraph_2:
    'We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.',
  cta_button_text: 'Contact Us',
  cta_button_url: '/contact',
  image_url: '',
};

let cachedAdminOverview = null;

const AdminProjectsServicesOverviewEditor = () => {
  const [formData, setFormData] = useState(() => {
    return cachedAdminOverview || DEFAULT_OVERVIEW;
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(!cachedAdminOverview);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchProjectsServicesOverview()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data || res || {};
        const rawImg = payload.image_url || payload.bg_image_url || '';

        const freshData = {
          paragraph_1: payload.paragraph_1 ?? DEFAULT_OVERVIEW.paragraph_1,
          paragraph_2: payload.paragraph_2 ?? DEFAULT_OVERVIEW.paragraph_2,
          cta_button_text: payload.cta_button_text ?? DEFAULT_OVERVIEW.cta_button_text,
          cta_button_url: payload.cta_button_url ?? DEFAULT_OVERVIEW.cta_button_url,
          image_url: rawImg,
        };

        cachedAdminOverview = freshData;
        setFormData(freshData);
      })
      .catch((err) => {
        console.error('Failed to load Projects & Services Overview:', err);
        showToast('Failed to load overview details.', 'error');
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
      cachedAdminOverview = nextState;
      return nextState;
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl =
        uploadRes.url || uploadRes.file_path || uploadRes.image_url || '';

      if (uploadedUrl) {
        setFormData((prev) => {
          const nextState = { ...prev, image_url: uploadedUrl };
          cachedAdminOverview = nextState;
          return nextState;
        });
        showToast('Featured image uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload featured image.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => {
      const nextState = { ...prev, image_url: '' };
      cachedAdminOverview = nextState;
      return nextState;
    });
    showToast('Featured image removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payloadToSave = {
      ...formData,
      bg_image_url: formData.image_url,
    };

    cachedAdminOverview = { ...formData };

    try {
      await updateProjectsServicesOverview(payloadToSave);
      showToast('Projects & Services overview updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Projects & Services overview:', err);
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
          Projects & Services Overview Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit main overview narrative, CTA button text/link, and featured side image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">

          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            OVERVIEW CONTENT & MEDIA
          </h2>

          {/* PARAGRAPH 1 */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 1
            </label>
            <textarea
              rows={3}
              name="paragraph_1"
              value={formData.paragraph_1}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Enter top narrative paragraph..."
            />
          </div>

          {/* PARAGRAPH 2 */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 2
            </label>
            <textarea
              rows={3}
              name="paragraph_2"
              value={formData.paragraph_2}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Enter second narrative paragraph..."
            />
          </div>

          {/* CTA CONTROLS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                BUTTON TEXT
              </label>
              <input
                type="text"
                name="cta_button_text"
                value={formData.cta_button_text}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="Contact Us"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                BUTTON DESTINATION URL
              </label>
              <input
                type="text"
                name="cta_button_url"
                value={formData.cta_button_url}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="/contact"
              />
            </div>
          </div>

          {/* MEDIA BOX */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <h3 className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              FEATURED SECTION IMAGE
            </h3>

            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              UPLOAD FEATURED IMAGE
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              {/* UPLOAD FILE DROPZONE */}
              <div
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                className="group flex h-20 flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 transition hover:border-sky-400 hover:bg-slate-50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <span className="mr-3 text-xl transition-transform group-hover:scale-110">
                  📁
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {uploadingImg
                    ? 'Uploading Image...'
                    : 'Click to Upload / Change Image'}
                </span>
              </div>

              {/* SMALL PREVIEW BOX */}
              <div className="relative flex h-20 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#0f172a] sm:w-44">
                {formData.image_url ? (
                  <>
                    <img
                      key={formData.image_url}
                      src={formData.image_url}
                      alt="Projects Overview Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 cursor-pointer rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs transition hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    NO IMAGE
                  </span>
                )}
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH SECTION'}
        </button>
      </form>
    </div>
  );
};

export default AdminProjectsServicesOverviewEditor;