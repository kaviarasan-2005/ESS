import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHoneywellGasDetectionDetails } from '../services/api';

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

const HoneywellGasDetectionDetailsSection = () => {
  const [data, setData] = useState({
    header_title: 'Trusted Honeywell Gas Detection Solutions',
    header_description: '',
    range_title: 'Our Honeywell Product Range',
    range_image_url: '',
    range_paragraph_1: '',
    range_paragraph_2: '',
    cards: [],
    support_title: 'Honeywell Analytics Distributor Support',
    support_points: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchHoneywellGasDetectionDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Honeywell Gas Detection details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.header_title || 'Honeywell Gas Detection Solutions';
  const metaTitle = `${displayTitle} | ESS-ME Certified Distributor`;
  const rawDescription = `${data.header_description || ''} ${data.range_paragraph_1 || ''}`;
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) || 
    'Honeywell gas detection product range, toxic and combustible gas detectors, flame sensors, and distributor support across the Middle East.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const rangeImageUrl = data.range_image_url && data.range_image_url.trim() !== '' ? data.range_image_url : undefined;

  // JSON-LD Structured Data Schema (ItemList / Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Honeywell Gas Detection Product Range & Technical Services',
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
          name: 'Honeywell Analytics',
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
        {rangeImageUrl && <meta property="og:image" content={rangeImageUrl} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {rangeImageUrl && <meta name="twitter:image" content={rangeImageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Details Section Container - Min-height shell prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[600px] w-full overflow-hidden bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Honeywell Gas Detection Product Range and Distributor Support"
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
              {/* SECTION 1: HEADER */}
              <Reveal className="space-y-4 text-center">
                <article>
                  <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                    {data.header_title}
                  </h2>
                  {data.header_description && (
                    <p className="mx-auto mt-4 max-w-4xl text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg">
                      {data.header_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 2: PRODUCT RANGE (IMAGE + TEXT) */}
              <div className="space-y-6">
                <Reveal>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.range_title}
                  </h3>
                </Reveal>
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-14">
                  {/* Image Box (fills fully, height follows the text on desktop) */}
                  <Reveal from="left" className="flex w-full min-w-0 lg:flex-1">
                    <div className="flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                      <div className="relative h-64 w-full bg-slate-50 md:h-80 lg:h-auto">
                        {data.range_image_url && data.range_image_url.trim() !== '' ? (
                          <img
                            src={data.range_image_url}
                            alt={`${displayTitle} Product Range`}
                            loading="lazy"
                            decoding="async"
                            width="600"
                            height="400"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-400">
                            <span className="text-4xl" role="img" aria-label="Pager icon">📟</span>
                            <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                              Product Range Photo
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>

                  {/* Description Text */}
                  <Reveal
                    from="right"
                    delay={STAGGER_MS}
                    className="flex w-full min-w-0 flex-col justify-center space-y-4 text-justify text-sm leading-relaxed text-black md:text-base lg:flex-1 lg:text-lg"
                  >
                    <article className="space-y-4">
                      {data.range_paragraph_1 && <p>{data.range_paragraph_1}</p>}
                      {data.range_paragraph_2 && (
                        <p className="whitespace-pre-line">{data.range_paragraph_2}</p>
                      )}
                    </article>
                  </Reveal>
                </div>
              </div>

              {/* SECTION 3: 2 FEATURE CARDS */}
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

              {/* SECTION 4: DISTRIBUTOR SUPPORT */}
              <div className="space-y-4 pt-4">
                <Reveal>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.support_title}
                  </h3>
                </Reveal>
                <ul className="space-y-3 pl-2">
                  {data.support_points &&
                    data.support_points.map((point, idx) => (
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
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HoneywellGasDetectionDetailsSection;