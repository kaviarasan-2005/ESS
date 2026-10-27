import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchMichellInstrumentsDetails } from '../services/api';

const REVEAL_THRESHOLD = 0.15;
const CARD_STAGGER_MS = 150;

// Fades and slides content up when it scrolls into view
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: REVEAL_THRESHOLD }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const MichellDetails = () => {
  const [data, setData] = useState({
    importance_title: 'Importance of Moisture Measurement',
    importance_description: '',
    solutions_title: 'Our Michell Instruments Product Solutions',
    solutions_description: '',
    cards: [],
    support_title: 'Expert Application Support',
    support_intro: '',
    support_points: [],
    applications_title: 'Typical Applications',
    applications_list: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchMichellInstrumentsDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Michell Instruments details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.importance_title || 'Importance of Moisture Measurement';
  const metaTitle = `Michell Instruments | ${displayTitle} | ESS-ME`;
  const rawDescription = `${data.importance_description || ''} ${data.solutions_description || ''}`;
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) || 
    'Michell Instruments moisture measurement solutions, impedance dew point transmitters, chilled mirror hygrometers, and expert application support across Middle East industries.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Michell Instruments Product Solutions & Technical Capabilities',
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
          name: 'Michell Instruments',
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
        className="relative min-h-[600px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Michell Instruments Moisture Measurement Capabilities and Applications"
      >
        <div className="mx-auto max-w-6xl space-y-12">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading details section">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-base text-gray-600">Loading details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: IMPORTANCE OF MOISTURE MEASUREMENT */}
              <Reveal className="space-y-3 text-center">
                <article>
                  <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                    {data.importance_title}
                  </h2>
                  {data.importance_description && (
                    <p className="mx-auto mt-3 max-w-4xl text-justify text-base leading-relaxed text-gray-800 md:text-lg">
                      {data.importance_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 2: PRODUCT SOLUTIONS & CARDS */}
              <div className="space-y-6">
                <Reveal className="space-y-2 text-center">
                  <article>
                    <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                      {data.solutions_title}
                    </h3>
                    {data.solutions_description && (
                      <p className="mx-auto mt-2 max-w-4xl text-justify text-base leading-relaxed text-gray-800 md:text-lg">
                        {data.solutions_description}
                      </p>
                    )}
                  </article>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                  {data.cards && data.cards.length > 0
                    ? data.cards.map((card, idx) => (
                        <Reveal key={card.id || idx} delay={idx * CARD_STAGGER_MS}>
                          <article className="h-full rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl">
                            <h4 className="mb-3 text-center text-base font-bold text-black md:text-lg">
                              {card.title}
                            </h4>
                            <p className="text-justify text-sm leading-relaxed text-gray-800 md:text-base">
                              {card.description}
                            </p>
                          </article>
                        </Reveal>
                      ))
                    : null}
                </div>
              </div>

              {/* SECTION 3: EXPERT APPLICATION SUPPORT */}
              <Reveal className="space-y-3 pt-2">
                <article>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.support_title}
                  </h3>
                  {data.support_intro && (
                    <p className="mt-2 text-justify text-base leading-relaxed text-gray-800 md:text-lg">
                      {data.support_intro}
                    </p>
                  )}
                </article>
                <ul className="mt-3 space-y-2 pl-2">
                  {data.support_points &&
                    data.support_points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-base text-gray-800 md:text-lg">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        <span className="text-justify">{point}</span>
                      </li>
                    ))}
                </ul>
              </Reveal>

              {/* SECTION 4: TYPICAL APPLICATIONS */}
              <Reveal className="space-y-3 pt-2">
                <article>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.applications_title}
                  </h3>
                </article>
                <ul className="mt-3 space-y-2 pl-2">
                  {data.applications_list &&
                    data.applications_list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-base text-gray-800 md:text-lg">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        <span className="text-justify">{item}</span>
                      </li>
                    ))}
                </ul>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default MichellDetails;