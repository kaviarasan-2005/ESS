import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchAKAYOverview } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const SECTION_STYLE = 'relative w-full bg-white text-black py-16 md:py-24 px-6 overflow-hidden min-h-[450px]';
const IMAGE_CARD_STYLE = 'w-full max-w-lg bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-lg';

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AkayOverview = () => {
  const [overviewData, setOverviewData] = useState({
    title: 'AKAY Industries Centrifugal Pumps',
    description:
      "When your process depends on moving aggressive, high-purity, or temperature-sensitive fluids, you need a pump that combines robust engineering with precise performance. ESS-ME is the trusted supplier of AKAY Industries centrifugal pumps, delivering rugged reliability for the most challenging applications in the Middle East's chemical, petrochemical, and industrial sectors. We provide pumping solutions engineered to handle corrosive chemicals, cryogenic liquids, and high-temperature fluids with unwavering durability.",
    image: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchAKAYOverview()
      .then((res) => {
        if (!isMounted) return;

        // Safely extract payload across multiple backend response layers
        const payload = res?.data?.data || res?.data || res || {};

        if (payload && payload.title) {
          setOverviewData({
            title: payload.title || 'AKAY Industries Centrifugal Pumps',
            description: payload.description || '',
            image: payload.image || payload.image_url || '',
            image_url: payload.image_url || payload.image || ''
          });
        }
      })
      .catch((err) => console.error('Failed to load AKAY Overview:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const imageUrl = formatImageUrl(overviewData.image_url || overviewData.image);

  // Dynamic Meta Setup for Search Engines
  const metaTitle = `${overviewData.title} | Chemical Process & Fluid Solutions`;
  const cleanDescription = overviewData.description.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (Product Context)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": overviewData.title,
    "description": cleanDescription,
    "brand": {
      "@type": "Brand",
      "name": "AKAY Industries"
    },
    "image": imageUrl || undefined,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      {/* Helmet SEO Meta Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={cleanDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={cleanDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={cleanDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Overview Section */}
      <section className={SECTION_STYLE} aria-label="AKAY Industries Overview">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* LEFT COLUMN: TITLE & DESCRIPTION */}
          <div className="flex-1 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black">
              {overviewData.title}
            </h2>

            {/* Simple divider under title */}
            <div className="mt-4 mb-6 h-1 w-16 bg-black rounded-full" />

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
            ) : (
              <div className="text-black text-sm md:text-base leading-relaxed space-y-4 font-normal">
                {overviewData.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: IMAGE CARD */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className={IMAGE_CARD_STYLE}>

              {/* IMAGE */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {loading ? (
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${overviewData.title} - Chemical Process & Heavy-Duty Centrifugal Pumps`}
                    loading="lazy"
                    decoding="async"
                    width="500"
                    height="375"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center p-6 text-black font-semibold text-xs uppercase">
                    No Image Selected
                  </div>
                )}
              </div>

              {/* BRAND FOOTER */}
              

            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default AkayOverview;