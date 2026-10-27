import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchEatonMedcBanner } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const DEFAULT_BANNER = {
  title: 'Eaton MEDC',
  carousel_titles: [
    'Eaton MEDC',
    'Explosion-Proof Visual & Audible Signals'
  ],
  subtitle: 'Explosion Proof Visual & Audible Warning Signals',
  bg_image_url: ''
};

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const EatonMedcBanner = () => {
  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [activeTitleIndex, setActiveTitleIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchEatonMedcBanner()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.title || payload.carousel_titles) {
          const titles = payload.carousel_titles?.length >= 2
            ? payload.carousel_titles
            : [payload.title || DEFAULT_BANNER.title, 'Explosion-Proof Visual & Audible Signals'];

          setBanner({
            title: payload.title || DEFAULT_BANNER.title,
            carousel_titles: titles,
            subtitle: payload.subtitle || DEFAULT_BANNER.subtitle,
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => console.error('Failed to load Eaton MEDC banner:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Text Carousel Rotation Timer (3.5s cycle)
  useEffect(() => {
    const titles = banner.carousel_titles;
    if (!titles || titles.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActiveTitleIndex((prev) => (prev + 1) % titles.length);
        setFade(true);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, [banner.carousel_titles]);

  const bgUrl = formatImageUrl(banner.bg_image_url);
  const currentTitle = banner.carousel_titles?.[activeTitleIndex] || banner.title;

  // Dynamic SEO Metadata
  const metaTitle = `${banner.title} | ${banner.subtitle}`;
  const metaDescription = `Explore ${banner.title} solutions for ${banner.subtitle}. Industry-leading ATEX & IECEx certified beacons, sirens, and alarm signals for hazardous areas.`;
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": banner.title,
    "description": metaDescription,
    "mainEntity": {
      "@type": "Brand",
      "name": banner.title,
      "description": banner.subtitle,
      "image": bgUrl || undefined
    }
  };

  return (
    <>
      {/* Helmet SEO Meta Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Hero Background Image Preload for LCP Optimization */}
        {bgUrl && <link rel="preload" as="image" href={bgUrl} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {bgUrl && <meta property="og:image" content={bgUrl} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {bgUrl && <meta name="twitter:image" content={bgUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Hero Banner Section */}
      <section
        className="relative w-full bg-[#0B1928]/80 overflow-hidden select-none h-56 sm:h-72 lg:h-[441px]"
        aria-label="Eaton MEDC Warning Signals Banner"
      >
        {/* BACKGROUND IMAGE OVERLAY */}
        {bgUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 pointer-events-none"
            style={{ backgroundImage: `url(${bgUrl})` }}
            role="img"
            aria-label={`${banner.title} background representation`}
          />
        )}

        {/* HERO CONTENT */}
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center z-10 h-full">
          {/* ROTATING TEXT CAROUSEL TITLE */}
          <h1
            className={`text-4xl sm:text-6xl md:text-6xl font-extrabold text-white tracking-tight leading-tight transition-opacity duration-300 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {currentTitle}
          </h1>

          {/* SUBTITLE */}
          {banner.subtitle && (
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-200 font-medium max-w-2xl">
              {banner.subtitle}
            </p>
          )}

          {/* CAROUSEL INDICATOR DOTS */}
          {/* {banner.carousel_titles?.length > 1 && (
            <div className="flex gap-2 mt-6" aria-hidden="true">
              {banner.carousel_titles.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeTitleIndex === idx ? 'w-6 bg-[#4679e9]' : 'w-2 bg-slate-600'
                  }`}
                />
              ))}
            </div>
          )} */}
        </div>
      </section>
    </>
  );
};

export default EatonMedcBanner;