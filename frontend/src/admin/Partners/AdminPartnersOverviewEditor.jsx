import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchPartnersPage, updatePartnersSection, uploadImageFile } from '../../services/api';

const DEFAULT_OVERVIEW = {
  paragraph_1:
    "SS Middle East embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.",
  paragraph_2:
    "We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.",
  image_url:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
};

// Module-level memory cache for instant load on re-mounts
let cachedPartnersOverview = null;

const AdminPartnersOverviewEditor = () => {
  const [formData, setFormData] = useState(() => {
    return cachedPartnersOverview || DEFAULT_OVERVIEW;
  });

  const { showToast } = useToast();
  const [fetching, setFetching] = useState(!cachedPartnersOverview);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Safe State Mutator Function
  const updateFormState = (updater) => {
    setFormData((prev) => {
      const nextState = typeof updater === 'function' ? updater(prev) : updater;
      cachedPartnersOverview = nextState;
      return nextState;
    });
  };

  useEffect(() => {
    let isMounted = true;

    fetchPartnersPage()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const overview = payload.overview || {};

        // Nullish coalescing (??) preserves cleared strings ("") correctly
        const freshData = {
          paragraph_1: overview.paragraph_1 ?? DEFAULT_OVERVIEW.paragraph_1,
          paragraph_2: overview.paragraph_2 ?? DEFAULT_OVERVIEW.paragraph_2,
          image_url: overview.image_url ?? DEFAULT_OVERVIEW.image_url,
        };

        cachedPartnersOverview = freshData;
        setFormData(freshData);
      })
      .catch((err) => console.error('Error fetching Partners Overview:', err))
      .finally(() => {
        if (isMounted) setFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadImageFile(file);
      const url = res?.url || res?.image_url || res?.data?.url || '';
      if (url) {
        updateFormState((prev) => ({ ...prev, image_url: url }));
        showToast('Image uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    cachedPartnersOverview = { ...formData };

    try {
      await updatePartnersSection('overview', formData);
      showToast('Partners Overview section updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 font-sans shadow-sm">
      
      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Partners Overview Manager</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Update paragraphs and featured image for the Partners section.
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
        
        {/* IMAGE UPLOAD & PREVIEW WITH HOVER REMOVE BUTTON */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Featured Image
          </h3>

          <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row">
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="w-full cursor-pointer text-xs text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 sm:flex-1"
            />

            {/* PREVIEW CONTAINER WITH OVERLAY REMOVE BUTTON */}
            <div className="relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1">
              {uploading ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  <span className="text-[9px] font-bold uppercase text-blue-600">Uploading</span>
                </div>
              ) : formData.image_url ? (
                <div className="group relative h-full w-full">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-full w-full rounded object-cover"
                  />
                  {/* Overlay Remove Button */}
                  <button
                    type="button"
                    onClick={() => updateFormState((prev) => ({ ...prev, image_url: '' }))}
                    className="absolute inset-0 flex cursor-pointer items-center justify-center rounded bg-slate-900/75 text-[10px] font-bold uppercase text-rose-400 opacity-0 transition-opacity hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="text-[9px] font-bold uppercase text-slate-400">No Image</span>
              )}
            </div>
          </div>
        </div>

        {/* PARAGRAPHS CONTENT */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Paragraph Texts
          </h3>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Paragraph 1 (After Large Drop-Cap 'E')
            </label>
            <textarea
              rows={3}
              value={formData.paragraph_1}
              onChange={(e) =>
                updateFormState((prev) => ({ ...prev, paragraph_1: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Paragraph 2
            </label>
            <textarea
              rows={3}
              value={formData.paragraph_2}
              onChange={(e) =>
                updateFormState((prev) => ({ ...prev, paragraph_2: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full cursor-pointer rounded-xl bg-[#03203c] py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#021528] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save & Publish Partners Overview Section'}
        </button>

      </form>
    </div>
  );
};

export default AdminPartnersOverviewEditor;