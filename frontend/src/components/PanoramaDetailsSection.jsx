import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchPanoramaDetails } from '../services/api';

const STAGGER_MS = 150;

// Fades and slides content up when it scrolls into view
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
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

const PanoramaDetailsSection = () => {
  const [data, setData] = useState({
    visibility_title: 'Unlock Operational Visibility with Panorama SCADA',
    visibility_description: '',
    services_title: 'Panorama SCADA Integration Services',
    services_description: '',
    cards: [],
    advantage_title: 'ESS-ME Advantage in SCADA Solutions',
    advantage_description: '',
    applications_title: 'Industrial Applications',
    applications_list: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchPanoramaDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Panorama details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.visibility_title || 'Unlock Operational Visibility with Panorama SCADA';
  const metaTitle = `Panorama SCADA | ${displayTitle} | ESS-ME`;
  const rawDescription = `${data.visibility_description || ''} ${data.services_description || ''}`;
  const metaDescription =
    rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'Codra Panorama SCADA system integration services, supervisory control, telemetry solutions, and industrial automation capabilities by ESS-ME across the Middle East.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Panorama SCADA Integration Services & Industrial Applications',
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
        aria-label="Panorama SCADA Integration Capabilities and Industrial Applications"
      >
        <div className="mx-auto max-w-6xl space-y-12">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading details section">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-700">Loading details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: UNLOCK OPERATIONAL VISIBILITY */}
              <Reveal className="space-y-3 text-center">
                <article>
                  <h2 className="text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
                    {data.visibility_title}
                  </h2>
                  {data.visibility_description && (
                    <p className="mx-auto mt-3 max-w-4xl text-justify text-base leading-relaxed text-gray-800 md:text-lg">
                      {data.visibility_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 2: INTEGRATION SERVICES & CARDS */}
              <div className="space-y-6">
                <Reveal className="space-y-2 text-center">
                  <article>
                    <h3 className="text-3xl font-bold tracking-tight text-gray-800 md:text-4xl">
                      {data.services_title}
                    </h3>
                    {data.services_description && (
                      <p className="mx-auto mt-2 max-w-4xl text-justify text-base leading-relaxed text-gray-800 md:text-lg">
                        {data.services_description}
                      </p>
                    )}
                  </article>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                  {data.cards && data.cards.length > 0
                    ? data.cards.map((card, idx) => (
                        <Reveal key={card.id || idx} delay={idx * STAGGER_MS} className="h-full">
                          <article className="flex h-full flex-col justify-center rounded-xl border border-slate-200 bg-gray-50 p-6 shadow-md transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl">
                            <h4 className="mb-3 text-center text-lg font-bold text-gray-800 md:text-xl">
                              {card.title}
                            </h4>
                            {card.description && (
                              <p className="text-justify text-base leading-relaxed text-gray-800 md:text-lg">
                                {card.description}
                              </p>
                            )}
                          </article>
                        </Reveal>
                      ))
                    : null}
                </div>
              </div>

              {/* SECTION 3: ESS-ME ADVANTAGE IN SCADA */}
              <Reveal className="space-y-3 pt-2">
                <article>
                  <h3 className="text-3xl font-bold tracking-tight text-gray-800 md:text-4xl">
                    {data.advantage_title}
                  </h3>
                  {data.advantage_description && (
                    <p className="mt-3 text-justify text-base leading-relaxed text-gray-800 md:text-lg">
                      {data.advantage_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 4: INDUSTRIAL APPLICATIONS */}
              <Reveal className="space-y-3 pt-2">
                <article>
                  <h3 className="text-3xl font-bold tracking-tight text-gray-800 md:text-4xl">
                    {data.applications_title}
                  </h3>
                </article>
                <ul className="mt-3 space-y-2 pl-2">
                  {data.applications_list &&
                    data.applications_list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-justify text-base text-gray-800 md:text-lg">
                        <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-blue-700" />
                        <span>{item}</span>
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

export default PanoramaDetailsSection;