import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { useNavigate } from 'react-router-dom';
import { fetchHomePage, updateFullHomePage, updateHomeSection } from '../../services/api';

const AdminHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [savingSection, setSavingSection] = useState('');
  const [savingFull, setSavingFull] = useState(false);

  // Home Page Initial State matching backend schemas
  const [homeData, setHomeData] = useState({
    hero: {
      tagline: '',
      title: '',
      subtitle: '',
      description: '',
      primary_btn_text: '',
      secondary_btn_text: '',
      video_url: '',
      bg_image_url: '',
      stats: []
    },
    services_summary: {
      heading: '',
      description: ''
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchHomePage()
      .then((res) => {
        const data = res?.data || res || {};
        if (data) {
          setHomeData({
            hero: {
              tagline: data.hero?.tagline || '',
              title: data.hero?.title || '',
              subtitle: data.hero?.subtitle || '',
              description: data.hero?.description || '',
              primary_btn_text: data.hero?.primary_btn_text || '',
              secondary_btn_text: data.hero?.secondary_btn_text || '',
              video_url: data.hero?.video_url || '',
              bg_image_url: data.hero?.bg_image_url || '',
              stats: data.hero?.stats || []
            },
            services_summary: data.services_summary || { heading: '', description: '' }
          });
        }
      })
      .catch((err) => {
        console.error('Fetch Home Page error:', err);
        showToast('Failed to load Home Page content from database.', 'error');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Save Full Page (PUT)
  const handleSaveFullPage = async (e) => {
    e.preventDefault();
    setSavingFull(true);

    try {
      await updateFullHomePage(homeData);
      showToast('Full Home Page updated successfully in MongoDB!', 'success');
    } catch (err) {
      console.error('Save Full Page error:', err);
      showToast('Failed to update full home page content.', 'error');
    } finally {
      setSavingFull(false);
    }
  };

  // Save Single Section (PATCH)
  const handleSaveSection = async (sectionName, sectionPayload) => {
    setSavingSection(sectionName);

    try {
      await updateHomeSection(sectionName, sectionPayload);
      showToast(`Section '${sectionName}' updated successfully!`, "success");
    } catch (err) {
      console.error(`Save section ${sectionName} error:`, err);
      showToast(`Failed to update ${sectionName} section.`, "error");
    } finally {
      setSavingSection('');
    }
  };

  // Metric Stat List Handlers
  const handleStatChange = (index, field, value) => {
    const updatedStats = [...(homeData.hero.stats || [])];
    updatedStats[index][field] = value;
    setHomeData({
      ...homeData,
      hero: { ...homeData.hero, stats: updatedStats }
    });
  };

  const handleAddStat = () => {
    const updatedStats = [...(homeData.hero.stats || []), { label: 'NEW METRIC', value: '0+' }];
    setHomeData({
      ...homeData,
      hero: { ...homeData.hero, stats: updatedStats }
    });
    showToast('New metric stat added.', 'success');
  };

  const handleRemoveStat = (index) => {
    const updatedStats = homeData.hero.stats.filter((_, i) => i !== index);
    setHomeData({
      ...homeData,
      hero: { ...homeData.hero, stats: updatedStats }
    });
    showToast('Metric stat removed.', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600 font-semibold text-xs animate-pulse">Loading Home Page Content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Home Page Content Manager</h1>
            <p className="text-xs text-slate-500 mt-0.5">Update individual sections (PATCH) or save full page content (PUT).</p>
          </div>
          <button
            type="button"
            onClick={handleSaveFullPage}
            disabled={savingFull}
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            {savingFull ? 'Saving All...' : 'Save Full Page (PUT)'}
          </button>
        </div>


        <div className="space-y-6">

          {/* 1. HERO SECTION */}
          <div className="bg-slate-50 p-5 border border-slate-200 rounded-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Hero Section</h3>
              <button
                type="button"
                onClick={() => handleSaveSection('hero', homeData.hero)}
                disabled={savingSection === 'hero'}
                className="text-xs font-bold text-blue-600 bg-white border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition-all"
              >
                {savingSection === 'hero' ? 'Saving...' : 'Save Hero (PATCH)'}
              </button>
            </div>

            <div className="space-y-3">
              
              {/* BACKGROUND IMAGE URL & PREVIEW */}
              <div className="bg-white p-3 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Background Image Path / URL</label>

                {/* DIMENSION REQUIREMENT NOTE */}
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                  <span className="text-amber-500 text-base mt-0.5" aria-hidden="true">⚠️</span>
                  <div>
                    <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Required Image Dimensions</p>
                    <p className="text-[11px] text-amber-600 mt-0.5">Upload images at exactly <strong>1024px × 441px</strong> for best display.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={homeData.hero.bg_image_url}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, bg_image_url: e.target.value } })}
                    className="flex-1 w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                    placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  />
                  {/* Visual Preview Box */}
                  <div className="w-full sm:w-36 h-12 bg-slate-900 border border-slate-300 rounded-lg overflow-hidden flex items-center justify-center">
                    {homeData.hero.bg_image_url ? (
                      <img 
                        src={homeData.hero.bg_image_url} 
                        alt="Hero Preview" 
                        className="w-full h-full object-cover opacity-70"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400">No Image</span>
                    )}
                  </div>
                </div>
              </div>

              {/* TAGLINE */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tagline / Badge</label>
                <input
                  type="text"
                  value={homeData.hero.tagline}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, tagline: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>

              {/* TITLE */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hero Title</label>
                <input
                  type="text"
                  value={homeData.hero.title}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              {/* SUBTITLE */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={homeData.hero.subtitle}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, subtitle: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-blue-600"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description Paragraph</label>
                <textarea
                  rows={2}
                  value={homeData.hero.description}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>

              {/* BUTTONS & VIDEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={homeData.hero.primary_btn_text}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, primary_btn_text: e.target.value } })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={homeData.hero.secondary_btn_text}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, secondary_btn_text: e.target.value } })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Video URL (Secondary Button Link)</label>
                <input
                  type="text"
                  value={homeData.hero.video_url}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, video_url: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>

            </div>
          </div>

          {/* 2. PERFORMANCE METRICS STATS ARRAY */}
          <div className="bg-slate-50 p-5 border border-slate-200 rounded-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Performance Metrics ({homeData.hero.stats?.length || 0})
              </h3>
              <button
                type="button"
                onClick={handleAddStat}
                className="text-xs font-bold text-blue-600 bg-white border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition-all"
              >
                + Add Metric
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {homeData.hero.stats?.map((stat, idx) => (
                <div key={idx} className="bg-white p-3 border border-slate-200 rounded-lg space-y-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-[10px] font-semibold uppercase text-slate-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="text-[10px] font-bold text-rose-600 hover:underline pt-1 block"
                  >
                    Delete Metric
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. SERVICES SUMMARY HEADING SECTION */}
          <div className="bg-slate-50 p-5 border border-slate-200 rounded-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">3. Services Overview Heading</h3>
              <button
                type="button"
                onClick={() => handleSaveSection('services_summary', homeData.services_summary)}
                disabled={savingSection === 'services_summary'}
                className="text-xs font-bold text-blue-600 bg-white border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition-all"
              >
                {savingSection === 'services_summary' ? 'Saving...' : 'Save Overview (PATCH)'}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Section Heading</label>
                <input
                  type="text"
                  value={homeData.services_summary.heading}
                  onChange={(e) => setHomeData({ ...homeData, services_summary: { ...homeData.services_summary, heading: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Section Description</label>
                <textarea
                  rows={2}
                  value={homeData.services_summary.description}
                  onChange={(e) => setHomeData({ ...homeData, services_summary: { ...homeData.services_summary, description: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* FULL PAGE SAVE BUTTON */}
          <button
            type="button"
            onClick={handleSaveFullPage}
            disabled={savingFull}
            className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl shadow-sm text-xs transition-all"
          >
            {savingFull ? 'Updating MongoDB Database...' : 'Save & Publish Full Home Page (PUT)'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminHome;