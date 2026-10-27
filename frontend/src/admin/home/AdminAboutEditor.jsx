import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHomeAbout, updateHomeAbout } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const AdminAboutEditor = () => {
  const [aboutData, setAboutData] = useState({
    tagline: 'ABOUT OUR COMPANY',
    title: 'WELCOME TO ESSENTIAL INDUSTRIAL SERVICES.',
    description: '',
    secondary_description: '',
    image_url: '',
    floating_badge_title: 'TURNKEY PRECISION',
    floating_badge_subtitle: 'Full-cycle Engineering & EPC Support',
    cta_text: 'Read Company Profile',
    cta_url: '/about',
    mission_statement: '',
    vision_statement: '',
    features: []
  });
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomeAbout()
      .then((res) => {
        const payload = res?.data || res || {};
        const about = payload.about || payload;

        if (about) {
          // Normalize features so plain strings become objects with title & subtitle
          const normalizedFeatures = (about.features || []).map((feat) => {
            if (typeof feat === 'string') {
              return { title: feat, subtitle: '' };
            }
            return {
              title: feat.title || '',
              subtitle: feat.subtitle || feat.description || feat.detail || ''
            };
          });

          setAboutData({
            ...about, // Preserves all extra metadata like line height, html descriptions, etc.
            tagline: about.tagline || '',
            title: about.title || '',
            description: about.description || '',
            secondary_description: about.secondary_description || '',
            image_url: about.image_url || '',
            floating_badge_title: about.floating_badge_title || '',
            floating_badge_subtitle: about.floating_badge_subtitle || '',
            cta_text: about.cta_text || 'Read Company Profile',
            cta_url: about.cta_url || '/about',
            mission_statement: about.mission_statement || '',
            vision_statement: about.vision_statement || '',
            features: normalizedFeatures
          });
        }
      })
      .catch((err) => console.error('Error loading about section:', err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHomeAbout(aboutData);
      showToast('About section updated successfully in MongoDB!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to update About section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureChange = (index, field, value) => {
    setAboutData((prev) => {
      const updated = [...prev.features];
      let currentItem = updated[index];

      if (typeof currentItem === 'string') {
        currentItem = { title: currentItem, subtitle: '' };
      }

      updated[index] = {
        ...currentItem,
        [field]: value
      };

      return { ...prev, features: updated };
    });
  };

  const handleAddFeature = () => {
    setAboutData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        { title: 'New Feature Title', subtitle: 'Detail description line...' }
      ]
    }));
  };

  const handleRemoveFeature = (index) => {
    setAboutData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">About Section Content Manager</h2>
        <p className="text-xs text-slate-500 mt-0.5">Dynamically modify titles, paragraphs, features list, image, badge overlay, and statements.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* 1. HEADINGS & DESCRIPTIONS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Main Content Headers</h3>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tagline / Category</label>
            <input
              type="text"
              value={aboutData.tagline || ''}
              onChange={(e) => setAboutData({ ...aboutData, tagline: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Main Heading Title</label>
            <input
              type="text"
              value={aboutData.title || ''}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Primary Description Paragraph</label>
            <textarea
              rows={3}
              value={aboutData.description || ''}
              onChange={(e) => setAboutData({ ...aboutData, description: e.target.value, description_html: '' })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Secondary Description Paragraph (Optional)</label>
            <textarea
              rows={3}
              value={aboutData.secondary_description || ''}
              onChange={(e) => setAboutData({ ...aboutData, secondary_description: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* 2. IMAGE & FLOATING BADGE */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Plant Image & Overlay Badge</h3>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <ImageUploader
                label="Upload Plant Image"
                value={aboutData.image_url}
                onChange={(url) => setAboutData({ ...aboutData, image_url: url })}
              />
            </div>
            <div className="w-full sm:w-36 h-20 bg-slate-900 border border-slate-300 rounded-lg overflow-hidden flex items-center justify-center shrink-0 mt-4 sm:mt-0">
              {aboutData.image_url ? (
                <img src={aboutData.image_url} alt="About Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[9px] font-bold text-slate-400 uppercase">No Image</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Badge Category Header</label>
              <input
                type="text"
                value={aboutData.floating_badge_title || ''}
                onChange={(e) => setAboutData({ ...aboutData, floating_badge_title: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-blue-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Badge Main Text</label>
              <input
                type="text"
                value={aboutData.floating_badge_subtitle || ''}
                onChange={(e) => setAboutData({ ...aboutData, floating_badge_subtitle: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC CHECKMARK FEATURES */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Checkmark Feature Highlights ({aboutData.features?.length || 0})
            </h3>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Add Feature Item
            </button>
          </div>

          {aboutData.features?.map((feat, idx) => {
            const titleVal = typeof feat === 'string' ? feat : (feat.title || '');
            const subVal = typeof feat === 'object' ? (feat.subtitle || feat.description || feat.detail || '') : '';

            return (
              <div key={idx} className="bg-white p-3 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    Delete Item
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Feature Title (e.g. ISO 9001 Certified Field Engineers)"
                  value={titleVal}
                  onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-bold text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Feature Subtitle / Details Line"
                  value={subVal}
                  onChange={(e) => handleFeatureChange(idx, 'subtitle', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-semibold text-slate-600"
                />
              </div>
            );
          })}
        </div>

        {/* 4. MISSION, VISION & BUTTON CONTROLS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Statements & Call-To-Action Button</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mission Statement</label>
              <textarea
                rows={2}
                value={aboutData.mission_statement || ''}
                onChange={(e) => setAboutData({ ...aboutData, mission_statement: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vision Statement</label>
              <textarea
                rows={2}
                value={aboutData.vision_statement || ''}
                onChange={(e) => setAboutData({ ...aboutData, vision_statement: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CTA Button Text</label>
              <input
                type="text"
                value={aboutData.cta_text || ''}
                onChange={(e) => setAboutData({ ...aboutData, cta_text: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CTA Target Path</label>
              <input
                type="text"
                value={aboutData.cta_url || ''}
                onChange={(e) => setAboutData({ ...aboutData, cta_url: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl shadow-sm text-xs transition-all"
        >
          {saving ? 'Publishing Updates...' : 'Save & Publish About Section'}
        </button>

      </form>
    </div>
  );
};

export default AdminAboutEditor;
