import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchVogelsangDetails } from '../services/api';

// Shared text styles
const BODY_TEXT = 'text-base leading-relaxed text-black text-justify md:text-lg md:leading-loose';
const LIST_TEXT = 'flex items-start gap-2.5 text-base text-black text-justify md:text-lg';
const MAIN_HEADING = 'text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl';
const SUB_HEADING = 'text-2xl font-bold tracking-tight text-black md:text-3xl lg:text-4xl';
const CARD_TITLE = 'mb-3 text-xl font-bold text-black md:text-2xl';
const SUBTITLE_TEXT = 'text-base font-semibold text-black text-justify md:text-lg';
const CARD_CLASS =
  'flex flex-col justify-start rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl';
const BULLET_CLASS = 'mt-2.5 h-2 w-2 shrink-0 rounded-full bg-blue-600';

// Animation timing
const STAGGER_MS = 100;

// Fades an element up when it scrolls into view
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const VogelsangDetailsSection = () => {
  const [data, setData] = useState({
    header_title: 'German Engineering for the Most Demanding Fluid Handling',
    header_description: '',
    product_line_title: 'Our Vogelsang Product Line',
    product_line_description: '',
    cards: [],
    advantage_title: 'ESS-ME Advantage: Application-Specific Solutions',
    advantage_subtitle: '',
    advantage_list: [],
    applications_title: 'Primary Applications',
    applications_list: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchVogelsangDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Vogelsang details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.header_title || 'German Engineering for the Most Demanding Fluid Handling';
  const metaTitle = `Vogelsang | ${displayTitle} | ESS-ME`;
  const rawDescription = `${data.header_description || ''} ${data.product_line_description || ''}`;
  const metaDescription =
    rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'Vogelsang industrial pumps, rotary lobe technology, twin-shaft macerators, and solids handling solutions engineered for Middle East wastewater & process plants by ESS-ME.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vogelsang Industrial Pumping & Maceration Product Line',
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
          name: 'Vogelsang',
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
        className="relative min-h-[600px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Vogelsang Product Range and Application Capabilities"
      >
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
              <Reveal className="space-y-3">
                <article>
                  <h2 className={MAIN_HEADING}>{data.header_title}</h2>
                  {data.header_description && (
                    <p className={`mt-3 ${BODY_TEXT}`}>{data.header_description}</p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 2: PRODUCT LINE & CARDS */}
              <div className="space-y-6">
                <Reveal className="space-y-2">
                  <article>
                    <h3 className={SUB_HEADING}>{data.product_line_title}</h3>
                    {data.product_line_description && (
                      <p className={`mt-2 ${BODY_TEXT}`}>{data.product_line_description}</p>
                    )}
                  </article>
                </Reveal>

                {/* CARDS GRID */}
                {data.cards && data.cards.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {data.cards.map((card, idx) => (
                      <Reveal key={card.id || idx} delay={(idx % 2) * STAGGER_MS} className="flex">
                        <article className={`w-full ${CARD_CLASS}`}>
                          <h4 className={CARD_TITLE}>{card.title}</h4>
                          <p className={BODY_TEXT}>{card.description}</p>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: ESS-ME ADVANTAGE */}
              <div className="space-y-3 pt-2">
                <Reveal className="space-y-3">
                  <article>
                    <h3 className={SUB_HEADING}>{data.advantage_title}</h3>
                    {data.advantage_subtitle && (
                      <p className={`mt-2 ${SUBTITLE_TEXT}`}>{data.advantage_subtitle}</p>
                    )}
                  </article>
                </Reveal>
                <ul className="mt-3 space-y-2 pl-2">
                  {data.advantage_list &&
                    data.advantage_list.map((item, idx) => (
                      <Reveal key={idx} delay={idx * 80}>
                        <li className={LIST_TEXT}>
                          <span className={BULLET_CLASS} />
                          <span>{item}</span>
                        </li>
                      </Reveal>
                    ))}
                </ul>
              </div>

              {/* SECTION 4: PRIMARY APPLICATIONS */}
              <div className="space-y-3 pt-2">
                <Reveal>
                  <article>
                    <h3 className={SUB_HEADING}>{data.applications_title}</h3>
                  </article>
                </Reveal>
                <ul className="mt-3 space-y-2 pl-2">
                  {data.applications_list &&
                    data.applications_list.map((item, idx) => (
                      <Reveal key={idx} delay={idx * 80}>
                        <li className={LIST_TEXT}>
                          <span className={BULLET_CLASS} />
                          <span>{item}</span>
                        </li>
                      </Reveal>
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

export default VogelsangDetailsSection;