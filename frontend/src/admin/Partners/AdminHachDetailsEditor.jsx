import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHachDetails, updateHachDetails } from '../../services/api';

const AdminHachDetailsEditor = () => {
  const [formData, setFormData] = useState({
    trusted_title: 'Trusted Water Analysis Expertise',
    trusted_description: '',
    product_range_title: 'Our HACH Product Range',
    online_analyzers_title: 'Online Water Quality Analyzers',
    online_analyzers_description: '',
    portable_meters_title: 'Portable Meters & Lab Equipment',
    portable_meters_description: '',
    support_capabilities_title: 'Our HACH Support Capabilities',
    support_capabilities_description: '',
    applications_title: 'Critical Applications',
    application_items: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHachDetails()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        setFormData({
          trusted_title: payload.trusted_title || 'Trusted Water Analysis Expertise',
          trusted_description: payload.trusted_description || '',
          product_range_title: payload.product_range_title || 'Our HACH Product Range',
          online_analyzers_title: payload.online_analyzers_title || 'Online Water Quality Analyzers',
          online_analyzers_description: payload.online_analyzers_description || '',
          portable_meters_title: payload.portable_meters_title || 'Portable Meters & Lab Equipment',
          portable_meters_description: payload.portable_meters_description || '',
          support_capabilities_title: payload.support_capabilities_title || 'Our HACH Support Capabilities',
          support_capabilities_description: payload.support_capabilities_description || '',
          applications_title: payload.applications_title || 'Critical Applications',
          application_items: payload.application_items || [
            'Wastewater Treatment Plants',
            'Potable Water Monitoring',
            'Petrochemical and Chemical Processing',
            'Power Generation (boiler/feed water)',
            'Environmental Monitoring.',
          ],
        });
      })
      .catch((err) => {
        console.error('Error fetching HACH Details:', err);
        showToast('Failed to load HACH details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // Application List Handlers
  const handleApplicationChange = (index, value) => {
    const updated = [...(formData.application_items || [])];
    updated[index] = value;
    setFormData({ ...formData, application_items: updated });
  };

  const handleAddApplication = () => {
    setFormData({
      ...formData,
      application_items: [...(formData.application_items || []), ''],
    });
  };

  const handleRemoveApplication = (index) => {
    const updated = (formData.application_items || []).filter((_, i) => i !== index);
    setFormData({ ...formData, application_items: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHachDetails(formData);
      showToast('HACH Details section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update HACH details:', err);
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
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          HACH Details & Capabilities Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit expertise header, product ranges, support capabilities, and critical applications list.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. TRUSTED EXPERTISE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. Trusted Expertise Header
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.trusted_title || ''}
              onChange={(e) => setFormData({ ...formData, trusted_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
            <textarea
              rows={3}
              value={formData.trusted_description || ''}
              onChange={(e) => setFormData({ ...formData, trusted_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 2. PRODUCT RANGE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. Product Range & Categories
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">PRODUCT RANGE MAIN TITLE</label>
            <input
              type="text"
              value={formData.product_range_title || ''}
              onChange={(e) => setFormData({ ...formData, product_range_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            {/* ONLINE ANALYZERS */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">ONLINE ANALYZERS TITLE</label>
              <input
                type="text"
                value={formData.online_analyzers_title || ''}
                onChange={(e) => setFormData({ ...formData, online_analyzers_title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
              />
              <label className="mt-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
              <textarea
                rows={3}
                value={formData.online_analyzers_description || ''}
                onChange={(e) => setFormData({ ...formData, online_analyzers_description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              />
            </div>

            {/* PORTABLE METERS */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">PORTABLE METERS TITLE</label>
              <input
                type="text"
                value={formData.portable_meters_title || ''}
                onChange={(e) => setFormData({ ...formData, portable_meters_title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
              />
              <label className="mt-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
              <textarea
                rows={3}
                value={formData.portable_meters_description || ''}
                onChange={(e) => setFormData({ ...formData, portable_meters_description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 3. SUPPORT CAPABILITIES */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. Support Capabilities
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.support_capabilities_title || ''}
              onChange={(e) => setFormData({ ...formData, support_capabilities_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
            <textarea
              rows={3}
              value={formData.support_capabilities_description || ''}
              onChange={(e) => setFormData({ ...formData, support_capabilities_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 4. CRITICAL APPLICATIONS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            4. Critical Applications List
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">SECTION TITLE</label>
            <input
              type="text"
              value={formData.applications_title || ''}
              onChange={(e) => setFormData({ ...formData, applications_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">APPLICATION ITEMS</label>
              <button
                type="button"
                onClick={handleAddApplication}
                className="cursor-pointer text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-800"
              >
                + Add Item
              </button>
            </div>

            {formData.application_items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => handleApplicationChange(idx, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800"
                  placeholder="e.g., Wastewater Treatment Plants"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveApplication(idx)}
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH HACH DETAILS'}
        </button>
      </form>
    </div>
  );
};

export default AdminHachDetailsEditor;