import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchProminentMeteringOverview } from '../services/api';

const ProminentOverviewSection = () => {
  const [data, setData] = useState({
    title: 'ProMinent Metering Pumps & Water Treatment',
    paragraph_1:
      'In industrial processes where chemical accuracy is critical to efficiency and safety, precision is non-negotiable. ESS-ME is the authorized Middle Eastern distributor for ProMinent Metering Pumps, the global leader in chemical dosing technology. We provide complete dosing solutions that deliver unmatched accuracy, reliability, and control for water treatment, oil & gas, and chemical processing applications across the GCC, ensuring optimal chemical usage, cost savings, and process integrity.',
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchProminentMeteringOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load ProMinent overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'ProMinent Metering Pumps & Water Treatment';
  const metaTitle = `${displayTitle} | ESS-ME Authorized GCC Distributor`;
  const metaDescription = (data.paragraph_1 || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl = data.image_url && data.image_url.trim() !== '' ? data.image_url : undefined;

  // JSON-LD Structured Data Schema (Product & Provider Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle,
    description: metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'ProMinent',
    },
    provider: {
      '@type': 'Organization',
      name: 'ESS-ME',
    },
    ...(currentImageUrl && { image: currentImageUrl }),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
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
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="ProMinent Metering Pumps & Water Treatment Overview"
      >
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading overview section">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-700">Loading section...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* SECTION TITLE */}
            <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT COLUMN: TEXT CONTENT */}
              <article className="flex-1 text-justify text-sm leading-relaxed text-black md:text-lg md:leading-loose">
                <p>{data.paragraph_1}</p>
              </article>

              {/* RIGHT COLUMN: BRAND IMAGE CARD */}
              <div className="w-full shrink-0 lg:w-1/2">
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gray-50 p-2 shadow-2xl">
                  <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2 md:h-80">
                    {data.image_url && data.image_url.trim() !== '' ? (
                      <img
                        src={data.image_url}
                        alt={`${displayTitle} - Precision Dosing Systems`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-slate-400">
                        <span className="text-4xl" role="img" aria-label="Gear emoji">⚙️</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          ProMinent Dosing Pumps & Systems
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

export default ProminentOverviewSection;