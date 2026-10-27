import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchAfterSalesServiceScope,
  updateAfterSalesServiceScope,
} from '../../services/projectsServices';

const DEFAULT_SCOPE = {
  title: 'Service Scope',
  items: [
    'Warranty service and claim support for supplied instruments and systems',
    'Preventive maintenance and corrective maintenance',
    'Calibration services for process instrumentation and analysers',
    'Troubleshooting and fault diagnosis with on-site and remote support options',
    'Spare parts identification, sourcing, and supply',
    'Annual Maintenance Contracts (AMC) for long-term service coverage',
  ],
  engineers_title: 'Factory Trained & OEM Certified Engineers',
  engineers_content:
    "ESS Saudi's service engineers complete manufacturer led training and certification programmes at OEM facilities, covering installation, commissioning, calibration, and maintenance procedures specific to each product line. This ensures that service delivered in the Kingdom consistently meets manufacturer direct quality standards, with the added advantage of local accessibility and rapid response.",
};

const AdminAfterSalesServiceScopeEditor = () => {
  const [formData, setFormData] = useState(DEFAULT_SCOPE);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchAfterSalesServiceScope()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const hasItemsProperty = Array.isArray(payload.items);

        setFormData({
          title: payload.title ?? DEFAULT_SCOPE.title,
          items: hasItemsProperty ? payload.items : DEFAULT_SCOPE.items,
          engineers_title: payload.engineers_title ?? DEFAULT_SCOPE.engineers_title,
          engineers_content: payload.engineers_content ?? DEFAULT_SCOPE.engineers_content,
        });
      })
      .catch((err) => {
        console.error('Failed to load After-Sales Service Scope:', err);
        showToast('Failed to load service scope section.', 'error');
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
      items: [...prev.items, 'New service scope item'],
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
      await updateAfterSalesServiceScope(formData);
      showToast('Service scope section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save After-Sales Service Scope:', err);
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
          After-Sales Service Scope & Engineers Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage service scope checkmark list items and factory certified engineers narrative.
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
              placeholder="e.g. Service Scope"
              required
            />
          </div>

          {/* SERVICE SCOPE BULLET ITEMS */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <label className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                SERVICE SCOPE BULLET ITEMS ({formData.items.length})
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

          {/* ENGINEERS SECTION */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-500 border-b border-slate-100 pb-3">
              CERTIFIED ENGINEERS SECTION
            </h3>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                ENGINEERS HEADING TITLE
              </label>
              <input
                type="text"
                name="engineers_title"
                value={formData.engineers_title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Factory Trained & OEM Certified Engineers"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                ENGINEERS DESCRIPTION
              </label>
              <textarea
                rows={4}
                name="engineers_content"
                value={formData.engineers_content}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
                placeholder="Enter certified engineers description..."
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

export default AdminAfterSalesServiceScopeEditor;