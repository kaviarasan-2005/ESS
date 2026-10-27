import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchEmersonDetails, updateEmersonDetails } from '../../services/api';

const AdminEmersonDetailsEditor = () => {
  const [formData, setFormData] = useState({
    trusted_title: '',
    trusted_subtitle: '',
    trusted_description: '',
    capabilities_title: '',
    capabilities_description: '',
    deltav_title: '',
    deltav_description: '',
    plc_scada_title: '',
    plc_scada_description: '',
    sis_title: '',
    sis_description: '',
    implementation_title: '',
    implementation_description: '',
    industries_title: '',
    industry_items: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmersonDetails()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        setFormData({
          trusted_title: payload.trusted_title || 'Trusted Emerson Automation in Qatar',
          trusted_subtitle: payload.trusted_subtitle || '',
          trusted_description: payload.trusted_description || '',
          capabilities_title: payload.capabilities_title || 'Our Emerson Service Capabilities',
          capabilities_description: payload.capabilities_description || '',
          deltav_title: payload.deltav_title || 'DeltaV Distributed Control System (DCS) Integration',
          deltav_description: payload.deltav_description || '',
          plc_scada_title: payload.plc_scada_title || 'PLC & SCADA System Implementation',
          plc_scada_description: payload.plc_scada_description || '',
          sis_title: payload.sis_title || 'Safety Instrumented System (SIS) Design',
          sis_description: payload.sis_description || '',
          implementation_title: payload.implementation_title || 'Integrated Emerson Technology: Implementation & Beyond',
          implementation_description: payload.implementation_description || '',
          industries_title: payload.industries_title || 'Industries we Serve',
          industry_items: payload.industry_items || [
            { name: 'Oil & Gas', description: 'Upstream production platforms, midstream pipelines, and refinery process control.' },
            { name: 'Power Generation', description: 'Plant-wide DCS for conventional and renewable power facilities.' },
            { name: 'Water & Wastewater', description: 'Plant automation and SCADA for pumping stations and treatment plants.' },
            { name: 'Chemical & Petrochemical', description: 'Complex batch and continuous process control.' },
          ],
        });
      })
      .catch((err) => {
        console.error('Error fetching Emerson Details:', err);
        showToast('Failed to load Emerson details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // Industry Items Handlers
  const handleIndustryChange = (index, field, value) => {
    const updated = [...(formData.industry_items || [])];
    updated[index][field] = value;
    setFormData({ ...formData, industry_items: updated });
  };

  const handleAddIndustry = () => {
    setFormData({
      ...formData,
      industry_items: [...(formData.industry_items || []), { name: '', description: '' }],
    });
  };

  const handleRemoveIndustry = (index) => {
    const updated = (formData.industry_items || []).filter((_, i) => i !== index);
    setFormData({ ...formData, industry_items: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateEmersonDetails(formData);
      showToast('Emerson Details section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Emerson details:', err);
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
          Emerson Capabilities & Details Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit service capabilities, DCS, SIS, PLC/SCADA sections, and industry list.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. TRUSTED AUTOMATION */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. Trusted Emerson Automation Header
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
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">SUBTITLE / TAGLINE</label>
            <input
              type="text"
              value={formData.trusted_subtitle || ''}
              onChange={(e) => setFormData({ ...formData, trusted_subtitle: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
            <textarea
              rows={4}
              value={formData.trusted_description || ''}
              onChange={(e) => setFormData({ ...formData, trusted_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 2. SERVICE CAPABILITIES */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. Our Service Capabilities
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.capabilities_title || ''}
              onChange={(e) => setFormData({ ...formData, capabilities_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
            <textarea
              rows={3}
              value={formData.capabilities_description || ''}
              onChange={(e) => setFormData({ ...formData, capabilities_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 3. DELTAV DCS INTEGRATION */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. DeltaV DCS Integration
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.deltav_title || ''}
              onChange={(e) => setFormData({ ...formData, deltav_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
            <textarea
              rows={4}
              value={formData.deltav_description || ''}
              onChange={(e) => setFormData({ ...formData, deltav_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 4. PLC & SCADA SYSTEM */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            4. PLC & SCADA System Implementation
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.plc_scada_title || ''}
              onChange={(e) => setFormData({ ...formData, plc_scada_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
            <textarea
              rows={4}
              value={formData.plc_scada_description || ''}
              onChange={(e) => setFormData({ ...formData, plc_scada_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 5. SAFETY INSTRUMENTED SYSTEM (SIS) */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            5. Safety Instrumented System (SIS) Design
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.sis_title || ''}
              onChange={(e) => setFormData({ ...formData, sis_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
            <textarea
              rows={4}
              value={formData.sis_description || ''}
              onChange={(e) => setFormData({ ...formData, sis_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 6. IMPLEMENTATION & BEYOND */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            6. Implementation & Beyond
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.implementation_title || ''}
              onChange={(e) => setFormData({ ...formData, implementation_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</label>
            <textarea
              rows={3}
              value={formData.implementation_description || ''}
              onChange={(e) => setFormData({ ...formData, implementation_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 7. INDUSTRIES WE SERVE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            7. Industries We Serve
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">SECTION TITLE</label>
            <input
              type="text"
              value={formData.industries_title || ''}
              onChange={(e) => setFormData({ ...formData, industries_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">INDUSTRY LIST ITEMS</label>
              <button
                type="button"
                onClick={handleAddIndustry}
                className="cursor-pointer text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-800"
              >
                + Add Industry
              </button>
            </div>

            {formData.industry_items?.map((ind, idx) => (
              <div key={idx} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Industry #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIndustry(idx)}
                    className="cursor-pointer rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={ind.name || ''}
                  onChange={(e) => handleIndustryChange(idx, 'name', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
                  placeholder="e.g., Oil & Gas"
                />
                <input
                  type="text"
                  value={ind.description || ''}
                  onChange={(e) => handleIndustryChange(idx, 'description', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                  placeholder="e.g., Upstream production platforms..."
                />
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH EMERSON DETAILS'}
        </button>
      </form>
    </div>
  );
};

export default AdminEmersonDetailsEditor;