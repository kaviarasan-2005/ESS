import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHomeHero, updateHomeHero } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const AdminHeroEditor = () => {
  const [slides, setSlides] = useState([]);
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomeHero()
      .then((res) => {
        const payload = res?.data || res || {};
        const heroData = payload.hero || payload;

        if (Array.isArray(heroData.slides) && heroData.slides.length > 0) {
          setSlides(heroData.slides);
        } else {
          setSlides([
            {
              id: '1',
              image_url: heroData.image_url || heroData.bg_image_url || '',
              tagline: heroData.tagline || 'WELCOME TO ESS',
              main_title: heroData.main_title || heroData.title || 'ESSENTIAL SYSTEMS & SERVICES',
              subtitle: heroData.subtitle || 'Industrial Equipment & Solutions',
              description: heroData.description || 'Providing world-class engineering capabilities.',
              primary_btn_text: heroData.primary_btn_text || 'OUR SERVICES',
              primary_btn_url: heroData.primary_btn_url || '/services',
              secondary_btn_text: heroData.secondary_btn_text || 'CONTACT US',
              secondary_btn_url: heroData.secondary_btn_url || '/contact',
              stats: heroData.stats || [
                { value: '75+', label: 'YEARS EXPERIENCE' },
                { value: '50K+', label: 'PROJECTS COMPLETED' }
              ]
            }
          ]);
        }
      })
      .catch((err) => {
        console.error('Error fetching Hero section:', err);
        showToast('Failed to load Hero slides.', 'error');
      });
  }, []);

  const handleSlideChange = (index, field, value) => {
    setSlides((prev) =>
      prev.map((slide, i) => (i === index ? { ...slide, [field]: value } : slide))
    );
  };

  const handleAddSlide = () => {
    setSlides((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        image_url: '',
        tagline: 'NEW SLIDE TAGLINE',
        main_title: 'New Slide Title',
        subtitle: 'New Subtitle',
        description: 'New slide description...',
        primary_btn_text: 'EXPLORE',
        primary_btn_url: '/services',
        secondary_btn_text: 'CONTACT',
        secondary_btn_url: '/contact',
        stats: []
      }
    ]);
    showToast('New slide added.', 'success');
  };

  const handleRemoveSlide = (index) => {
    if (slides.length <= 1) {
      showToast('You must keep at least one slide.', 'info');
      return;
    }
    setSlides((prev) => prev.filter((_, i) => i !== index));
    showToast('Slide removed.', 'info');
  };

  // PER-SLIDE STAT HANDLERS
  const handleAddSlideStat = (slideIdx) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === slideIdx
          ? { ...slide, stats: [...(slide.stats || []), { value: '100%', label: 'NEW STAT' }] }
          : slide
      )
    );
  };

  const handleSlideStatChange = (slideIdx, statIdx, field, val) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === slideIdx
          ? {
            ...slide,
            stats: slide.stats.map((st, sIdx) =>
              sIdx === statIdx ? { ...st, [field]: val } : st
            )
          }
          : slide
      )
    );
  };

  const handleRemoveSlideStat = (slideIdx, statIdx) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === slideIdx
          ? { ...slide, stats: slide.stats.filter((_, sIdx) => sIdx !== statIdx) }
          : slide
      )
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateHomeHero({ slides });
      showToast('Hero Slides and Slide-Specific Stats updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating Hero Section:', err);
      showToast('Failed to update Hero section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hero Carousel Manager</h1>
          <p className="text-xs text-slate-500">Configure background images, content, buttons, and stats for each individual slide.</p>
        </div>
        <button
          type="button"
          onClick={handleAddSlide}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-all"
        >
          + Add New Slide
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {slides.map((slide, idx) => (
          <div key={slide.id || idx} className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-sm relative">

            {/* CARD HEADER */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Slide #{idx + 1} Configuration</span>
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSlide(idx)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                >
                  Delete Slide
                </button>
              )}
            </div>

            {/* BACKGROUND IMAGE UPLOADER */}
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Slide Background Image</label>

              {/* PREVIEW — full width on top */}
              <div className="w-full h-44 bg-slate-900 border rounded-xl overflow-hidden flex items-center justify-center relative">
                {slide.image_url ? (
                  <img src={slide.image_url} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 uppercase">No Image Set</span>
                )}
              </div>

              {/* DIMENSION REQUIREMENT NOTE */}
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                <span className="text-amber-500 text-base mt-0.5" aria-hidden="true">⚠️</span>
                <div>
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Required Image Dimensions</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">Upload images at exactly <strong>1920px × 1080px</strong> for best display</p>
                </div>
              </div>

              <div className="w-full">
                <ImageUploader
                  label={slide.image_url ? "Change Background Image" : "Upload Background Image"}
                  onChange={(url) => handleSlideChange(idx, 'image_url', url)}
                />
              </div>
            </div>

            {/* TEXT FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={slide.tagline || ''}
                  onChange={(e) => handleSlideChange(idx, 'tagline', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Main Title</label>
                <input
                  type="text"
                  value={slide.main_title || ''}
                  onChange={(e) => handleSlideChange(idx, 'main_title', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subtitle</label>
              <input
                type="text"
                value={slide.subtitle || ''}
                onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
              <textarea
                rows={2}
                value={slide.description || ''}
                onChange={(e) => handleSlideChange(idx, 'description', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>

            {/* BUTTON ACTION LINKS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Primary Btn Text</label>
                <input
                  type="text"
                  value={slide.primary_btn_text || ''}
                  onChange={(e) => handleSlideChange(idx, 'primary_btn_text', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Primary Btn URL</label>
                <input
                  type="text"
                  value={slide.primary_btn_url || ''}
                  onChange={(e) => handleSlideChange(idx, 'primary_btn_url', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Secondary Btn Text</label>
                <input
                  type="text"
                  value={slide.secondary_btn_text || ''}
                  onChange={(e) => handleSlideChange(idx, 'secondary_btn_text', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Secondary Btn URL</label>
                <input
                  type="text"
                  value={slide.secondary_btn_url || ''}
                  onChange={(e) => handleSlideChange(idx, 'secondary_btn_url', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                />
              </div>
            </div>

            {/* PER-SLIDE STATS COUNTERS */}
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-700 uppercase">
                  Stats Counters For Slide #{idx + 1} ({slide.stats?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddSlideStat(idx)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  + Add Stat To This Slide
                </button>
              </div>

              {slide.stats && slide.stats.length > 0 ? (
                <div className="space-y-2">
                  {slide.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="flex gap-2 items-center bg-white p-2 border border-slate-200 rounded-md">
                      <input
                        type="text"
                        placeholder="Value (e.g. 75+)"
                        value={stat.value || ''}
                        onChange={(e) => handleSlideStatChange(idx, sIdx, 'value', e.target.value)}
                        className="w-1/3 p-1.5 border border-slate-300 rounded text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. YEARS EXPERIENCE)"
                        value={stat.label || ''}
                        onChange={(e) => handleSlideStatChange(idx, sIdx, 'label', e.target.value)}
                        className="flex-1 p-1.5 border border-slate-300 rounded text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSlideStat(idx, sIdx)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">No stats assigned to this slide (Optional).</p>
              )}
            </div>

          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white text-xs font-bold py-3.5 rounded-lg shadow transition-all"
        >
          {saving ? 'Saving Changes...' : 'Save & Publish Hero Carousel'}
        </button>
      </form>
    </div>
  );
};

export default AdminHeroEditor;