import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { fetchPartnersPage, updatePartnersSection, uploadImageFile } from '../../services/api';

const DEFAULT_CATEGORY_GROUPS = [
  {
    id: "cat-fire-gas",
    category_title: "Fire & Gas Systems",
    partners: [
      { id: "p-1", name: "Honeywell", logo_url: "", link_url: "/products" },
      { id: "p-2", name: "Scame Sistemi", logo_url: "", link_url: "/products" },
      { id: "p-3", name: "Xtralis", logo_url: "", link_url: "/products" },
      { id: "p-4", name: "Eaton MEDC", logo_url: "", link_url: "/products" },
    ]
  },
  {
    id: "cat-analytical",
    category_title: "Analytical Instrumentation",
    partners: [
      { id: "p-5", name: "Testo", logo_url: "", link_url: "/products" },
      { id: "p-6", name: "Hach", logo_url: "", link_url: "/products" },
      { id: "p-7", name: "AGC Instruments", logo_url: "", link_url: "/products" },
      { id: "p-8", name: "Michell Instruments", logo_url: "", link_url: "/products" },
    ]
  }
];

const AdminCategorizedPartnersEditor = () => {
  const [categoryGroups, setCategoryGroups] = useState([]);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  // LOAD API DATA AND PRESERVE SAVED LINK PATHS
  useEffect(() => {
    fetchPartnersPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const savedGroups = payload.category_groups;

        if (Array.isArray(savedGroups) && savedGroups.length > 0) {
          setCategoryGroups(savedGroups);
        } else {
          setCategoryGroups(DEFAULT_CATEGORY_GROUPS);
        }
      })
      .catch((err) => {
        console.error('Error loading Categorized Partners:', err);
        setCategoryGroups(DEFAULT_CATEGORY_GROUPS);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddCategory = () => {
    setCategoryGroups((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        category_title: 'New Division Category',
        partners: []
      }
    ]);
  };

  const handleRemoveCategory = (catId) => {
    setCategoryGroups((prev) => prev.filter((cat) => cat.id !== catId));
  };

  const handleCategoryTitleChange = (catId, title) => {
    setCategoryGroups((prev) =>
      prev.map((cat) => (cat.id === catId ? { ...cat, category_title: title } : cat))
    );
  };

  const handleAddPartner = (catId) => {
    setCategoryGroups((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            partners: [
              ...cat.partners,
              { id: `p-${Date.now()}`, name: '', logo_url: '', link_url: '' }
            ]
          };
        }
        return cat;
      })
    );
  };

  const handleRemovePartner = (catId, partnerId) => {
    setCategoryGroups((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            partners: cat.partners.filter((p) => p.id !== partnerId)
          };
        }
        return cat;
      })
    );
  };

  const handlePartnerNameChange = (catId, partnerId, name) => {
    setCategoryGroups((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            partners: cat.partners.map((p) =>
              p.id === partnerId ? { ...p, name } : p
            )
          };
        }
        return cat;
      })
    );
  };

  // UPDATE EACH CARD'S CUSTOM LINK PATH
  const handlePartnerLinkChange = (catId, partnerId, link_url) => {
    setCategoryGroups((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            partners: cat.partners.map((p) =>
              p.id === partnerId ? { ...p, link_url } : p
            )
          };
        }
        return cat;
      })
    );
  };

  const handleFileUpload = async (catId, partnerId, file) => {
    if (!file) return;

    setUploadingId(partnerId);
    try {
      const res = await uploadImageFile(file);
      const url = res?.url || res?.image_url || res?.data?.url || '';
      if (url) {
        setCategoryGroups((prev) =>
          prev.map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                partners: cat.partners.map((p) =>
                  p.id === partnerId ? { ...p, logo_url: url } : p
                )
              };
            }
            return cat;
          })
        );
        showToast('Logo uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Failed to upload partner logo.', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePartnersSection('category_groups', categoryGroups);
      showToast('Categorized partner grids saved and published!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update partner grids.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-bold text-slate-500">Loading grid editor...</div>;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 max-w-6xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Categorized Partner Grids</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage division headers, custom routes, and upload partner logos.</p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          + Add Division Category
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {categoryGroups.map((cat, catIdx) => (
          <div key={cat.id || catIdx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* DIVISION TITLE */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex-1 max-w-xl">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Division Title #{catIdx + 1}
                </label>
                <input
                  type="text"
                  value={cat.category_title || ''}
                  onChange={(e) => handleCategoryTitleChange(cat.id, e.target.value)}
                  placeholder="e.g. Fire & Gas Systems"
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCategory(cat.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline px-2 cursor-pointer mt-5"
              >
                Delete Division
              </button>
            </div>

            {/* PARTNER LOGOS GRID */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Partner Logos ({cat.partners?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddPartner(cat.id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  + Add Partner Card
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {(cat.partners || []).map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    {/* PARTNER NAME */}
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Partner Name"
                        value={partner.name || ''}
                        onChange={(e) => handlePartnerNameChange(cat.id, partner.id, e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePartner(cat.id, partner.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Remove Partner"
                      >
                        ✕
                      </button>
                    </div>

                    {/* LOGO IMAGE PREVIEW */}
                    <div className="w-full h-36 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden group-hover:border-blue-300 transition-colors">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name || 'Partner Logo'}
                          className="max-h-full max-w-full object-contain p-2"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <span className="text-2xl block mb-1">🖼️</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">No Logo Uploaded</span>
                        </div>
                      )}

                      <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer p-2">
                        <span className="bg-white text-slate-900 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          {uploadingId === partner.id ? 'Uploading...' : partner.logo_url ? 'Change Logo' : 'Upload Logo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(cat.id, partner.id, e.target.files[0])}
                          className="hidden"
                          disabled={uploadingId === partner.id}
                        />
                      </label>
                    </div>

                    {/* LINK PATH INPUT */}
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Link Path
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /products or /contact"
                        value={partner.link_url ?? ''}
                        onChange={(e) => handlePartnerLinkChange(cat.id, partner.id, e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}

        <button
          type="submit"
          disabled={saving || uploadingId !== null}
          className="w-full bg-[#03203c] hover:bg-[#021528] text-white font-extrabold text-xs tracking-wider uppercase py-4 rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save & Publish All Categorized Partner Grids'}
        </button>
      </form>
    </div>
  );
};

export default AdminCategorizedPartnersEditor;
