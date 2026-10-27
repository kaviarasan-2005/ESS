import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchRASilverDetails } from '../services/api';

// Scroll-reveal animation settings
const REVEAL_DURATION_MS = 700;
const REVEAL_STEP_MS = 120;
const REVEAL_THRESHOLD = 0.15;

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
      { threshold: REVEAL_THRESHOLD }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={{
        transitionDuration: `${REVEAL_DURATION_MS}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const RASilverDetailsSection = () => {
  const [data, setData] = useState({
    expertise_title: 'Certified Rockwell Automation Expertise',
    expertise_description: '',
    services_title: 'Our Rockwell Automation Services',
    services_description: '',
    features: [],
    difference_title: 'The ESS-ME Difference',
    difference_description: '',
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
      const res = await fetchRASilverDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load RA Silver details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.expertise_title || 'Certified Rockwell Automation Expertise';
  const metaTitle = `Rockwell Automation | ${displayTitle} | ESS-ME`;
  const rawDescription = `${data.expertise_description || ''} ${data.services_description || ''}`;
  const metaDescription =
    rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'Certified Rockwell Automation Silver System Integrator services: ControlLogix, PlantPAx DCS, FactoryTalk SCADA, and Allen-Bradley PLC programming solutions across Middle East industries.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Rockwell Automation Silver System Integration Services & Engineering Expertise',
    description: metaDescription,
    itemListElement: (data.features || []).map((feat, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: feat.title,
        description: feat.description,
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

      {/* Main Details Section Container - Min-height shell prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[600px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 md:py-20 lg:px-20"
        aria-label="Rockwell Automation Silver System Integration Capabilities and Technical Expertise"
      >
        <div className="mx-auto max-w-5xl space-y-12">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading details section">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">Loading details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: CERTIFIED EXPERTISE */}
              <Reveal className="space-y-4">
                <article>
                  <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                    {data.expertise_title}
                  </h2>
                  {data.expertise_description && (
                    <div className="mt-4 space-y-3 whitespace-pre-line text-justify text-sm leading-relaxed text-gray-800 md:text-base md:leading-loose lg:text-lg lg:leading-loose">
                      <p>{data.expertise_description}</p>
                    </div>
                  )}
                </article>
              </Reveal>

              {/* SECTION 2: SERVICES & FEATURE BLOCKS */}
              <div className="space-y-8">
                <Reveal className="space-y-3">
                  <article>
                    <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                      {data.services_title}
                    </h3>
                    {data.services_description && (
                      <p className="mt-3 text-justify text-sm leading-relaxed text-gray-800 md:text-base md:leading-loose lg:text-lg lg:leading-loose">
                        {data.services_description}
                      </p>
                    )}
                  </article>
                </Reveal>

                <div className="space-y-8">
                  {data.features &&
                    data.features.map((feat, idx) => (
                      <Reveal
                        key={feat.id || idx}
                        delay={idx * REVEAL_STEP_MS}
                        className="space-y-2 border-l-4 border-sky-500 pl-5"
                      >
                        <article>
                          <h4 className="text-lg font-bold text-black md:text-xl lg:text-2xl">
                            {feat.title}
                          </h4>
                          <p className="mt-2 whitespace-pre-line text-justify text-sm leading-relaxed text-gray-800 md:text-base lg:text-lg">
                            {feat.description}
                          </p>
                        </article>
                      </Reveal>
                    ))}
                </div>
              </div>

              {/* SECTION 3: THE ESS-ME DIFFERENCE */}
              <Reveal className="space-y-4 pt-2">
                <article>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.difference_title}
                  </h3>
                  {data.difference_description && (
                    <p className="mt-3 text-justify text-sm leading-relaxed text-gray-800 md:text-base md:leading-loose lg:text-lg lg:leading-loose">
                      {data.difference_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 4: INDUSTRIES WE SERVE */}
              <Reveal className="space-y-4 pt-2">
                <article>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.industries_title}
                  </h3>
                </article>
                <ul className="mt-4 space-y-3 pl-2">
                  {data.industries_list &&
                    data.industries_list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-800 md:text-base lg:text-lg">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
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

export default RASilverDetailsSection;