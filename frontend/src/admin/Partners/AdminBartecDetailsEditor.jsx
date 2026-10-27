import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchBartecDetails, updateBartecDetails } from '../../services/api';

const AdminBartecDetailsEditor = () => {
  const [formData, setFormData] = useState({
    trusted_title: '',
    trusted_description: '',
    solutions_title: '',
    solutions_description: '',
    shelters_title: '',
    shelters_description: '',
    sample_title: '',
    sample_description: '',
    advantage_title: '',
    advantage_description: '',
    advantage_items: [],
    applications_title: '',
    application_items: []
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBartecDetails()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        setFormData({
          trusted_title: payload.trusted_title || '',
          trusted_description: payload.trusted_description || '',
          solutions_title: payload.solutions_title || '',
          solutions_description: payload.solutions_description || '',
          shelters_title: payload.shelters_title || '',
          shelters_description: payload.shelters_description || '',
          sample_title: payload.sample_title || '',
          sample_description: payload.sample_description || '',
          advantage_title: payload.advantage_title || '',
          advantage_description: payload.advantage_description || '',
          advantage_items: payload.advantage_items || [],
          applications_title: payload.applications_title || 'Industry Applications',
          application_items: payload.application_items || [
            'Refineries',
            'Petrochemical and Gas Plants',
            'Chemical Processing Facilities'
          ]
        });
      })
      .catch((err) => {
        console.error('Error fetching Bartec Details:', err);
        showToast('Failed to load Bartec details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // Industry Application List Helpers
  const handleApplicationChange = (index, value) => {
    const updated = [...(formData.application_items || [])];
    updated[index] = value;
    setFormData({ ...formData, application_items: updated });
  };

  const handleAddApplication = () => {
    setFormData({
      ...formData,
      application_items: [...(formData.application_items || []), '']
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
      await updateBartecDetails(formData);
      showToast('Bartec Details section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Bartec details:', err);
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
    <div className="max-w-5xl mx-auto p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bartec Solutions & Details Editor</h1>
        <p className="text-xs text-slate-400 mt-1">
          Edit headings, product solutions, turnkey advantage bullet points, and industry applications.
        </p>
      </div>


      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. TRUSTED SOLUTIONS */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">1. Trusted Bartec Solutions</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.trusted_title || ''}
              onChange={(e) => setFormData({ ...formData, trusted_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.trusted_description || ''}
              onChange={(e) => setFormData({ ...formData, trusted_description: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* 2. PRODUCT & SERVICE SOLUTIONS */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">2. Product & Service Solutions</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.solutions_title || ''}
              onChange={(e) => setFormData({ ...formData, solutions_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.solutions_description || ''}
              onChange={(e) => setFormData({ ...formData, solutions_description: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* 3. ANALYZER SHELTERS */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">3. Analyzer Shelters & Houses</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.shelters_title || ''}
              onChange={(e) => setFormData({ ...formData, shelters_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.shelters_description || ''}
              onChange={(e) => setFormData({ ...formData, shelters_description: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* 4. SAMPLE CONDITIONING */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">4. Sample Conditioning Systems</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.sample_title || ''}
              onChange={(e) => setFormData({ ...formData, sample_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.sample_description || ''}
              onChange={(e) => setFormData({ ...formData, sample_description: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* 5. TURNKEY ADVANTAGE */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">5. The ESS-ME Turnkey Advantage</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.advantage_title || ''}
              onChange={(e) => setFormData({ ...formData, advantage_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
          <div className="space-y-3 pt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Advantage Items</label>
            {formData.advantage_items?.map((item, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => {
                    const updated = [...formData.advantage_items];
                    updated[idx].title = e.target.value;
                    setFormData({ ...formData, advantage_items: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  placeholder="Item Title"
                />
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => {
                    const updated = [...formData.advantage_items];
                    updated[idx].description = e.target.value;
                    setFormData({ ...formData, advantage_items: updated });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="Item Description"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 6. INDUSTRY APPLICATIONS (MISSING SECTION ADDED) */}
        <div className="p-6 bg-[#f8fafc] border border-slate-200/70 rounded-2xl space-y-4">
          <h2 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">6. Industry Applications</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Section Title</label>
            <input
              type="text"
              value={formData.applications_title || ''}
              onChange={(e) => setFormData({ ...formData, applications_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold"
              placeholder="Industry Applications"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Application Items</label>
              <button
                type="button"
                onClick={handleAddApplication}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                + Add Application
              </button>
            </div>

            {formData.application_items?.map((appItem, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={appItem}
                  onChange={(e) => handleApplicationChange(idx, e.target.value)}
                  className="flex-1 p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  placeholder={`e.g., Refineries`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveApplication(idx)}
                  className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
          className="w-full bg-[#031527] hover:bg-[#071d34] text-white text-xs font-bold py-4 rounded-xl shadow transition-all cursor-pointer uppercase tracking-wider"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH BARTEC DETAILS'}
        </button>

      </form>
    </div>
  );
};

export default AdminBartecDetailsEditor;
