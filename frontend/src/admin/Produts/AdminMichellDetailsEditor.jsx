import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchMichellDetails, updateMichellDetails } from '../../services/api';

const AdminMichellDetailsEditor = () => {
  const [formData, setFormData] = useState({
    section_title: 'Product Features & Specifications',
    features: [],
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMichellDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            section_title:
              content.section_title || 'Product Features & Specifications',
            features: content.features || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Michell details:', err);
        showToast('Failed to load Michell feature points.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTitleChange = (e) => {
    setFormData((prev) => ({ ...prev, section_title: e.target.value }));
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, 'New feature bullet point...'],
    }));
    showToast('New feature point added.', 'info');
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
    showToast('Feature point removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateMichellDetails(formData);
      showToast('Michell details section updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Michell details:', err);
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
        <span className="text-xs font-medium text-slate-500">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 font-sans shadow-xs">
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Michell Instruments Details Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit section heading and manage product feature bullet points.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION TITLE INPUT */}
        <div className="rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            MAIN SECTION HEADING
          </label>
          <input
            type="text"
            value={formData.section_title}
            onChange={handleTitleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
            placeholder="Product Features & Specifications"
            required
          />
        </div>

        {/* FEATURES BULLET LIST EDITOR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              FEATURE BULLET POINTS ({formData.features.length})
            </h2>
            <button
              type="button"
              onClick={handleAddFeature}
              className="cursor-pointer rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-sky-700"
            >
              + ADD NEW BULLET POINT
            </button>
          </div>

          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-2xs"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-600">
                  {index + 1}
                </span>

                <textarea
                  rows={2}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter feature bullet description..."
                  required
                />

                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="shrink-0 cursor-pointer rounded-lg bg-rose-600/10 px-3 py-2 text-[11px] font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white"
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

export default AdminMichellDetailsEditor;