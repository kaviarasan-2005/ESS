import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchAKAYBanner } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const BANNER_HEIGHT = 'h-56 sm:h-72 lg:h-[441px]';
const OVERLAY_COLOR = 'bg-[#0B192C]/30';

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AkayBanner = () => {
  const [bannerData, setBannerData] = useState({
    title: 'AKAY Industries',
    subtitle: 'Centrifugal Pumps & Chemical Process Solutions',
    bg_image_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchAKAYBanner()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data || {};
        if (payload.title) {
          setBannerData({
            title: payload.title,
            subtitle: payload.subtitle || 'Centrifugal Pumps & Chemical Process Solutions',
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => console.error('Failed to load AKAY Banner:', err))
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
  const metaDescription = `Discover ${bannerData.title} solutions for ${bannerData.subtitle}. Industry-leading heavy-duty chemical process pumps and fluid handling equipment.`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data (Organization / Brand Context)
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
      {/* Helmet SEO Meta Tags */}
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
        className={`relative w-full ${BANNER_HEIGHT} overflow-hidden bg-[#0B192C] flex items-center justify-center`}
        aria-label="AKAY Industries Banner"
      >
        {/* BACKGROUND IMAGE WITH BLUE OVERLAY */}
        {bgImageUrl && (
          <div className="absolute inset-0 bg-[#0B192C]/30 z-0">
            <img
              src={bgImageUrl}
              alt={`${bannerData.title} - ${bannerData.subtitle}`}
              loading="eager"
              fetchPriority="high"
              width="1920"
              height="320"
              className="w-full h-full object-cover object-center"
            />x 
            <div className={`absolute inset-0 ${OVERLAY_COLOR}`} />
          </div>
        )}

        {/* CENTERED TEXT - Fixed Container to Prevent Layout Shift (CLS) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {loading ? (
            <div className="flex justify-center items-center py-4" aria-label="Loading banner">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                {bannerData.title}
              </h1>
              {bannerData.subtitle && (
                <p className="mt-4 text-sm md:text-base text-white/90 font-medium tracking-wide max-w-2xl mx-auto">
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

export default AkayBanner;