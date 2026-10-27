import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchEcoPhysicsBanner } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const DEFAULT_BANNER = {
  title: 'Eco Physics',
  subtitle: 'High Precision Gas Analyzers and Environmental Measurement Systems',
  bg_image: '',
  bg_image_url: ''
};

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const EcoPhysicsBanner = () => {
  const [banner, setBanner] = useState(DEFAULT_BANNER);

  useEffect(() => {
    let isMounted = true;
    fetchEcoPhysicsBanner()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.title || payload.subtitle) {
          setBanner({
            title: payload.title || DEFAULT_BANNER.title,
            subtitle: payload.subtitle || DEFAULT_BANNER.subtitle,
            bg_image_url: payload.bg_image_url || payload.bg_image || ''
          });
        }
      })
      .catch((err) => console.error('Failed to load Eco Physics banner:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const bgUrl = formatImageUrl(banner.bg_image_url);

  // Dynamic SEO Metadata
  const metaTitle = `${banner.title} | ${banner.subtitle}`;
  const metaDescription = `Explore ${banner.title} solutions for ${banner.subtitle}. Ultra-sensitive CLD NOx analyzers and environmental measurement systems.`;
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
      {/* Helmet SEO Meta Tags */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Hero Image Preload for Core Web Vitals (LCP) */}
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
        className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-[#081b2c] font-sans sm:h-72 lg:h-[441px]"
        aria-label="Eco Physics Banner"
      >
        {/* BACKGROUND IMAGE OVERLAY */}
        {bgUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={bgUrl}
              alt={`${banner.title} background representation`}
              className="h-full w-full object-cover object-center opacity-80"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-[#081b2c]" />
        )}

        {/* CENTERED TEXT CONTENT */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="mt-3 text-sm font-medium text-gray-200 drop-shadow-sm md:text-base lg:text-lg">
              {banner.subtitle}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default EcoPhysicsBanner;