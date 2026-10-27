import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchAfterSalesWhyUs,
  updateAfterSalesWhyUs,
} from '../../services/projectsServices';

const DEFAULT_WHY_US = {
  industries_title: 'Industries Served',
  industries: ['Oil & Gas', 'Petrochemical', 'Power Generation', 'Water & Utilities'],
  why_title: 'Why Choose Us',
  why_description:
    'As the authorised local channel partner for the instrumentation and analyser brands we represent, ESS Saudi delivers factory certified after-sales and warranty services across the Kingdom. Clients benefit from reduced equipment downtime, faster response, and the confidence of OEM standard service without the delays and costs associated with routing support requests through overseas manufacturers.',
};

const AdminAfterSalesWhyUsEditor = () => {
  const [formData, setFormData] = useState(DEFAULT_WHY_US);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchAfterSalesWhyUs()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const hasIndustries = Array.isArray(payload.industries);

        setFormData({
          industries_title: payload.industries_title ?? DEFAULT_WHY_US.industries_title,
          industries: hasIndustries ? payload.industries : DEFAULT_WHY_US.industries,
          why_title: payload.why_title ?? DEFAULT_WHY_US.why_title,
          why_description: payload.why_description ?? DEFAULT_WHY_US.why_description,
        });
      })
      .catch((err) => {
        console.error('Failed to load After-Sales Why Us section:', err);
        showToast('Failed to load details.', 'error');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIndustryChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.industries];
      updated[index] = value;
      return { ...prev, industries: updated };
    });
  };

  const handleAddIndustry = () => {
    setFormData((prev) => ({
      ...prev,
      industries: [...prev.industries, 'New Industry'],
    }));
  };

  const handleRemoveIndustry = (index) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAfterSalesWhyUs(formData);
      showToast('After-Sales Why Choose Us section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save section:', err);
      showToast('Failed to save changes.', 'error');
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
          After-Sales Industries Served & Why Choose Us Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage industry pill tags and After-Sales value proposition content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          
          {/* INDUSTRIES SERVED CARD */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-500 border-b border-slate-100 pb-3">
              INDUSTRIES SERVED STRIP
            </h3>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                STRIP HEADING TITLE
              </label>
              <input
                type="text"
                name="industries_title"
                value={formData.industries_title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Industries Served"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between pb-2">
                <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  INDUSTRY PILL TAGS ({formData.industries.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddIndustry}
                  className="cursor-pointer rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                >
                  + Add Industry
                </button>
              </div>

              <div className="space-y-2.5">
                {formData.industries.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleIndustryChange(idx, e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIndustry(idx)}
                      className="cursor-pointer text-xs font-bold text-rose-600 hover:underline shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WHY CHOOSE US CARD */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-500 border-b border-slate-100 pb-3">
              WHY CHOOSE US BLOCK
            </h3>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                SECTION TITLE
              </label>
              <input
                type="text"
                name="why_title"
                value={formData.why_title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Why Choose Us"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                DESCRIPTION NARRATIVE
              </label>
              <textarea
                rows={4}
                name="why_description"
                value={formData.why_description}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="Enter narrative description..."
              />
            </div>
          </div>

        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH SECTION'}
        </button>
      </form>
    </div>
  );
};

export default AdminAfterSalesWhyUsEditor;