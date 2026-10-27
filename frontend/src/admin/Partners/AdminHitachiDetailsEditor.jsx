import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHitachiDetails, updateHitachiDetails } from '../../services/api';

const AdminHitachiDetailsEditor = () => {
  const [formData, setFormData] = useState({
    precision_title: 'Precision Engineering and Technological Innovation',
    precision_description: '',
    product_range_title: 'Our Hitachi Product Range',
    product_range_description: '',
    compressors_card_title: 'Centrifugal & Process Gas Compressors',
    compressors_card_description: '',
    pumps_card_title: 'High-Pressure & Large-Capacity Industrial Pumps',
    pumps_card_description: '',
    lifecycle_title: 'Lifecycle Support for Major Assets',
    lifecycle_subtitle: 'Partnering with us for Hitachi equipment means securing a long-term commitment. We provide:',
    lifecycle_items: [],
    sectors_title: 'Key Sectors',
    sector_items: [],
  });

  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHitachiDetails()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        setFormData({
          precision_title: payload.precision_title || 'Precision Engineering and Technological Innovation',
          precision_description: payload.precision_description || '',
          product_range_title: payload.product_range_title || 'Our Hitachi Product Range',
          product_range_description: payload.product_range_description || '',
          compressors_card_title: payload.compressors_card_title || 'Centrifugal & Process Gas Compressors',
          compressors_card_description: payload.compressors_card_description || '',
          pumps_card_title: payload.pumps_card_title || 'High-Pressure & Large-Capacity Industrial Pumps',
          pumps_card_description: payload.pumps_card_description || '',
          lifecycle_title: payload.lifecycle_title || 'Lifecycle Support for Major Assets',
          lifecycle_subtitle: payload.lifecycle_subtitle || '',
          lifecycle_items: payload.lifecycle_items || [],
          sectors_title: payload.sectors_title || 'Key Sectors',
          sector_items: payload.sector_items || [],
        });
      })
      .catch((err) => {
        console.error('Error fetching Hitachi Details:', err);
        showToast('Failed to load Hitachi details.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // List Handlers: Lifecycle Items
  const handleLifecycleChange = (index, value) => {
    const updated = [...(formData.lifecycle_items || [])];
    updated[index] = value;
    setFormData({ ...formData, lifecycle_items: updated });
  };

  const handleAddLifecycle = () => {
    setFormData({
      ...formData,
      lifecycle_items: [...(formData.lifecycle_items || []), ''],
    });
  };

  const handleRemoveLifecycle = (index) => {
    const updated = (formData.lifecycle_items || []).filter((_, i) => i !== index);
    setFormData({ ...formData, lifecycle_items: updated });
  };

  // List Handlers: Key Sectors
  const handleSectorChange = (index, value) => {
    const updated = [...(formData.sector_items || [])];
    updated[index] = value;
    setFormData({ ...formData, sector_items: updated });
  };

  const handleAddSector = () => {
    setFormData({
      ...formData,
      sector_items: [...(formData.sector_items || []), ''],
    });
  };

  const handleRemoveSector = (index) => {
    const updated = (formData.sector_items || []).filter((_, i) => i !== index);
    setFormData({ ...formData, sector_items: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHitachiDetails(formData);
      showToast('Hitachi Details section saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update Hitachi details:', err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Hitachi Details & Capabilities Editor
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Edit precision engineering headers, product range cards, lifecycle support items, and key sector list.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. PRECISION ENGINEERING */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            1. Precision Engineering Header
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">SECTION TITLE</label>
            <input
              type="text"
              value={formData.precision_title || ''}
              onChange={(e) => setFormData({ ...formData, precision_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION BODY</label>
            <textarea
              rows={3}
              value={formData.precision_description || ''}
              onChange={(e) => setFormData({ ...formData, precision_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 2. PRODUCT RANGE */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            2. Product Range & Category Cards
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">MAIN TITLE</label>
            <input
              type="text"
              value={formData.product_range_title || ''}
              onChange={(e) => setFormData({ ...formData, product_range_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">MAIN DESCRIPTION</label>
            <textarea
              rows={2}
              value={formData.product_range_description || ''}
              onChange={(e) => setFormData({ ...formData, product_range_description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            {/* CARD 1: COMPRESSORS */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">CARD 1 TITLE (COMPRESSORS)</label>
              <input
                type="text"
                value={formData.compressors_card_title || ''}
                onChange={(e) => setFormData({ ...formData, compressors_card_title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
              />
              <label className="mt-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">CARD 1 DESCRIPTION</label>
              <textarea
                rows={4}
                value={formData.compressors_card_description || ''}
                onChange={(e) => setFormData({ ...formData, compressors_card_description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              />
            </div>

            {/* CARD 2: PUMPS */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">CARD 2 TITLE (PUMPS)</label>
              <input
                type="text"
                value={formData.pumps_card_title || ''}
                onChange={(e) => setFormData({ ...formData, pumps_card_title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
              />
              <label className="mt-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">CARD 2 DESCRIPTION</label>
              <textarea
                rows={4}
                value={formData.pumps_card_description || ''}
                onChange={(e) => setFormData({ ...formData, pumps_card_description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 3. LIFECYCLE SUPPORT */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            3. Lifecycle Support Items
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">TITLE</label>
            <input
              type="text"
              value={formData.lifecycle_title || ''}
              onChange={(e) => setFormData({ ...formData, lifecycle_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">SUBTITLE</label>
            <input
              type="text"
              value={formData.lifecycle_subtitle || ''}
              onChange={(e) => setFormData({ ...formData, lifecycle_subtitle: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">LIFECYCLE ITEMS</label>
              <button
                type="button"
                onClick={handleAddLifecycle}
                className="cursor-pointer text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-800"
              >
                + Add Item
              </button>
            </div>

            {formData.lifecycle_items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => handleLifecycleChange(idx, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800"
                  placeholder="e.g., Technical Consulting: Front-end engineering support..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLifecycle(idx)}
                  className="shrink-0 cursor-pointer rounded-lg bg-rose-50 px-3 py-3 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. KEY SECTORS */}
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[#f8fafc] p-6">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            4. Key Sectors List
          </h2>
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">SECTION TITLE</label>
            <input
              type="text"
              value={formData.sectors_title || ''}
              onChange={(e) => setFormData({ ...formData, sectors_title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">SECTOR ITEMS</label>
              <button
                type="button"
                onClick={handleAddSector}
                className="cursor-pointer text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-800"
              >
                + Add Item
              </button>
            </div>

            {formData.sector_items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => handleSectorChange(idx, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800"
                  placeholder="e.g., Oil, Gas & Petrochemicals: LNG liquefaction..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSector(idx)}
                  className="shrink-0 cursor-pointer rounded-lg bg-rose-50 px-3 py-3 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
                >
                  Remove
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
          {saving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH HITACHI DETAILS'}
        </button>
      </form>
    </div>
  );
};

export default AdminHitachiDetailsEditor;