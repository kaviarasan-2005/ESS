import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchTestoDetails } from '../services/api';

// Shared text styles
const BODY_TEXT = 'text-sm leading-relaxed text-black text-justify md:text-base md:leading-loose';
const LIST_TEXT = 'flex items-start gap-2.5 text-sm text-black text-justify md:text-base';
const SECTION_HEADING = 'text-2xl font-bold tracking-tight text-black md:text-3xl lg:text-4xl';
const CARD_CLASS =
  'rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl';

// Animation timing
const STAGGER_MS = 100;

const TestoDetailsSection = () => {
  const [data, setData] = useState({
    header_title: 'Comprehensive Portable Measurement Solutions',
    header_description: '',
    solutions_title: 'Our Testo Product Solutions',
    solutions_description: '',
    cards: [],
    advantage_title: 'The ESS-ME Advantage: More Than a Supplier',
    advantage_subtitle: '',
    advantage_list: [],
    industries_title: 'Industries We Serve',
    industries_list: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchTestoDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Testo details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.header_title || 'Comprehensive Portable Measurement Solutions';
  const metaTitle = `Testo Portable Instruments | ${displayTitle} | ESS-ME`;
  const rawDescription = `${data.header_description || ''} ${data.solutions_description || ''}`;
  const metaDescription =
    rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'Testo portable measurement solutions, flue gas analyzers, thermal imagers, digital manifolds, and environmental measurement tools supplied across the Middle East by ESS-ME.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Testo Portable Measurement Instruments & Industrial Solutions',
    description: metaDescription,
    itemListElement: (data.cards || []).map((card, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: card.title,
        description: card.description,
        brand: {
          '@type': 'Brand',
          name: 'Testo',
        },
      },
    })),
  };

  return (
    <>
      {/* Helmet SEO Meta Tag Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Details Section Container - Min-height shell prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[600px] w-full bg-white px-6 py-2 font-sans text-black md:px-12 lg:px-20"
        aria-label="Testo Portable Measurement Instruments Details and Technical Solutions"
      >
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            opacity: 0;
            animation: fadeUp 0.7s ease-out forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-fade-up {
              opacity: 1;
              animation: none;
            }
          }
        `}</style>

        <div className="mx-auto max-w-6xl space-y-12">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading details section">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">Loading details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: HEADER & INTRO */}
              <div className="animate-fade-up space-y-3">
                <article>
                  <h2 className={SECTION_HEADING}>
                    {data.header_title}
                  </h2>
                  {data.header_description && (
                    <p className={`mt-3 ${BODY_TEXT}`}>
                      {data.header_description}
                    </p>
                  )}
                </article>
              </div>

              {/* SECTION 2: PRODUCT SOLUTIONS & CARDS */}
              <div className="space-y-6">
                <div className="animate-fade-up space-y-2" style={{ animationDelay: `${STAGGER_MS}ms` }}>
                  <article>
                    <h3 className="text-xl font-bold tracking-tight text-black md:text-2xl lg:text-3xl">
                      {data.solutions_title}
                    </h3>
                    {data.solutions_description && (
                      <p className={`mt-2 ${BODY_TEXT}`}>
                        {data.solutions_description}
                      </p>
                    )}
                  </article>
                </div>

                {/* CARDS GRID (Top 2 cards side-by-side, 3rd card full-width) */}
                {data.cards && data.cards.length > 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {data.cards.slice(0, 2).map((card, idx) => (
                        <article
                          key={card.id || idx}
                          className={`animate-fade-up flex flex-col justify-start ${CARD_CLASS}`}
                          style={{ animationDelay: `${(idx + 2) * STAGGER_MS}ms` }}
                        >
                          <h4 className="mb-3 text-lg font-bold text-black md:text-xl">
                            {card.title}
                          </h4>
                          <p className={BODY_TEXT}>
                            {card.description}
                          </p>
                        </article>
                      ))}
                    </div>

                    {data.cards.length > 2 && (
                      <article
                        className={`animate-fade-up ${CARD_CLASS}`}
                        style={{ animationDelay: `${4 * STAGGER_MS}ms` }}
                      >
                        <h4 className="mb-3 text-lg font-bold text-black md:text-xl">
                          {data.cards[2].title}
                        </h4>
                        <p className={BODY_TEXT}>
                          {data.cards[2].description}
                        </p>
                      </article>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 3: THE ESS-ME ADVANTAGE */}
              <div className="animate-fade-up space-y-3 pt-2">
                <article>
                  <h3 className="text-xl font-bold tracking-tight text-black md:text-2xl lg:text-3xl">
                    {data.advantage_title}
                  </h3>
                  {data.advantage_subtitle && (
                    <p className="mt-1 text-sm font-semibold text-black md:text-base">
                      {data.advantage_subtitle}
                    </p>
                  )}
                </article>
                <ul className="mt-3 space-y-2 pl-2">
                  {data.advantage_list &&
                    data.advantage_list.map((item, idx) => (
                      <li
                        key={idx}
                        className={`animate-fade-up ${LIST_TEXT}`}
                        style={{ animationDelay: `${idx * STAGGER_MS}ms` }}
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* SECTION 4: INDUSTRIES WE SERVE */}
              <div className="animate-fade-up space-y-3 py-12 pt-2">
                <article>
                  <h3 className="text-xl font-bold tracking-tight text-black md:text-2xl lg:text-3xl">
                    {data.industries_title}
                  </h3>
                </article>
                <ul className="mt-3 space-y-2 pl-2">
                  {data.industries_list &&
                    data.industries_list.map((item, idx) => (
                      <li
                        key={idx}
                        className={`animate-fade-up ${LIST_TEXT}`}
                        style={{ animationDelay: `${idx * STAGGER_MS}ms` }}
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default TestoDetailsSection;