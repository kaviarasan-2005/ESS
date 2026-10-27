import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchFooter, updateFooter } from '../../services/footerService';
import ImageUploader from '../../components/ImageUploader';

const AdminFooterEditor = () => {
  const [formData, setFormData] = useState({
    bg_image_url: '',
    logo_url: '',
    description: 'Integrated engineering solutions, life-safety instrumentation, and industrial process control.',
    socials: [],
    quick_links: [],
    products: [],
    reach_us: {
      company_name: 'Essential Systems and Services',
      address: 'P.O. Box: 319, Buzwair Commercial Building, Al Mansoura, Zone: 25, Street: 330, Building: 57, Doha, Qatar.',
      email: 'sales@essme.com',
      phone: '+974 4405 9666'
    },
    terms_label: 'Terms & Conditions',
    terms_url: '/terms',
    privacy_label: 'Privacy Policy',
    privacy_url: '/privacy',
    copyright_text: 'Copyright © 2026 Essential Systems and Services - All rights reserved.'
  });
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFooter()
      .then((res) => {
        // /api/footer returns { success: true, data: { ...footerFields } }
        const footerData = res?.data || {};

        if (footerData) {
          setFormData({
            bg_image_url: footerData.bg_image_url ?? '',
            logo_url: footerData.logo_url ?? '',
            description: footerData.description ?? '',
            socials: footerData.socials || [],
            quick_links: footerData.quick_links || [],
            products: footerData.products || [],
            reach_us: {
              company_name: footerData.reach_us?.company_name ?? 'Essential Systems and Services',
              address: footerData.reach_us?.address ?? '',
              email: footerData.reach_us?.email ?? '',
              phone: footerData.reach_us?.phone ?? ''
            },
            terms_label: footerData.terms_label ?? 'Terms & Conditions',
            terms_url: footerData.terms_url ?? '/terms',
            privacy_label: footerData.privacy_label ?? 'Privacy Policy',
            privacy_url: footerData.privacy_url ?? '/privacy',
            copyright_text: footerData.copyright_text ?? 'Copyright © 2026 Essential Systems and Services - All rights reserved.'
          });
        }
      })
      .catch((err) => console.error('Error loading Footer settings:', err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // PUT to /api/footer — dedicated footer_page collection
      await updateFooter(formData);
      showToast('Footer updated successfully in footer_page collection!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to update Footer.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- Array Handlers for Quick Links & Products ---
  const handleItemChange = (listName, idx, field, val) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item, i) =>
        i === idx ? { ...item, [field]: val } : item
      )
    }));
  };

  const handleAddItem = (listName, defaultObj) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: [...prev[listName], { id: `item-${Date.now()}`, ...defaultObj }]
    }));
  };

  const handleRemoveItem = (listName, idx) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Footer Manager</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage background texture, logo, links, contact info, and legal notices.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. FOOTER BACKGROUND IMAGE */}
        <div className="bg-blue-50/60 p-4 border border-blue-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">1. Footer Background Pattern Image</h3>
          <ImageUploader
            label="Background Texture / Pattern Upload"
            value={formData.bg_image_url}
            onChange={(url) => setFormData({ ...formData, bg_image_url: url })}
          />
        </div>

        {/* 2. BRAND LOGO & DESCRIPTION */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Brand Logo & About Text</h3>
          
          <ImageUploader
            label="Footer Logo Image"
            value={formData.logo_url}
            onChange={(url) => setFormData({ ...formData, logo_url: url })}
          />

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Short Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-medium"
            />
          </div>
        </div>

        {/* 3. QUICK LINKS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Quick Links ({formData.quick_links.length})
            </h3>
            <button
              type="button"
              onClick={() => handleAddItem('quick_links', { label: 'New Link', url: '/' })}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Add Link
            </button>
          </div>

          {formData.quick_links.map((link, idx) => (
            <div key={link.id || idx} className="bg-white p-3 border border-slate-200 rounded-lg flex gap-3 items-center">
              <input
                type="text"
                placeholder="Link Label"
                value={link.label || ''}
                onChange={(e) => handleItemChange('quick_links', idx, 'label', e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded text-xs font-bold"
              />
              <input
                type="text"
                placeholder="URL Path"
                value={link.url || ''}
                onChange={(e) => handleItemChange('quick_links', idx, 'url', e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded text-xs font-medium"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem('quick_links', idx)}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* 4. PRODUCT LINKS */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              4. Products List ({formData.products.length})
            </h3>
            <button
              type="button"
              onClick={() => handleAddItem('products', { label: 'New Product', url: '/products' })}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Add Product
            </button>
          </div>

          {formData.products.map((prod, idx) => (
            <div key={prod.id || idx} className="bg-white p-3 border border-slate-200 rounded-lg flex gap-3 items-center">
              <input
                type="text"
                placeholder="Product Name"
                value={prod.label || ''}
                onChange={(e) => handleItemChange('products', idx, 'label', e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded text-xs font-bold"
              />
              <input
                type="text"
                placeholder="Route Path"
                value={prod.url || ''}
                onChange={(e) => handleItemChange('products', idx, 'url', e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded text-xs font-medium"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem('products', idx)}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* 5. REACH US INFO */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">5. Reach Us Contact Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Name</label>
              <input
                type="text"
                value={formData.reach_us.company_name}
                onChange={(e) => setFormData({ ...formData, reach_us: { ...formData.reach_us, company_name: e.target.value } })}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.reach_us.email}
                onChange={(e) => setFormData({ ...formData, reach_us: { ...formData.reach_us, email: e.target.value } })}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.reach_us.phone}
              onChange={(e) => setFormData({ ...formData, reach_us: { ...formData.reach_us, phone: e.target.value } })}
              className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Physical Address</label>
            <textarea
              rows={2}
              value={formData.reach_us.address}
              onChange={(e) => setFormData({ ...formData, reach_us: { ...formData.reach_us, address: e.target.value } })}
              className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-medium"
            />
          </div>
        </div>

        {/* 6. LEGAL & COPYRIGHT */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">6. Bottom Bar Legal & Copyright</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Terms Link Label</label>
              <input
                type="text"
                value={formData.terms_label}
                onChange={(e) => setFormData({ ...formData, terms_label: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Privacy Link Label</label>
              <input
                type="text"
                value={formData.privacy_label}
                onChange={(e) => setFormData({ ...formData, privacy_label: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Copyright Text</label>
            <input
              type="text"
              value={formData.copyright_text}
              onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
              className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-sm"
        >
          {saving ? 'Publishing Updates...' : 'Save & Publish Footer Section'}
        </button>

      </form>
    </div>
  );
};

export default AdminFooterEditor;
