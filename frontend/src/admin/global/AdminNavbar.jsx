import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { useNavigate } from 'react-router-dom';
import { fetchNavbarSettings, updateNavbarSettings } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [navData, setNavData] = useState({
    logo_url: '',
    nav_links: [],
    cta_button: { text: '', url: '' }
  });
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaultCoreLinks = [
    { id: 'core-home', label: 'Home', path: '/', is_permanent: true, has_dropdown: false, dropdown_items: [] },
    { id: 'core-about', label: 'About Us', path: '/about', is_permanent: true, has_dropdown: false, dropdown_items: [] },
    { id: 'core-products', label: 'Products', path: '/products', is_permanent: true, has_dropdown: true, dropdown_items: [] },
    { id: 'core-integrated-systems', label: 'Integrated Systems & Solutions', path: '/integrated-systems', is_permanent: true, has_dropdown: true, dropdown_items: [] },

    { id: 'core-partners', label: 'Our Partners', path: '/partners', is_permanent: true, has_dropdown: true, dropdown_items: [] },
     { id: 'core-projects-services', label: 'Projects & Services', path: '/projects-services', is_permanent: true, has_dropdown: true, dropdown_items: [] },
    { id: 'core-contact', label: 'Contact Us', path: '/contact', is_permanent: true, has_dropdown: false, dropdown_items: [] }
  ];

  const protectedPaths = [
    '/', 
    '/about', 
    '/products', 
    '/integrated-systems', 
    '/projects-services', 
    '/partners', 
    '/contact', 
    '/contact-us'
  ];

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchNavbarSettings()
      .then((res) => {
        const actualData = res?.data || res || {};
        let fetchedLinks = actualData.nav_links || [];
        const restoredLinks = defaultCoreLinks.map(core => ({ ...core }));

        fetchedLinks.forEach((fetchedLink) => {
          const isCore = 
            protectedPaths.includes(fetchedLink.path) || 
            defaultCoreLinks.some(c => c.label.toLowerCase() === (fetchedLink.label || '').toLowerCase());
          
          if (!isCore) {
            restoredLinks.push({
              ...fetchedLink,
              dropdown_items: fetchedLink.dropdown_items || []
            });
          } else {
            const coreIndex = restoredLinks.findIndex(
              c => c.path === fetchedLink.path || c.label.toLowerCase() === (fetchedLink.label || '').toLowerCase()
            );
            if (coreIndex !== -1) {
              restoredLinks[coreIndex] = { 
                ...fetchedLink, 
                is_permanent: true,
                has_dropdown: fetchedLink.has_dropdown ?? restoredLinks[coreIndex].has_dropdown,
                dropdown_items: fetchedLink.dropdown_items || []
              };
            }
          }
        });

        setNavData({
          logo_url: actualData.logo_url || '/images/logo.png',
          nav_links: restoredLinks,
          cta_button: actualData.cta_button || { text: 'Shop with Us', url: '/shop' }
        });
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        showToast('Failed to load navbar settings.', 'error');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateNavbarSettings(navData);
      showToast('Navbar updated successfully in MongoDB!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleParentLabelChange = (parentIdx, newLabel) => {
    setNavData((prev) => ({
      ...prev,
      nav_links: prev.nav_links.map((link, idx) => 
        idx === parentIdx ? { ...link, label: newLabel } : link
      )
    }));
  };

  const handleParentPathChange = (parentIdx, newPath) => {
    setNavData((prev) => ({
      ...prev,
      nav_links: prev.nav_links.map((link, idx) => 
        idx === parentIdx ? { ...link, path: newPath } : link
      )
    }));
  };

  const handleAddSubItem = (parentIdx) => {
    setNavData((prev) => ({
      ...prev,
      nav_links: prev.nav_links.map((link, idx) => {
        if (idx !== parentIdx) return link;
        const newSub = {
          id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: 'New Sub Category',
          path: '/sub-route'
        };
        return {
          ...link,
          has_dropdown: true,
          dropdown_items: [...(link.dropdown_items || []), newSub]
        };
      })
    }));
  };

  const handleSubItemChange = (parentIdx, subIdx, field, value) => {
    setNavData((prev) => ({
      ...prev,
      nav_links: prev.nav_links.map((link, pIdx) => {
        if (pIdx !== parentIdx) return link;
        const updatedSubItems = (link.dropdown_items || []).map((subItem, sIdx) => {
          if (sIdx !== subIdx) return subItem;
          return { ...subItem, [field]: value };
        });
        return { ...link, dropdown_items: updatedSubItems };
      })
    }));
  };

  const handleRemoveSubItem = (parentIdx, subIdx) => {
    setNavData((prev) => ({
      ...prev,
      nav_links: prev.nav_links.map((link, pIdx) => {
        if (pIdx !== parentIdx) return link;
        return {
          ...link,
          dropdown_items: (link.dropdown_items || []).filter((_, sIdx) => sIdx !== subIdx)
        };
      })
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600 font-semibold text-xs animate-pulse">Loading Navbar Settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
        
        {/* TOP TITLE */}
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl font-bold text-slate-900">Dynamic Navigation Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage logo, top menu links, header CTA, and nested dropdowns.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* 1. BRAND LOGO CONFIGURATION */}
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3 overflow-hidden">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Brand Logo Settings</h3>
            
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              {/* min-w-0 lets this column shrink; break-all wraps the long Cloudinary URL */}
              <div className="flex-1 min-w-0 w-full break-all">
                <ImageUploader
                  label="Upload Brand Logo"
                  value={navData.logo_url}
                  onChange={(url) => setNavData({ ...navData, logo_url: url })}
                />
              </div>

              <div className="w-full lg:w-auto shrink-0 flex flex-col items-center lg:items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Live Preview</span>
                <div className="h-16 w-48 bg-white border border-slate-300 rounded-xl p-2 flex items-center justify-center overflow-hidden shadow-sm">
                  {navData.logo_url ? (
                    <img
                      src={navData.logo_url}
                      alt="Logo Preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span className="text-[10px] text-slate-400 font-semibold" style={{ display: navData.logo_url ? 'none' : 'block' }}>
                    No Logo Found
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. HEADER CTA BUTTON */}
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Header CTA Button</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Text</label>
                <input
                  type="text"
                  value={navData.cta_button?.text || ''}
                  onChange={(e) => setNavData({ ...navData, cta_button: { ...navData.cta_button, text: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Route</label>
                <input
                  type="text"
                  value={navData.cta_button?.url || ''}
                  onChange={(e) => setNavData({ ...navData, cta_button: { ...navData.cta_button, url: e.target.value } })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 3. MENU ITEMS & DROPDOWNS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">3. Menu Items & Dropdowns</h3>
            
            {navData.nav_links?.map((link, parentIdx) => {
              const isPermanent = link.is_permanent || protectedPaths.includes(link.path);
              const isDropdownAllowed = [
                '/products', 
                '/integrated-systems', 
                '/projects-services', 
                '/partners'
              ].includes(link.path) || link.has_dropdown;

              return (
                <div key={link.id || `parent-${parentIdx}`} className="bg-slate-50/50 p-4 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    
                    {/* Item Label */}
                    <div className="w-full sm:w-5/12">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Item Label</label>
                      <input
                        type="text"
                        value={link.label || ''}
                        onChange={(e) => handleParentLabelChange(parentIdx, e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                      />
                    </div>

                    {/* Route Path */}
                    <div className="w-full sm:w-5/12">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Route Path</label>
                      <input
                        type="text"
                        disabled={isPermanent}
                        value={link.path || ''}
                        onChange={(e) => handleParentPathChange(parentIdx, e.target.value)}
                        className={`w-full p-2 border border-slate-300 rounded-lg text-xs ${
                          isPermanent ? 'bg-slate-100 text-slate-500 cursor-not-allowed font-medium' : 'bg-white text-slate-800'
                        }`}
                      />
                    </div>

                    {/* Status Badge */}
                    <div className="w-full sm:w-2/12 flex items-center justify-end mt-2 sm:mt-5">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md border border-slate-300">
                        {isPermanent ? 'Locked' : 'Custom'}
                      </span>
                    </div>

                  </div>

                  {/* NESTED DROPDOWN SECTION */}
                  {isDropdownAllowed && (
                    <div className="ml-4 pl-4 border-l-2 border-blue-200 bg-blue-50/30 p-3 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-blue-900 uppercase">
                          Nested Dropdown Items ({link.dropdown_items?.length || 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddSubItem(parentIdx)}
                          className="text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          + Add Sub-Item
                        </button>
                      </div>

                      {link.dropdown_items?.map((subItem, subIdx) => (
                        <div key={subItem.id || `sub-${parentIdx}-${subIdx}`} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Sub-Item Label"
                            value={subItem.label || ''}
                            onChange={(e) => handleSubItemChange(parentIdx, subIdx, 'label', e.target.value)}
                            className="w-1/2 p-1.5 bg-white border border-slate-300 rounded text-xs font-medium"
                          />
                          <input
                            type="text"
                            placeholder="Sub Route Path"
                            value={subItem.path || ''}
                            onChange={(e) => handleSubItemChange(parentIdx, subIdx, 'path', e.target.value)}
                            className="w-1/2 p-1.5 bg-white border border-slate-300 rounded text-xs font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSubItem(parentIdx, subIdx)}
                            className="text-xs font-bold text-rose-600 hover:bg-rose-100 p-1.5 rounded"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#1e2738] hover:bg-[#151c28] text-white font-bold py-3.5 rounded-xl shadow-sm text-xs transition-all"
          >
            {saving ? 'Publishing Changes...' : 'Save & Publish All Navbar Settings'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default AdminNavbar;