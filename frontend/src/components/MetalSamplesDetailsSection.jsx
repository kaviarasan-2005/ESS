import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchMetalSamplesDetails } from '../services/api';

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

const MetalSamplesDetailsSection = () => {
  const [data, setData] = useState({
    global_title: 'Global Standard in Corrosion/Erosion Monitoring',
    global_description: '',
    range_title: 'Our Metal Samples Product Range',
    range_description: '',
    cards: [],
    advantage_title: 'ESS-ME Advantage: From Data to Decision',
    advantage_intro: '',
    advantage_points: [],
    industries_title: 'Industries Reliant on This Technology',
    industries_list: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchMetalSamplesDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Metal Samples details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.global_title || 'Global Standard in Corrosion/Erosion Monitoring';
  const metaTitle = `${displayTitle} | ESS-ME Metal Samples`;
  const rawDescription = `${data.global_description || ''} ${data.range_description || ''}`;
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'Metal Samples corrosion probes, coupons, high-pressure access fittings, ER/LPR monitoring systems, and technical services supplied by ESS-ME.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Metal Samples Corrosion Monitoring Portfolio & Engineering Services',
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
          name: 'Metal Samples',
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

      {/* Main Details Section Container - Fixed Shell Prevents CLS */}
      <section
        className="relative min-h-[600px] w-full overflow-hidden bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Metal Samples Corrosion Monitoring Capabilities and Industry Applications"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading details section">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-800 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">Loading details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: GLOBAL STANDARD */}
              <Reveal className="space-y-4 text-center">
                <article>
                  <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                    {data.global_title}
                  </h2>
                  {data.global_description && (
                    <p className="mx-auto mt-4 max-w-4xl text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg">
                      {data.global_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 2: PRODUCT RANGE & CARDS */}
              <div className="space-y-6">
                <Reveal className="space-y-3 text-center">
                  <article>
                    <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                      {data.range_title}
                    </h3>
                    {data.range_description && (
                      <p className="mx-auto mt-3 max-w-4xl text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg">
                        {data.range_description}
                      </p>
                    )}
                  </article>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
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

              {/* SECTION 3: ESS-ME ADVANTAGE */}
              <div className="space-y-4 pt-2">
                <Reveal className="space-y-3">
                  <article>
                    <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                      {data.advantage_title}
                    </h3>
                    {data.advantage_intro && (
                      <p className="mt-3 text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg">
                        {data.advantage_intro}
                      </p>
                    )}
                  </article>
                </Reveal>
                <ul className="space-y-3 pl-2">
                  {data.advantage_points &&
                    data.advantage_points.map((point, idx) => (
                      <Reveal
                        as="li"
                        key={idx}
                        from="left"
                        delay={idx * STAGGER_MS}
                        className="flex items-start gap-3 text-justify text-base text-black md:text-lg"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        <span>{point}</span>
                      </Reveal>
                    ))}
                </ul>
              </div>

              {/* SECTION 4: INDUSTRIES RELIANT */}
              <div className="space-y-4 pt-2">
                <Reveal>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.industries_title}
                  </h3>
                </Reveal>
                <ul className="space-y-3 pl-2">
                  {data.industries_list &&
                    data.industries_list.map((item, idx) => (
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

export default MetalSamplesDetailsSection;