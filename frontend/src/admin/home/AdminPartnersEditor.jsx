import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHomePartners, updateHomePartners } from '../../services/api';

const AdminPartnersEditor = () => {
  const [formData, setFormData] = useState({
    tagline: 'ALLIANCES',
    title: 'Our Partners',
    items: []
  });
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomePartners()
      .then((res) => {
        const payload = res?.data || res || {};
        const sec = payload.partners || payload;

        const fetchedItems = Array.isArray(sec.items)
          ? sec.items
          : (Array.isArray(sec) ? sec : []);

        setFormData({
          tagline: sec.tagline || 'ALLIANCES',
          title: sec.title || 'Our Partners',
          items: fetchedItems.map((partner, idx) => ({
            id: partner.id || `pt-${Date.now()}-${idx}`,
            name: partner.name || '',
            logo_url: partner.logo_url || '',
            website_url: partner.website_url || ''
          }))
        });
      })
      .catch((err) => console.error('Error loading Partners:', err));
  }, []);

  const handleItemChange = (targetId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((partner) => {
        if (partner.id !== targetId) return partner;
        return { ...partner, [field]: value };
      })
    }));
  };

  // Convert uploaded image file to Base64 string
  const handleFileUpload = (targetId, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleItemChange(targetId, 'logo_url', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPartner = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: '',
          logo_url: '',
          website_url: ''
        }
      ]
    }));
  };

  const handleRemovePartner = (targetId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((partner) => partner.id !== targetId)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHomePartners(formData);
      showToast('Partners section published successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update Partners section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Partners & Alliances Manager</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage section title, tagline, and brand partner logos.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* HEADER CONTROLS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Header Configuration</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900"
            />
          </div>
        </div>

        {/* PARTNERS LIST */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Brand Partners ({formData.items.length})
            </h3>
            <button
              type="button"
              onClick={handleAddPartner}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              + Add Partner
            </button>
          </div>

          {formData.items.map((partner, idx) => (
            <div key={partner.id} className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Partner #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePartner(partner.id)}
                  className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Delete Partner
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Partner Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Honeywell"
                    value={partner.name || ''}
                    onChange={(e) => handleItemChange(partner.id, 'name', e.target.value)}
                    className="w-full p-2 bg-slate-50/50 border border-slate-300 rounded text-xs font-bold text-slate-800"
                  />
                </div>
                {/* <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Website URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={partner.website_url || ''}
                    onChange={(e) => handleItemChange(partner.id, 'website_url', e.target.value)}
                    className="w-full p-2 bg-slate-50/50 border border-slate-300 rounded text-xs font-semibold text-slate-800"
                  />
                </div> */}
              </div>

              {/* LOGO UPLOAD & PREVIEW */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload Logo Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(partner.id, e.target.files[0])}
                    className="w-full sm:flex-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />

                  {/* MINI PREVIEW BOX */}
                  <div className="w-24 h-12 border border-slate-200 rounded-lg flex items-center justify-center p-1 bg-slate-50 shrink-0">
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 uppercase">No Logo</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl shadow-sm text-xs transition-all cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save & Publish Partners Section'}
        </button>

      </form>
    </div>
  );
};

export default AdminPartnersEditor;
