import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchTSIOverview } from '../services/api';

const TSIOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Precision TSI Instruments for Environmental, Safety & Process Monitoring',
    paragraph_1:
      "ESS-ME is the authorized distributor for TSI Instruments, a global leader in precision measurement technology, serving the Middle East's most critical industries. We supply, calibrate, and support TSI's extensive range of cutting-edge instruments for environmental monitoring, occupational health and safety, and advanced process control. From ensuring cleanroom compliance to optimizing worker safety and combustion efficiency, TSI provides the data-driven insights you need to excel.",
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchTSIOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load TSI overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Precision TSI Instruments for Environmental, Safety & Process Monitoring';
  const metaTitle = `${displayTitle} | ESS-ME Middle East Distributor`;
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
      name: 'TSI Incorporated',
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

  // Extract drop-cap letter if present
  const firstLetter = data.paragraph_1 ? data.paragraph_1.charAt(0) : '';
  const restOfParagraph = data.paragraph_1 ? data.paragraph_1.slice(1) : '';

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
        aria-label="TSI Instruments Environmental and Safety Measurement Overview"
      >
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading overview section">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading section...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* SECTION TITLE */}
            <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            {/* items-stretch makes both columns the same height */}
            <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
              {/* LEFT COLUMN: TEXT CONTENT WITH DROP CAP (equal width, centered vertically) */}
              <article className="flex w-full flex-col justify-center text-justify text-base leading-relaxed text-black md:text-lg md:leading-loose lg:w-0 lg:flex-1">
                <p>
                  {firstLetter && (
                    <span className="float-left mr-3 text-5xl font-extrabold leading-none text-black md:text-6xl">
                      {firstLetter}
                    </span>
                  )}
                  {restOfParagraph}
                </p>
              </article>

              {/* RIGHT COLUMN: BRAND CARD (equal width, full height) */}
              <div className="flex w-full lg:w-0 lg:flex-1">
                <div className="relative flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white/5 p-2 shadow-2xl backdrop-blur-xs">
                  <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2 md:h-80 lg:h-auto lg:min-h-[360px] lg:flex-1">
                    {data.image_url && data.image_url.trim() !== '' ? (
                      <img
                        src={data.image_url}
                        alt={`${displayTitle} - TSI Authorized Distributor`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-slate-400">
                        <span className="text-4xl" role="img" aria-label="Bar chart emoji">📊</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          TSI Instruments Partner Logo
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

export default TSIOverviewSection;