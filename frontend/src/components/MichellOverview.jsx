import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchMichellInstrumentsOverview } from '../services/api';

const MichellOverview = () => {
  const [data, setData] = useState({
    title: 'Michell Instruments Moisture & Dew Point Analyzers',
    paragraph_1:
      "In countless industrial processes, water vapor is more than just a contaminant—it's a direct threat to product quality, operational safety, and asset integrity. ESS-ME is the regional supplier for Michell Instruments moisture and dew point analyzers, providing the gold standard in water vapor measurement for the Middle East's oil & gas, industrial, and manufacturing sectors. We deliver the precise, reliable data needed to prevent icing, corrosion, and product spoilage in your most critical applications.",
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchMichellInstrumentsOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Michell Instruments overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Michell Instruments Moisture & Dew Point Analyzers';
  const metaTitle = `${displayTitle} | ESS-ME Regional Supplier`;
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
      name: 'Michell Instruments',
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

      {/* Main Container Shell - Fixed min-height shell prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Michell Instruments Moisture and Dew Point Analyzers Overview"
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
            {/* SECTION TITLE */}
            <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center">
              {/* LEFT COLUMN: BRAND IMAGE CARD */}
              <div className="w-full shrink-0 lg:w-1/2">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  {data.image_url && data.image_url.trim() !== '' ? (
                    <img
                      src={data.image_url}
                      alt={`${displayTitle} - Water Vapor & Dew Point Measurement`}
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="400"
                      className="block h-auto w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 flex-col items-center justify-center text-center text-slate-400 md:h-80">
                      <span className="text-4xl" role="img" aria-label="Water drop emoji">💧</span>
                      <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                        Michell Moisture & Dew Point Analyzers
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: TEXT CONTENT */}
              <article className="flex-1 text-justify text-base leading-relaxed text-black md:text-lg md:leading-loose lg:text-xl">
                <p>{data.paragraph_1}</p>
              </article>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default MichellOverview;