import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

// API Base URL config
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

// Formats relative image paths into absolute backend URLs
const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AgcInstrumentsBanner = () => {
  const [bannerData, setBannerData] = useState({
    title: 'AGC Instruments',
    subtitle: 'Gas Chromatographs & Analysers',
    bg_image_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`${API_BASE_URL}/api/agc-instruments/banner`)
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || {};
        if (payload.title) {
          setBannerData({
            title: payload.title,
            subtitle: payload.subtitle || 'Gas Chromatographs & Analysers',
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load AGC Banner data:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const bgImageUrl = formatImageUrl(bannerData.bg_image_url);

  // Dynamic SEO Meta Values
  const metaTitle = `${bannerData.title} | ${bannerData.subtitle}`;
  const metaDescription = `Explore high-precision ${bannerData.title} solutions for ${bannerData.subtitle}. Industry-leading gas analysis and chromatography instruments.`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // Structured Data Schema (JSON-LD)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": bannerData.title,
    "description": metaDescription,
    "mainEntity": {
      "@type": "Brand",
      "name": bannerData.title,
      "description": bannerData.subtitle,
      "image": bgImageUrl || undefined
    }
  };

  return (
    <>
      {/* Dynamic SEO Meta Tags & Head Elements */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Hero Image Preload for LCP Optimization */}
        {bgImageUrl && <link rel="preload" as="image" href={bgImageUrl} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {bgImageUrl && <meta property="og:image" content={bgImageUrl} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {bgImageUrl && <meta name="twitter:image" content={bgImageUrl} />}

        {/* JSON-LD Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Hero Banner Container */}
      <section
        className="relative w-full overflow-hidden bg-[#0B192C] h-56 sm:h-72 lg:h-[441px] flex flex-col justify-center"
        aria-label="AGC Instruments Banner"
      >
        {/* Background Overlay */}
        {bgImageUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={bgImageUrl}
              alt={`${bannerData.title} - ${bannerData.subtitle}`}
              loading="eager"
              fetchPriority="high"
              width="1920"
              height="600"
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: 'center center' }}
            />
            <div className="absolute inset-0 bg-[#0B192C]/30" />
          </div>
        )}

        {/* Main Content Container (Prevents CLS layout shift during loading) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 text-center w-full">
          {loading ? (
            <div className="flex justify-center items-center py-6" aria-label="Loading content">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {bannerData.title}
              </h1>
              {bannerData.subtitle && (
                <p className="mt-3 text-sm md:text-lg text-slate-300 font-medium max-w-2xl mx-auto">
                  {bannerData.subtitle}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AgcInstrumentsBanner;