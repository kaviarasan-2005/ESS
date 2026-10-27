import React from 'react';
import useRangeSupportEditor from './hooks/useRangeSupportEditor';

const EcoPhysicsRangeSupportAdminEditor = () => {
  const {
    formData,
    loading,
    saving,
    uploadingImg,
    fileInputRef,
    handleInputChange,
    handleIndustryListChange,
    addIndustryItem,
    removeIndustryItem,
    handleFileUpload,
    handleRemoveImage,
    handleSubmit,
  } = useRangeSupportEditor();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-500">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#051124] border-r-transparent"></div>
        <span className="ml-3 text-sm font-medium">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl rounded-2xl border border-gray-100 bg-white p-8 font-sans text-gray-800 shadow-xs">

      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#051124]">
          Eco Physics Product Range &amp; Support Editor
        </h1>
        <p className="mt-1.5 text-sm font-medium text-gray-400">
          Edit product range cards, support statements, industry lists, image asset, and footer email CTA.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: PRODUCT RANGE */}
        <div className="rounded-2xl border border-gray-200/60 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="mb-6 text-xs font-bold tracking-wider text-slate-500 uppercase">
            1. PRODUCT RANGE CARDS
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                SECTION TITLE
              </label>
              <input
                type="text"
                name="product_range_title"
                value={formData.product_range_title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-800 shadow-2xs focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                SUBTITLE / OVERVIEW PARAGRAPH
              </label>
              <textarea
                name="product_range_subtitle"
                rows={3}
                value={formData.product_range_subtitle}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
                <label className="mb-2 block text-xs font-bold text-slate-400 uppercase">
                  CARD 1 TITLE
                </label>
                <input
                  type="text"
                  name="card_1_title"
                  value={formData.card_1_title}
                  onChange={handleInputChange}
                  className="mb-3 w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs font-bold text-gray-800"
                  required
                />
                <label className="mb-2 block text-xs font-bold text-slate-400 uppercase">
                  CARD 1 DESCRIPTION
                </label>
                <textarea
                  name="card_1_desc"
                  rows={5}
                  value={formData.card_1_desc}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-700"
                  required
                />
              </div>
              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
                <label className="mb-2 block text-xs font-bold text-slate-400 uppercase">
                  CARD 2 TITLE
                </label>
                <input
                  type="text"
                  name="card_2_title"
                  value={formData.card_2_title}
                  onChange={handleInputChange}
                  className="mb-3 w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs font-bold text-gray-800"
                  required
                />
                <label className="mb-2 block text-xs font-bold text-slate-400 uppercase">
                  CARD 2 DESCRIPTION
                </label>
                <textarea
                  name="card_2_desc"
                  rows={5}
                  value={formData.card_2_desc}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-700"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TECHNICAL SUPPORT */}
        <div className="rounded-2xl border border-gray-200/60 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="mb-6 text-xs font-bold tracking-wider text-slate-500 uppercase">
            2. TECHNICAL EXPERTISE &amp; SUPPORT
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                SECTION TITLE
              </label>
              <input
                type="text"
                name="support_title"
                value={formData.support_title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-800 shadow-2xs focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                SUPPORT PARAGRAPH 1
              </label>
              <textarea
                name="support_para_1"
                rows={3}
                value={formData.support_para_1}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                SUPPORT PARAGRAPH 2
              </label>
              <textarea
                name="support_para_2"
                rows={3}
                value={formData.support_para_2}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: INDUSTRIES WE SERVE */}
        <div className="rounded-2xl border border-gray-200/60 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="mb-6 text-xs font-bold tracking-wider text-slate-500 uppercase">
            3. INDUSTRIES WE SERVE &amp; MEDIA
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                FEATURED INDUSTRY IMAGE
              </label>
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 shadow-2xs">
                {formData.industry_image_url ? (
                  <>
                    <img
                      src={formData.industry_image_url}
                      alt="Industry Application"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://via.placeholder.com/400x200?text=Industry+Application';
                      }}
                      className="h-full w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 rounded-lg bg-[#e11d48] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">
                    No image selected
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                  UPLOAD NEW IMAGE
                </label>
                <span className="text-[10px] font-semibold text-slate-400">
                  Min: 500x250px
                </span>
              </div>
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="group flex h-48 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-white transition hover:border-sky-400 hover:bg-slate-50/50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    📁
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {uploadingImg
                      ? 'Uploading Image...'
                      : 'Click to Upload Background Image'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
              IMAGE CAPTION
            </label>
            <input
              type="text"
              name="industry_image_caption"
              value={formData.industry_image_caption}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                INDUSTRY APPLICATION BULLETS
              </label>
              <button
                type="button"
                onClick={addIndustryItem}
                className="rounded-lg bg-sky-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-500"
              >
                + Add Application
              </button>
            </div>

            <div className="space-y-3">
              {formData.industry_list.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-3 shadow-2xs"
                >
                  <input
                    type="text"
                    value={item.label}
                    placeholder="Application Name"
                    onChange={(e) =>
                      handleIndustryListChange(idx, 'label', e.target.value)
                    }
                    className="w-1/3 rounded-lg border border-gray-200 p-2 text-xs font-bold text-gray-800"
                    required
                  />
                  <input
                    type="text"
                    value={item.detail}
                    placeholder="Detail description..."
                    onChange={(e) =>
                      handleIndustryListChange(idx, 'detail', e.target.value)
                    }
                    className="w-2/3 rounded-lg border border-gray-200 p-2 text-xs text-gray-700"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeIndustryItem(idx)}
                    className="rounded-lg bg-rose-100 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: EMAIL CTA & FOOTER STATEMENT CONTROLS */}
        <div className="rounded-2xl border border-gray-200/60 bg-[#f8fafc] p-6 md:p-8">
          <h2 className="mb-6 text-xs font-bold tracking-wider text-slate-500 uppercase">
            4. EMAIL CTA &amp; FOOTER STATEMENT CONTROLS
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                FOOTER PARAGRAPH TEXT
              </label>
              <textarea
                name="footer_text"
                rows={3}
                value={formData.footer_text}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-700 shadow-2xs focus:border-sky-500 focus:outline-none"
                placeholder="ECO Physics product applications across Doha and other places in the Middle East has been soaring of late..."
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                  CONTACT EMAIL ADDRESS (`mailto:`)
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-2xs focus:border-sky-500 focus:outline-none"
                  placeholder="info@ess-me.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                  CLICKABLE LINK ANCHOR TEXT
                </label>
                <input
                  type="text"
                  name="link_text"
                  value={formData.link_text}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-2xs focus:border-sky-500 focus:outline-none"
                  placeholder="send an email to our ECO Physics product experts"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center rounded-xl bg-[#051124] py-4 text-center text-xs font-bold tracking-widest text-white uppercase shadow-md transition hover:bg-[#0a1e3f] disabled:opacity-50"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                SAVING CHANGES...
              </div>
            ) : (
              'SAVE & PUBLISH RANGE & SUPPORT SECTION'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EcoPhysicsRangeSupportAdminEditor;
