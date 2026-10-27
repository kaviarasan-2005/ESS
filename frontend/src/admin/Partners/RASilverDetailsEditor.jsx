import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchRASilverDetails,
  updateRASilverDetails,
} from '../../services/api';

const RASilverDetailsEditor = () => {
  const [formData, setFormData] = useState({
    expertise_title: '',
    expertise_description: '',
    services_title: '',
    services_description: '',
    features: [],
    difference_title: '',
    difference_description: '',
    industries_title: '',
    industries_list: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRASilverDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            expertise_title: content.expertise_title || 'Certified Rockwell Automation Expertise',
            expertise_description: content.expertise_description || '',
            services_title: content.services_title || 'Our Rockwell Automation Services',
            services_description: content.services_description || '',
            features: content.features || [],
            difference_title: content.difference_title || 'The ESS-ME Difference',
            difference_description: content.difference_description || '',
            industries_title: content.industries_title || 'Industries We Serve',
            industries_list: content.industries_list || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load RA Silver details:', err);
        showToast('Failed to load details content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* FEATURES MANAGEMENT */
  const handleFeatureChange = (index, field, value) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        { id: `feat_${Date.now()}`, title: 'New Service Block', description: 'Description...' },
      ],
    }));
  };

  const handleRemoveFeature = (index) => {
    const updated = formData.features.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, features: updated }));
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
      industries_list: [...prev.industries_list, 'New Industry Sector'],
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
      await updateRASilverDetails(formData);
      showToast('RA Silver details updated successfully!', 'success');
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
          RA Silver Details Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage Rockwell certification overview, automation services, safety difference description, and target industries.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: CERTIFIED EXPERTISE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. CERTIFIED ROCKWELL AUTOMATION EXPERTISE
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="expertise_title"
              value={formData.expertise_title}
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
              name="expertise_description"
              rows={4}
              value={formData.expertise_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 2: SERVICES & FEATURES */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              2. OUR SERVICES & FEATURE BLOCKS
            </h2>
            <button
              type="button"
              onClick={handleAddFeature}
              className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              + Add Service Block
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION TITLE
            </label>
            <input
              type="text"
              name="services_title"
              value={formData.services_title}
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
              name="services_description"
              rows={3}
              value={formData.services_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-4 pt-2">
            {formData.features.map((feat, index) => (
              <div key={feat.id || index} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    SERVICE BLOCK #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="rounded-lg bg-rose-600/10 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      BLOCK TITLE
                    </label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      BLOCK DESCRIPTION
                    </label>
                    <textarea
                      rows={5}
                      value={feat.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: THE ESS-ME DIFFERENCE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. THE ESS-ME DIFFERENCE
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="difference_title"
              value={formData.difference_title}
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
              name="difference_description"
              rows={3}
              value={formData.difference_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 4: INDUSTRIES WE SERVE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              4. INDUSTRIES WE SERVE
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

export default RASilverDetailsEditor;