import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHoneywellDetails } from '../services/api';

// Scroll-reveal animation constants
const REVEAL_BASE = "transition-all duration-700 ease-out motion-reduce:transition-none";
const REVEAL_HIDDEN = {
  up: "translate-y-10 opacity-0",
  left: "-translate-x-16 opacity-0",
  right: "translate-x-16 opacity-0",
};
const REVEAL_SHOWN = "translate-x-0 translate-y-0 opacity-100";
const STAGGER_MS = 150;
const VISIBLE_THRESHOLD = 0.15;

// Fades / slides its children in once, when they scroll into view
const Reveal = ({ as: Tag = 'div', from = 'up', delay = 0, className = '', children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_THRESHOLD }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${REVEAL_BASE} ${isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN[from]} ${className}`}
    >
      {children}
    </Tag>
  );
};

const HoneywellDetailsSection = () => {
  const [data, setData] = useState({
    legacy_title: "Honeywell's Legacy of Process Control Innovation",
    legacy_description: '',
    portfolio_title: 'Honeywell Automation Service Portfolio',
    portfolio_description: '',
    cards: [],
    value_title: 'ESS-ME Value Addition',
    value_description: '',
    industries_title: 'Core Industries We Serve',
    industries: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchHoneywellDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Honeywell details section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const metaTitle = `${data.legacy_title || 'Honeywell Process Control Innovation'} | ESS-ME`;
  const rawDescription = `${data.legacy_description} ${data.portfolio_description}`;
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) || 
    'Honeywell automation service portfolio including Experion PKS DCS, Safety Manager SIS, field instrumentation, and industrial control systems.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList & Service Schema)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Honeywell Automation Solutions and Services',
    description: metaDescription,
    itemListElement: (data.cards || []).map((card, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: card.title,
        description: card.description,
        provider: {
          '@type': 'Organization',
          name: 'ESS-ME',
        },
      },
    })),
  };

  return (
    <>
      {/* Helmet SEO Meta Tags */}
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
        className="relative min-h-[600px] w-full overflow-hidden bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Honeywell Process Control Legacy and Service Portfolio"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading details">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-800 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">Loading details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: LEGACY HEADER */}
              <Reveal className="space-y-4 text-center">
                <article>
                  <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                    {data.legacy_title}
                  </h2>
                  {data.legacy_description && (
                    <p className="mx-auto mt-4 max-w-4xl text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg">
                      {data.legacy_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 2: PORTFOLIO & 2x2 CARDS */}
              <div className="space-y-6">
                <Reveal className="space-y-3 text-center">
                  <article>
                    <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                      {data.portfolio_title}
                    </h3>
                    {data.portfolio_description && (
                      <p className="mx-auto mt-3 max-w-4xl text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg">
                        {data.portfolio_description}
                      </p>
                    )}
                  </article>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
                  {data.cards && data.cards.length > 0
                    ? data.cards.map((card, idx) => (
                        <Reveal
                          key={card.id || idx}
                          from={idx % 2 === 0 ? 'left' : 'right'}
                          delay={idx * STAGGER_MS}
                          className="h-full"
                        >
                          <article className="h-full rounded-xl border border-slate-200 border-t-4 border-t-blue-600 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                            <h4 className="mb-4 text-center text-base font-bold text-black md:text-lg lg:text-xl">
                              {card.title}
                            </h4>
                            <p className="text-justify text-sm leading-relaxed text-black md:text-base">
                              {card.description}
                            </p>
                          </article>
                        </Reveal>
                      ))
                    : null}
                </div>
              </div>

              {/* SECTION 3: VALUE ADDITION */}
              <Reveal className="space-y-3 pt-4">
                <article>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.value_title}
                  </h3>
                  {data.value_description && (
                    <p className="mt-3 text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg">
                      {data.value_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 4: CORE INDUSTRIES BULLET LIST */}
              <div className="space-y-4 pt-2">
                <Reveal>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.industries_title}
                  </h3>
                </Reveal>
                <ul className="space-y-3 pl-2">
                  {data.industries &&
                    data.industries.map((item, idx) => (
                      <Reveal
                        as="li"
                        key={idx}
                        from="left"
                        delay={idx * STAGGER_MS}
                        className="flex items-start gap-3 text-justify text-base text-black md:text-lg"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
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

export default HoneywellDetailsSection;