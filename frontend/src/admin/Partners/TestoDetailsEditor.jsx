import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchTestoDetails,
  updateTestoDetails,
} from '../../services/api';

const TestoDetailsEditor = () => {
  const [formData, setFormData] = useState({
    header_title: '',
    header_description: '',
    solutions_title: '',
    solutions_description: '',
    cards: [],
    advantage_title: '',
    advantage_subtitle: '',
    advantage_list: [],
    industries_title: '',
    industries_list: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestoDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            header_title: content.header_title || 'Comprehensive Portable Measurement Solutions',
            header_description: content.header_description || '',
            solutions_title: content.solutions_title || 'Our Testo Product Solutions',
            solutions_description: content.solutions_description || '',
            cards: content.cards || [],
            advantage_title: content.advantage_title || 'The ESS-ME Advantage: More Than a Supplier',
            advantage_subtitle: content.advantage_subtitle || '',
            advantage_list: content.advantage_list || [],
            industries_title: content.industries_title || 'Industries We Serve',
            industries_list: content.industries_list || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Testo details:', err);
        showToast('Failed to load details content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* CARDS MANAGEMENT */
  const handleCardChange = (index, field, value) => {
    const updated = [...formData.cards];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, cards: updated }));
  };

  const handleAddCard = () => {
    setFormData((prev) => ({
      ...prev,
      cards: [
        ...prev.cards,
        { id: `card_${Date.now()}`, title: 'New Solution Title', description: 'Description...' },
      ],
    }));
  };

  const handleRemoveCard = (index) => {
    const updated = formData.cards.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, cards: updated }));
  };

  /* ADVANTAGES MANAGEMENT */
  const handleAdvantageChange = (index, value) => {
    const updated = [...formData.advantage_list];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, advantage_list: updated }));
  };

  const handleAddAdvantage = () => {
    setFormData((prev) => ({
      ...prev,
      advantage_list: [...prev.advantage_list, 'New Advantage Item: Description...'],
    }));
  };

  const handleRemoveAdvantage = (index) => {
    const updated = formData.advantage_list.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, advantage_list: updated }));
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
      industries_list: [...prev.industries_list, 'New Industry Sector: Description...'],
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
      await updateTestoDetails(formData);
      showToast('Testo details updated successfully!', 'success');
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
          Testo Details Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage product solutions cards, ESS-ME advantage points, and industries served list.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: HEADER & INTRO */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. HEADER & INTRO
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="header_title"
              value={formData.header_title}
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
              name="header_description"
              rows={3}
              value={formData.header_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 2: PRODUCT SOLUTIONS & CARDS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              2. PRODUCT SOLUTIONS CARDS
            </h2>
            <button
              type="button"
              onClick={handleAddCard}
              className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              + Add Card
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION TITLE
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
              SECTION DESCRIPTION
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

          <div className="space-y-4 pt-2">
            {formData.cards.map((card, index) => (
              <div key={card.id || index} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    CARD #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(index)}
                    className="rounded-lg bg-rose-600/10 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
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
                      rows={4}
                      value={card.description}
                      onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: THE ESS-ME ADVANTAGE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              3. THE ESS-ME ADVANTAGE
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
              SUBTITLE
            </label>
            <input
              type="text"
              name="advantage_subtitle"
              value={formData.advantage_subtitle}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {formData.advantage_list.map((item, index) => (
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

export default TestoDetailsEditor;