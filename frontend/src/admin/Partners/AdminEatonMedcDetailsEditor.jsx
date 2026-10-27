import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchEatonMedcDetails, updateEatonMedcDetails } from '../../services/api';

const AdminEatonMedcDetailsEditor = () => {
  const [formData, setFormData] = useState({
    safety_title: '',
    safety_description: '',
    range_title: '',
    range_description: '',
    product_cards: [],
    advantage_title: '',
    advantage_description: '',
    advantage_items: [],
    industries_title: '',
    industry_items: []
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEatonMedcDetails()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        setFormData({
          safety_title: payload.safety_title || 'Safety in Hazardous Environments',
          safety_description: payload.safety_description || '',
          range_title: payload.range_title || 'Our Eaton (MEDC) Product Range',
          range_description: payload.range_description || '',
          product_cards: payload.product_cards || [],
          advantage_title: payload.advantage_title || 'The ESS-ME Advantage: Your Safety Compliance Partner',
          advantage_description: payload.advantage_description || '',
          advantage_items: payload.advantage_items || [],
          industries_title: payload.industries_title || 'Industries Served',
          industry_items: payload.industry_items || []
        });
      })
      .catch((err) => {
        console.error('Error fetching Eaton MEDC Details:', err);
        showToast('Failed to load Eaton MEDC details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // --- ESS-ME ADVANTAGE HANDLERS ---
  const handleAddAdvantageItem = () => {
    setFormData((prev) => ({
      ...prev,
      advantage_items: [...(prev.advantage_items || []), { title: '', description: '' }]
    }));
  };

  const handleAdvantageItemChange = (index, field, value) => {
    const updated = [...(formData.advantage_items || [])];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, advantage_items: updated }));
  };

  const handleRemoveAdvantageItem = (index) => {
    const updated = (formData.advantage_items || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, advantage_items: updated }));
  };

  // --- INDUSTRIES SERVED HANDLERS ---
  const handleAddIndustryItem = () => {
    setFormData((prev) => ({
      ...prev,
      industry_items: [...(prev.industry_items || []), { title: '', description: '' }]
    }));
  };

  const handleIndustryItemChange = (index, field, value) => {
    const updated = [...(formData.industry_items || [])];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, industry_items: updated }));
  };

  const handleRemoveIndustryItem = (index) => {
    const updated = (formData.industry_items || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, industry_items: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateEatonMedcDetails(formData);
      showToast('Eaton MEDC Details saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Eaton MEDC details:', err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-6 font-sans">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Eaton MEDC Product Range & Details Editor</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage dynamic advantage points and industries served dynamically.
        </p>
      </div>


      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. SAFETY SECTION */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">1. Safety in Hazardous Environments</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.safety_title || ''}
              onChange={(e) => setFormData({ ...formData, safety_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.safety_description || ''}
              onChange={(e) => setFormData({ ...formData, safety_description: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-700"
            />
          </div>
        </div>

        {/* 2. PRODUCT RANGE SECTION & CARDS */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-5">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">2. Our Eaton (MEDC) Product Range</h2>
          
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Range Section Title</label>
              <input
                type="text"
                value={formData.range_title || ''}
                onChange={(e) => setFormData({ ...formData, range_title: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Range Section Description</label>
              <textarea
                rows={3}
                value={formData.range_description || ''}
                onChange={(e) => setFormData({ ...formData, range_description: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Product Cards List</label>
            {formData.product_cards?.map((card, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <input
                  type="text"
                  value={card.title || ''}
                  onChange={(e) => {
                    const updated = [...formData.product_cards];
                    updated[idx].title = e.target.value;
                    setFormData({ ...formData, product_cards: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  placeholder="Card Title"
                />
                <textarea
                  rows={3}
                  value={card.description || ''}
                  onChange={(e) => {
                    const updated = [...formData.product_cards];
                    updated[idx].description = e.target.value;
                    setFormData({ ...formData, product_cards: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                  placeholder="Card Description"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. ESS-ME ADVANTAGE (DYNAMIC ADD/REMOVE) */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">3. The ESS-ME Advantage</h2>
            <button
              type="button"
              onClick={handleAddAdvantageItem}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              + Add Advantage Item
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.advantage_title || ''}
              onChange={(e) => setFormData({ ...formData, advantage_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subtitle / Lead Text</label>
            <input
              type="text"
              value={formData.advantage_description || ''}
              onChange={(e) => setFormData({ ...formData, advantage_description: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-700"
            />
          </div>

          <div className="space-y-3 pt-2">
            {formData.advantage_items?.map((item, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAdvantageItem(idx)}
                    className="text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleAdvantageItemChange(idx, 'title', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  placeholder="Item Title (e.g. Area Classification Review)"
                />
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => handleAdvantageItemChange(idx, 'description', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                  placeholder="Item Description"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 4. INDUSTRIES SERVED (DYNAMIC ADD/REMOVE) */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">4. Industries Served</h2>
            <button
              type="button"
              onClick={handleAddIndustryItem}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              + Add Industry Item
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.industries_title || ''}
              onChange={(e) => setFormData({ ...formData, industries_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>

          <div className="space-y-3 pt-2">
            {formData.industry_items?.map((item, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Industry #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIndustryItem(idx)}
                    className="text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleIndustryItemChange(idx, 'title', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  placeholder="Industry Title (e.g. Oil & Gas)"
                />
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => handleIndustryItemChange(idx, 'description', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                  placeholder="Industry Description"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#031527] hover:bg-[#071d34] text-white text-xs font-bold py-4 rounded-xl shadow transition-all cursor-pointer uppercase tracking-wider"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH EATON MEDC DETAILS'}
        </button>

      </form>
    </div>
  );
};

export default AdminEatonMedcDetailsEditor;
