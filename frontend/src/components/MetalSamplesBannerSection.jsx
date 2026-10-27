import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchMetalSamplesBanner } from '../services/api';

const MetalSamplesBannerSection = () => {
  const [data, setData] = useState({
    title: 'Metal Samples',
    subtitle: 'Corrosion Monitoring & Material Evaluation Systems',
    bg_image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBannerData();
  }, []);

  const loadBannerData = async () => {
    try {
      setLoading(true);
      const res = await fetchMetalSamplesBanner();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Metal Samples banner section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const metaTitle = `${data.title} ${data.subtitle} | ESS-ME`;
  const metaDescription = `Explore ${data.title} ${data.subtitle}. Authorized supplier for corrosion monitoring probes, corrosion coupons, high-pressure access fittings, and material evaluation systems across the Middle East.`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const imageUrl = data.bg_image_url && data.bg_image_url.trim() !== '' ? data.bg_image_url : undefined;

  // JSON-LD Structured Data Schema (Brand & WebPage Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${data.title} ${data.subtitle}`,
    description: metaDescription,
    mainEntity: {
      '@type': 'Brand',
      name: data.title,
      description: data.subtitle,
      ...(imageUrl && { image: imageUrl }),
    },
  };

  return (
    <>
      {/* Helmet SEO Meta Tag Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Hero Background Image Preload for LCP Optimization */}
        {imageUrl && <link rel="preload" as="image" href={imageUrl} />}

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Hero Banner Section Container - Min-height shell prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative flex h-56 w-full flex-col justify-between overflow-hidden bg-[#081b2c] font-sans sm:h-72 lg:h-[441px]"
        aria-label="Metal Samples Corrosion Monitoring Systems Banner"
      >
        {/* Accessible Hidden Subheading for Semantic Hierarchy */}
        <h2 className="sr-only">{data.title} - Industrial Corrosion Monitoring & Material Evaluation</h2>

        {loading ? (
          <div className="flex h-full w-full items-center justify-center text-white" aria-label="Loading banner">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-300">Loading banner...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Background Image Layer with Performance Optimization */}
            {imageUrl && (
              <div className="absolute inset-0 z-0">
                <img
                  src={imageUrl}
                  alt={`${data.title} ${data.subtitle} Background`}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover opacity-80"
                />
              </div>
            )}

            {/* Main Banner Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <h1 className="max-w-5xl text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                {data.title}
              </h1>
              {data.subtitle && (
                <p className="mt-3 max-w-3xl text-sm font-medium text-gray-300 md:text-base lg:text-lg">
                  {data.subtitle}
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default MetalSamplesBannerSection;