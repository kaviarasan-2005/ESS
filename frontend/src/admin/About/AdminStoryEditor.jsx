import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAboutStory, updateAboutStory } from '../../services/aboutService';

// Module-level cache for instant load on re-mounts
let cachedStoryData = null;

const AdminStoryEditor = () => {
  // 1. Initialize state safely: preserves empty strings if defined in cache
  const [formData, setFormData] = useState(() => {
    if (cachedStoryData) {
      return cachedStoryData;
    }
    return {
      tagline: 'ESSME',
      title: 'Our Story: Two Decades of Trusted Partnership',
      paragraph_1: '',
      paragraph_2: '',
      paragraph_3: '',
    };
  });

  const { showToast } = useToast();
  const [fetching, setFetching] = useState(!cachedStoryData);
  const [saving, setSaving] = useState(false);

  // 2. Fetch live "Our Story" section via GET /api/about/story
  useEffect(() => {
    let isMounted = true;

    fetchAboutStory()
      .then((res) => {
        if (!isMounted) return;

        const storyData = res?.data || res || {};

        // Use Nullish Coalescing (??) instead of Logical OR (||)
        // This ensures "" (empty string) is preserved and not replaced by defaults!
        const freshData = {
          tagline: storyData.tagline ?? '',
          title: storyData.title ?? '',
          paragraph_1: storyData.paragraph_1 ?? '',
          paragraph_2: storyData.paragraph_2 ?? '',
          paragraph_3: storyData.paragraph_3 ?? '',
        };

        // Sync local state and module cache
        cachedStoryData = freshData;
        setFormData(freshData);
      })
      .catch((err) =>
        console.error('Error fetching About Story section:', err)
      )
      .finally(() => {
        if (isMounted) setFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to update local state and in-memory cache together
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const nextState = { ...prev, [field]: value };
      cachedStoryData = nextState;
      return nextState;
    });
  };

  // 3. Save payload via PUT /api/about/story
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Update in-memory cache immediately with exact values
    cachedStoryData = { ...formData };

    try {
      await updateAboutStory(formData);
      showToast('Our Story section updated successfully!', 'success');
    } catch (err) {
      console.error('Error saving About Story section:', err);
      showToast('Failed to update Our Story section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 font-sans">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Our Story Editor</h1>
          <p className="text-xs text-slate-500">
            Manage the tagline, title, and key narrative paragraphs displayed on the About Us page.
          </p>
        </div>
        {fetching && (
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-blue-500">
            <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
            Syncing…
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* HEADER CONTROLS */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Section Titles
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Tagline / Badge Text
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. ESSME"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Main Headline
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Our Story: Two Decades of Trusted Partnership"
              />
            </div>
          </div>
        </div>

        {/* PARAGRAPHS CONTROLS */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Story Paragraphs
          </h2>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Paragraph 1 (Core Focus & Region)
            </label>
            <textarea
              rows={3}
              value={formData.paragraph_1}
              onChange={(e) => handleInputChange('paragraph_1', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first paragraph text..."
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Paragraph 2 (Strategic Associations / History)
            </label>
            <textarea
              rows={3}
              value={formData.paragraph_2}
              onChange={(e) => handleInputChange('paragraph_2', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter second paragraph text..."
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Paragraph 3 (Client Base & Sectors)
            </label>
            <textarea
              rows={3}
              value={formData.paragraph_3}
              onChange={(e) => handleInputChange('paragraph_3', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter third paragraph text..."
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-[#1e2738] py-3.5 text-xs font-bold text-white shadow transition-all hover:bg-[#151c28] disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Publishing Story Changes...</span>
            </>
          ) : (
            <span>Save & Publish Our Story</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminStoryEditor;