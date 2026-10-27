import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHyosungDetails, updateHyosungDetails } from '../../services/api';

const AdminHyosungDetailsEditor = () => {
  const [formData, setFormData] = useState({
    performance_title: 'Proven Hydraulic Performance for Industrial Applications',
    performance_description: '',
    portfolio_title: 'Our Hyosung Goodsprings Pump Portfolio',
    portfolio_description: '',
    card_one_title: 'Industrial Process & Plant Pumps',
    card_one_description: '',
    card_two_title: 'Water Supply, Circulation & Pressure Boosting Systems',
    card_two_description: '',
    support_title: 'Application-Focused Support',
    support_description: '',
    uses_title: 'Common Uses',
    uses_items: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHyosungDetails()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        setFormData({
          performance_title: payload.performance_title || 'Proven Hydraulic Performance for Industrial Applications',
          performance_description: payload.performance_description || '',
          portfolio_title: payload.portfolio_title || 'Our Hyosung Goodsprings Pump Portfolio',
          portfolio_description: payload.portfolio_description || '',
          card_one_title: payload.card_one_title || 'Industrial Process & Plant Pumps',
          card_one_description: payload.card_one_description || '',
          card_two_title: payload.card_two_title || 'Water Supply, Circulation & Pressure Boosting Systems',
          card_two_description: payload.card_two_description || '',
          support_title: payload.support_title || 'Application-Focused Support',
          support_description: payload.support_description || '',
          uses_title: payload.uses_title || 'Common Uses',
          uses_items: payload.uses_items || [],
        });
      })
      .catch((err) => {
        console.error('Error fetching Hyosung Details:', err);
        showToast('Failed to load Hyosung details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // List Handlers: Common Uses
  const handleUseChange = (index, value) => {
    const updated = [...(formData.uses_items || [])];
    updated[index] = value;
    setFormData({ ...formData, uses_items: updated });
  };

  const handleAddUse = () => {
    setFormData({
      ...formData,
      uses_items: [...(formData.uses_items || []), ''],
    });
  };

  const handleRemoveUse = (index) => {
    const updated = (formData.uses_items || []).filter((_, i) => i !== index);
    setFormData({ ...formData, uses_items: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHyosungDetails(formData);
      showToast('Hyosung Details section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Hyosung details:', err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 font-sans shadow-xs">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Hyosung Goodsprings Details Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit hydraulic performance headers, portfolio category cards, application support, and common uses list.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. PERFORMANCE OVERVIEW */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. Hydraulic Performance Overview
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">SECTION TITLE</label>
            <input
              type="text"
              value={formData.performance_title || ''}
              onChange={(e) => setFormData({ ...formData, performance_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION BODY</label>
            <textarea
              rows={3}
              value={formData.performance_description || ''}
              onChange={(e) => setFormData({ ...formData, performance_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 2. PORTFOLIO & CARDS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. Pump Portfolio & Category Cards
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">MAIN TITLE</label>
            <input
              type="text"
              value={formData.portfolio_title || ''}
              onChange={(e) => setFormData({ ...formData, portfolio_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">MAIN DESCRIPTION</label>
            <textarea
              rows={2}
              value={formData.portfolio_description || ''}
              onChange={(e) => setFormData({ ...formData, portfolio_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            {/* CARD 1 */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">CARD 1 TITLE (PROCESS PUMPS)</label>
              <input
                type="text"
                value={formData.card_one_title || ''}
                onChange={(e) => setFormData({ ...formData, card_one_title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
              />
              <label className="mt-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">CARD 1 DESCRIPTION</label>
              <textarea
                rows={4}
                value={formData.card_one_description || ''}
                onChange={(e) => setFormData({ ...formData, card_one_description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              />
            </div>

            {/* CARD 2 */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">CARD 2 TITLE (WATER & BOOSTING)</label>
              <input
                type="text"
                value={formData.card_two_title || ''}
                onChange={(e) => setFormData({ ...formData, card_two_title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
              />
              <label className="mt-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">CARD 2 DESCRIPTION</label>
              <textarea
                rows={4}
                value={formData.card_two_description || ''}
                onChange={(e) => setFormData({ ...formData, card_two_description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 3. APPLICATION-FOCUSED SUPPORT */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. Application-Focused Support
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.support_title || ''}
              onChange={(e) => setFormData({ ...formData, support_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION BODY</label>
            <textarea
              rows={3}
              value={formData.support_description || ''}
              onChange={(e) => setFormData({ ...formData, support_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 4. COMMON USES */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            4. Common Uses List
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">SECTION TITLE</label>
            <input
              type="text"
              value={formData.uses_title || ''}
              onChange={(e) => setFormData({ ...formData, uses_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">USE ITEMS</label>
              <button
                type="button"
                onClick={handleAddUse}
                className="cursor-pointer text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-800"
              >
                + Add Item
              </button>
            </div>

            {formData.uses_items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => handleUseChange(idx, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Power Generation: Boiler feed..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveUse(idx)}
                  className="shrink-0 cursor-pointer rounded-lg bg-rose-50 px-3 py-3 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
                >
                  Remove
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH HYOSUNG DETAILS'}
        </button>
      </form>
    </div>
  );
};

export default AdminHyosungDetailsEditor;