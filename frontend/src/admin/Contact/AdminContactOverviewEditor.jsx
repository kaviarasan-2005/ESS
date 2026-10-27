import React, { useEffect, useState } from "react";
import { fetchContactPage, updateContactSection } from "../../services/api";
import { useToast } from "../components/ToastContext";

const DEFAULT_CONTENT = {
  tagline: "REACH US",
  title: "Get in Touch.",
  description:
    "We are never out of reach and always at your service. We can't wait to growth along with you.",
  locations: [
    {
      id: "loc-1",
      title: "Main Office",
      address:
        "P.O. Box: 319, Buzwair Commercial Building, Al Mansoura Zone: 25, Street: 330, Building: 57, Doha, Qatar.",
    },
    {
      id: "loc-2",
      title: "Warehouse",
      address: "P.O. Box: 319, Street 46, Industrial Area, Doha, Qatar.",
    },
    {
      id: "loc-3",
      title: "Engineering Facility",
      address: "P.O. Box: 319, Street 14, Industrial Area Doha, Qatar.",
    },
  ],
  email: "sales@essme.com",
  phone: "+974 4405 9666",
  product_options: [
    "Fire & Gas Systems",
    "Analytical Instrumentation",
    "Analyzer System Integration",
    "Industrial Automation",
    "Process Equipments",
  ],
  form_labels: {
    name_label: "Name",
    name_placeholder: "Your name",
    location_label: "Location",
    location_placeholder: "Your location",
    email_label: "Email",
    email_placeholder: "you@example.com",
    contact_number_label: "Contact Number",
    contact_number_placeholder: "+974 ...",
    products_label: "Choose Products",
    message_label: "Message",
    message_placeholder: "Tell us about your requirements...",
    submit_btn_text: "SUBMIT",
    email_heading: "Email Us",
    phone_heading: "Call to Us",
    social_heading: "FOLLOW OUR SOCIAL MEDIA",
  },
  social_links: [{ id: "soc-1", platform: "linkedin", url: "https://linkedin.com" }],
};

const AdminContactOverviewEditor = () => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newProductOption, setNewProductOption] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    fetchContactPage()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        const cmsContent = payload.content || {};

        // FIX: Remove .length > 0 checks so empty arrays [] persist when deleted
        setContent({
          tagline: cmsContent.tagline ?? DEFAULT_CONTENT.tagline,
          title: cmsContent.title ?? DEFAULT_CONTENT.title,
          description: cmsContent.description ?? DEFAULT_CONTENT.description,
          locations: Array.isArray(cmsContent.locations)
            ? cmsContent.locations
            : DEFAULT_CONTENT.locations,
          email: cmsContent.email !== undefined ? cmsContent.email : (payload.general_email || DEFAULT_CONTENT.email),
          phone: cmsContent.phone !== undefined ? cmsContent.phone : (payload.general_phone || DEFAULT_CONTENT.phone),
          product_options: Array.isArray(cmsContent.product_options)
            ? cmsContent.product_options
            : DEFAULT_CONTENT.product_options,
          form_labels: { ...DEFAULT_CONTENT.form_labels, ...(cmsContent.form_labels || {}) },
          social_links: Array.isArray(cmsContent.social_links)
            ? cmsContent.social_links
            : DEFAULT_CONTENT.social_links,
        });
      })
      .catch((err) => console.error("Failed to load contact CMS details:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormLabelChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({
      ...prev,
      form_labels: { ...prev.form_labels, [name]: value },
    }));
  };

  const handleLocationChange = (index, field, value) => {
    const updated = [...content.locations];
    updated[index][field] = value;
    setContent((prev) => ({ ...prev, locations: updated }));
  };

  const addLocation = () => {
    setContent((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          id: `loc-${Date.now()}`,
          title: "New Branch / Office",
          address: "Enter full office location address...",
        },
      ],
    }));
  };

  const removeLocation = (index) => {
    setContent((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const handleAddProductOption = () => {
    if (!newProductOption.trim()) return;
    setContent((prev) => ({
      ...prev,
      product_options: [...prev.product_options, newProductOption.trim()],
    }));
    setNewProductOption("");
  };

  const handleRemoveProductOption = (index) => {
    setContent((prev) => ({
      ...prev,
      product_options: prev.product_options.filter((_, i) => i !== index),
    }));
  };

  const handleSocialChange = (index, field, value) => {
    const updated = [...content.social_links];
    updated[index][field] = value;
    setContent((prev) => ({ ...prev, social_links: updated }));
  };

  const addSocialLink = () => {
    setContent((prev) => ({
      ...prev,
      social_links: [
        ...prev.social_links,
        { id: `soc-${Date.now()}`, platform: "linkedin", url: "https://" },
      ],
    }));
  };

  const removeSocialLink = (index) => {
    setContent((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateContactSection("content", content);
      showToast("Contact section updated successfully!", "success");
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Failed to update section. Please check admin permissions.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-600 bg-white rounded-2xl shadow border border-slate-200">
        <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading Admin Controls...
      </div>
    );
  }

  const labels = content.form_labels || DEFAULT_CONTENT.form_labels;
  const inputCls =
    "w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-slate-800";

  return (
    <div className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl max-w-5xl mx-auto space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Contact Section CMS Editor
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">
          Edit all form fields, placeholders, right dark-panel content, locations, and social media links.
        </p>
      </div>

      {/* 1. LEFT FORM LABELS */}
      <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
          1. Inquiry Form Controls (Left Side)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Name Label", "name_label"],
            ["Name Placeholder", "name_placeholder"],
            ["Location Label", "location_label"],
            ["Location Placeholder", "location_placeholder"],
            ["Email Label", "email_label"],
            ["Email Placeholder", "email_placeholder"],
            ["Contact Number Label", "contact_number_label"],
            ["Contact Number Placeholder", "contact_number_placeholder"],
            ["Choose Products Header", "products_label"],
            ["Message Label", "message_label"],
            ["Message Placeholder", "message_placeholder"],
            ["Submit Button Text", "submit_btn_text"],
          ].map(([labelText, fieldName]) => (
            <div key={fieldName}>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {labelText}
              </label>
              <input
                type="text"
                name={fieldName}
                value={labels[fieldName] || ""}
                onChange={handleFormLabelChange}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. RIGHT DARK PANEL — HEADINGS + EMAIL & PHONE */}
      <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
          2. Right Side Dark Panel Headings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tagline (Accent upper text)
            </label>
            <input
              type="text"
              name="tagline"
              value={content.tagline}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Main Heading
            </label>
            <input
              type="text"
              name="title"
              value={content.title}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Description Paragraph
          </label>
          <textarea
            name="description"
            rows="2"
            value={content.description}
            onChange={handleChange}
            className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-slate-800"
          />
        </div>

        <div className="border-t border-slate-300 pt-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Email and Phone Card Settings
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
              shown below locations in right panel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Card Title
              </label>
              <input
                type="text"
                name="email_heading"
                value={labels.email_heading || ""}
                onChange={handleFormLabelChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Card Title
              </label>
              <input
                type="text"
                name="phone_heading"
                value={labels.phone_heading || ""}
                onChange={handleFormLabelChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Social Section Title
              </label>
              <input
                type="text"
                name="social_heading"
                value={labels.social_heading || ""}
                onChange={handleFormLabelChange}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={content.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={content.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. OFFICE LOCATIONS */}
      <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
            3. Office Facilities List ({content.locations.length})
          </h3>
          <button
            onClick={addLocation}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            + Add Facility
          </button>
        </div>
        <div className="space-y-4">
          {content.locations.map((loc, idx) => (
            <div
              key={loc.id || idx}
              className="bg-white p-4 rounded-lg border border-slate-300 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Facility #{idx + 1}
                </span>
                <button
                  onClick={() => removeLocation(idx)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Facility Title
                  </label>
                  <input
                    type="text"
                    value={loc.title}
                    onChange={(e) =>
                      handleLocationChange(idx, "title", e.target.value)
                    }
                    placeholder="Main Office"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3 py-2 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={loc.address}
                    onChange={(e) =>
                      handleLocationChange(idx, "address", e.target.value)
                    }
                    placeholder="Full location address..."
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3 py-2 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CHECKBOX PRODUCT OPTIONS */}
      <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
          4. Checkbox Product Options ({content.product_options.length})
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new checkbox item..."
            value={newProductOption}
            onChange={(e) => setNewProductOption(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddProductOption()}
            className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-slate-800"
          />
          <button
            onClick={handleAddProductOption}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Add Option
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {content.product_options.map((opt, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 bg-white text-slate-800 border border-slate-300 text-xs px-3 py-1.5 rounded-full shadow-sm"
            >
              <span>{opt}</span>
              <button
                onClick={() => handleRemoveProductOption(idx)}
                className="text-rose-600 hover:text-rose-800 font-bold text-sm leading-none cursor-pointer"
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 5. SOCIAL MEDIA LINKS */}
      <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
            5. Social Channels ({content.social_links.length})
          </h3>
          <button
            onClick={addSocialLink}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-3">
          {content.social_links.map((soc, idx) => (
            <div key={soc.id || idx} className="flex items-center gap-3">
              <input
                type="text"
                value={soc.platform}
                onChange={(e) =>
                  handleSocialChange(idx, "platform", e.target.value)
                }
                placeholder="Platform (e.g. linkedin)"
                className="w-32 bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                value={soc.url}
                onChange={(e) => handleSocialChange(idx, "url", e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2 rounded-lg"
              />
              <button
                onClick={() => removeSocialLink(idx)}
                className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SAVE BAR */}
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer active:scale-[0.99]"
        >
          {saving ? "Saving..." : "Save & Publish Contact Overview Section"}
        </button>
      </div>
    </div>
  );
};

export default AdminContactOverviewEditor;