import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHitachiDetails } from '../services/api';

// Repeated class names, kept in one place
const SECTION_HEADING_CLASS =
  'border-l-4 border-[#081b2c] pl-4 text-2xl font-extrabold tracking-tight text-black md:text-3xl lg:text-4xl';
const CARD_HEADING_CLASS = 'mb-3 text-center text-xl font-bold text-black md:text-2xl';
const BODY_TEXT_CLASS = 'text-justify text-sm leading-relaxed text-black md:text-base lg:text-lg';
const CARD_CLASS =
  'h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';

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

const HitachiDetailsSection = () => {
  const [data, setData] = useState({
    precision_title: 'Precision Engineering and Technological Innovation',
    precision_description:
      'Hitachi brings over a century of manufacturing excellence to its comprehensive product lineup. Renowned for exceptional durability and advanced R&D, Hitachi equipment is designed for continuous, high-load operation with extended service life. Their extensive know-how in simulation technology, lifecycle cost reduction, and performance optimization makes them the trusted choice for projects where failure is not an option.',
    product_range_title: 'Our Hitachi Product Range',
    product_range_description:
      "We supply Hitachi's extensive range of equipment, engineered to meet the specific demands of large-scale industrial and infrastructure projects. Our technical team provides expert support to select the ideal model for your pressure, flow, and application requirements.",
    compressors_card_title: 'Centrifugal & Process Gas Compressors',
    compressors_card_description:
      'Power the core of your process with unmatched reliability. Our Hitachi centrifugal compressors are the industry benchmark for large-volume air and process gas applications. These workhorses form the heart of petrochemical plants, natural gas processing facilities, and large air separation units, delivering efficient, stable, and continuous operation under the most demanding conditions.',
    pumps_card_title: 'High-Pressure & Large-Capacity Industrial Pumps',
    pumps_card_description:
      'Meet the rigorous demands of power and water infrastructure. We supply Hitachi industrial pumps engineered for critical duties, including high-temperature, high-pressure boiler feed pumps for thermal power stations, reactor coolant pumps, and large-capacity models for seawater intake, potable water supply, and sewage treatment. These pumps are built for longevity and extreme operating conditions.',
    lifecycle_title: 'Lifecycle Support for Major Assets',
    lifecycle_subtitle:
      'Partnering with us for Hitachi equipment means securing a long-term commitment. We provide:',
    lifecycle_items: [
      'Technical Consulting: Front-end engineering support for optimal equipment selection and integration.',
      'Project Management: Coordinating the supply of major equipment and auxiliary systems.',
      'Lifecycle Services: Access to genuine spare parts, technical documentation, and specialized maintenance support to protect your investment for decades.',
    ],
    sectors_title: 'Key Sectors',
    sector_items: [
      'Oil, Gas & Petrochemicals: LNG liquefaction, gas processing, refinery air compression.',
      'Power Generation: Boiler feed, cooling water, flue gas desulfurization (FGD) systems.',
      'Water & Infrastructure: Large-scale water supply, seawater desalination, drainage, and irrigation.',
      'Industrial Gases: Air separation units (ASU) and gas processing.',
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchHitachiDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Hitachi details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata
  const metaTitle = 'Hitachi Industrial Compressors & High-Pressure Pumps | Asset Support';
  const rawDescription = data.precision_description || data.product_range_description || '';
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Product / Service Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hitachi Industrial Equipment Range & Services',
    description: metaDescription,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: data.compressors_card_title,
          description: data.compressors_card_description,
          brand: { '@type': 'Brand', name: 'Hitachi' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Product',
          name: data.pumps_card_title,
          description: data.pumps_card_description,
          brand: { '@type': 'Brand', name: 'Hitachi' },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: data.lifecycle_title,
          description: data.lifecycle_subtitle,
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
        aria-label="Hitachi Product Range and Lifecycle Support Capabilities"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-black" aria-label="Loading details">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <span className="mt-3 text-base text-gray-600">Loading details...</span>
            </div>
          ) : (
            <>
              {/* 1. PRECISION ENGINEERING */}
              <Reveal className="space-y-4">
                <article>
                  <h2 className={SECTION_HEADING_CLASS}>{data.precision_title}</h2>
                  {data.precision_description && (
                    <p className={`${BODY_TEXT_CLASS} mt-4`}>{data.precision_description}</p>
                  )}
                </article>
              </Reveal>

              {/* 2. PRODUCT RANGE & CARDS */}
              <div className="space-y-6">
                <Reveal className="space-y-4">
                  <article>
                    <h2 className={SECTION_HEADING_CLASS}>{data.product_range_title}</h2>
                    {data.product_range_description && (
                      <p className={`${BODY_TEXT_CLASS} mt-4`}>{data.product_range_description}</p>
                    )}
                  </article>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                  {/* COMPRESSORS CARD */}
                  <Reveal delay={100} className="h-full">
                    <article className={CARD_CLASS}>
                      <h3 className={CARD_HEADING_CLASS}>{data.compressors_card_title}</h3>
                      <p className={BODY_TEXT_CLASS}>{data.compressors_card_description}</p>
                    </article>
                  </Reveal>

                  {/* PUMPS CARD */}
                  <Reveal delay={250} className="h-full">
                    <article className={CARD_CLASS}>
                      <h3 className={CARD_HEADING_CLASS}>{data.pumps_card_title}</h3>
                      <p className={BODY_TEXT_CLASS}>{data.pumps_card_description}</p>
                    </article>
                  </Reveal>
                </div>
              </div>

              {/* 3 & 4. LIFECYCLE SUPPORT + KEY SECTORS */}
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* LIFECYCLE SUPPORT */}
                <Reveal className="space-y-4">
                  <article>
                    <h2 className={SECTION_HEADING_CLASS}>{data.lifecycle_title}</h2>
                    {data.lifecycle_subtitle && (
                      <p className={`${BODY_TEXT_CLASS} mt-4`}>{data.lifecycle_subtitle}</p>
                    )}
                    <ul className={`mt-4 space-y-3 ${BODY_TEXT_CLASS}`}>
                      {data.lifecycle_items?.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1"
                        >
                          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#081b2c]"></span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>

                {/* KEY SECTORS */}
                <Reveal delay={150} className="space-y-4">
                  <article>
                    <h2 className={SECTION_HEADING_CLASS}>{data.sectors_title}</h2>
                    <ul className={`mt-4 space-y-3 ${BODY_TEXT_CLASS}`}>
                      {data.sector_items?.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1"
                        >
                          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#081b2c]"></span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HitachiDetailsSection;