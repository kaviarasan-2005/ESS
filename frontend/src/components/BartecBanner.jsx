import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchBartecBanner } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const BartecBanner = () => {
  const [bannerData, setBannerData] = useState({
    title: 'BARTEC',
    subtitle: 'Explosion Protection & Safety Systems',
    bg_image_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchBartecBanner()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || {};
        if (payload.title) {
          setBannerData({
            title: payload.title,
            subtitle: payload.subtitle || 'Explosion Protection & Safety Systems',
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load Bartec Banner data:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const bgImageUrl = formatImageUrl(bannerData.bg_image_url);

  // Dynamic SEO Meta Setup
  const metaTitle = `${bannerData.title} | ${bannerData.subtitle}`;
  const metaDescription = `Explore ${bannerData.title} solutions for ${bannerData.subtitle}. World-class ATEX and IECEx certified explosion safety products for hazardous areas.`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (Brand / WebPage Context)
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
      {/* Dynamic SEO Meta Tags */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Hero Image Preload for LCP Performance */}
        {bgImageUrl && <link rel="preload" as="image" href={bgImageUrl} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {bgImageUrl && <meta property="og:image" content={bgImageUrl} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {bgImageUrl && <meta name="twitter:image" content={bgImageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Banner Hero Section - Fixed height shell prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative w-full overflow-hidden bg-[#0B192C] h-56 sm:h-72 lg:h-[441px] flex flex-col justify-center"
        aria-label="BARTEC Explosion Protection Banner"
      >
        {/* BACKGROUND IMAGE / FALLBACK OVERLAY */}
        {bgImageUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={bgImageUrl}
              alt={`${bannerData.title} - ${bannerData.subtitle}`}
              loading="eager"
              fetchPriority="high"
              width="1920"
              height="320"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#0B192C]/30" />
          </div>
        )}

        {/* MAIN CONTENT CONTAINER */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 text-center w-full">
          {loading ? (
            <div className="flex justify-center items-center py-4" aria-label="Loading banner content">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                {bannerData.title}
              </h1>
              {bannerData.subtitle && (
                <p className="mt-3 text-sm md:text-lg text-white font-medium max-w-2xl mx-auto">
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

export default BartecBanner;