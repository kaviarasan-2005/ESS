import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchFireGasCapabilities,
  updateFireGasCapabilities,
} from '../../services/SystemsSolutions';

const FireGasCapEditor = () => {
  const [formData, setFormData] = useState({
    industries_title: 'Industries served',
    industries_list: [],
    why_title: 'Why ESS Saudi',
    why_description: '',
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFireGasCapabilities()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            industries_title: content.industries_title || 'Industries served',
            industries_list: content.industries_list || [],
            why_title: content.why_title || 'Why ESS Saudi',
            why_description: content.why_description || '',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Fire & Gas capabilities:', err);
        showToast('Failed to load capabilities content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* INDUSTRIES PILLS MANAGEMENT */
  const handleIndustryChange = (index, value) => {
    const updated = [...formData.industries_list];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, industries_list: updated }));
  };

  const handleAddIndustry = () => {
    setFormData((prev) => ({
      ...prev,
      industries_list: [...prev.industries_list, 'New Sector'],
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
      await updateFireGasCapabilities(formData);
      showToast('Fire & Gas Capabilities saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update capabilities section:', err);
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

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 font-sans shadow-xs">
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Fire & Gas Capabilities & Industries Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit industries served pill badges and the "Why ESS Saudi" narrative block.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: INDUSTRIES SERVED PILLS */}
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              1. INDUSTRIES SERVED PILLS
            </h2>
            <button
              type="button"
              onClick={handleAddIndustry}
              className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              + Add Pill
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION HEADING
            </label>
            <input
              type="text"
              name="industries_title"
              value={formData.industries_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Industries served"
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
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
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

        {/* SECTION 2: WHY ESS SAUDI */}
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. WHY ESS SAUDI CONTENT
          </h2>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              HEADING
            </label>
            <input
              type="text"
              name="why_title"
              value={formData.why_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Why ESS Saudi"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              DESCRIPTION PARAGRAPH
            </label>
            <textarea
              name="why_description"
              rows={4}
              value={formData.why_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="ESS Saudi supplies fire and gas control systems..."
              required
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH CAPABILITIES SECTION'}
        </button>
      </form>
    </div>
  );
};

export default FireGasCapEditor;