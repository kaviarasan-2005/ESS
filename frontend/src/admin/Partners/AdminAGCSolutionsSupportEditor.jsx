import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const AdminAGCSolutionsSupportEditor = () => {
  const [formData, setFormData] = useState({
    precision_title: '',
    precision_description: '',
    solutions_title: '',
    solutions_description: '',
    product_cards: [],
    support_title: '',
    support_description: '',
    support_items: [],
    industries_title: '',
    industry_items: []
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    axios
      .get(`${API_BASE_URL}/api/agc-instruments/solutions-support`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        if (res.data?.data) {
          setFormData(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching AGC Solutions & Support:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_BASE_URL}/api/agc-instruments/solutions-support`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('AGC Solutions & Support section updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update section:', err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Item Helpers for Integration & Service Support
  const addSupportItem = () => {
    setFormData((prev) => ({
      ...prev,
      support_items: [...(prev.support_items || []), { title: '', description: '' }]
    }));
  };

  const removeSupportItem = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      support_items: prev.support_items.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Dynamic Item Helpers for Key Industries
  const addIndustryItem = () => {
    setFormData((prev) => ({
      ...prev,
      industry_items: [...(prev.industry_items || []), { title: '', description: '' }]
    }));
  };

  const removeIndustryItem = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      industry_items: prev.industry_items.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Solutions & Support Editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AGC Solutions & Support Section Editor</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage headings, solution cards, integration services, and key industries list.
        </p>
      </div>


      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. PRECISION GAS ANALYSIS */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            1. Precision Gas Analysis
          </h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.precision_title}
              onChange={(e) => setFormData({ ...formData, precision_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.precision_description}
              onChange={(e) => setFormData({ ...formData, precision_description: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* 2. AGC PRODUCT SOLUTIONS */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">2. Product Solutions</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.solutions_title}
              onChange={(e) => setFormData({ ...formData, solutions_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sub-description</label>
            <textarea
              rows={3}
              value={formData.solutions_description}
              onChange={(e) => setFormData({ ...formData, solutions_description: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>

          {/* PRODUCT CARDS */}
          <div className="space-y-3 pt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">
              Product Cards ({formData.product_cards?.length || 0})
            </label>
            {formData.product_cards?.map((card, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => {
                    const updated = [...formData.product_cards];
                    updated[idx].title = e.target.value;
                    setFormData({ ...formData, product_cards: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  placeholder="Card Title"
                />
                <textarea
                  rows={3}
                  value={card.description}
                  onChange={(e) => {
                    const updated = [...formData.product_cards];
                    updated[idx].description = e.target.value;
                    setFormData({ ...formData, product_cards: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="Card Description"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. INTEGRATION & SERVICE SUPPORT */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              3. Integration & Service Support
            </h2>
            <button
              type="button"
              onClick={addSupportItem}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-all"
            >
              + Add Support Item
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.support_title}
              onChange={(e) => setFormData({ ...formData, support_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>

          {/* SUPPORT BULLET ITEMS */}
          <div className="space-y-3 pt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">
              Support Services ({formData.support_items?.length || 0})
            </label>
            {formData.support_items?.map((item, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSupportItem(idx)}
                    className="text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                  >
                    Delete Item
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...formData.support_items];
                    updated[idx].title = e.target.value;
                    setFormData({ ...formData, support_items: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  placeholder="Service Title"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...formData.support_items];
                    updated[idx].description = e.target.value;
                    setFormData({ ...formData, support_items: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="Service Description"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 4. KEY INDUSTRIES */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              4. Key Industries
            </h2>
            <button
              type="button"
              onClick={addIndustryItem}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-all"
            >
              + Add Industry Item
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.industries_title}
              onChange={(e) => setFormData({ ...formData, industries_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>

          {/* INDUSTRY BULLET ITEMS */}
          <div className="space-y-3 pt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">
              Industry Items ({formData.industry_items?.length || 0})
            </label>
            {formData.industry_items?.map((item, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeIndustryItem(idx)}
                    className="text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                  >
                    Delete Item
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...formData.industry_items];
                    updated[idx].title = e.target.value;
                    setFormData({ ...formData, industry_items: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  placeholder="Industry Title"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...formData.industry_items];
                    updated[idx].description = e.target.value;
                    setFormData({ ...formData, industry_items: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH SOLUTIONS & SUPPORT SECTION'}
        </button>

      </form>
    </div>
  );
};

export default AdminAGCSolutionsSupportEditor;
