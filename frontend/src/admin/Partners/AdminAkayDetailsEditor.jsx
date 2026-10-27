import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchAKAYDetails, updateAKAYDetails } from '../../services/api';

const DEFAULT_FORM_DATA = {
  environment_title: 'Reliable in Harsh Process Environments',
  environment_description: 'AKAY Industries brings a passion for manufacturing high-quality centrifugal pumps that meet rigorous international standards. Their pumps are renowned for superior hydraulics, robust mechanical seals, and construction from a wide range of corrosion-resistant materials.',
  portfolio_title: 'Our AKAY Pumps Portfolio',
  portfolio_description: 'We offer a comprehensive range of AKAY pumps, each designed to excel in specific fluid handling duties.',
  cards: [
    {
      id: 'card-1',
      title: 'Chemical and Process Pumps',
      description: 'AKAY pumps allow you to handle corrosive and abrasive fluids with absolute confidence.'
    },
    {
      id: 'card-2',
      title: 'Cryogenic Pumps',
      description: 'Maintain efficiency and safety in extreme cold conditions.'
    }
  ],
  advantage_title: 'The ESS-ME Advantage: Your Fluid Handling Partner',
  advantage_description: 'We go beyond supply to ensure your pumping success. Our services include:',
  advantage_bullets: [
    { id: 'b-1', label: 'Technical Selection', detail: 'Guiding you to the perfect pump model and seal for your fluid and duty point.' },
    { id: 'b-2', label: 'Local Spare Parts Support', detail: 'Ensuring rapid availability of critical components to minimize downtime.' },
    { id: 'b-3', label: 'After-Sales Service', detail: 'Providing installation support, maintenance, and troubleshooting.' }
  ],
  industries_title: 'Industries & Applications',
  industries_bullets: [
    { id: 'i-1', label: 'Chemical & Petrochemical', detail: 'Acid transfer, solvent circulation, reactor feed.' },
    { id: 'i-2', label: 'Oil & Gas', detail: 'Produced water, glycol circulation, amine service.' }
  ]
};

const AdminAkayDetailsEditor = () => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAKAYDetails()
      .then((res) => {
        const payload = res?.data || res || {};
        if (payload && (payload.environment_title || payload.cards)) {
          setFormData({
            environment_title: payload.environment_title ?? DEFAULT_FORM_DATA.environment_title,
            environment_description: payload.environment_description ?? DEFAULT_FORM_DATA.environment_description,
            portfolio_title: payload.portfolio_title ?? DEFAULT_FORM_DATA.portfolio_title,
            portfolio_description: payload.portfolio_description ?? DEFAULT_FORM_DATA.portfolio_description,
            cards: Array.isArray(payload.cards) && payload.cards.length > 0 ? payload.cards : DEFAULT_FORM_DATA.cards,
            advantage_title: payload.advantage_title ?? DEFAULT_FORM_DATA.advantage_title,
            advantage_description: payload.advantage_description ?? DEFAULT_FORM_DATA.advantage_description,
            advantage_bullets: Array.isArray(payload.advantage_bullets) ? payload.advantage_bullets : DEFAULT_FORM_DATA.advantage_bullets,
            industries_title: payload.industries_title ?? DEFAULT_FORM_DATA.industries_title,
            industries_bullets: Array.isArray(payload.industries_bullets) ? payload.industries_bullets : DEFAULT_FORM_DATA.industries_bullets,
          });
        }
      })
      .catch((err) => {
        console.error('Error loading AKAY details:', err);
        setFormData(DEFAULT_FORM_DATA);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.cards];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, cards: updated };
    });
  };

  const handleAddCard = () => {
    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, { id: `card-${Date.now()}`, title: 'New Category', description: '' }]
    }));
  };

  const handleRemoveCard = (index) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  const handleAdvantageBulletChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.advantage_bullets];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, advantage_bullets: updated };
    });
  };

  const handleAddAdvantageBullet = () => {
    setFormData((prev) => ({
      ...prev,
      advantage_bullets: [...prev.advantage_bullets, { id: `b-${Date.now()}`, label: 'Label', detail: 'Details...' }]
    }));
  };

  const handleRemoveAdvantageBullet = (index) => {
    setFormData((prev) => ({
      ...prev,
      advantage_bullets: prev.advantage_bullets.filter((_, i) => i !== index)
    }));
  };

  const handleIndustryBulletChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.industries_bullets];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, industries_bullets: updated };
    });
  };

  const handleAddIndustryBullet = () => {
    setFormData((prev) => ({
      ...prev,
      industries_bullets: [...prev.industries_bullets, { id: `i-${Date.now()}`, label: 'Industry', detail: 'Details...' }]
    }));
  };

  const handleRemoveIndustryBullet = (index) => {
    setFormData((prev) => ({
      ...prev,
      industries_bullets: prev.industries_bullets.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAKAYDetails(formData);
      showToast('AKAY Details Section updated successfully!', 'success');
      window.dispatchEvent(new Event('homeDataUpdated'));
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to update section. Please check admin login.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading AKAY Details Editor...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-8 font-sans">
      <div className="pb-5 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          AKAY Industries — Details & Portfolio Section Editor
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage pump categories, ESS-ME advantages, and industry application bullet lists.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. ENVIRONMENT SECTION */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Harsh Environment Section
          </h3>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Heading Title</label>
            <input
              type="text"
              value={formData.environment_title || ''}
              onChange={(e) => handleChange('environment_title', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Environment Description</label>
            <textarea
              rows={3}
              value={formData.environment_description || ''}
              onChange={(e) => handleChange('environment_description', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* 2. PUMPS PORTFOLIO */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Pumps Portfolio & Cards ({(formData.cards || []).length})
            </h3>
            <button
              type="button"
              onClick={handleAddCard}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold"
            >
              + Add Pump Card
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Portfolio Title</label>
              <input
                type="text"
                value={formData.portfolio_title || ''}
                onChange={(e) => handleChange('portfolio_title', e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Portfolio Description</label>
              <textarea
                rows={2}
                value={formData.portfolio_description || ''}
                onChange={(e) => handleChange('portfolio_description', e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {(formData.cards || []).map((card, idx) => (
              <div key={card.id || idx} className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Card #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(idx)}
                    className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md"
                  >
                    Delete Card
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Card Title</label>
                  <input
                    type="text"
                    value={card.title || ''}
                    onChange={(e) => handleCardChange(idx, 'title', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Card Description</label>
                  <textarea
                    rows={4}
                    value={card.description || ''}
                    onChange={(e) => handleCardChange(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. ESS-ME ADVANTAGE */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. ESS-ME Advantage Bullets ({(formData.advantage_bullets || []).length})
            </h3>
            <button
              type="button"
              onClick={handleAddAdvantageBullet}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold"
            >
              + Add Bullet Point
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Advantage Heading</label>
              <input
                type="text"
                value={formData.advantage_title || ''}
                onChange={(e) => handleChange('advantage_title', e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Advantage Intro Text</label>
              <input
                type="text"
                value={formData.advantage_description || ''}
                onChange={(e) => handleChange('advantage_description', e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {(formData.advantage_bullets || []).map((item, idx) => (
              <div key={item.id || idx} className="flex gap-2 items-center bg-white p-3 border border-slate-200 rounded-xl shadow-2xs">
                <input
                  type="text"
                  placeholder="Bold Label"
                  value={item.label || ''}
                  onChange={(e) => handleAdvantageBulletChange(idx, 'label', e.target.value)}
                  className="w-1/3 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                />
                <input
                  type="text"
                  placeholder="Detail text..."
                  value={item.detail || ''}
                  onChange={(e) => handleAdvantageBulletChange(idx, 'detail', e.target.value)}
                  className="w-2/3 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAdvantageBullet(idx)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. INDUSTRIES & APPLICATIONS */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Industries & Applications ({(formData.industries_bullets || []).length})
            </h3>
            <button
              type="button"
              onClick={handleAddIndustryBullet}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold"
            >
              + Add Industry
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Industries Heading</label>
            <input
              type="text"
              value={formData.industries_title || ''}
              onChange={(e) => handleChange('industries_title', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            {(formData.industries_bullets || []).map((item, idx) => (
              <div key={item.id || idx} className="flex gap-2 items-center bg-white p-3 border border-slate-200 rounded-xl shadow-2xs">
                <input
                  type="text"
                  placeholder="Industry Name"
                  value={item.label || ''}
                  onChange={(e) => handleIndustryBulletChange(idx, 'label', e.target.value)}
                  className="w-1/3 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                />
                <input
                  type="text"
                  placeholder="Application details..."
                  value={item.detail || ''}
                  onChange={(e) => handleIndustryBulletChange(idx, 'detail', e.target.value)}
                  className="w-2/3 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIndustryBullet(idx)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FULL WIDTH PUBLISH BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full px-8 py-3 bg-[#1e2738] hover:bg-[#151c28] disabled:bg-slate-300 text-white font-bold text-xs text-center rounded-xl shadow-md transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'SAVE & PUBLISH SOLUTIONS & SUPPORT SECTION'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAkayDetailsEditor;
