import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHoneywellGasDetectionIndustries } from '../services/api';

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

const HoneywellGasDetectionIndustriesSection = () => {
  const [data, setData] = useState({
    section_title: 'Industries We Serve',
    intro_text:
      'Our Honeywell gas detection solutions protect assets and personnel in the following major areas:',
    industry_list: [],
    poster_image_url: '',
    poster_caption: 'Honeywell in Oil & Gas Applications',
    footer_text:
      'Our applications range all across the Middle East, especially Qatar. To understand more about our services, send an email to our Honeywell Gas detection specialists and we will reach out to you right away.',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIndustriesData();
  }, []);

  const loadIndustriesData = async () => {
    try {
      setLoading(true);
      const res = await fetchHoneywellGasDetectionIndustries();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Honeywell Gas Detection industries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.section_title || 'Industries We Serve';
  const metaTitle = `Honeywell Gas Detection ${displayTitle} | ESS-ME`;
  const rawDescription = `${data.intro_text || ''} ${data.footer_text || ''}`;
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) || 
    'Honeywell gas detection industry applications across Qatar and the Middle East. Specialized safety monitoring for oil & gas, petrochemical, and power generation sectors.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const posterImageUrl = data.poster_image_url && data.poster_image_url.trim() !== '' ? data.poster_image_url : undefined;

  // JSON-LD Structured Data Schema (ItemList / Service / Industry Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Honeywell Gas Detection Industry Applications',
    description: metaDescription,
    itemListElement: (data.industry_list || []).map((industry, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: typeof industry === 'string' ? industry : industry?.name || 'Industrial Safety Application',
        description: `Honeywell Gas Detection solutions for ${typeof industry === 'string' ? industry : industry?.name || 'industrial facilities'}.`,
        provider: {
          '@type': 'Organization',
          name: 'ESS-ME',
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
        {posterImageUrl && <meta property="og:image" content={posterImageUrl} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {posterImageUrl && <meta name="twitter:image" content={posterImageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Section Shell - Preserves min-height to prevent Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[600px] w-full overflow-hidden bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Honeywell Gas Detection Industry Applications and Regional Coverage"
      >
        <div className="mx-auto max-w-6xl space-y-10">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading industries section">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-800 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">Loading section...</p>
              </div>
            </div>
          ) : (
            <>
              {/* MAIN SECTION TITLE */}
              <Reveal>
                <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                  {data.section_title}
                </h2>
              </Reveal>

              {/* TWO-COLUMN GRID */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">

                {/* LEFT COLUMN: INTRO & BULLET LIST */}
                <Reveal from="left" className="h-full">
                  <article className="flex h-full flex-col justify-center rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 bg-white p-8 shadow-lg">
                    <p className="mb-6 text-justify text-base font-medium leading-relaxed text-black md:text-lg lg:text-xl">
                      {data.intro_text}
                    </p>
                    <ul className="space-y-4 pl-2">
                      {data.industry_list &&
                        data.industry_list.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-justify text-base font-semibold text-black md:text-lg"
                          >
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  </article>
                </Reveal>

                {/* RIGHT COLUMN: POSTER / BROCHURE CARD */}
                <Reveal from="right" delay={STAGGER_MS} className="h-full">
                  <figure className="relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 shadow-md md:h-96 lg:h-full lg:min-h-[24rem]">
                      {data.poster_image_url && data.poster_image_url.trim() !== '' ? (
                        <img
                          src={data.poster_image_url}
                          alt={data.poster_caption || 'Honeywell Gas Detection Industrial Applications'}
                          loading="lazy"
                          decoding="async"
                          width="600"
                          height="400"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-400">
                          <span className="text-5xl" role="img" aria-label="Brochure icon">📖</span>
                          <span className="mt-3 text-xs font-bold uppercase tracking-wider">
                            Gas Detection Brochure Cover
                          </span>
                        </div>
                      )}
                    </div>
                    {data.poster_caption && (
                      <figcaption className="mt-4 text-center text-sm font-semibold italic text-black md:text-base">
                        {data.poster_caption}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>

              </div>

              {/* FOOTER PARAGRAPH WITH EMAIL HIGHLIGHT */}
              <Reveal className="pt-4">
                <article>
                  <p className="text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg">
                    {data.footer_text}
                  </p>
                </article>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HoneywellGasDetectionIndustriesSection;