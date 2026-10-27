import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchRASilverOverview } from '../services/api';

const RASilverOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Rockwell Automation System Integration',
    paragraph_1:
      'As a certified Silver Level System Integrator for Rockwell Automation, ESS-ME delivers expert engineering, proven project execution, and unparalleled support for ControlLogix, PlantPAx, and other Allen-Bradley platforms across the Middle East.',
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchRASilverOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load RA Silver overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Rockwell Automation System Integration';
  const metaTitle = `${displayTitle} | ESS-ME Certified Silver Partner`;
  const metaDescription = (data.paragraph_1 || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl = data.image_url && data.image_url.trim() !== '' ? data.image_url : undefined;

  // JSON-LD Structured Data Schema (Service & Brand/Provider Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: displayTitle,
    description: metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'Rockwell Automation',
    },
    provider: {
      '@type': 'Organization',
      name: 'ESS-ME',
    },
    ...(currentImageUrl && { image: currentImageUrl }),
  };

  return (
    <>
      {/* Helmet SEO Meta Tag Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        {metaDescription && <meta property="og:description" content={metaDescription} />}
        {currentImageUrl && <meta property="og:image" content={currentImageUrl} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        {metaDescription && <meta name="twitter:description" content={metaDescription} />}
        {currentImageUrl && <meta name="twitter:image" content={currentImageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Container Shell - Preserves min-height to prevent Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 md:py-20 lg:px-20 lg:py-24"
        aria-label="Rockwell Automation Certified Silver System Integration Overview"
      >
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading overview section">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading section...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* LEFT COLUMN: TITLE + TEXT CONTENT */}
              <article>
                <h2 className="mb-6 text-3xl font-extrabold text-justify leading-tight tracking-tight text-black md:text-4xl lg:text-5xl">
                  {data.title}
                </h2>

                <p className="text-justify text-base leading-relaxed text-gray-800 md:text-lg md:leading-loose lg:text-xl lg:leading-loose">
                  {data.paragraph_1}
                </p>
              </article>

              {/* RIGHT COLUMN: BRAND / CERTIFICATION CARD */}
              <div className="w-full">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-1 shadow-xl">
                  <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-xl bg-white p-4 md:h-80 lg:h-80">
                    {data.image_url && data.image_url.trim() !== '' ? (
                      <img
                        src={data.image_url}
                        alt={`${displayTitle} - Certified Silver System Integrator`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="h-full w-full rounded-xl object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-gray-500">
                        <span className="text-5xl" role="img" aria-label="Lightning bolt emoji">⚡</span>
                        <span className="mt-3 text-sm font-semibold uppercase tracking-wider">
                          Rockwell Automation Silver System Integrator
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default RASilverOverviewSection;