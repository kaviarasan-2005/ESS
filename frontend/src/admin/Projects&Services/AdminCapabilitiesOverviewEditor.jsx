import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchCapabilitiesOverview,
  updateCapabilitiesOverview,
} from '../../services/projectsServices';
import { uploadImageFile } from '../../services/uploadService';

const DEFAULT_OVERVIEW = {
  paragraph_1:
    "In addition to supplying process instruments, analysers, and sampling systems from internationally recognised manufacturers, ESS Saudi provides in-house engineering and project execution from initial design through installation, testing, and commissioning. We work directly with EPC contractors and end users to deliver instrumentation, process analyser, control system, and safety system projects that meet project-specific technical requirements and applicable engineering and safety standards across Saudi Arabia.",
  paragraph_2:
    "Our in-house capabilities include basic and detailed engineering, panel and system integration, Factory Acceptance Testing and Site Acceptance Testing (FAT/SAT), and installation and commissioning support. This enables ESS Saudi to take full responsibility for the complete project scope from specification and design through to handover, rather than limiting our role to equipment supply alone.",
  images: [],
};

const AdminCapabilitiesOverviewEditor = () => {
  const [formData, setFormData] = useState(DEFAULT_OVERVIEW);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchCapabilitiesOverview()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};

        // FIX: respect the saved images array, even when it is empty
        const hasImagesArray = Array.isArray(payload.images);
        let galleryImages = hasImagesArray ? payload.images : [];

        // Legacy fallback ONLY for old records that never had an images array
        if (!hasImagesArray && (payload.image_url || payload.bg_image_url)) {
          galleryImages = [payload.image_url || payload.bg_image_url];
        }

        setFormData({
          paragraph_1: payload.paragraph_1 ?? DEFAULT_OVERVIEW.paragraph_1,
          paragraph_2: payload.paragraph_2 ?? DEFAULT_OVERVIEW.paragraph_2,
          images: galleryImages,
        });
      })
      .catch((err) => {
        console.error('Failed to load Capabilities Overview:', err);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes.url || uploadRes.file_path || uploadRes.image_url || '';

      if (uploadedUrl) {
        setActiveImageIndex(formData.images.length);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, uploadedUrl],
        }));
        showToast('Image uploaded to gallery!', 'success');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = formData.images.filter((_, idx) => idx !== indexToRemove);
    setFormData((prev) => ({ ...prev, images: updated }));

    if (activeImageIndex >= updated.length) {
      setActiveImageIndex(Math.max(0, updated.length - 1));
    }
    showToast('Image removed from gallery.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const firstImage = formData.images.length > 0 ? formData.images[0] : '';

    const payloadToSave = {
      ...formData,
      image_url: firstImage,
      bg_image_url: firstImage, // FIX: also clear the old field so it can't come back
    };

    try {
      await updateCapabilitiesOverview(payloadToSave);
      showToast('Capabilities overview saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Capabilities overview:', err);
      showToast('Failed to save changes.', 'error');
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

  const activeImage = formData.images[activeImageIndex] || null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 font-sans shadow-xs">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        className="hidden"
      />

      {/* HEADER */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Capabilities Overview Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit main narrative paragraphs and manage side carousel gallery images.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            OVERVIEW CONTENT & GALLERY IMAGES
          </h2>

          {/* PARAGRAPH 1 */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 1 (TOP)
            </label>
            <textarea
              rows={4}
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
              PARAGRAPH 2 (BOTTOM)
            </label>
            <textarea
              rows={4}
              name="paragraph_2"
              value={formData.paragraph_2}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Enter second narrative paragraph..."
            />
          </div>

          {/* GALLERY CONTAINER CARD */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h3 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              CAROUSEL GALLERY IMAGES
            </h3>

            {/* MAIN IMAGE PREVIEW BOX */}
            <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#f1f5f9] p-6">
              {activeImage ? (
                <>
                  <img
                    src={activeImage}
                    alt="Main Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(activeImageIndex)}
                    className="absolute top-4 right-4 cursor-pointer rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-md transition hover:bg-rose-700"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-slate-400">
                  <span className="text-4xl">🖼️</span>
                  <span className="mt-2 text-xs font-semibold">
                    No active image selected
                  </span>
                </div>
              )}
            </div>

            {/* UPLOADED THUMBNAILS STRIP */}
            <div>
              <label className="mb-3 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                UPLOADED IMAGES GALLERY (CLICK THUMBNAIL TO SET AS MAIN VIEW)
              </label>

              <div className="flex flex-wrap items-center gap-4">
                {formData.images.map((url, index) => {
                  const isActive = activeImageIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative flex h-32 w-40 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border-2 bg-white p-2.5 transition ${
                        isActive
                          ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="flex h-20 w-full items-center justify-center overflow-hidden">
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="w-full text-center text-[11px] font-bold text-rose-600 transition hover:text-rose-800"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}

                {/* ADD IMAGE CARD */}
                <div
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-white p-4 transition hover:border-sky-400 hover:bg-slate-50"
                >
                  <span className="text-2xl font-extrabold text-indigo-500">+</span>
                  <span className="mt-2 text-xs font-bold text-indigo-900">
                    {uploadingImg ? 'Uploading...' : 'Add Image'}
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
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH SECTION'}
        </button>
      </form>
    </div>
  );
};

export default AdminCapabilitiesOverviewEditor;