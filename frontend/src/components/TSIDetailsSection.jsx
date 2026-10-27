import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchTSIDetails } from '../services/api';

// Shared text styles
const BODY_TEXT = 'text-sm leading-relaxed text-black text-justify md:text-base md:leading-loose';
const LIST_TEXT = 'flex items-start gap-2.5 text-sm text-black text-justify md:text-base';
const MAIN_HEADING = 'text-2xl font-extrabold tracking-tight text-black md:text-3xl lg:text-4xl';
const SUB_HEADING = 'text-xl font-bold tracking-tight text-black md:text-2xl lg:text-3xl';
const CARD_CLASS =
  'rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl';
const BULLET_CLASS = 'mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600';

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

const TSIDetailsSection = () => {
  const [data, setData] = useState({
    header_title: 'Trusted TSI Measurement Solutions for the Middle East',
    header_description: '',
    categories_title: 'Our Core TSI Product Categories & Applications',
    categories: [],
    expertise_title: 'More Than a Supplier: Our TSI Expertise & Value-Add',
    expertise_subtitle: '',
    expertise_list: [],
    industries_title: 'TSI for Your Industry',
    industries_subtitle: '',
    industries_list: [],
    cta_title: 'Secure Your Operational Excellence With TSI Data',
    cta_subtitle: '',
    cta_button_text: 'Contact a TSI Application Specialist',
    cta_button_link: '/contact',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchTSIDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load TSI details section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.header_title || 'Trusted TSI Measurement Solutions for the Middle East';
  const metaTitle = `TSI Instruments | ${displayTitle} | ESS-ME`;
  const rawDescription = `${data.header_description || ''} ${data.categories_title || ''}`;
  const metaDescription =
    rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'TSI Instruments environmental monitoring, particle counters, ventilation meters, and dust measurement solutions supplied, calibrated, and supported in the Middle East by ESS-ME.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TSI Precision Measurement Product Categories & Technical Expertise',
    description: metaDescription,
    itemListElement: (data.categories || []).map((cat, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: cat.title,
        description: `${cat.paragraph_1 || ''} ${cat.paragraph_2 || ''}`.trim(),
        brand: {
          '@type': 'Brand',
          name: 'TSI Incorporated',
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
        aria-label="TSI Measurement Solutions Details and Industry Applications"
      >
        <div className="mx-auto max-w-6xl space-y-12">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading details section">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">Loading TSI details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* 1. INTRO HEADER */}
              <Reveal className="space-y-3">
                <article>
                  <h2 className={MAIN_HEADING}>{data.header_title}</h2>
                  {data.header_description && (
                    <p className={`mt-3 ${BODY_TEXT}`}>{data.header_description}</p>
                  )}
                </article>
              </Reveal>

              <hr className="border-slate-200" />

              {/* 2. CORE PRODUCT CATEGORIES */}
              <div className="space-y-8">
                <Reveal>
                  <article>
                    <h3 className={SUB_HEADING}>{data.categories_title}</h3>
                  </article>
                </Reveal>

                <div className="space-y-6">
                  {data.categories &&
                    data.categories.map((cat, idx) => (
                      <Reveal key={cat.id || idx} delay={idx * STAGGER_MS}>
                        <article className={`space-y-2 ${CARD_CLASS}`}>
                          <h4 className="text-lg font-bold text-black md:text-xl">{cat.title}</h4>
                          <p className={BODY_TEXT}>{cat.paragraph_1}</p>
                          {cat.paragraph_2 && <p className={BODY_TEXT}>{cat.paragraph_2}</p>}
                        </article>
                      </Reveal>
                    ))}
                </div>
              </div>

              {/* 3. VALUE-ADD EXPERTISE */}
              <div className="space-y-4 pt-4">
                <Reveal className="space-y-3">
                  <article>
                    <h3 className={SUB_HEADING}>{data.expertise_title}</h3>
                    {data.expertise_subtitle && <p className={`mt-2 ${BODY_TEXT}`}>{data.expertise_subtitle}</p>}
                  </article>
                </Reveal>
                <ul className="mt-3 space-y-3 pl-2">
                  {data.expertise_list &&
                    data.expertise_list.map((item, idx) => (
                      <Reveal key={idx} delay={idx * 80}>
                        <li className={LIST_TEXT}>
                          <span className={BULLET_CLASS} />
                          <span>{item}</span>
                        </li>
                      </Reveal>
                    ))}
                </ul>
              </div>

              {/* 4. INDUSTRIES WE SERVE */}
              <div className="space-y-4 pt-4">
                <Reveal className="space-y-3">
                  <article>
                    <h3 className={SUB_HEADING}>{data.industries_title}</h3>
                    {data.industries_subtitle && <p className={`mt-2 ${BODY_TEXT}`}>{data.industries_subtitle}</p>}
                  </article>
                </Reveal>
                <ul className="mt-3 space-y-2.5 pl-2">
                  {data.industries_list &&
                    data.industries_list.map((item, idx) => (
                      <Reveal key={idx} delay={idx * 80}>
                        <li className={LIST_TEXT}>
                          <span className={BULLET_CLASS} />
                          <span>{item}</span>
                        </li>
                      </Reveal>
                    ))}
                </ul>
              </div>

              {/* 5. CTA CARD BANNER */}
              <Reveal className="pt-4">
                <aside className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E3A8A] via-[#1d4ed8] to-[#155CFB] p-8 text-center text-white shadow-2xl md:p-12">
                  {/* soft decorative circles */}
                  <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                  <div className="pointer-events-none absolute -bottom-12 -right-12 h-52 w-52 rounded-full bg-white/10" />

                  <div className="relative">
                    <h3 className="text-xl font-extrabold tracking-tight md:text-2xl lg:text-3xl">
                      {data.cta_title}
                    </h3>
                    {data.cta_subtitle && (
                      <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 md:text-base">
                        {data.cta_subtitle}
                      </p>
                    )}
                    <div className="mt-6">
                      <Link
                        to={data.cta_button_link || '/contact'}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-xs font-bold text-[#1E3A8A] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl md:text-sm hover:bg-blue-600 hover:text-amber-50"
                        aria-label={data.cta_button_text}
                      >
                        <span role="img" aria-label="Loudspeaker emoji">📢</span>
                        <span >{data.cta_button_text}</span>
                      </Link>
                    </div>
                  </div>
                </aside>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default TSIDetailsSection;