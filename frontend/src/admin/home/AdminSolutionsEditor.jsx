import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHomeSolutions, updateHomeSolutions } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const AdminSolutionsEditor = () => {
  const [formData, setFormData] = useState({
    tagline: 'TURNKEY SERVICES',
    title: 'Solutions',
    description: 'Custom engineered turn-key modules tailored from concept prototyping straight to site deployment.',
    items: [],
    cta: {
      title: 'Need a custom engineered solution?',
      description: 'Contact our specialist engineering team today for tailor-made CAD modeling and execution feasibility studies.',
      btn_text: 'Schedule Consultation',
      btn_url: '/contact'
    }
  });
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomeSolutions()
      .then((res) => {
        const payload = res?.data || res || {};
        const sec = payload.solutions || payload;
        setFormData({
          tagline: sec.tagline || 'TURNKEY SERVICES',
          title: sec.title || 'Solutions',
          description: sec.description || '',
          items: (sec.items || []).map((item) => ({
            ...item,
            icon_url: item.icon_url || item.icon || ''
          })),
          cta: sec.cta || {
            title: 'Need a custom engineered solution?',
            description: 'Contact our specialist engineering team today...',
            btn_text: 'Schedule Consultation',
            btn_url: '/contact'
          }
        });
      })
      .catch((err) => console.error('Error loading Solutions:', err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHomeSolutions(formData);
      showToast('Solutions section updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update Solutions section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleItemChange = (idx, field, val) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[idx] = { ...updatedItems[idx], [field]: val };
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `sol-${Date.now()}`,
          icon_url: '',
          icon: '',
          title: 'New Service Module',
          description: 'Detailed service description line...',
          link_url: '/solutions',
          link_text: 'Details →'
        }
      ]
    }));
  };

  const handleRemoveItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Solutions Section Manager</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage section header, solution cards with custom logos, and the bottom CTA banner.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* HEADER CONTROLS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Header Settings</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>
        </div>

        {/* SOLUTION CARDS LIST */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Solution Cards ({formData.items.length})</h3>
            <button type="button" onClick={handleAddItem} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
              + Add Solution Card
            </button>
          </div>

          {formData.items.map((item, idx) => {
            const currentImg = item.icon_url || item.icon || '';

            return (
              <div key={item.id || idx} className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Card #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Delete Card
                  </button>
                </div>

                {/* LOGO UPLOADER & LIVE PREVIEW */}
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50/70 p-3 rounded-lg border border-slate-200/60">
                  <div className="flex-1 w-full">
                    <ImageUploader
                      label="Card Icon / Logo Image"
                      value={currentImg}
                      onChange={(url) => {
                        handleItemChange(idx, 'icon_url', url);
                        handleItemChange(idx, 'icon', url);
                      }}
                    />
                  </div>
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-1 shadow-sm shrink-0">
                    {currentImg ? (
                      <img
                        src={currentImg}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-[9px] font-bold text-slate-300 uppercase text-center leading-tight">
                        No Logo
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Card Title</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-medium"
                  />
                </div>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Link Text</label>
                    <input
                      type="text"
                      value={item.link_text || 'Details →'}
                      onChange={(e) => handleItemChange(idx, 'link_text', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Link URL</label>
                    <input
                      type="text"
                      value={item.link_url || '/solutions'}
                      onChange={(e) => handleItemChange(idx, 'link_url', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-xs font-semibold"
                    />
                  </div>
                </div> */}
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA BANNER CONTROLS */}
        {/* <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Bottom Banner Settings</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Banner Title</label>
            <input
              type="text"
              value={formData.cta?.title || ''}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, title: e.target.value } })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Banner Description</label>
            <textarea
              rows={2}
              value={formData.cta?.description || ''}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, description: e.target.value } })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Text</label>
              <input
                type="text"
                value={formData.cta?.btn_text || ''}
                onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, btn_text: e.target.value } })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-xs font-semibold text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button URL</label>
              <input
                type="text"
                value={formData.cta?.btn_url || ''}
                onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, btn_url: e.target.value } })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-xs font-semibold text-white"
              />
            </div>
          </div>
        </div> */}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl shadow-sm text-xs transition-all cursor-pointer"
        >
          {saving ? 'Publishing Updates...' : 'Save & Publish Solutions Section'}
        </button>

      </form>
    </div>
  );
};

export default AdminSolutionsEditor;
