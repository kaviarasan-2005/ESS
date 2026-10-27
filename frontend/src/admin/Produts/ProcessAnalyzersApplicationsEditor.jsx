import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchProcessAnalyzersApplications,
  updateProcessAnalyzersApplications,
} from '../../services/api';

const ProcessAnalyzersApplicationsEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Key Applications',
    applications_list: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProcessAnalyzersApplications()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            title: content.title || 'Key Applications',
            applications_list: content.applications_list || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Process Analyzers applications:', err);
        showToast('Failed to load applications content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* BULLETS MANAGEMENT */
  const handleItemChange = (index, value) => {
    const updated = [...formData.applications_list];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, applications_list: updated }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      applications_list: [
        ...prev.applications_list,
        'New application requirement point...',
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    const updated = formData.applications_list.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, applications_list: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProcessAnalyzersApplications(formData);
      showToast('Key Applications section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update applications section:', err);
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
          Process Analyzers Key Applications Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit section title and manage key application bullet points.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            APPLICATIONS CONTENT & BULLETS
          </h2>

          {/* TITLE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION TITLE
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Key Applications"
              required
            />
          </div>

          {/* APPLICATION BULLETS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                APPLICATION BULLET POINTS
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
              >
                + Add Bullet
              </button>
            </div>

            {formData.applications_list.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="rounded-lg bg-rose-600/10 px-3 py-3 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
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
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH APPLICATIONS SECTION'}
        </button>
      </form>
    </div>
  );
};

export default ProcessAnalyzersApplicationsEditor;