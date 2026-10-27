import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHachDetails } from '../services/api';

// Repeated class names, kept in one place
const SECTION_HEADING_CLASS =
  'border-l-4 border-[#081b2c] pl-4 text-2xl font-extrabold tracking-tight text-black md:text-3xl lg:text-4xl';
const CARD_HEADING_CLASS = 'text-xl font-bold tracking-tight text-black md:text-2xl';
const BODY_TEXT_CLASS = 'text-sm leading-relaxed text-black md:text-base lg:text-lg';
const CARD_CLASS =
  'h-full space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';

// Fade-up animation when the block scrolls into view
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

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

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const HachDetailsSection = () => {
  const [data, setData] = useState({
    trusted_title: 'Trusted Water Analysis Expertise',
    trusted_description:
      "Hach's broad line of instrumentation, reagents, and chemistries have been carefully crafted to make water analysis better – faster, simpler, greener, and more informative. This ensures operational efficiency, regulatory compliance, and product quality.",
    product_range_title: 'Our HACH Product Range',
    online_analyzers_title: 'Online Water Quality Analyzers',
    online_analyzers_description:
      'For continuous monitoring of parameters like pH, conductivity, COD, BOD, TOC, and contaminants in effluent, boiler, and process water.',
    portable_meters_title: 'Portable Meters & Lab Equipment',
    portable_meters_description:
      'For precise field and laboratory testing, including spectrophotometers, turbidity meters, and a full range of test kits and reagents.',
    support_capabilities_title: 'Our HACH Support Capabilities',
    support_capabilities_description:
      'Our qualified service personnel provide expert support, from selecting the right instrument and method to installation, training, and preventative maintenance, ensuring your investment is protected.',
    applications_title: 'Critical Applications',
    application_items: [
      'Wastewater Treatment Plants',
      'Potable Water Monitoring',
      'Petrochemical and Chemical Processing',
      'Power Generation (boiler/feed water)',
      'Environmental Monitoring.',
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchHachDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load HACH details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata
  const metaTitle = 'HACH Water Quality Testing & Online Analyzers | Product Range';
  const rawDescription = data.trusted_description || data.support_capabilities_description || '';
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HACH Water Quality Analysis Solutions',
    description: metaDescription,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: data.online_analyzers_title,
          description: data.online_analyzers_description,
          brand: { '@type': 'Brand', name: 'HACH' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Product',
          name: data.portable_meters_title,
          description: data.portable_meters_description,
          brand: { '@type': 'Brand', name: 'HACH' },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: data.support_capabilities_title,
          description: data.support_capabilities_description,
          provider: { '@type': 'Organization', name: 'ESS-ME' },
        },
      },
    ],
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

      {/* Main Details Section Container - Fixed Shell Prevents CLS */}
      <section
        className="relative min-h-[600px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-24 lg:py-20"
        aria-label="HACH Product Range and Technical Support Capabilities"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-black" aria-label="Loading details">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <span className="mt-3 text-base text-gray-600">Loading details...</span>
            </div>
          ) : (
            <>
              {/* 1. TRUSTED WATER ANALYSIS EXPERTISE */}
              <Reveal className="space-y-4">
                <article>
                  <h2 className={SECTION_HEADING_CLASS}>{data.trusted_title}</h2>
                  {data.trusted_description && (
                    <p className={`${BODY_TEXT_CLASS} mt-4 max-w-4xl`}>{data.trusted_description}</p>
                  )}
                </article>
              </Reveal>

              {/* 2. PRODUCT RANGE & SUBSECTIONS */}
              <div className="space-y-6">
                <Reveal>
                  <h2 className={SECTION_HEADING_CLASS}>{data.product_range_title}</h2>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* ONLINE ANALYZERS */}
                  <Reveal delay={100}>
                    <article className={CARD_CLASS}>
                      <h3 className={CARD_HEADING_CLASS}>{data.online_analyzers_title}</h3>
                      {data.online_analyzers_description && (
                        <p className={BODY_TEXT_CLASS}>{data.online_analyzers_description}</p>
                      )}
                    </article>
                  </Reveal>

                  {/* PORTABLE METERS */}
                  <Reveal delay={250}>
                    <article className={CARD_CLASS}>
                      <h3 className={CARD_HEADING_CLASS}>{data.portable_meters_title}</h3>
                      {data.portable_meters_description && (
                        <p className={BODY_TEXT_CLASS}>{data.portable_meters_description}</p>
                      )}
                    </article>
                  </Reveal>
                </div>
              </div>

              {/* 3 & 4. SUPPORT CAPABILITIES + CRITICAL APPLICATIONS */}
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* SUPPORT CAPABILITIES */}
                <Reveal className="space-y-4">
                  <article>
                    <h2 className={SECTION_HEADING_CLASS}>{data.support_capabilities_title}</h2>
                    {data.support_capabilities_description && (
                      <p className={`${BODY_TEXT_CLASS} mt-4`}>{data.support_capabilities_description}</p>
                    )}
                  </article>
                </Reveal>

                {/* CRITICAL APPLICATIONS LIST */}
                <Reveal delay={150} className="space-y-4">
                  <div>
                    <h2 className={SECTION_HEADING_CLASS}>{data.applications_title}</h2>
                    <ul className={`mt-4 space-y-3 ${BODY_TEXT_CLASS}`}>
                      {data.application_items?.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1"
                        >
                          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#081b2c]"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HachDetailsSection;