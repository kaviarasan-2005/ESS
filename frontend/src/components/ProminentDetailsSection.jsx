import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchProminentMeteringDetails } from '../services/api';

const STAGGER_MS = 120;

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

const ProminentDetailsSection = () => {
  const [data, setData] = useState({
    header_title: 'Engineered Dosing Excellence with ProMinent Technology',
    header_description: '',
    range_title: 'Our ProMinent Product Range',
    range_description: '',
    categories: [],
    support_title: "ESS-ME's Total Dosing System Support",
    support_description: '',
    industries_title: 'Industries Served',
    industries_list: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchProminentMeteringDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load ProMinent details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.header_title || 'Engineered Dosing Excellence with ProMinent Technology';
  const metaTitle = `ProMinent Metering | ${displayTitle} | ESS-ME`;
  const rawDescription = `${data.header_description || ''} ${data.range_description || ''}`;
  const metaDescription =
    rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'ProMinent chemical dosing pumps, solenoid-driven metering pumps, motor-driven pumps, water treatment systems, and engineering support across Middle East industries by ESS-ME.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Product Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ProMinent Chemical Dosing Product Range & System Support',
    description: metaDescription,
    itemListElement: (data.categories || []).map((cat, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: cat.title,
        description: cat.description,
        brand: {
          '@type': 'Brand',
          name: 'ProMinent',
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
        aria-label="ProMinent Dosing Technology Details and Industrial Applications"
      >
        <div className="mx-auto max-w-6xl space-y-16">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading details section">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-700">Loading details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: ENGINEERED DOSING EXCELLENCE */}
              <Reveal className="space-y-4 text-center">
                <article>
                  <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                    {data.header_title}
                  </h2>
                  <div className="mx-auto my-4 h-1 w-24 rounded-full bg-black" />
                  {data.header_description && (
                    <p className="mx-auto max-w-4xl text-justify text-base leading-relaxed text-black md:text-lg md:leading-loose">
                      {data.header_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 2: PRODUCT RANGE & CATEGORIES */}
              <div className="space-y-8">
                <Reveal className="space-y-3 text-center">
                  <article>
                    <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                      {data.range_title}
                    </h3>
                    {data.range_description && (
                      <p className="mx-auto mt-3 max-w-4xl text-justify text-base leading-relaxed text-black md:text-lg">
                        {data.range_description}
                      </p>
                    )}
                  </article>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {data.categories &&
                    data.categories.map((cat, idx) => (
                      <Reveal key={cat.id || idx} delay={idx * STAGGER_MS} className="h-full">
                        <article className="h-full space-y-3 rounded-xl border border-slate-200 border-l-4 border-l-blue-600 bg-gray-50 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                          <h4 className="text-lg font-bold text-black md:text-xl">
                            {cat.title}
                          </h4>
                          <p className="text-justify text-base leading-relaxed text-black md:text-lg">
                            {cat.description}
                          </p>
                        </article>
                      </Reveal>
                    ))}
                </div>
              </div>

              {/* SECTION 3: TOTAL DOSING SYSTEM SUPPORT */}
              <Reveal>
                <article className="space-y-4 rounded-2xl border border-slate-200 bg-gray-50 p-8 shadow-md md:p-10">
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.support_title}
                  </h3>
                  {data.support_description && (
                    <p className="text-justify text-base leading-relaxed text-black md:text-lg md:leading-loose">
                      {data.support_description}
                    </p>
                  )}
                </article>
              </Reveal>

              {/* SECTION 4: INDUSTRIES SERVED */}
              <Reveal className="space-y-5">
                <article>
                  <h3 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    {data.industries_title}
                  </h3>
                </article>
                <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 pl-2 md:grid-cols-2">
                  {data.industries_list &&
                    data.industries_list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-justify text-base text-black md:text-lg">
                        <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-black" />
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

export default ProminentDetailsSection;