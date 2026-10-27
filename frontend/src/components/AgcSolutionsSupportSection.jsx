import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

// Fade-up entrance animation for each block, staggered by data-index
const SECTION_ANIM_STYLES = `
  @keyframes agcFadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .agc-fade-block {
    animation: agcFadeInUp 0.7s ease-out both;
  }
  .agc-fade-card {
    animation: agcFadeInUp 0.6s ease-out both;
  }
  @media (prefers-reduced-motion: reduce) {
    .agc-fade-block, .agc-fade-card { animation: none; }
  }
`;

const AgcSolutionsSupportSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API_BASE_URL}/api/agc-instruments/solutions-support`)
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.data) {
          setData(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to load AGC Solutions & Support:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // SEO Dynamic Meta Setup
  const metaTitle = data?.solutions_title
    ? `${data.solutions_title} | AGC Instruments Support & Services`
    : 'AGC Instruments Solutions & Technical Service Support';

  const rawDescription = data?.precision_description || data?.solutions_description || '';
  const metaDescription = rawDescription
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD ItemList / Service Schema for Search Engines
  const schemaData = data ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Gas Chromatography & Analysis Support",
    "provider": {
      "@type": "Organization",
      "name": "AGC Instruments Solutions"
    },
    "name": data.solutions_title || "AGC Gas Analysis Solutions",
    "description": metaDescription,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AGC Product Solutions",
      "itemListElement": data.product_cards?.map((card, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": card.title,
          "description": card.description
        },
        "position": idx + 1
      })) || []
    }
  } : null;

  return (
    <>
      {/* Helmet Meta & SEO Injections */}
      {data && (
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          {pageUrl && <link rel="canonical" href={pageUrl} />}

          {/* Open Graph Meta Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={metaDescription} />

          {/* Structured Data (JSON-LD) */}
          <script type="application/ld+json">
            {JSON.stringify(schemaData)}
          </script>
        </Helmet>
      )}

      {/* Main Container - Prevents Cumulative Layout Shift (CLS) */}
      <section
        className="w-full bg-white text-[#0b1220] py-16 md:py-20 px-6 md:px-16 overflow-hidden min-h-[600px]"
        aria-label="AGC Solutions and Integration Support"
      >
        <style>{SECTION_ANIM_STYLES}</style>

        {loading || !data ? (
          <div className="w-full py-20 flex justify-center items-center" aria-label="Loading solutions data">
            <div className="w-8 h-8 border-2 border-[#0b2447] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-16">

            {/* 1. PRECISION GAS ANALYSIS */}
            <div className="agc-fade-block space-y-4 max-w-5xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0b2447]">
                {data.precision_title}
              </h2>
              <span className="inline-block w-12 h-1 bg-[#1E3A8A] rounded-full" />

              <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal text-center">
                {data.precision_description}
              </p>
            </div>

            {/* 2. OUR AGC PRODUCT SOLUTIONS */}
            <div className="agc-fade-block space-y-8" style={{ animationDelay: '0.1s' }}>
              <div className="space-y-3 max-w-5xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0b2447]">
                  {data.solutions_title}
                </h2>
                <span className="inline-block w-12 h-1 bg-[#1E3A8A] rounded-full" />

                <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal text-center">
                  {data.solutions_description}
                </p>
              </div>

              {/* TWO SIDE-BY-SIDE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.product_cards?.map((card, idx) => (
                  <article
                    key={idx}
                    className="agc-fade-card bg-white border border-slate-200 rounded-2xl p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3"
                    style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white font-extrabold text-sm">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-[#0b2447]">
                      {card.title}
                    </h3>
                    <p className="text-lg md:text-base text-slate-600 leading-relaxed text-justify font-normal">
                      {card.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* 3. OUR INTEGRATION & SERVICE SUPPORT */}
            <div
              className="agc-fade-block bg-[#f8fafc] border border-slate-200 rounded-2xl p-7 md:p-10 space-y-5"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="space-y-2 max-w-3xl">
                <span className="inline-block w-12 h-1 bg-[#1E3A8A] rounded-full" />
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0b2447]">
                  {data.support_title}
                </h2>
                {data.support_description && (
                  <p className="text-base md:text-lg text-slate-600 font-medium">
                    {data.support_description}
                  </p>
                )}
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-1">
                {data.support_items?.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm md:text-base text-slate-700">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1E3A8A] text-white text-[10px] font-bold mr-2.5 mt-0.5 shrink-0">
                      ✓
                    </span>
                    <span>
                      <strong className="font-bold text-[#0b2447]">{item.title}: </strong>
                      <span className="text-slate-600">{item.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. KEY INDUSTRIES */}
            <div className="agc-fade-block space-y-5" style={{ animationDelay: '0.25s' }}>
              <div className="space-y-2 max-w-3xl">
                <span className="inline-block w-12 h-1 bg-[#1E3A8A] rounded-full" />
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0b2447]">
                  {data.industries_title}
                </h2>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-1">
                {data.industry_items?.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm md:text-base text-slate-700">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1E3A8A] text-white text-[10px] font-bold mr-2.5 mt-0.5 shrink-0">
                      ✓
                    </span>
                    <span>
                      <strong className="font-bold text-[#0b2447]">{item.title}: </strong>
                      <span className="text-slate-600">{item.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </section>
    </>
  );
};

export default AgcSolutionsSupportSection;