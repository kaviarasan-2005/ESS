import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
  fetchSystemsSolutionsGrid,
  updateSystemsSolutionsGrid,
} from '../../services/SystemsSolutions';
import { uploadImageFile } from '../../services/uploadService';

// Icon options for the fallback dropdown (values match icon_type in SystemsSolutionsGrid)
const AVAILABLE_ICONS = [
  { value: 'droplet', label: 'Droplets' },
  { value: 'flame', label: 'Flame' },
  { value: 'target', label: 'Target' },
  { value: 'layers', label: 'Layers' },
  { value: 'disc', label: 'Disc' },
  { value: 'bell', label: 'Bell' },
];

const DEFAULT_CARDS = [
  { id: 'sol-1', title: 'Moisture & Dew Point Measurement Instruments', icon_type: 'droplet', logo_url: '', link_url: '/systems/moisture-dew-point' },
  { id: 'sol-2', title: 'Flame & Gas Detectors', icon_type: 'flame', logo_url: '', link_url: '/systems/flame-gas-detectors' },
  { id: 'sol-3', title: 'VESDA® Aspirating Smoke Detection & Fire Alarm Devices', icon_type: 'target', logo_url: '', link_url: '/systems/vesda-smoke-detection' },
  { id: 'sol-4', title: 'Process Analyzers', icon_type: 'layers', logo_url: '', link_url: '/systems/process-analyzers' },
  { id: 'sol-5', title: 'Process Instrumentation', icon_type: 'disc', logo_url: '', link_url: '/systems/process-instrumentation' },
  { id: 'sol-6', title: 'Upstream Instrumentation (Water Cut Meters)', icon_type: 'droplet', logo_url: '', link_url: '/systems/water-cut-meters' },
  { id: 'sol-7', title: 'Beacons & Sounders', icon_type: 'bell', logo_url: '', link_url: '/systems/beacons-sounders' },
];

let cachedGridEditor = null;

const AdminSystemsSolutionsGridEditor = () => {
  const [cards, setCards] = useState(() => cachedGridEditor || DEFAULT_CARDS);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(!cachedGridEditor);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchSystemsSolutionsGrid()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data || res || {};
        const freshCards = Array.isArray(payload.cards) && payload.cards.length > 0
          ? payload.cards.map((c, idx) => ({
              id: c.id ?? `sol-${Date.now()}-${idx}`,
              title: c.title ?? '',
              icon_type: c.icon_type ?? 'flame',
              logo_url: c.logo_url ?? '',
              link_url: c.link_url ?? '',
            }))
          : DEFAULT_CARDS;

        cachedGridEditor = freshCards;
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
    setCards((prev) => {
      const nextCards = prev.map((item) =>
        item.id === cardId ? { ...item, [field]: value } : item
      );
      cachedGridEditor = nextCards;
      return nextCards;
    });
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
      id: `sol-${Date.now()}`,
      title: 'New Solution Card',
      icon_type: 'flame',
      logo_url: '',
      link_url: '/systems/new',
    };
    setCards((prev) => {
      const nextCards = [...prev, newCard];
      cachedGridEditor = nextCards;
      return nextCards;
    });
    showToast('New card added.', 'success');
  };

  const handleRemoveCard = (cardId) => {
    setCards((prev) => {
      const nextCards = prev.filter((item) => item.id !== cardId);
      cachedGridEditor = nextCards;
      return nextCards;
    });
    showToast('Solution card removed.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    cachedGridEditor = [...cards];

    try {
      await updateSystemsSolutionsGrid({ cards });
      showToast('Solutions grid saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save solutions grid:', err);
      showToast('Failed to save grid changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Grid Editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Systems & Solutions Cards Manager</h1>
          <p className="text-xs text-slate-500">
            Manage card titles, logo uploads, fallback icons, and destination URLs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCard}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm"
        >
          + Add Card
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveCard(card.id)}
                className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
              >
                Remove
              </button>

              {/* CARD TITLE */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Card #{idx + 1} Title
                </label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* LOGO IMAGE UPLOAD & PREVIEW SECTION WITH REMOVE BUTTON */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Card Logo Image
                  </label>

                  {/* REMOVE IMAGE BUTTON */}
                  {card.logo_url && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(card.id)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer transition-colors"
                    >
                      ✕ Remove Image
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-20 h-20 rounded-xl bg-white border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-2 relative group">
                    {card.logo_url ? (
                      <>
                        <img
                          src={card.logo_url}
                          alt={card.title}
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(card.id)}
                          className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow cursor-pointer opacity-90 hover:opacity-100"
                          title="Remove Logo"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase text-center leading-tight">
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
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                    {uploadingId === card.id && (
                      <span className="text-xs text-blue-600 font-bold block animate-pulse">
                        Uploading image...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ICON FALLBACK */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Icon (Fallback)
                </label>
                <select
                  value={card.icon_type || 'flame'}
                  onChange={(e) => handleCardChange(card.id, 'icon_type', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
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
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={card.link_url}
                  onChange={(e) => handleCardChange(card.id, 'link_url', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                  placeholder="/systems/solution-name"
                />
              </div>
            </div>
          ))}
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving || uploadingId !== null}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white text-xs font-bold py-4 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider"
        >
          {saving ? 'Saving Changes...' : 'Save & Publish Solutions Grid'}
        </button>
      </form>
    </div>
  );
};

export default AdminSystemsSolutionsGridEditor;