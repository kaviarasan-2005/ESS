import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchMichellCTA,
  updateMichellCTA,
} from '../../services/api';

const MichellCTAEditor = () => {
  const [formData, setFormData] = useState({
    title: 'Need the right analyzer for your application?',
    subtitle: '',
    button_text: 'Contact Us',
    button_link: '/contact',
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMichellCTA()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            title:
              content.title ||
              'Need the right analyzer for your application?',
            subtitle: content.subtitle || '',
            button_text: content.button_text || 'Contact Us',
            button_link: content.button_link || '/contact',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Michell CTA:', err);
        showToast('Failed to load CTA details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateMichellCTA(formData);
      showToast('Michell CTA section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Michell CTA:', err);
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
          Michell CTA Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit call-to-action title, instruction paragraph, button label, and page redirect URL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            CTA CONTENT & BUTTON CONFIGURATION
          </h2>

          {/* MAIN TITLE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              CTA HEADING TITLE
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Need the right analyzer for your application?"
              required
            />
          </div>

          {/* SUBTITLE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              INSTRUCTION SUBTITLE
            </label>
            <textarea
              name="subtitle"
              rows={3}
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Tell us your gas, pressure, and measurement range..."
              required
            />
          </div>

          {/* BUTTON FIELDS GRID */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                BUTTON TEXT
              </label>
              <input
                type="text"
                name="button_text"
                value={formData.button_text}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="Contact Us"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                REDIRECT ROUTE / LINK
              </label>
              <input
                type="text"
                name="button_link"
                value={formData.button_link}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="/contact"
                required
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH CTA SECTION'}
        </button>
      </form>
    </div>
  );
};

export default MichellCTAEditor;