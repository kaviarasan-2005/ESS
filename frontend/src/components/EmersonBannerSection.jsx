import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchEmersonBanner } from '../services/api';

const OVERLAY_CLASS = 'bg-[#081b2c]/50';

const EmersonBannerSection = () => {
  const [data, setData] = useState({
    title: 'Emerson',
    subtitle: 'Process Management, Measurement Instrumentation & Automation Solutions',
    bg_image_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    loadBannerData();
  }, []);

  const loadBannerData = async () => {
    try {
      setLoading(true);
      const res = await fetchEmersonBanner();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({
          ...prev,
          ...content,
          // null or missing from the API means "no image", never keep an old one
          bg_image_url: content.bg_image_url || '',
        }));
        setImageFailed(false);
      }
    } catch (err) {
      console.error('Failed to load Emerson banner section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata
  const metaTitle = `${data.title} | ${data.subtitle}`;
  const metaDescription = `Explore ${data.title} solutions for ${data.subtitle}. Industry-leading process control, Rosemount instrumentation, Micro Motion flow meters, and DeltaV automation.`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const imageUrl = data.bg_image_url && data.bg_image_url.trim() !== '' ? data.bg_image_url : undefined;
  const showImage = imageUrl && !imageFailed;

  // JSON-LD Structured Data (Brand / WebPage Schema)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.title,
    description: metaDescription,
    mainEntity: {
      '@type': 'Brand',
      name: data.title,
      description: data.subtitle,
      image: imageUrl,
    },
  };

  return (
    <>
      {/* Helmet SEO Meta Injection */}
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

      {/* Main Hero Banner Container - Fixed Layout Prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative flex h-56 w-full flex-col justify-between overflow-hidden bg-[#081b2c] font-sans sm:h-72 lg:h-[441px]"
        aria-label="Emerson Automation & Process Control Solutions Banner"
      >
        {loading ? (
          <div
            className="flex h-full w-full items-center justify-center text-white"
            aria-label="Loading banner"
          >
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-300">Loading banner...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Background Image Layer with Performance Attributes */}
            {showImage && (
              <div className="absolute inset-0 z-0">
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt={`${data.title} Process Management & Automation Background`}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={() => setImageFailed(true)}
                  className="h-full w-full object-cover object-center"
                />
                {/* Dark overlay keeps the white text readable on any image */}
                <div className={`absolute inset-0 ${OVERLAY_CLASS}`}></div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
                {data.title}
              </h1>
              {data.subtitle && (
                <p className="mt-3 max-w-3xl text-sm font-medium text-gray-200 md:text-base lg:text-lg">
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

export default EmersonBannerSection;