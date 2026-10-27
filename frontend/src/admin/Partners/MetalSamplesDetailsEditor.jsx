import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchMetalSamplesDetails,
  updateMetalSamplesDetails,
} from '../../services/api';

const MetalSamplesDetailsEditor = () => {
  const [formData, setFormData] = useState({
    global_title: '',
    global_description: '',
    range_title: '',
    range_description: '',
    cards: [],
    advantage_title: '',
    advantage_intro: '',
    advantage_points: [],
    industries_title: '',
    industries_list: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMetalSamplesDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            global_title: content.global_title || 'Global Standard in Corrosion/Erosion Monitoring',
            global_description: content.global_description || '',
            range_title: content.range_title || 'Our Metal Samples Product Range',
            range_description: content.range_description || '',
            cards: content.cards || [],
            advantage_title: content.advantage_title || 'ESS-ME Advantage: From Data to Decision',
            advantage_intro: content.advantage_intro || '',
            advantage_points: content.advantage_points || [],
            industries_title: content.industries_title || 'Industries Reliant on This Technology',
            industries_list: content.industries_list || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Metal Samples details:', err);
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

  /* ADVANTAGE BULLETS */
  const handleAdvantageChange = (index, value) => {
    const updatedList = [...formData.advantage_points];
    updatedList[index] = value;
    setFormData((prev) => ({ ...prev, advantage_points: updatedList }));
  };

  const handleAddAdvantage = () => {
    setFormData((prev) => ({
      ...prev,
      advantage_points: [...prev.advantage_points, 'New Advantage Point: Description...'],
    }));
  };

  const handleRemoveAdvantage = (index) => {
    const updatedList = formData.advantage_points.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, advantage_points: updatedList }));
  };

  /* INDUSTRIES BULLETS */
  const handleIndustryChange = (index, value) => {
    const updatedList = [...formData.industries_list];
    updatedList[index] = value;
    setFormData((prev) => ({ ...prev, industries_list: updatedList }));
  };

  const handleAddIndustry = () => {
    setFormData((prev) => ({
      ...prev,
      industries_list: [...prev.industries_list, 'New Industry Sector: Description...'],
    }));
  };

  const handleRemoveIndustry = (index) => {
    const updatedList = formData.industries_list.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, industries_list: updatedList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateMetalSamplesDetails(formData);
      showToast('Metal Samples details updated successfully!', 'success');
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
          Metal Samples Details Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage global standard headers, 2 product range cards, ESS-ME advantage, and industry applications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: GLOBAL STANDARD */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. GLOBAL STANDARD HEADER
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="global_title"
              value={formData.global_title}
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
              name="global_description"
              rows={3}
              value={formData.global_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 2: FIXED 2 CARDS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. PRODUCT RANGE & CARDS (2 CARDS)
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PRODUCT RANGE TITLE
            </label>
            <input
              type="text"
              name="range_title"
              value={formData.range_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PRODUCT RANGE DESCRIPTION
            </label>
            <textarea
              name="range_description"
              rows={2}
              value={formData.range_description}
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

        {/* SECTION 3: ESS-ME ADVANTAGE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              3. ESS-ME ADVANTAGE BULLETS
            </h2>
            <button
              type="button"
              onClick={handleAddAdvantage}
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
              name="advantage_title"
              value={formData.advantage_title}
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
              name="advantage_intro"
              value={formData.advantage_intro}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {formData.advantage_points.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleAdvantageChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAdvantage(index)}
                  className="rounded-lg bg-rose-600/10 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: INDUSTRIES RELIANT */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              4. INDUSTRIES RELIANT ON THIS TECHNOLOGY
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

export default MetalSamplesDetailsEditor;