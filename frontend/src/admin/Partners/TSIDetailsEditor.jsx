import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchTSIDetails,
  updateTSIDetails,
} from '../../services/api';

const TSIDetailsEditor = () => {
  const [formData, setFormData] = useState({
    header_title: '',
    header_description: '',
    categories_title: '',
    categories: [],
    expertise_title: '',
    expertise_subtitle: '',
    expertise_list: [],
    industries_title: '',
    industries_subtitle: '',
    industries_list: [],
    cta_title: '',
    cta_subtitle: '',
    cta_button_text: '',
    cta_button_link: '',
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTSIDetails()
      .then((res) => {
        const content = res?.data?.data || res?.data || res || {};
        if (content) {
          setFormData({
            header_title: content.header_title || 'Trusted TSI Measurement Solutions for the Middle East',
            header_description: content.header_description || '',
            categories_title: content.categories_title || 'Our Core TSI Product Categories & Applications',
            categories: content.categories || [],
            expertise_title: content.expertise_title || 'More Than a Supplier: Our TSI Expertise & Value-Add',
            expertise_subtitle: content.expertise_subtitle || '',
            expertise_list: content.expertise_list || [],
            industries_title: content.industries_title || 'TSI for Your Industry',
            industries_subtitle: content.industries_subtitle || '',
            industries_list: content.industries_list || [],
            cta_title: content.cta_title || 'Secure Your Operational Excellence With TSI Data',
            cta_subtitle: content.cta_subtitle || '',
            cta_button_text: content.cta_button_text || 'Contact a TSI Application Specialist',
            cta_button_link: content.cta_button_link || '/contact',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load TSI details:', err);
        showToast('Failed to load details content.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* CATEGORIES MANAGEMENT */
  const handleCategoryChange = (index, field, value) => {
    const updated = [...formData.categories];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, categories: updated }));
  };

  const handleAddCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        { id: `cat_${Date.now()}`, title: 'New Category', paragraph_1: 'Description...', paragraph_2: '' },
      ],
    }));
  };

  const handleRemoveCategory = (index) => {
    const updated = formData.categories.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, categories: updated }));
  };

  /* EXPERTISE MANAGEMENT */
  const handleExpertiseChange = (index, value) => {
    const updated = [...formData.expertise_list];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, expertise_list: updated }));
  };

  const handleAddExpertise = () => {
    setFormData((prev) => ({
      ...prev,
      expertise_list: [...prev.expertise_list, 'New Value-Add Point: Description...'],
    }));
  };

  const handleRemoveExpertise = (index) => {
    const updated = formData.expertise_list.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, expertise_list: updated }));
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
      industries_list: [...prev.industries_list, 'New Sector: Application description...'],
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
      await updateTSIDetails(formData);
      showToast('TSI details section saved successfully!', 'success');
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
          TSI Details Section Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage product categories, TSI expertise bullets, industry applications, and bottom CTA card.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. INTRO HEADER */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. INTRO HEADER
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
              rows={4}
              value={formData.header_description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* 2. PRODUCT CATEGORIES */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              2. PRODUCT CATEGORIES & APPLICATIONS
            </h2>
            <button
              type="button"
              onClick={handleAddCategory}
              className="cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              + Add Category
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SECTION HEADING
            </label>
            <input
              type="text"
              name="categories_title"
              value={formData.categories_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-4 pt-2">
            {formData.categories.map((cat, index) => (
              <div key={cat.id || index} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    CATEGORY BLOCK #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(index)}
                    className="rounded-lg bg-rose-600/10 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      CATEGORY TITLE
                    </label>
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => handleCategoryChange(index, 'title', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      PARAGRAPH 1
                    </label>
                    <textarea
                      rows={3}
                      value={cat.paragraph_1}
                      onChange={(e) => handleCategoryChange(index, 'paragraph_1', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      PARAGRAPH 2 (OPTIONAL)
                    </label>
                    <textarea
                      rows={2}
                      value={cat.paragraph_2 || ''}
                      onChange={(e) => handleCategoryChange(index, 'paragraph_2', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. VALUE-ADD EXPERTISE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              3. VALUE-ADD EXPERTISE
            </h2>
            <button
              type="button"
              onClick={handleAddExpertise}
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
              name="expertise_title"
              value={formData.expertise_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SUBTITLE
            </label>
            <textarea
              name="expertise_subtitle"
              rows={2}
              value={formData.expertise_subtitle}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {formData.expertise_list.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleExpertiseChange(index, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExpertise(index)}
                  className="rounded-lg bg-rose-600/10 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. INDUSTRIES WE SERVE */}
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
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              SUBTITLE
            </label>
            <input
              type="text"
              name="industries_subtitle"
              value={formData.industries_subtitle}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
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

        {/* 5. CTA BANNER CARD */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            5. CTA BANNER CARD
          </h2>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              CTA TITLE
            </label>
            <input
              type="text"
              name="cta_title"
              value={formData.cta_title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              CTA SUBTITLE
            </label>
            <textarea
              name="cta_subtitle"
              rows={2}
              value={formData.cta_subtitle}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                BUTTON LABEL
              </label>
              <input
                type="text"
                name="cta_button_text"
                value={formData.cta_button_text}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                BUTTON REDIRECT LINK
              </label>
              <input
                type="text"
                name="cta_button_link"
                value={formData.cta_button_link}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH DETAILS SECTION'}
        </button>
      </form>
    </div>
  );
};

export default TSIDetailsEditor;