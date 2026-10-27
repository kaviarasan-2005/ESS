import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHomeProducts, updateHomeProducts } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const AdminProductsEditor = () => {
  const [formData, setFormData] = useState({
    tagline: 'MANUFACTURED HARDWARE',
    title: 'Our Products',
    description: 'Engineered to withstand extreme pressures, harsh corrosive environments, and intensive manufacturing duty cycles.',
    items: []
  });
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomeProducts()
      .then((res) => {
        const payload = res?.data || res || {};
        const sec = payload.products || payload.products_section || payload;
        setFormData({
          tagline: sec.tagline || 'MANUFACTURED HARDWARE',
          title: sec.title || 'Our Products',
          description: sec.description || '',
          items: sec.items || []
        });
      })
      .catch((err) => console.error('Error loading products:', err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHomeProducts(formData);
      showToast('Products section updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update Products section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleItemChange = (idx, field, val) => {
    const updated = [...formData.items];
    updated[idx][field] = val;
    setFormData({ ...formData, items: updated });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: `prod-${Date.now()}`,
          title: 'New Industrial Product',
          description: 'Product detail description line...',
          spec_code: 'ISO 9001 Spec',
          image_url: '',
          btn_text: 'View Details',
          details_url: '/products'
        }
      ]
    });
  };

  const handleRemoveItem = (idx) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Products Section Manager</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage section headers and product cards shown on the home page.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* HEADER CONTROLS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Header Content</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>
        </div>

        {/* PRODUCT CARDS LIST */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Product Cards ({formData.items.length})</h3>
            <button type="button" onClick={handleAddItem} className="text-xs font-bold text-blue-600 hover:underline">
              + Add Product Card
            </button>
          </div>

          {formData.items.map((item, idx) => (
            <div key={item.id || idx} className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Product #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-[10px] font-bold text-rose-600 hover:underline"
                >
                  Delete Card
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Spec Code (Bottom Left)</label>
                  <input
                    type="text"
                    value={item.spec_code || ''}
                    onChange={(e) => handleItemChange(idx, 'spec_code', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-medium"
                />
              </div>

              {/* DYNAMIC BUTTON TEXT & URL INPUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder="View Details"
                    value={item.btn_text || ''}
                    onChange={(e) => handleItemChange(idx, 'btn_text', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-semibold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Link / URL</label>
                  <input
                    type="text"
                    placeholder="/products or https://..."
                    value={item.details_url || item.btn_url || ''}
                    onChange={(e) => handleItemChange(idx, 'details_url', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-semibold bg-white"
                  />
                </div>
              </div>

              {/* IMAGE UPLOADER */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex-1 w-full">
                  <ImageUploader
                    label="Product Image URL"
                    value={item.image_url || ''}
                    onChange={(url) => handleItemChange(idx, 'image_url', url)}
                  />
                </div>
                <div className="w-full sm:w-24 h-16 bg-slate-900 rounded border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] text-slate-400 font-bold">No Image</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl shadow-sm text-xs transition-all cursor-pointer"
        >
          {saving ? 'Publishing Updates...' : 'Save & Publish Products Section'}
        </button>

      </form>
    </div>
  );
};

export default AdminProductsEditor;
