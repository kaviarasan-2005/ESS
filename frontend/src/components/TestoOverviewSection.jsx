import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchTestoOverview } from '../services/api';

const TestoOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Testo Portable Measurement Instruments',
    paragraph_1:
      'From optimizing combustion efficiency to ensuring perfect indoor air quality, accurate portable data is the key to operational excellence. ESS-ME is the authorized Middle Eastern distributor for Testo portable instruments, providing maintenance teams, facility managers, and service technicians with the precise, rugged, and easy-to-use tools they need.',
    paragraph_2:
      "We supply a comprehensive range of portable flue gas analyzers, environmental meters, and thermal imagers trusted across the GCC's industrial, HVAC, and facilities management sectors.",
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchTestoOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Testo overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Testo Portable Measurement Instruments';
  const metaTitle = `${displayTitle} | ESS-ME Authorized GCC Distributor`;
  const rawDescription = `${data.paragraph_1 || ''} ${data.paragraph_2 || ''}`;
  const metaDescription =
    rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'Authorized Testo distributor in the Middle East & GCC. Supplying portable flue gas analyzers, thermal imagers, digital manifolds, and environmental meters for HVAC and industrial teams.';
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
      name: 'Testo',
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
        aria-label="Testo Portable Measurement Instruments Overview"
      >
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center bg-[#081b2c] text-white rounded-xl" aria-label="Loading overview section">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-300">Loading section...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* SECTION TITLE */}
            <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            {/* items-stretch makes both columns the same height */}
            <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
              {/* LEFT COLUMN: BRAND IMAGE CARD (equal width, full height) */}
              <div className="flex w-full lg:w-0 lg:flex-1">
                <div className="relative flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white/5 p-2 shadow-2xl backdrop-blur-xs">
                  <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2 md:h-80 lg:h-auto lg:min-h-[360px] lg:flex-1">
                    {data.image_url && data.image_url.trim() !== '' ? (
                      <img
                        src={data.image_url}
                        alt={`${displayTitle} - Testo Portable Instrumentation`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-slate-400">
                        <span className="text-4xl" role="img" aria-label="Thermometer emoji">🌡️</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          Testo Portable Measurement Solutions
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TEXT CONTENT (equal width, centered vertically) */}
              <article className="flex w-full flex-col justify-center space-y-4 text-justify text-base leading-relaxed text-gray-900 md:text-lg md:leading-loose lg:w-0 lg:flex-1">
                <p>{data.paragraph_1}</p>
                {data.paragraph_2 && <p>{data.paragraph_2}</p>}
              </article>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default TestoOverviewSection;