import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchMichellInstrumentsDetails,
  updateMichellInstrumentsDetails,
} from '../../services/api';

const MichellDetailsEditor = () => {
  const [formData, setFormData] = useState({
    importance_title: '',
    importance_description: '',
    solutions_title: '',
    solutions_description: '',
    cards: [],
    support_title: '',
    support_intro: '',
    support_points: [],
    applications_title: '',
    applications_list: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMichellInstrumentsDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            importance_title: content.importance_title || 'Importance of Moisture Measurement',
            importance_description: content.importance_description || '',
            solutions_title: content.solutions_title || 'Our Michell Instruments Product Solutions',
            solutions_description: content.solutions_description || '',
            cards: content.cards || [],
            support_title: content.support_title || 'Expert Application Support',
            support_intro: content.support_intro || '',
            support_points: content.support_points || [],
            applications_title: content.applications_title || 'Typical Applications',
            applications_list: content.applications_list || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Michell Instruments details:', err);
        showToast('Failed to load details content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* FIXED 2 CARDS MANAGEMENT */
  const handleCardChange = (index, field, value) => {
    const updatedCards = [...formData.cards];
    updatedCards[index][field] = value;
    setFormData((prev) => ({ ...prev, cards: updatedCards }));
  };

  /* SUPPORT BULLETS */
  const handleSupportChange = (index, value) => {
    const updatedList = [...formData.support_points];
    updatedList[index] = value;
    setFormData((prev) => ({ ...prev, support_points: updatedList }));
  };

  const handleAddSupport = () => {
    setFormData((prev) => ({
      ...prev,
      support_points: [...prev.support_points, 'New Support Point: Description...'],
    }));
  };

  const handleRemoveSupport = (index) => {
    const updatedList = formData.support_points.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, support_points: updatedList }));
  };

  /* APPLICATIONS BULLETS */
  const handleApplicationChange = (index, value) => {
    const updatedList = [...formData.applications_list];
    updatedList[index] = value;
    setFormData((prev) => ({ ...prev, applications_list: updatedList }));
  };

  const handleAddApplication = () => {
    setFormData((prev) => ({
      ...prev,
      applications_list: [...prev.applications_list, 'New Application Sector: Description...'],
    }));
  };

  const handleRemoveApplication = (index) => {
    const updatedList = formData.applications_list.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, applications_list: updatedList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateMichellInstrumentsDetails(formData);
      showToast('Michell Instruments details updated successfully!', 'success');
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
          Michell Instruments Details Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage moisture measurement importance, 2 product solution cards, expert support points, and typical applications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: IMPORTANCE OF MOISTURE MEASUREMENT */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. IMPORTANCE OF MOISTURE MEASUREMENT
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="importance_title"
              value={formData.importance_title}
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
              name="importance_description"
              rows={3}
              value={formData.importance_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 2: FIXED 2 CARDS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. PRODUCT SOLUTIONS & CARDS (2 CARDS)
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SOLUTIONS TITLE
            </label>
            <input
              type="text"
              name="solutions_title"
              value={formData.solutions_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SOLUTIONS DESCRIPTION
            </label>
            <textarea
              name="solutions_description"
              rows={2}
              value={formData.solutions_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
            {formData.cards.map((card, index) => (
              <div key={card.id || index} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <span className="mb-2 block text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  CARD #{index + 1}
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      CARD TITLE
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      CARD DESCRIPTION
                    </label>
                    <textarea
                      rows={6}
                      value={card.description}
                      onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none resize-y"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: EXPERT APPLICATION SUPPORT */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              3. EXPERT APPLICATION SUPPORT BULLETS
            </h2>
            <button
              type="button"
              onClick={handleAddSupport}
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
              name="support_title"
              value={formData.support_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              INTRO SENTENCE
            </label>
            <input
              type="text"
              name="support_intro"
              value={formData.support_intro}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {formData.support_points.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleSupportChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSupport(index)}
                  className="rounded-lg bg-rose-600/10 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: TYPICAL APPLICATIONS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              4. TYPICAL APPLICATIONS
            </h2>
            <button
              type="button"
              onClick={handleAddApplication}
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
              name="applications_title"
              value={formData.applications_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            {formData.applications_list.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleApplicationChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveApplication(index)}
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

export default MichellDetailsEditor;