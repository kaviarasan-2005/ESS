import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAVEVADetails, updateAVEVADetails } from '../../services/api';

const AdminAvevaDetailsEditor = () => {
  const [formData, setFormData] = useState({
    features: [],
    applications_title: 'Key Applications',
    key_applications: []
  });
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAVEVADetails()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload) {
          setFormData({
            features: payload.features || [],
            applications_title: payload.applications_title || 'Key Applications',
            key_applications: payload.key_applications || []
          });
        }
      })
      .catch((err) => {
        console.error('Error loading AVEVA details:', err);
        showToast('Failed to load details data.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  // Feature item handlers
  const handleFeatureChange = (index, field, value) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        { id: `feat-${Date.now()}`, title: '', description: '' }
      ]
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Key Applications handlers
  const handleAppChange = (index, field, value) => {
    const updated = [...formData.key_applications];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, key_applications: updated }));
  };

  const addApp = () => {
    setFormData((prev) => ({
      ...prev,
      key_applications: [
        ...prev.key_applications,
        { id: `app-${Date.now()}`, industry: '', details: '' }
      ]
    }));
  };

  const removeApp = (index) => {
    setFormData((prev) => ({
      ...prev,
      key_applications: prev.key_applications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAVEVADetails(formData);
      showToast('AVEVA Solutions Details updated successfully!', 'success');
      window.dispatchEvent(new Event('homeDataUpdated'));
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save details.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading AVEVA Details Editor...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-8 font-sans">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">AVEVA Solutions Features & Applications Editor</h2>
        <p className="text-xs text-slate-500 mt-1">Manage feature paragraphs and industry key applications bullet points.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: FEATURES LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Solution Features</h3>
            <button type="button" onClick={addFeature} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
              + Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {formData.features.map((feat, idx) => (
              <div key={feat.id || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                <button type="button" onClick={() => removeFeature(idx)} className="absolute top-3 right-3 text-rose-600 hover:text-rose-800 text-xs font-bold">
                  Delete
                </button>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Feature Title</label>
                  <input
                    type="text"
                    value={feat.title || ''}
                    onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description Paragraph</label>
                  <textarea
                    rows={4}
                    value={feat.description || ''}
                    onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: KEY APPLICATIONS */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Key Applications</h3>
            <button type="button" onClick={addApp} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
              + Add Application
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Applications Heading Title</label>
            <input
              type="text"
              value={formData.applications_title || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, applications_title: e.target.value }))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {formData.key_applications.map((app, idx) => (
              <div key={app.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center relative">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Industry (e.g. Oil & Gas)"
                    value={app.industry || ''}
                    onChange={(e) => handleAppChange(idx, 'industry', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-7">
                  <input
                    type="text"
                    placeholder="Details description..."
                    value={app.details || ''}
                    onChange={(e) => handleAppChange(idx, 'details', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-1 text-right">
                  <button type="button" onClick={() => removeApp(idx)} className="text-rose-600 hover:text-rose-800 text-xs font-bold">
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="w-full px-8 py-3 bg-[#0B192C] hover:bg-[#152a47] disabled:bg-slate-300 text-white font-bold text-xs text-center rounded-xl shadow-md transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save AVEVA Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAvevaDetailsEditor;
