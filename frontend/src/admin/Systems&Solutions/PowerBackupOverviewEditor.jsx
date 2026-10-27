import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchPowerBackupOverview,
  updatePowerBackupOverview,
} from '../../services/SystemsSolutions';
import { uploadImageFile } from '../../services/uploadService';

const PowerBackupOverviewEditor = () => {
  const [formData, setFormData] = useState({
    paragraph_1: '',
    paragraph_2: '',
    carousel_images: [],
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPowerBackupOverview()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            paragraph_1: content.paragraph_1 || '',
            paragraph_2: content.paragraph_2 || '',
            carousel_images: content.carousel_images || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Power Backup overview:', err);
        showToast('Failed to load overview details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (index, value) => {
    const updated = [...formData.carousel_images];
    updated[index].title = value;
    setFormData((prev) => ({ ...prev, carousel_images: updated }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes.url || uploadRes.file_path;

      const newSlide = {
        id: `slide_${Date.now()}`,
        title: file.name ? file.name.split('.')[0] : 'New Power Backup Image',
        image_url: uploadedUrl,
      };

      setFormData((prev) => {
        const newImages = [...prev.carousel_images, newSlide];
        setActiveImageIndex(newImages.length - 1);
        return { ...prev, carousel_images: newImages };
      });

      showToast('Image uploaded to gallery successfully!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = formData.carousel_images.filter(
      (_, idx) => idx !== indexToRemove
    );
    setFormData((prev) => ({ ...prev, carousel_images: updated }));

    if (activeImageIndex >= updated.length) {
      setActiveImageIndex(Math.max(0, updated.length - 1));
    }
    showToast('Image removed from gallery.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePowerBackupOverview(formData);
      showToast('Power Backup overview saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Power Backup overview:', err);
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

  const activeImage = formData.carousel_images[activeImageIndex] || null;

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

      {/* PAGE HEADER */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Power Backup Systems Overview Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit narrative paragraphs and manage product image gallery/thumbnails.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MAIN CONTAINER */}
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            OVERVIEW CONTENT & GALLERY IMAGES
          </h2>

          {/* PARAGRAPH 1 */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 1 (PRIMARY DESCRIPTION)
            </label>
            <textarea
              name="paragraph_1"
              rows={4}
              value={formData.paragraph_1}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none"
              placeholder="Control, safety, and communication systems must stay powered..."
              required
            />
          </div>

          {/* PARAGRAPH 2 */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 2 (SECONDARY / SCOPE DETAILS)
            </label>
            <textarea
              name="paragraph_2"
              rows={3}
              value={formData.paragraph_2}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none"
              placeholder="Our scope covers UPS systems, Battery Charger and battery bank systems..."
            />
          </div>

          {/* GALLERY CONTAINER CARD */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h3 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              PRODUCT IMAGES / CAROUSEL GALLERY
            </h3>

            {/* MAIN IMAGE PREVIEW BOX */}
            <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#f1f5f9] p-6">
              {activeImage && activeImage.image_url ? (
                <>
                  <img
                    src={activeImage.image_url}
                    alt={activeImage.title || 'Main Preview'}
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
                {formData.carousel_images.map((img, index) => {
                  const isActive = activeImageIndex === index;
                  return (
                    <div
                      key={img.id || index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative flex h-40 w-40 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border-2 bg-white p-2.5 transition ${
                        isActive
                          ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="flex h-20 w-full items-center justify-center overflow-hidden">
                        {img.image_url ? (
                          <img
                            src={img.image_url}
                            alt={img.title || `Thumbnail ${index + 1}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            No Img
                          </span>
                        )}
                      </div>

                      {/* Title Input */}
                      <input
                        type="text"
                        value={img.title || ''}
                        onChange={(e) =>
                          handleTitleChange(index, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-full truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 focus:bg-white focus:outline-none"
                        placeholder="Image name"
                      />

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
                  className="flex h-40 w-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-white p-4 transition hover:border-sky-400 hover:bg-slate-50"
                >
                  <span className="text-2xl font-extrabold text-indigo-500">
                    +
                  </span>
                  <span className="mt-2 text-xs font-bold text-indigo-900">
                    {uploading ? 'Uploading...' : 'Add Image'}
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH OVERVIEW SECTION'}
        </button>
      </form>
    </div>
  );
};

export default PowerBackupOverviewEditor;