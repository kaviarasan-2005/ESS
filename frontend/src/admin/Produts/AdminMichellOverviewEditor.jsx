import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchMichellOverview,
  updateMichellOverview,
  uploadImageFile,
} from '../../services/api';

const AdminMichellOverviewEditor = () => {
  const [formData, setFormData] = useState({
    paragraph_1: '',
    paragraph_2: '',
    main_image_url: '',
    image_url: '',
    images: [], // List of { url, caption }
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMichellOverview()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          const rawImages = content.images || [];
          let formattedImages = rawImages.map((img) =>
            typeof img === 'string' ? { url: img, caption: '' } : img
          );

          // Standardize legacy image_url into main_image_url
          const activeMain =
            content.main_image_url || content.image_url || formattedImages[0]?.url || '';

          // Ensure main image exists inside images list if missing
          if (activeMain && !formattedImages.some((i) => i.url === activeMain)) {
            formattedImages.unshift({ url: activeMain, caption: '' });
          }

          setFormData({
            ...content,
            paragraph_1: content.paragraph_1 || '',
            paragraph_2: content.paragraph_2 || '',
            main_image_url: activeMain,
            image_url: activeMain,
            images: formattedImages,
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Michell overview:', err);
        showToast('Failed to load Michell overview details.', 'error');
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

      const newImageItem = { url: uploadedUrl, caption: file.name.split('.')[0] };

      setFormData((prev) => {
        const updatedImages = [...prev.images, newImageItem];
        return {
          ...prev,
          images: updatedImages,
          main_image_url: prev.main_image_url || uploadedUrl,
          image_url: prev.main_image_url || uploadedUrl,
        };
      });

      showToast('Image added to gallery!', 'success');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload image file.', 'error');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectMainImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      main_image_url: url,
      image_url: url,
    }));
  };

  // Remove active/main image explicitly
  const handleRemoveMainImage = () => {
    setFormData((prev) => {
      const remainingImages = prev.images.filter((img) => img.url !== prev.main_image_url);
      const newMain = remainingImages[0]?.url || '';

      return {
        ...prev,
        main_image_url: newMain,
        image_url: newMain,
        images: remainingImages,
      };
    });
    showToast('Main image removed.', 'info');
  };

  // Remove specific thumbnail from list
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const targetUrl = prev.images[indexToRemove]?.url;
      const updatedImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      const isMainRemoved = prev.main_image_url === targetUrl;
      const nextMain = isMainRemoved ? updatedImages[0]?.url || '' : prev.main_image_url;

      return {
        ...prev,
        images: updatedImages,
        main_image_url: nextMain,
        image_url: nextMain,
      };
    });
    showToast('Image removed.', 'info');
  };

  const handleCaptionChange = (index, caption) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = { ...updatedImages[index], caption };
      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateMichellOverview(formData);
      showToast('Michell overview updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Michell overview:', err);
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
          Michell Instruments Overview Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit company introduction text paragraphs and image gallery/thumbnails.
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
              PARAGRAPH 1 (PRIMARY DESCRIPTION)
            </label>
            <textarea
              name="paragraph_1"
              rows={4}
              value={formData.paragraph_1 || ''}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="From optimizing industrial gas processing..."
              required
            />
          </div>

          {/* PARAGRAPH 2 */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PARAGRAPH 2 (SECONDARY / PRODUCT OFFERINGS)
            </label>
            <textarea
              name="paragraph_2"
              rows={3}
              value={formData.paragraph_2 || ''}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="We supply a comprehensive range of..."
            />
          </div>

          {/* GALLERY & MAIN DISPLAY SECTION */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase">
              Product Images / Carousel Gallery
            </h3>

            {/* MAIN IMAGE DISPLAY PREVIEW WITH REMOVE BUTTON */}
            <div>
              {/* <div className="mb-2 flex items-center justify-between">
                <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Active / Main Preview Image
                </label>
                {formData.main_image_url && (
                  <button
                    type="button"
                    onClick={handleRemoveMainImage}
                    className="cursor-pointer text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline"
                  >
                    Remove Active Image
                  </button>
                )}
              </div> */}

              <div className="relative flex h-64 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#f4f6f8] p-4 text-center">
                {formData.main_image_url ? (
                  <>
                    <img
                      src={formData.main_image_url}
                      alt="Main Overview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveMainImage}
                      className="absolute top-3 right-3 cursor-pointer rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">
                    No main image selected
                  </span>
                )}
              </div>
            </div>

            {/* THUMBNAILS LIST & ADD NEW IMAGE */}
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Uploaded Images Gallery (Click thumbnail to set as main view)
              </label>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {formData.images.map((img, idx) => {
                  const isMain = formData.main_image_url === img.url;
                  return (
                    <div
                      key={idx}
                      className={`group relative flex flex-col items-center rounded-xl border p-2 transition ${
                        isMain
                          ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div
                        onClick={() => handleSelectMainImage(img.url)}
                        className="relative flex h-24 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white"
                      >
                        <img
                          src={img.url}
                          alt={img.caption || `Thumbnail ${idx + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* CAPTION EDIT INPUT */}
                      <input
                        type="text"
                        value={img.caption || ''}
                        onChange={(e) => handleCaptionChange(idx, e.target.value)}
                        placeholder="Image Caption"
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white p-1 text-[11px] text-slate-700 focus:border-blue-500 focus:outline-none"
                      />

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="mt-2 text-[10px] font-bold text-rose-600 hover:text-rose-800"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}

                {/* UPLOAD TILE */}
                <div
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-white p-3 transition hover:border-sky-400 hover:bg-slate-50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <span className="text-xl">➕</span>
                  <span className="mt-1 text-center text-[11px] font-bold text-slate-600">
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
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH OVERVIEW SECTION'}
        </button>
      </form>
    </div>
  );
};

export default AdminMichellOverviewEditor;