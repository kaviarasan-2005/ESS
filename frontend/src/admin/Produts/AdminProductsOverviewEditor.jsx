import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchProductsPage, updateProductsSection } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const AdminProductsOverviewEditor = () => {
  const [formData, setFormData] = useState({
    paragraph_1: '',
    paragraph_2: '',
    button_text: 'Contact Us',
    button_link: '/contact',
    image_url: '',
  });
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch live Overview/Content section data on mount
  useEffect(() => {
    fetchProductsPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const contentData = payload.content || {};

        setFormData({
          paragraph_1:
            contentData.paragraph_1 ||
            'ESS Middle East embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.',
          paragraph_2:
            contentData.paragraph_2 ||
            'We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.',
          button_text: contentData.button_text || 'Contact Us',
          button_link: contentData.button_link || '/contact',
          image_url: contentData.image_url || '',
        });
      })
      .catch((err) => console.error('Error fetching Products Overview settings:', err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Handle Image Upload Callback
  const handleImageChange = (newUrl) => {
    setFormData((prev) => ({
      ...prev,
      image_url: newUrl || '',
    }));
  };

  // 3. Save Payload via PATCH /api/products/section/content
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProductsSection('content', formData);
      showToast('Products overview section updated successfully!', 'success');
    } catch (err) {
      console.error('Error saving Products overview section:', err);
      showToast('Failed to update Products overview section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Overview Settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Products Overview Section</h1>
        <p className="text-xs text-slate-500">
          Manage the introduction paragraphs, call-to-action button, and featured industrial image.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* PARAGRAPHS SETTINGS */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Overview Text Paragraphs
          </h2>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Paragraph 1
            </label>
            <textarea
              rows={3}
              value={formData.paragraph_1}
              onChange={(e) => setFormData({ ...formData, paragraph_1: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first paragraph content..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Paragraph 2
            </label>
            <textarea
              rows={3}
              value={formData.paragraph_2}
              onChange={(e) => setFormData({ ...formData, paragraph_2: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter second paragraph content..."
            />
          </div>
        </div>

        {/* BUTTON SETTINGS */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Call To Action Button
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={formData.button_text}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Contact Us"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Button Link / Route
              </label>
              <input
                type="text"
                value={formData.button_link}
                onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. /contact"
              />
            </div>
          </div>
        </div>

        {/* FEATURED IMAGE UPLOADER & LIVE PREVIEW */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Featured Side Image
          </h2>

          <ImageUploader
            label="Upload Network / Industry Image"
            value={formData.image_url}
            onChange={handleImageChange}
          />

          {formData.image_url ? (
            <div className="space-y-2 pt-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Section Image Preview
              </span>
              <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                <img
                  key={formData.image_url}
                  src={formData.image_url}
                  alt="Overview Featured"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageChange('')}
                  className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow transition-colors"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs font-medium text-slate-400">
              No image uploaded yet. Click above to select an image from your computer.
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white text-xs font-bold py-3.5 rounded-lg shadow transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <span>Save Section Changes</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminProductsOverviewEditor;