import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHoneywellDetails, updateHoneywellDetails } from '../../services/api';

const AdminHoneywellDetailsEditor = () => {
  const [formData, setFormData] = useState({
    legacy_title: '',
    legacy_description: '',
    portfolio_title: '',
    portfolio_description: '',
    cards: [],
    value_title: '',
    value_description: '',
    industries_title: '',
    industries: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHoneywellDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            legacy_title: content.legacy_title || "Honeywell's Legacy of Process Control Innovation",
            legacy_description: content.legacy_description || '',
            portfolio_title: content.portfolio_title || 'Honeywell Automation Service Portfolio',
            portfolio_description: content.portfolio_description || '',
            cards: content.cards || [],
            value_title: content.value_title || 'ESS-ME Value Addition',
            value_description: content.value_description || '',
            industries_title: content.industries_title || 'Core Industries We Serve',
            industries: content.industries || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Honeywell details:', err);
        showToast('Failed to load Honeywell details content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* FIXED 4 CARDS MANAGEMENT */
  const handleCardChange = (index, field, value) => {
    const updatedCards = [...formData.cards];
    updatedCards[index][field] = value;
    setFormData((prev) => ({ ...prev, cards: updatedCards }));
  };

  /* INDUSTRIES LIST MANAGEMENT */
  const handleIndustryChange = (index, value) => {
    const updatedIndustries = [...formData.industries];
    updatedIndustries[index] = value;
    setFormData((prev) => ({ ...prev, industries: updatedIndustries }));
  };

  const handleAddIndustry = () => {
    setFormData((prev) => ({ ...prev, industries: [...prev.industries, 'New Industry: Description...'] }));
  };

  const handleRemoveIndustry = (index) => {
    const updatedIndustries = formData.industries.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, industries: updatedIndustries }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHoneywellDetails(formData);
      showToast('Honeywell details section updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Honeywell details:', err);
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
          Honeywell Automation Details Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage process innovation headers, 4 portfolio cards, value addition, and core industries.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: LEGACY */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. LEGACY & INNOVATION HEADER
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="legacy_title"
              value={formData.legacy_title}
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
              name="legacy_description"
              rows={4}
              value={formData.legacy_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 2: FIXED 4 PORTFOLIO CARDS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. SERVICE PORTFOLIO CARDS
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PORTFOLIO TITLE
            </label>
            <input
              type="text"
              name="portfolio_title"
              value={formData.portfolio_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              PORTFOLIO DESCRIPTION
            </label>
            <textarea
              name="portfolio_description"
              rows={3}
              value={formData.portfolio_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="pt-2">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                FIXED SERVICE CARDS (4)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {formData.cards.map((card, index) => (
                <div key={card.id || index} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                  <div className="mb-3">
                    <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                      CARD #{index + 1}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        TITLE
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
                        DESCRIPTION
                      </label>
                      <textarea
                        rows={7}
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
        </div>

        {/* SECTION 3: VALUE ADDITION */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. ESS-ME VALUE ADDITION
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              TITLE
            </label>
            <input
              type="text"
              name="value_title"
              value={formData.value_title}
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
              name="value_description"
              rows={3}
              value={formData.value_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 4: CORE INDUSTRIES */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              4. CORE INDUSTRIES WE SERVE
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
            {formData.industries.map((item, index) => (
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH HONEYWELL DETAILS'}
        </button>
      </form>
    </div>
  );
};

export default AdminHoneywellDetailsEditor;