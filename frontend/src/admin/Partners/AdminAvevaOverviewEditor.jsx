import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAVEVAOverview, updateAVEVAOverview } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AdminAvevaOverviewEditor = () => {
  const [formData, setFormData] = useState({
    title: 'AVEVA System Platform & SCADA Solutions',
    description: '',
    image: '',
    image_url: ''
  });
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAVEVAOverview()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload) {
          setFormData({
            title: payload.title || 'AVEVA System Platform & SCADA Solutions',
            description: payload.description || '',
            image: payload.image || payload.image_url || '',
            image_url: payload.image_url || payload.image || ''
          });
        }
      })
      .catch((err) => {
        console.error('Error loading AVEVA overview:', err);
        showToast('Failed to load overview data.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
      image_url: url
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAVEVAOverview(formData);
      showToast('AVEVA Overview updated successfully!', 'success');
      window.dispatchEvent(new Event('homeDataUpdated'));
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save AVEVA Overview.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const previewImageUrl = formatImageUrl(formData.image_url || formData.image);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading AVEVA Overview Editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 font-sans">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">AVEVA Overview Section Editor</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage the heading, body description paragraph, and overview image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Section Title</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500"
            placeholder="e.g. AVEVA System Platform & SCADA Solutions"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description Paragraph</label>
          <textarea
            rows={6}
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-500 leading-relaxed"
            placeholder="Enter overview text..."
          />
        </div>

        <div>
          <ImageUploader
            label="Overview Image"
            value={formData.image_url || formData.image}
            onChange={handleImageChange}
          />
        </div>

        {/* IMAGE PREVIEW */}
        {previewImageUrl && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Image Preview</label>
            <div className="w-full max-w-md h-56 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center">
              <img src={previewImageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="w-full px-8 py-3 bg-[#0B192C] hover:bg-[#152a47] disabled:bg-slate-300 text-white font-bold text-xs text-center rounded-xl shadow-md transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save AVEVA Overview'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAvevaOverviewEditor;
