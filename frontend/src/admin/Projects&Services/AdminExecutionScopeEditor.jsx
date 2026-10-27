import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchExecutionScope,
  updateExecutionScope,
} from '../../services/projectsServices';

const DEFAULT_SCOPE = {
  title: 'Execution Scope',
  items: [
    'Basic and detailed engineering for instrumentation, control, and safety systems',
    'Analyser shelter, control panel, and Fire & Gas (F&G) panel design and integration',
    'Sampling system engineering for Gas and Liquid applications',
    'SIL rated safety system design per applicable safety lifecycle requirements (IEC 61511)',
    'Factory Acceptance Testing (FAT) and Site Acceptance Testing (SAT)',
    'Installation, testing, and commissioning',
    'Project documentation, as-built drawings, and handover packages',
  ],
  standards_title: 'Standards & Compliance',
  standards_content:
    "ESS Saudi applies relevant end-user engineering requirements and recognised international safety standards including IEC 61511, IEC 61508, and applicable Saudi Aramco Engineering Standards (SAES) throughout project execution. This approach ensures that engineered systems are fully compatible with existing plant infrastructure and aligned with the site's safety and functional safety requirements.",
};

const AdminExecutionScopeEditor = () => {
  const [formData, setFormData] = useState(DEFAULT_SCOPE);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchExecutionScope()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const hasItemsProperty = Array.isArray(payload.items);

        setFormData({
          title: payload.title ?? DEFAULT_SCOPE.title,
          items: hasItemsProperty ? payload.items : DEFAULT_SCOPE.items,
          standards_title: payload.standards_title ?? DEFAULT_SCOPE.standards_title,
          standards_content: payload.standards_content ?? DEFAULT_SCOPE.standards_content,
        });
      })
      .catch((err) => {
        console.error('Failed to load Execution Scope:', err);
        showToast('Failed to load execution scope section.', 'error');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = value;
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, 'New execution scope item'],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateExecutionScope(formData);
      showToast('Execution Scope section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save Execution Scope:', err);
      showToast('Failed to save changes.', 'error');
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
          Execution Scope & Standards Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage key applications bullet items and compliance standards narrative.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6 md:p-8">
          
          {/* SECTION TITLE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-slate-400">
              SECTION MAIN HEADING
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Execution Scope"
              required
            />
          </div>

          {/* EXECUTION SCOPE BULLET ITEMS */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <label className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                EXECUTION SCOPE BULLET ITEMS ({formData.items.length})
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="cursor-pointer rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
              >
                + Add New Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(idx, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    placeholder={`Scope item #${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="cursor-pointer text-xs font-bold text-rose-600 hover:underline shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STANDARDS & COMPLIANCE */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-500 border-b border-slate-100 pb-3">
              STANDARDS & COMPLIANCE CONTENT
            </h3>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                STANDARDS TITLE
              </label>
              <input
                type="text"
                name="standards_title"
                value={formData.standards_title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Standards & Compliance"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                STANDARDS DESCRIPTION
              </label>
              <textarea
                rows={4}
                name="standards_content"
                value={formData.standards_content}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="Enter standards description..."
              />
            </div>
          </div>

        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#031527] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#071d34] disabled:opacity-50"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH SECTION'}
        </button>
      </form>
    </div>
  );
};

export default AdminExecutionScopeEditor;