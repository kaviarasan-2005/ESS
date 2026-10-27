import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  fetchEcoPhysicsOverview,
  updateEcoPhysicsOverview,
  uploadImageFile,
} from '../services/api';

const EcoPhysicsOverviewSection = ({ isAdmin = false }) => {
  const [data, setData] = useState({
    title: 'Eco Physics Nitrogen Oxide (NOx) Analyzers',
    description:
      'ESS-ME is the authorized Middle Eastern distributor for ECO Physics, a global pioneer in ultra-precise nitrogen oxide (NOx) analyzers. For industries and research institutions where accuracy is non-negotiable, ECO Physics provides the definitive solution. Our analyzers deliver unmatched reliability for the most demanding applications, from stringent continuous emissions monitoring systems (CEMS) in industrial stacks to sensitive ambient air quality networks and advanced atmospheric research across the GCC region.',
    product_image_url: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...data });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchEcoPhysicsOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData(content);
        setFormData(content);
      }
    } catch (err) {
      console.error('Failed to fetch Eco Physics overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    try {
      const uploadRes = await uploadImageFile(file);
      const uploadedUrl = uploadRes.url || uploadRes.file_path;

      setFormData((prev) => ({
        ...prev,
        product_image_url: uploadedUrl,
      }));
      setStatusMsg({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (err) {
      console.error('Image upload failed:', err);
      setStatusMsg({ type: 'error', text: 'Failed to upload image.' });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await updateEcoPhysicsOverview(formData);
      const updatedContent = res?.data?.data || res?.data || formData;
      setData(updatedContent);
      setIsEditing(false);
      setStatusMsg({ type: 'success', text: 'Section updated successfully!' });
    } catch (err) {
      console.error('Failed to update section:', err);
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update section.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Dynamic SEO Meta Setup
  const metaTitle = `${data.title} | Ultra-Precise CLD NOx Measurement`;
  const cleanDescription = data.description
    ? data.description.replace(/\s+/g, ' ').trim().slice(0, 160)
    : '';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const imageUrl =
    data.product_image_url && data.product_image_url.trim() !== ''
      ? data.product_image_url
      : undefined;

  // JSON-LD Structured Data Schema (Product Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: cleanDescription,
    brand: {
      '@type': 'Brand',
      name: 'ECO Physics',
    },
    image: imageUrl,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      {/* Helmet SEO Meta Tags */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={cleanDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={cleanDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={cleanDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Section Container - Fixed Shell Prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[400px] bg-white px-6 py-16 text-black md:px-12 lg:px-24"
        aria-label="Eco Physics Overview Section"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-black">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-700">Loading section...</p>
          </div>
        ) : (
          <>
            {isAdmin && !isEditing && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
                >
                  ✏️ Edit Section
                </button>
              </div>
            )}

            {statusMsg.text && (
              <div
                className={`mb-6 rounded p-3 text-sm font-medium ${
                  statusMsg.type === 'success'
                    ? 'border border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border border-rose-500 bg-rose-50 text-rose-900'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            {isEditing ? (
              <form
                onSubmit={handleSave}
                className="space-y-6 rounded-lg border border-gray-300 bg-white p-6 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <h3 className="text-xl font-bold text-black">Edit Overview Section</h3>
                  <span className="text-xs text-gray-500">Eco Physics Brand Page</span>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-black">
                    Section Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 bg-white p-3 text-black focus:border-black focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-black">
                    Description Body Text
                  </label>
                  <textarea
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 bg-white p-3 text-black focus:border-black focus:outline-none"
                    required
                  />
                </div>

                <div className="rounded border border-gray-300 bg-gray-50 p-4">
                  <label className="mb-1 block text-sm font-medium text-black">
                    Overview Banner Image
                  </label>
                  <input
                    type="text"
                    name="product_image_url"
                    value={formData.product_image_url}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 bg-white p-2.5 text-sm text-black focus:border-black focus:outline-none"
                    placeholder="/uploads/eco_physics_banner.jpg"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-xs text-gray-700 file:mr-2 file:rounded file:border-0 file:bg-gray-200 file:px-3 file:py-1 file:text-xs file:text-black hover:file:bg-gray-300"
                    />
                    {uploadingImg && (
                      <span className="text-xs text-amber-600">Uploading...</span>
                    )}
                  </div>

                  <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded border border-dashed border-gray-300 bg-white">
                    <img
                      src={
                        formData.product_image_url && formData.product_image_url.trim() !== ''
                          ? formData.product_image_url
                          : 'https://via.placeholder.com/650x360?text=Eco+Physics+NOx+Analyzers'
                      }
                      alt="Overview Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://via.placeholder.com/650x360?text=Eco+Physics+NOx+Analyzers';
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ ...data });
                    }}
                    className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mx-auto max-w-7xl">
                <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
                  {data.title}
                </h2>

                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-6">
                    <p className="text-justify text-sm leading-relaxed text-gray-900 md:text-base">
                      <span className="float-left mr-2 text-5xl font-extrabold leading-none text-black">
                        {data.description ? data.description.charAt(0) : 'E'}
                      </span>
                      {data.description ? data.description.slice(1) : ''}
                    </p>
                  </div>

                  {/* Perfect Edge-to-Edge Image Alignment with Image Performance attributes */}
                  <div className="lg:col-span-6">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-lg">
                      <img
                        src={
                          data.product_image_url && data.product_image_url.trim() !== ''
                            ? data.product_image_url
                            : 'https://via.placeholder.com/650x360?text=Eco+Physics+NOx+Analyzers'
                        }
                        alt={`${data.title} - Continuous Emission Monitoring & Air Quality Systems`}
                        loading="lazy"
                        decoding="async"
                        width="650"
                        height="360"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://via.placeholder.com/650x360?text=Eco+Physics+NOx+Analyzers';
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default EcoPhysicsOverviewSection;