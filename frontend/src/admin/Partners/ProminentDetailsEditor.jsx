import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchProminentMeteringDetails,
  updateProminentMeteringDetails,
} from '../../services/api';

const ProminentDetailsEditor = () => {
  const [formData, setFormData] = useState({
    header_title: '',
    header_description: '',
    range_title: '',
    range_description: '',
    categories: [],
    support_title: '',
    support_description: '',
    industries_title: '',
    industries_list: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProminentMeteringDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            header_title: content.header_title || 'Engineered Dosing Excellence with ProMinent Technology',
            header_description: content.header_description || '',
            range_title: content.range_title || 'Our ProMinent Product Range',
            range_description: content.range_description || '',
            categories: content.categories || [],
            support_title: content.support_title || "ESS-ME's Total Dosing System Support",
            support_description: content.support_description || '',
            industries_title: content.industries_title || 'Industries Served',
            industries_list: content.industries_list || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load ProMinent details:', err);
        showToast('Failed to load details content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* CATEGORIES MANAGEMENT */
  const handleCategoryChange = (index, field, value) => {
    const updated = [...formData.categories];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, categories: updated }));
  };

  const handleAddCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        { id: `cat_${Date.now()}`, title: 'New Category Title', description: 'Description...' },
      ],
    }));
  };

  const handleRemoveCategory = (index) => {
    const updated = formData.categories.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, categories: updated }));
  };

  /* INDUSTRIES MANAGEMENT */
  const handleIndustryChange = (index, value) => {
    const updated = [...formData.industries_list];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, industries_list: updated }));
  };

  const handleAddIndustry = () => {
    setFormData((prev) => ({
      ...prev,
      industries_list: [...prev.industries_list, 'New Industry Sector: Description...'],
    }));
  };

  const handleRemoveIndustry = (index) => {
    const updated = formData.industries_list.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, industries_list: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProminentMeteringDetails(formData);
      showToast('ProMinent details updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update details:', err);
      showToast(err.response?.data?.detail || 'Failed to save changes.', 'error');
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
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          ProMinent Details Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage dosing technology overview, product categories, total support description, and industries served.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: HEADER & INTRO */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. HEADER & INTRO
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="header_title"
              value={formData.header_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              DESCRIPTION
            </label>
            <textarea
              name="header_description"
              rows={3}
              value={formData.header_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 2: PRODUCT RANGE & CATEGORIES */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              2. PRODUCT RANGE & CATEGORIES
            </h2>
            <button
              type="button"
              onClick={handleAddCategory}
              className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              + Add Category
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION TITLE
            </label>
            <input
              type="text"
              name="range_title"
              value={formData.range_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION DESCRIPTION
            </label>
            <textarea
              name="range_description"
              rows={2}
              value={formData.range_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-4 pt-2">
            {formData.categories.map((cat, index) => (
              <div key={cat.id || index} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    CATEGORY #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(index)}
                    className="rounded-lg bg-rose-600/10 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      CATEGORY TITLE
                    </label>
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => handleCategoryChange(index, 'title', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      CATEGORY DESCRIPTION
                    </label>
                    <textarea
                      rows={3}
                      value={cat.description}
                      onChange={(e) => handleCategoryChange(index, 'description', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: TOTAL DOSING SYSTEM SUPPORT */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. TOTAL DOSING SYSTEM SUPPORT
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="support_title"
              value={formData.support_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              DESCRIPTION
            </label>
            <textarea
              name="support_description"
              rows={3}
              value={formData.support_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 4: INDUSTRIES SERVED */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              4. INDUSTRIES SERVED
            </h2>
            <button
              type="button"
              onClick={handleAddIndustry}
              className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              + Add Item
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="industries_title"
              value={formData.industries_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            {formData.industries_list.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleIndustryChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIndustry(index)}
                  className="rounded-lg bg-rose-600/10 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH DETAILS SECTION'}
        </button>
      </form>
    </div>
  );
};

export default ProminentDetailsEditor;