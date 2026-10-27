import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchHomeMissionVision, updateHomeMissionVision } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const AdminMissionVisionEditor = () => {
  const [formData, setFormData] = useState({
    tagline: 'ENGEN',
    mission_title: 'MISSION STATEMENT',
    mission_heading: '',
    mission_quote: '',
    mission_points: [],
    vision_title: 'OUR VISION',
    vision_heading: '',
    vision_quote: '',
    vision_points: [],
    cta_text: 'DISCOVER CAPABILITIES',
    cta_url: '/capabilities',
    center_circle_title: 'ESS',
    center_circle_subtitle: 'SYSTEMS & SERVICES',
    center_logo_url: '',
    hexagon_nodes: []
  });
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomeMissionVision()
      .then((res) => {
        const payload = res?.data || res || {};
        const mvData = payload.mission_vision || payload;

        if (mvData) {
          setFormData({
            tagline: mvData.tagline ?? 'ENGEN',
            mission_title: mvData.mission_title ?? 'MISSION STATEMENT',
            mission_heading: mvData.mission_heading || mvData.mission_description || '',
            mission_quote: mvData.mission_quote ?? '',
            mission_points: Array.isArray(mvData.mission_points) ? mvData.mission_points : [],
            vision_title: mvData.vision_title ?? 'OUR VISION',
            vision_heading: mvData.vision_heading || mvData.vision_description || '',
            vision_quote: mvData.vision_quote ?? '',
            vision_points: Array.isArray(mvData.vision_points) ? mvData.vision_points : [],
            cta_text: mvData.cta_text ?? 'DISCOVER CAPABILITIES',
            cta_url: mvData.cta_url ?? '/capabilities',
            center_circle_title: mvData.center_circle_title ?? 'ESS',
            center_circle_subtitle: mvData.center_circle_subtitle ?? 'SYSTEMS & SERVICES',
            center_logo_url: mvData.center_logo_url ?? '',
            hexagon_nodes: Array.isArray(mvData.hexagon_nodes)
              ? mvData.hexagon_nodes.map((node) => ({
                ...node,
                image_url: node.image_url || node.image || '',
                image: node.image_url || node.image || '',
                icon_url: node.icon_url || node.icon || '',
                icon: node.icon_url || node.icon || 'fire',
                url: node.url || node.link || '/products'
              }))
              : []
          });
        }
      })
      .catch((err) => console.error('Error loading Mission/Vision section:', err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payloadToSave = {
      ...formData,
      mission_description: formData.mission_heading || '',
      vision_description: formData.vision_heading || '',
      center_logo_url: formData.center_logo_url || '',
      hexagon_nodes: formData.hexagon_nodes.map((node) => ({
        ...node,
        image_url: node.image_url || node.image || '',
        image: node.image_url || node.image || '',
        icon_url: node.icon_url || node.icon || '',
        icon: node.icon_url || node.icon || '',
        url: node.url || node.link || '/products',
        link: node.url || node.link || '/products'
      }))
    };

    try {
      await updateHomeMissionVision(payloadToSave);
      showToast('Mission, Vision & Hexagon Nodes published successfully!', 'success');

      // Dispatch custom event so the user-facing home page re-renders immediately
      window.dispatchEvent(new Event('homeDataUpdated'));
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to update section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- MISSION POINTS HANDLERS ---
  const handleAddMissionPoint = () => {
    setFormData((prev) => ({
      ...prev,
      mission_points: [
        ...(prev.mission_points || []),
        { id: `mp-${Date.now()}`, title: '', description: '' }
      ]
    }));
  };

  const handleMissionPointChange = (idx, field, val) => {
    setFormData((prev) => ({
      ...prev,
      mission_points: prev.mission_points.map((pt, i) =>
        i === idx ? { ...pt, [field]: val } : pt
      )
    }));
  };

  const handleRemoveMissionPoint = (idx) => {
    setFormData((prev) => ({
      ...prev,
      mission_points: prev.mission_points.filter((_, i) => i !== idx)
    }));
  };

  // --- VISION POINTS HANDLERS ---
  const handleAddVisionPoint = () => {
    setFormData((prev) => ({
      ...prev,
      vision_points: [
        ...(prev.vision_points || []),
        { id: `vp-${Date.now()}`, title: '', description: '' }
      ]
    }));
  };

  const handleVisionPointChange = (idx, field, val) => {
    setFormData((prev) => ({
      ...prev,
      vision_points: prev.vision_points.map((pt, i) =>
        i === idx ? { ...pt, [field]: val } : pt
      )
    }));
  };

  const handleRemoveVisionPoint = (idx) => {
    setFormData((prev) => ({
      ...prev,
      vision_points: prev.vision_points.filter((_, i) => i !== idx)
    }));
  };

  // --- HEXAGON NODE HANDLERS ---
  const handleNodeChange = (idx, field, val) => {
    setFormData((prev) => ({
      ...prev,
      hexagon_nodes: prev.hexagon_nodes.map((node, i) =>
        i === idx ? { ...node, [field]: val } : node
      )
    }));
  };

  const handleAddNode = () => {
    setFormData((prev) => ({
      ...prev,
      hexagon_nodes: [
        ...prev.hexagon_nodes,
        {
          id: `hex-${Date.now()}`,
          title: 'New Node',
          url: '/products',
          link: '/products',
          bg_color: '#dc2626',
          image_url: '',
          image: '',
          icon_url: '',
          icon: ''
        }
      ]
    }));
  };

  const handleRemoveNode = (idx) => {
    setFormData((prev) => ({
      ...prev,
      hexagon_nodes: prev.hexagon_nodes.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Mission, Vision & Center Circle Manager</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Edit texts, headings, solution points, center logo badge, CTA button, and outer hexagon nodes with card images, center icons, and custom URLs.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* CENTER CIRCLE / BRAND BADGE */}
        <div className="bg-blue-50/60 p-4 border border-blue-200 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Center Circle / Brand Badge</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Center Title Text (Fallback)</label>
              <input
                type="text"
                placeholder="e.g. ESS"
                value={formData.center_circle_title || ''}
                onChange={(e) => setFormData({ ...formData, center_circle_title: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-black text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Center Subtitle Text (Fallback)</label>
              <input
                type="text"
                placeholder="e.g. SYSTEMS & SERVICES"
                value={formData.center_circle_subtitle || ''}
                onChange={(e) => setFormData({ ...formData, center_circle_subtitle: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-600"
              />
            </div>
          </div>

          <div className="bg-white p-3.5 border border-slate-200 rounded-xl space-y-3 shadow-xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Center Circle Logo Image
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <ImageUploader
                  label="Upload Center Logo Image"
                  value={formData.center_logo_url || ''}
                  onChange={(url) => setFormData({ ...formData, center_logo_url: url })}
                />
              </div>

              <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-full overflow-hidden flex items-center justify-center p-2 shrink-0 relative shadow-inner">
                {formData.center_logo_url ? (
                  <>
                    <img
                      src={formData.center_logo_url}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, center_logo_url: '' })}
                      className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow hover:bg-rose-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="text-[9px] font-bold text-slate-300 uppercase text-center leading-tight">No Logo</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MISSION CONTROLS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mission Statement Controls</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mission Tagline</label>
            <input
              type="text"
              placeholder="Tagline (e.g. ENGEN)"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded text-xs font-semibold bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mission Title</label>
            <input
              type="text"
              placeholder="Mission Title (e.g. MISSION STATEMENT)"
              value={formData.mission_title || ''}
              onChange={(e) => setFormData({ ...formData, mission_title: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded text-xs font-bold bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mission Quote (Supports Multi-line)</label>
            <textarea
              rows={3}
              placeholder="Mission Quote"
              value={formData.mission_quote || ''}
              onChange={(e) => setFormData({ ...formData, mission_quote: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded text-xs font-bold whitespace-pre-line bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mission Heading</label>
            <input
              type="text"
              placeholder="Mission Heading (e.g. Featured Solutions (Saudi priority order))"
              value={formData.mission_heading || ''}
              onChange={(e) => setFormData({ ...formData, mission_heading: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded text-xs font-bold bg-white"
            />
          </div>

          {/* MISSION POINTS */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Mission Points / Solutions ({(formData.mission_points || []).length})
              </label>
              <button
                type="button"
                onClick={handleAddMissionPoint}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                + Add Point
              </button>
            </div>

            <div className="space-y-3">
              {(formData.mission_points || []).map((pt, idx) => (
                <div key={pt.id || idx} className="bg-white p-3 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Title (e.g. Upstream Instrumentation & Water Cut Metering)"
                      value={pt.title || ''}
                      onChange={(e) => handleMissionPointChange(idx, 'title', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMissionPoint(idx)}
                      className="text-xs font-bold text-rose-600 shrink-0 px-1 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Description text..."
                    value={pt.description || ''}
                    onChange={(e) => handleMissionPointChange(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-normal text-slate-600 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VISION CONTROLS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Vision Controls</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vision Title</label>
            <input
              type="text"
              placeholder="Vision Title (e.g. OUR VISION)"
              value={formData.vision_title || ''}
              onChange={(e) => setFormData({ ...formData, vision_title: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded text-xs font-bold bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vision Quote (Supports Multi-line)</label>
            <textarea
              rows={3}
              placeholder="Vision Quote"
              value={formData.vision_quote || ''}
              onChange={(e) => setFormData({ ...formData, vision_quote: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded text-xs font-bold whitespace-pre-line bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vision Heading</label>
            <input
              type="text"
              placeholder="Vision Heading (e.g. Strategic Goals)"
              value={formData.vision_heading || ''}
              onChange={(e) => setFormData({ ...formData, vision_heading: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded text-xs font-bold bg-white"
            />
          </div>

          {/* VISION POINTS */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Vision Points ({(formData.vision_points || []).length})
              </label>
              <button
                type="button"
                onClick={handleAddVisionPoint}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                + Add Point
              </button>
            </div>

            <div className="space-y-3">
              {(formData.vision_points || []).map((pt, idx) => (
                <div key={pt.id || idx} className="bg-white p-3 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Title (e.g. Point Title)"
                      value={pt.title || ''}
                      onChange={(e) => handleVisionPointChange(idx, 'title', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVisionPoint(idx)}
                      className="text-xs font-bold text-rose-600 shrink-0 px-1 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Description text..."
                    value={pt.description || ''}
                    onChange={(e) => handleVisionPointChange(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-normal text-slate-600 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CALL TO ACTION BUTTON CONTROLS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Call-To-Action Button Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Text</label>
              <input
                type="text"
                placeholder="e.g. DISCOVER CAPABILITIES"
                value={formData.cta_text || ''}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target URL Path</label>
              <input
                type="text"
                placeholder="e.g. /capabilities"
                value={formData.cta_url || ''}
                onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* HEXAGON NODES */}
        <div className="bg-slate-50 p-5 border border-slate-200/80 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Hexagon Wheel Nodes ({formData.hexagon_nodes.length})
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Configure outer cards, images, center badges, and link destinations.</p>
            </div>
            <button
              type="button"
              onClick={handleAddNode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <span>+</span> Add Node
            </button>
          </div>

          <div className="space-y-4">
            {formData.hexagon_nodes.map((node, idx) => (
              <div key={node.id || idx} className="bg-white p-4 border border-slate-200 rounded-xl space-y-4 shadow-xs hover:border-slate-300 transition-colors">

                {/* NODE METADATA ROW */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Node Title</label>
                    <input
                      type="text"
                      placeholder="e.g. System Integration"
                      value={node.title || ''}
                      onChange={(e) => handleNodeChange(idx, 'title', e.target.value)}
                      className="w-full p-2 bg-slate-50/50 border border-slate-300 focus:bg-white rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Link Path</label>
                    <input
                      type="text"
                      placeholder="e.g. /products/integration"
                      value={node.url || node.link || ''}
                      onChange={(e) => {
                        handleNodeChange(idx, 'url', e.target.value);
                        handleNodeChange(idx, 'link', e.target.value);
                      }}
                      className="w-full p-2 bg-slate-50/50 border border-slate-300 focus:bg-white rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Card Color</label>
                    <div className="flex items-center gap-2 bg-slate-50/50 p-1 border border-slate-300 rounded-lg">
                      <input
                        type="color"
                        value={node.bg_color || '#dc2626'}
                        onChange={(e) => handleNodeChange(idx, 'bg_color', e.target.value)}
                        className="w-8 h-7 p-0 border-0 rounded cursor-pointer shrink-0 bg-transparent"
                      />
                      <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">
                        {node.bg_color || '#dc2626'}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveNode(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      title="Delete Node"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* IMAGES & BADGE CONFIGURATION SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-slate-100">

                  {/* 1. TOP CARD BACKGROUND IMAGE */}
                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/60 space-y-2">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Top Card Background Image
                    </span>
                    <ImageUploader
                      label=""
                      value={node.image_url || node.image || ''}
                      onChange={(uploadedUrl) => {
                        handleNodeChange(idx, 'image_url', uploadedUrl);
                        handleNodeChange(idx, 'image', uploadedUrl);
                      }}
                    />
                  </div>

                  {/* 2. FLOATING CENTER BADGE ICON / IMAGE */}
                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/60 space-y-2">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Floating Center Badge Icon / Image
                    </span>
                    <ImageUploader
                      label=""
                      value={node.icon_url || node.icon || ''}
                      onChange={(uploadedUrl) => {
                        handleNodeChange(idx, 'icon_url', uploadedUrl);
                        handleNodeChange(idx, 'icon', uploadedUrl);
                      }}
                    />
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 uppercase tracking-wider"
        >
          {saving ? 'Publishing Updates...' : 'Save & Publish Section'}
        </button>

      </form>
    </div>
  );
};

export default AdminMissionVisionEditor;
