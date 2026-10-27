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

const AgcOverviewSection = () => {
  const [content, setContent] = useState({
    title: 'AGC Instruments Gas Chromatographs & Analysers',
    description:
      "In industries where gas composition directly impacts product quality, revenue, and safety, there is no room for estimation. ESS-ME is the trusted supplier of AGC Instruments gas chromatographs and process analyzers, delivering laboratory-grade precision for continuous online monitoring. We provide robust, reliable solutions for the Middle East's natural gas, petrochemical, and industrial sectors, ensuring you have the accurate, real-time data needed for custody transfer, process optimization, and quality assurance.",
    image_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API_BASE_URL}/api/agc-instruments/overview`)
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || {};
        if (payload.title) {
          setContent({
            title: payload.title,
            description: payload.description || '',
            image_url: payload.image_url || payload.image || ''
          });
        }
      })
      .catch((err) => console.error('Failed to load AGC Overview:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const imageUrl = formatImageUrl(content.image_url);

  // Dynamic Meta Values for Section SEO
  const cleanDescription = content.description.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (Product / Technical Article Context)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": content.title,
    "description": cleanDescription,
    "brand": {
      "@type": "Brand",
      "name": "AGC Instruments"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "image": imageUrl || undefined
  };

  return (
    <>
      {/* Helmet SEO Meta Injection */}
      <Helmet>
        <title>{`${content.title} | Process Analyzers & Gas Chromatography`}</title>
        <meta name="description" content={cleanDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={cleanDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={cleanDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Overview Section */}
      <section 
        className="relative w-full bg-white text-[#0b2447] py-16 md:py-20 px-6 md:px-12 overflow-hidden"
        aria-label="AGC Instruments Overview"
      >
        {/* SUBTLE DOT GRID OVERLAY */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#0b2447_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-7xl mx-auto">
          {/* HEADING */}
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mb-10 md:mb-14">
            {content.title}
          </h2>

          {/* CONTENT GRID (image left, text right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center min-h-[300px]">
            {/* LEFT: CARD IMAGE CONTAINER */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start order-1 lg:order-1">
              <div className="relative rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden group h-[300px] bg-slate-100">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#0b2447] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${content.title} - Continuous Online Gas Analysis`}
                    loading="lazy"
                    decoding="async"
                    width="500"
                    height="300"
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f0f6fa] flex items-center justify-center text-slate-400 font-semibold text-xs">
                    No Image Set
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: DESCRIPTION TEXT */}
            <div className="lg:col-span-7 space-y-4 order-2 lg:order-2 border-l-4 border-[#0b2447] pl-6">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                  <div className="h-4 bg-slate-200 rounded w-4/6" />
                </div>
              ) : (
                <p className="text-sm md:text-lg leading-relaxed text-slate-700 font-normal whitespace-pre-line text-justify">
                  {content.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AgcOverviewSection;