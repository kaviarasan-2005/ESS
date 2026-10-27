import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchAVEVABanner } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const DEFAULT_BANNER = {
  title: 'AVEVA',
  subtitle: 'Industrial Software & Digital Transformation Solutions',
  bg_image: '',
  bg_image_url: ''
};

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AvevaBannerSection = () => {
  const [bannerData, setBannerData] = useState(DEFAULT_BANNER);

  useEffect(() => {
    let isMounted = true;

    fetchAVEVABanner()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload && (payload.title || payload.bg_image || payload.bg_image_url)) {
          setBannerData({
            title: payload.title || 'AVEVA',
            subtitle: payload.subtitle ?? DEFAULT_BANNER.subtitle,
            bg_image: payload.bg_image || payload.bg_image_url || '',
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => {
        console.error('API Error, using fallback banner:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const rawImg = bannerData.bg_image_url || bannerData.bg_image;
  const bgImg = formatImageUrl(rawImg);

  // Dynamic SEO Meta Setup
  const metaTitle = `${bannerData.title} | ${bannerData.subtitle}`;
  const metaDescription = `Explore ${bannerData.title} solutions for ${bannerData.subtitle}. Leading digital twin, SCADA, and industrial intelligence platforms.`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data (Brand / WebPage Context)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": bannerData.title,
    "description": metaDescription,
    "mainEntity": {
      "@type": "Brand",
      "name": bannerData.title,
      "description": bannerData.subtitle,
      "image": bgImg || undefined
    }
  };

  return (
    <>
      {/* Dynamic Head Meta Injections */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Hero Background Image Preload for LCP */}
        {bgImg && <link rel="preload" as="image" href={bgImg} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {bgImg && <meta property="og:image" content={bgImg} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {bgImg && <meta name="twitter:image" content={bgImg} />}

        {/* Structured Data Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Banner Hero Section */}
      <section
        className="relative w-full bg-[#0B1928] font-sans overflow-hidden flex items-center justify-center h-56 sm:h-72 lg:h-[441px]"
        aria-label="AVEVA Industrial Software Hero Banner"
      >
        {/* BACKGROUND IMAGE OVERLAY */}
        {bgImg && (
          <div
            className="absolute inset-0 bg-cover  bg-center bg-no-repeat opacity-60 pointer-events-none"
            style={{ backgroundImage: `url(${bgImg})` }}
            role="img"
            aria-label={`${bannerData.title} background representation`}
          />
        )}

        {/* MAIN BANNER CONTENT CONTAINER */}
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
            {bannerData.title || 'AVEVA'}
          </h1>

          {bannerData.subtitle && (
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 font-medium max-w-2xl tracking-wide leading-relaxed text-justify">
              {bannerData.subtitle}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default AvevaBannerSection;