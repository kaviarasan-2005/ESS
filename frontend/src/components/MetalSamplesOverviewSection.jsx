import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchMetalSamplesOverview } from '../services/api';

const MetalSamplesOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Metal Samples Corrosion Monitoring Products',
    paragraph_1:
      'Corrosion is a constant threat to your pipelines, vessels, and process equipment, leading to costly downtime, safety hazards, and catastrophic failures. ESS-ME is the authorized supplier of Metal Samples corrosion monitoring products, providing the essential tools for a proactive, data-driven asset integrity strategy. We equip industries across the Middle East with reliable solutions to measure, monitor, and mitigate corrosion, transforming your maintenance from reactive to predictive.',
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchMetalSamplesOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Metal Samples overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Metal Samples Corrosion Monitoring Products';
  const metaTitle = `${displayTitle} | ESS-ME Middle East Supplier`;
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
      name: 'Metal Samples Company',
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
        aria-label="Metal Samples Corrosion Monitoring Overview"
      >
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading overview section">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-800 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading section...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* SECTION TITLE */}
            <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:gap-14">
              {/* LEFT COLUMN: TEXT CONTENT (equal width, justified) */}
              <article className="flex w-full min-w-0 flex-col justify-center text-justify text-base leading-relaxed text-black md:text-lg md:leading-loose lg:flex-1 lg:text-xl">
                <p>{data.paragraph_1}</p>
              </article>

              {/* RIGHT COLUMN: IMAGE CARD (fills fully, height follows the text) */}
              <div className="flex w-full min-w-0 lg:flex-1">
                <div className="flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <div className="relative h-64 w-full bg-slate-50 md:h-80 lg:h-auto">
                    {data.image_url && data.image_url.trim() !== '' ? (
                      <img
                        src={data.image_url}
                        alt={`${displayTitle} - Corrosion Probes & Access Fittings`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-400">
                        <span className="text-4xl" role="img" aria-label="Test tube emoji">🧪</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          Metal Samples Corrosion Monitoring
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

export default MetalSamplesOverviewSection;