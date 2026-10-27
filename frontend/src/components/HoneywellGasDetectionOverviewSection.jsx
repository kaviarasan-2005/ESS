import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHoneywellGasDetectionOverview } from '../services/api';

const HoneywellGasDetectionOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Honeywell Gas Detection Solutions',
    paragraph_1:
      'In hazardous industrial environments, personnel safety and plant integrity depend on uncompromising gas detection capabilities. ESS-ME is a certified Middle Eastern distributor for Honeywell Gas Detection, providing advanced toxic and combustible gas monitors, flame detectors, and controller units. We equip industrial facilities across the GCC with rugged, high-precision safety systems engineered to deliver immediate warnings and prevent catastrophic incidents.',
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchHoneywellGasDetectionOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Honeywell Gas Detection overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Honeywell Gas Detection Solutions';
  const metaTitle = `${displayTitle} | ESS-ME Certified GCC Distributor`;
  const metaDescription = (data.paragraph_1 || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl = data.image_url && data.image_url.trim() !== '' ? data.image_url : undefined;

  // JSON-LD Structured Data Schema (Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle,
    description: metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'Honeywell Analytics',
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

      {/* Main Section Shell - Preserves layout height during loading to prevent Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Honeywell Gas Detection Solutions Overview"
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
              {/* LEFT COLUMN: TEXT CONTENT (equal width) */}
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
                        alt={`${displayTitle} - Industrial Safety Monitors`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-400">
                        <span className="text-4xl" role="img" aria-label="Siren emoji">🚨</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          Honeywell Gas Detection
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

export default HoneywellGasDetectionOverviewSection;