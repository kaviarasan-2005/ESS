import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAKAYOverview, updateAKAYOverview } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const AdminAkayOverviewEditor = () => {
  const [formData, setFormData] = useState({
    title: 'AKAY Industries Centrifugal Pumps',
    description: '',
    image: '',
    image_url: ''
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    fetchAKAYOverview()
      .then((res) => {
        if (!isMounted) return;

        // Safely extract payload across multiple response wrappers
        const payload = res?.data?.data || res?.data || res || {};

        if (payload && typeof payload === 'object') {
          setFormData({
            title: payload.title || 'AKAY Industries Centrifugal Pumps',
            description: payload.description || '',
            image: payload.image || payload.image_url || '',
            image_url: payload.image_url || payload.image || ''
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching AKAY overview settings:', err);
        // Do not block the UI or show red error if default fields are populated
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payloadToSave = {
      ...formData,
      image: formData.image_url || formData.image || '',
      image_url: formData.image_url || formData.image || ''
    };

    try {
      await updateAKAYOverview(payloadToSave);
      showToast('Overview section published successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to update AKAY overview section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
        Loading Overview Settings...
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">AKAY Industries Overview Editor</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage the heading, detailed overview text, and featured card image for AKAY Centrifugal Pumps.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Overview Content</h3>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Section Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              placeholder="AKAY Industries Centrifugal Pumps"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Detailed Description Text</label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed text-slate-700"
              placeholder="Overview description..."
            />
          </div>
        </div>

        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Featured Image Card</h3>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <ImageUploader
                label="Card Image"
                value={formData.image_url || formData.image}
                onChange={(uploadedUrl) => setFormData({ ...formData, image: uploadedUrl, image_url: uploadedUrl })}
              />
            </div>

            <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              {formData.image_url || formData.image ? (
                <img
                  src={formData.image_url || formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[9px] font-bold text-slate-400 uppercase">No Image</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Publishing Updates...' : 'Save & Publish Overview'}
        </button>
      </form>
    </div>
  );
};

export default AdminAkayOverviewEditor;
