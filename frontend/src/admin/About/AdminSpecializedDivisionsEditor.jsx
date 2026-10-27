import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchAboutSpecializedDivisions,
  updateAboutSpecializedDivisions,
} from '../../services/aboutService';

const DEFAULT_DIVISIONS_DATA = {
  title:
    'To deliver comprehensive, end-to-end service, ESS Saudi is structured into specialized divisions:',
  image_url: '',
  divisions: [
    { id: 'div-1', title: 'Control & Automation Systems', link_url: '' },
    { id: 'div-2', title: 'Analytical & Sampling Systems', link_url: '' },
    { id: 'div-3', title: 'Power & Backup Infrastructure', link_url: '' },
  ],
  description_1:
    'This focused approach ensures expert-level knowledge and tailored solutions for every facet of your operation.',
  description_2:
    'We invest relentlessly in our people and infrastructure. Our engineers receive advanced, factory-level training directly from global OEM partners.',
  cta_text: 'Start a Conversation',
  cta_url: '/contact',
};

// Module-level memory cache for instant load on re-mounts
let cachedDivisionsData = null;

const AdminSpecializedDivisionsEditor = () => {
  const [formData, setFormData] = useState(() => {
    return cachedDivisionsData || DEFAULT_DIVISIONS_DATA;
  });

  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(!cachedDivisionsData);

  // 1. Safe Fetch Lifecycle with Nullish Coalescing (??)
  useEffect(() => {
    let isMounted = true;

    fetchAboutSpecializedDivisions()
      .then((res) => {
        if (!isMounted) return;

        const rawPayload = res?.data?.data || res?.data || res || {};
        const sec = typeof rawPayload === 'object' ? rawPayload : {};

        const rawDivisions = Array.isArray(sec.divisions) ? sec.divisions : [];

        // Nullish coalescing preserves empty strings ("") when intentionally cleared
        const freshData = {
          title: sec.title ?? DEFAULT_DIVISIONS_DATA.title,
          image_url: sec.image_url ?? '',
          divisions:
            rawDivisions.length > 0
              ? rawDivisions.map((div, idx) => ({
                  id: div.id ?? `div-${Date.now()}-${idx}`,
                  title: div.title ?? '',
                  link_url: div.link_url ?? '',
                }))
              : DEFAULT_DIVISIONS_DATA.divisions,
          description_1:
            sec.description_1 ?? DEFAULT_DIVISIONS_DATA.description_1,
          description_2:
            sec.description_2 ?? DEFAULT_DIVISIONS_DATA.description_2,
          cta_text: sec.cta_text ?? DEFAULT_DIVISIONS_DATA.cta_text,
          cta_url: sec.cta_url ?? DEFAULT_DIVISIONS_DATA.cta_url,
        };

        cachedDivisionsData = freshData;
        setFormData(freshData);
      })
      .catch((err) => {
        console.error('Error loading Specialized Divisions:', err);
      })
      .finally(() => {
        if (isMounted) setFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateFormState = (updater) => {
    setFormData((prev) => {
      const nextState = typeof updater === 'function' ? updater(prev) : updater;
      cachedDivisionsData = nextState;
      return nextState;
    });
  };

  const handleDivisionChange = (targetId, field, value) => {
    updateFormState((prev) => ({
      ...prev,
      divisions: prev.divisions.map((item) =>
        item.id === targetId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddDivision = () => {
    updateFormState((prev) => ({
      ...prev,
      divisions: [
        ...prev.divisions,
        {
          id: `div-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: '',
          link_url: '',
        },
      ],
    }));
  };

  const handleRemoveDivision = (targetId) => {
    updateFormState((prev) => ({
      ...prev,
      divisions: prev.divisions.filter((item) => item.id !== targetId),
    }));
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      requestAnimationFrame(() => {
        updateFormState((prev) => ({ ...prev, image_url: reader.result }));
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    cachedDivisionsData = { ...formData };

    try {
      await updateAboutSpecializedDivisions(formData);
      showToast('Specialized Divisions section saved successfully!', 'success');
    } catch (err) {
      console.error('Error saving Specialized Divisions:', err);
      showToast('Failed to update section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 font-sans shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Specialized Divisions Manager
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage heading, section image, division titles, individual route links, and CTA button.
          </p>
        </div>
        {fetching && (
          <span className="ml-4 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-blue-600">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            Syncing…
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* HEADING & IMAGE CARD */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Heading & Image
          </h3>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Heading Title
            </label>
            <textarea
              rows={2}
              value={formData.title}
              onChange={(e) =>
                updateFormState((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter main heading title..."
            />
          </div>
          
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Section Image
            </label>
            <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="w-full cursor-pointer text-xs text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 sm:flex-1"
              />

              {/* IMAGE PREVIEW WITH HOVER REMOVE BUTTON */}
              <div className="relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1">
                {formData.image_url ? (
                  <div className="group relative h-full w-full">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="h-full w-full rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateFormState((prev) => ({ ...prev, image_url: '' }))
                      }
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded bg-slate-900/70 text-[10px] font-bold uppercase text-rose-400 opacity-0 transition-opacity hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <span className="text-[9px] font-bold uppercase text-slate-400">
                    No Image
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DIVISIONS LIST */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Divisions ({formData.divisions.length})
            </h3>
            <button
              type="button"
              onClick={handleAddDivision}
              className="cursor-pointer text-xs font-bold text-blue-600 hover:underline"
            >
              + Add Division
            </button>
          </div>

          {formData.divisions.map((item, idx) => (
            <div
              key={item.id}
              className="space-y-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Division #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveDivision(item.id)}
                  className="cursor-pointer text-xs font-bold text-rose-600 hover:underline"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase text-slate-400">
                    Division Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fire & Gas Systems"
                    value={item.title}
                    onChange={(e) =>
                      handleDivisionChange(item.id, 'title', e.target.value)
                    }
                    className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase text-slate-400">
                    Link URL (Leave blank for no link)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /services/fire-and-gas"
                    value={item.link_url}
                    onChange={(e) =>
                      handleDivisionChange(item.id, 'link_url', e.target.value)
                    }
                    className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESCRIPTIONS */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Description Paragraphs
          </h3>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Paragraph 1
            </label>
            <textarea
              rows={2}
              value={formData.description_1}
              onChange={(e) =>
                updateFormState((prev) => ({
                  ...prev,
                  description_1: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Paragraph 2
            </label>
            <textarea
              rows={4}
              value={formData.description_2}
              onChange={(e) =>
                updateFormState((prev) => ({
                  ...prev,
                  description_2: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* CTA BUTTON */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Call To Action Button
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Button Text
              </label>
              <input
                type="text"
                value={formData.cta_text}
                onChange={(e) =>
                  updateFormState((prev) => ({
                    ...prev,
                    cta_text: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
    
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Button URL
              </label>
              <input
                type="text"
                value={formData.cta_url}
                onChange={(e) =>
                  updateFormState((prev) => ({
                    ...prev,
                    cta_url: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-xl bg-[#03203c] py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#021528] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save & Publish Specialized Divisions Section'}
        </button>
      </form>
    </div>
  );
};

export default AdminSpecializedDivisionsEditor;