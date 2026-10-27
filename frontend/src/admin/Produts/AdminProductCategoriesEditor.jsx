import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchProductsPage, updateProductsSection, uploadImageFile } from '../../services/api';

const AVAILABLE_ICONS = ['Flame', 'Users', 'CircleDot', 'Layers', 'Share2'];

const AdminProductCategoriesEditor = () => {
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [items, setItems] = useState([]);

  // Fetch initial category cards from FastAPI backend
  useEffect(() => {
    fetchProductsPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};

        if (Array.isArray(payload.items)) {
          setItems(payload.items);
        }
      })
      .catch((err) => console.error('Error fetching Product Categories data:', err))
      .finally(() => setLoading(false));
  }, []);

  // Save items to backend
  const handleSaveCategories = async () => {
    setSaving(true);

    try {
      await updateProductsSection('items', items);
      showToast('Updated product categories successfully!', 'success');
    } catch (err) {
      console.error('Error saving categories:', err);
      showToast('Failed to update product categories.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Card Management Handlers
  const handleCardChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Remove uploaded image handler
  const handleRemoveImage = (index) => {
    handleCardChange(index, 'icon_url', '');
  };

  // Image Upload Handler for specific category card logo
  const handleLogoFileUpload = async (index, file) => {
    if (!file) return;

    setUploadingIndex(index);
    try {
      const res = await uploadImageFile(file);
      const imageUrl = res?.url || res?.image_url || res?.data?.url || '';

      if (imageUrl) {
        handleCardChange(index, 'icon_url', imageUrl);
        showToast('Category logo uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to upload logo image:', err);
      showToast('Failed to upload logo image.', 'error');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleAddCard = () => {
    setItems([
      ...items,
      {
        id: `prod-${Date.now()}`,
        title: 'New Product Category',
        icon_name: 'Flame',
        icon_url: '',
        button_text: 'KNOW MORE',
        button_link: '/products/new',
      },
    ]);
    showToast('New category added.', 'success');
  };

  const handleRemoveCard = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    showToast('Category card removed.', 'info');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Category Settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Categories Editor</h1>
          <p className="text-xs text-slate-500">
            Manage product category cards, logo uploads, icons, titles, and button URLs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCard}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm"
        >
          + Add Category
        </button>
      </div>

      {/* FEEDBACK NOTIFICATION */}

      {/* CATEGORY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((card, idx) => (
          <div
            key={card.id || idx}
            className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm relative"
          >
            <button
              type="button"
              onClick={() => handleRemoveCard(idx)}
              className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
            >
              Remove
            </button>

            {/* CATEGORY TITLE */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Category Title
              </label>
              <input
                type="text"
                value={card.title || ''}
                onChange={(e) => handleCardChange(idx, 'title', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* LOGO IMAGE UPLOAD & ENLARGED PREVIEW SECTION WITH REMOVE BUTTON */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Category Logo Image
                </label>

                {/* REMOVE IMAGE BUTTON */}
                {card.icon_url && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer transition-colors"
                  >
                    ✕ Remove Image
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Image Preview Box */}
                <div className="w-20 h-20 rounded-xl bg-white border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-2 relative group">
                  {card.icon_url ? (
                    <>
                      <img
                        src={card.icon_url}
                        alt={card.title}
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleCardChange(idx, 'icon_url', '');
                          showToast('Category logo removed.', 'info');
                        }}
                        className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow cursor-pointer opacity-90 hover:opacity-100"
                        title="Remove Logo"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase text-center leading-tight">
                      No Logo
                    </span>
                  )}
                </div>

                {/* Upload File Input */}
                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoFileUpload(idx, e.target.files?.[0])}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    disabled={uploadingIndex === idx}
                  />
                  {uploadingIndex === idx && (
                    <span className="text-xs text-blue-600 font-bold block animate-pulse">
                      Uploading image...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* LUCIDE ICON FALLBACK & BUTTON TEXT */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Lucide Icon (Fallback)
                </label>
                <select
                  value={card.icon_name || 'Flame'}
                  onChange={(e) => handleCardChange(idx, 'icon_name', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  {AVAILABLE_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={card.button_text || 'KNOW MORE'}
                  onChange={(e) => handleCardChange(idx, 'button_text', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* TARGET LINK */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                Target URL
              </label>
              <input
                type="text"
                value={card.button_link || ''}
                onChange={(e) => handleCardChange(idx, 'button_link', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                placeholder="/products/category-name"
              />
            </div>
          </div>
        ))}
      </div>

      {/* SAVE BUTTON */}
      <button
        type="button"
        disabled={saving || uploadingIndex !== null}
        onClick={handleSaveCategories}
        className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white text-xs font-bold py-4 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider"
      >
        {saving ? 'Saving Changes...' : 'Save Product Categories'}
      </button>

    </div>
  );
};

export default AdminProductCategoriesEditor;