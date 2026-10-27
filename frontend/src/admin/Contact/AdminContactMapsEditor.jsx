import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchContactPage, updateContactSection } from '../../services/api';

const DEFAULT_MAPS = {
  section_title: "Our Locations",
  main_map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.286812852787!2d51.5284!3d25.2693",
  main_map_link: "https://maps.google.com",
  facility_maps: [
    {
      id: "map-1",
      title: "Engineering Facility",
      address: "P.O. Box: 319, Street 14, Industrial Area Doha, Qatar",
      map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.6!2d51.44!3d25.18",
      map_link: "https://maps.google.com"
    },
    {
      id: "map-2",
      title: "Warehouse",
      address: "P.O. Box: 319, Street 46, Industrial Area, Doha, Qatar",
      map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.8!2d51.43!3d25.17",
      map_link: "https://maps.google.com"
    }
  ]
};

const AdminContactMapsEditor = () => {
  const [formData, setFormData] = useState(DEFAULT_MAPS);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.maps_section) {
          setFormData({
            section_title: payload.maps_section.section_title || DEFAULT_MAPS.section_title,
            main_map_embed_url: payload.maps_section.main_map_embed_url || DEFAULT_MAPS.main_map_embed_url,
            main_map_link: payload.maps_section.main_map_link || DEFAULT_MAPS.main_map_link,
            facility_maps: Array.isArray(payload.maps_section.facility_maps) && payload.maps_section.facility_maps.length > 0
              ? payload.maps_section.facility_maps
              : DEFAULT_MAPS.facility_maps
          });
        }
      })
      .catch((err) => console.error('Error loading maps section data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleFacilityChange = (index, field, value) => {
    const updated = [...formData.facility_maps];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, facility_maps: updated }));
  };

  const handleAddFacility = () => {
    setFormData((prev) => ({
      ...prev,
      facility_maps: [
        ...prev.facility_maps,
        {
          id: `map-${Date.now()}`,
          title: 'New Facility Location',
          address: '',
          map_embed_url: '',
          map_link: ''
        }
      ]
    }));
  };

  const handleRemoveFacility = (index) => {
    setFormData((prev) => ({
      ...prev,
      facility_maps: prev.facility_maps.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateContactSection('maps_section', formData);
      showToast('Contact maps section updated successfully!', 'success');
    } catch (err) {
      console.error('Error saving maps section:', err);
      showToast('Failed to update contact maps section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-500 font-medium text-xs">Loading Maps Editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Contact Page Maps Editor</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Configure section headings, main map embed links, and secondary facility locations.
        </p>
      </div>

      {/* FEEDBACK MSG */}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. SECTION TITLE CONTROL */}
        <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
            SECTION HEADING CONTROL
          </h2>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              SECTION TITLE / HEADING
            </label>
            <input
              type="text"
              value={formData.section_title}
              onChange={(e) => setFormData({ ...formData, section_title: e.target.value })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              placeholder="e.g. Our Locations"
              required
            />
          </div>
        </div>

        {/* 2. MAIN OVERVIEW MAP SETTINGS */}
        <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
            MAIN OVERVIEW MAP
          </h2>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              MAIN MAP GOOGLE IFRAME EMBED URL (SRC OR FULL IFRAME CODE)
            </label>
            <input
              type="text"
              value={formData.main_map_embed_url}
              onChange={(e) => setFormData({ ...formData, main_map_embed_url: e.target.value })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              placeholder="https://www.google.com/maps/embed?pb=... or <iframe src=...>"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              EXTERNAL "OPEN IN MAPS" LINK
            </label>
            <input
              type="text"
              value={formData.main_map_link}
              onChange={(e) => setFormData({ ...formData, main_map_link: e.target.value })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>

        {/* 3. SECONDARY FACILITY MAP CARDS */}
        <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
              FACILITY MAP CARDS ({formData.facility_maps.length})
            </h2>
            <button
              type="button"
              onClick={handleAddFacility}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              + Add Facility Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {formData.facility_maps.map((fac, idx) => (
              <div key={fac.id || idx} className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-3 relative shadow-xs">
                
                <button
                  type="button"
                  onClick={() => handleRemoveFacility(idx)}
                  className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                >
                  Remove
                </button>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    FACILITY TITLE
                  </label>
                  <input
                    type="text"
                    value={fac.title}
                    onChange={(e) => handleFacilityChange(idx, 'title', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                    placeholder="e.g. Engineering Facility"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    GOOGLE MAPS EMBED URL (SRC OR FULL IFRAME CODE)
                  </label>
                  <input
                    type="text"
                    value={fac.map_embed_url}
                    onChange={(e) => handleFacilityChange(idx, 'map_embed_url', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    ADDRESS / LOCATION NOTE
                  </label>
                  <input
                    type="text"
                    value={fac.address || ''}
                    onChange={(e) => handleFacilityChange(idx, 'address', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600"
                    placeholder="e.g. Street 14, Industrial Area Doha"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#031A30] hover:bg-[#072545] text-white text-xs font-black tracking-wider uppercase py-4 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>SAVING MAPS...</span>
            </>
          ) : (
            <span>SAVE & PUBLISH MAPS SECTION</span>
          )}
        </button>

      </form>
    </div>
  );
};

export default AdminContactMapsEditor;
