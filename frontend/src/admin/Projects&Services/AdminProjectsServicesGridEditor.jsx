import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchProjectsServicesGrid,
  updateProjectsServicesGrid,
} from '../../services/projectsServices';
import { uploadImageFile } from '../../services/uploadService';

// Icon options for the fallback dropdown
const AVAILABLE_ICONS = [
  { value: 'droplet', label: 'Droplets' },
  { value: 'flame', label: 'Flame' },
  { value: 'target', label: 'Target' },
  { value: 'layers', label: 'Layers' },
  { value: 'disc', label: 'Disc' },
  { value: 'bell', label: 'Bell' },
];

const DEFAULT_CARDS = [
  { id: 'ps-1', title: 'Moisture & Dew Point Measurement Instruments', icon_type: 'droplet', logo_url: '', link_url: '/projects-services/moisture-dew-point' },
  { id: 'ps-2', title: 'Flame & Gas Detectors', icon_type: 'flame', logo_url: '', link_url: '/projects-services/flame-gas-detectors' },
  { id: 'ps-3', title: 'VESDA® Aspirating Smoke Detection & Fire Alarm Devices', icon_type: 'target', logo_url: '', link_url: '/projects-services/vesda-smoke-detection' },
  { id: 'ps-4', title: 'Process Analyzers', icon_type: 'layers', logo_url: '', link_url: '/projects-services/process-analyzers' },
  { id: 'ps-5', title: 'Process Instrumentation', icon_type: 'disc', logo_url: '', link_url: '/projects-services/process-instrumentation' },
  { id: 'ps-6', title: 'Upstream Instrumentation (Water Cut Meters)', icon_type: 'droplet', logo_url: '', link_url: '/projects-services/water-cut-meters' },
  { id: 'ps-7', title: 'Beacons & Sounders', icon_type: 'bell', logo_url: '', link_url: '/projects-services/beacons-sounders' },
];

const AdminProjectsServicesGridEditor = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchProjectsServicesGrid()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const freshCards = Array.isArray(payload.cards) && payload.cards.length > 0
          ? payload.cards.map((c, idx) => ({
              id: c.id ?? `ps-${Date.now()}-${idx}`,
              title: c.title ?? '',
              icon_type: c.icon_type ?? 'flame',
              logo_url: c.logo_url ?? '',
              link_url: c.link_url ?? '',
            }))
          : DEFAULT_CARDS;

        setCards(freshCards);
      })
      .catch((err) => console.error('Error fetching grid cards:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardChange = (cardId, field, value) => {
    setCards((prev) =>
      prev.map((item) => (item.id === cardId ? { ...item, [field]: value } : item))
    );
  };

  // Remove uploaded logo handler
  const handleRemoveImage = (cardId) => {
    handleCardChange(cardId, 'logo_url', '');
    showToast('Card logo removed.', 'info');
  };

  const handleLogoUpload = async (cardId, file) => {
    if (!file) return;

    setUploadingId(cardId);
    try {
      const uploadRes = await uploadImageFile(file);
      const url = uploadRes.url || uploadRes.file_path || uploadRes.image_url || '';

      if (url) {
        handleCardChange(cardId, 'logo_url', url);
        showToast('Card logo uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Logo upload failed:', err);
      showToast('Failed to upload card logo.', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  const handleAddCard = () => {
    const newCard = {
      id: `ps-${Date.now()}`,
      title: 'New Project / Service Card',
      icon_type: 'flame',
      logo_url: '',
      link_url: '',
    };
    setCards((prev) => [...prev, newCard]);
  };

  const handleRemoveCard = (cardId) => {
    setCards((prev) => prev.filter((item) => item.id !== cardId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProjectsServicesGrid({ cards });
      showToast('Projects & Services grid saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save grid:', err);
      showToast('Failed to save grid changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 shadow-xs">
        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Loading Grid Editor...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects & Services Cards Manager</h1>
          <p className="text-xs text-slate-500">
            Manage card titles, logo uploads, fallback icons, and destination URLs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCard}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          + Add Card
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARDS GRID */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="relative space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <button
                type="button"
                onClick={() => handleRemoveCard(card.id)}
                className="absolute top-4 right-4 cursor-pointer text-xs font-bold text-rose-500 hover:text-rose-700"
              >
                Remove
              </button>

              {/* CARD TITLE */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-600 uppercase">
                  Card #{idx + 1} Title
                </label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* LOGO IMAGE UPLOAD & PREVIEW SECTION WITH REMOVE BUTTON */}
              <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                    Card Logo Image
                  </label>

                  {/* REMOVE IMAGE BUTTON */}
                  {card.logo_url && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(card.id)}
                      className="cursor-pointer text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-800 hover:underline"
                    >
                      ✕ Remove Image
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-300 bg-white p-2 shadow-sm">
                    {card.logo_url ? (
                      <>
                        <img
                          src={card.logo_url}
                          alt={card.title}
                          className="h-full w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(card.id)}
                          className="absolute top-1 right-1 cursor-pointer rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white opacity-90 shadow hover:bg-rose-700 hover:opacity-100"
                          title="Remove Logo"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className="text-center text-[10px] leading-tight font-extrabold text-slate-400 uppercase">
                        No Logo
                      </span>
                    )}
                  </div>

                  {/* Upload File Input */}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingId === card.id}
                      onChange={(e) => handleLogoUpload(card.id, e.target.files?.[0])}
                      className="w-full cursor-pointer text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-blue-700"
                    />
                    {uploadingId === card.id && (
                      <span className="block animate-pulse text-xs font-bold text-blue-600">
                        Uploading image...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ICON FALLBACK */}
              <div>
                <label className="mb-1 block text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  Icon (Fallback)
                </label>
                <select
                  value={card.icon_type || 'flame'}
                  onChange={(e) => handleCardChange(card.id, 'icon_type', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                  {AVAILABLE_ICONS.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESTINATION URL */}
              <div>
                <label className="mb-1 block text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={card.link_url}
                  onChange={(e) => handleCardChange(card.id, 'link_url', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="/projects-services/service-name"
                />
              </div>
            </div>
          ))}
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving || uploadingId !== null}
          className="w-full cursor-pointer rounded-xl bg-[#1e2738] py-4 text-xs font-bold tracking-wider text-white uppercase shadow transition-all hover:bg-[#151c28] disabled:opacity-50"
        >
          {saving ? 'Saving Changes...' : 'Save & Publish Projects & Services Grid'}
        </button>
      </form>
    </div>
  );
};

export default AdminProjectsServicesGridEditor;