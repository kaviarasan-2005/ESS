import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchBartecOverview } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const DEFAULT_DATA = {
  title: 'Bartec Analyzer Shelters & Sample Systems',
  description:
    "In the demanding environments of the Middle East's oil & gas and petrochemical sectors, protecting sensitive analytical instrumentation is paramount. ESS-ME, as an expert integrator of Bartec analyzer shelters, delivers fully engineered, turnkey solutions that ensure analytical integrity. We provide more than just enclosures; we deliver complete life-support systems for your analyzers, guaranteeing reliable performance and accurate data in the face of extreme heat, sand, and corrosive atmospheres.",
  image_url: ''
};

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const BartecOverviewSection = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchBartecOverview()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.title || payload.description) {
          setData({
            title: payload.title || DEFAULT_DATA.title,
            description: payload.description || DEFAULT_DATA.description,
            image_url: payload.image_url || payload.image || ''
          });
        }
      })
      .catch((err) => console.error('Failed to fetch Bartec overview:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const imageUrl = formatImageUrl(data.image_url);

  // Dynamic Meta Setup for Search Engines
  const metaTitle = `${data.title} | Integrated Analyzer Houses & Enclosures`;
  const cleanDescription = data.description.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (Product Context)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.title,
    "description": cleanDescription,
    "brand": {
      "@type": "Brand",
      "name": "BARTEC"
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
      {/* Helmet SEO Meta Tags */}
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
      <section 
        className="relative w-full bg-white text-black py-16 md:py-24 px-6 md:px-12 overflow-hidden border-b border-slate-200 min-h-[450px]"
        aria-label="BARTEC Overview Section"
      >
        <div className="relative max-w-7xl mx-auto">
          {/* SECTION HEADING */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight leading-tight max-w-4xl mb-12">
            {data.title}
          </h2>

          {/* CONTENT & IMAGE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* LEFT: TEXT PARAGRAPH WITH ACCENT BAR */}
            <div className="lg:col-span-6 space-y-4">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                  <div className="h-4 bg-slate-200 rounded w-4/6" />
                </div>
              ) : (
               <p className="text-base md:text-lg leading-relaxed text-black text-justify hyphens-auto font-normal border-l-2 border-[#FFC107] pl-4 py-1 whitespace-pre-line">
  {data.description}
</p>
              )}
            </div>

            {/* RIGHT: FEATURED IMAGE CARD */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-[16/10] bg-white rounded-2xl p-2 shadow-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
                {loading ? (
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${data.title} - Turnkey Analyzer House Protection`}
                    loading="lazy"
                    decoding="async"
                    width="500"
                    height="312"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-xl p-6 text-center">
                    <span className="text-3xl font-black text-[#FF6B00] tracking-wider uppercase">
                      BARTEC
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default BartecOverviewSection;