import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHyosungDetails } from '../services/api';

// Repeated class names, kept in one place
const SECTION_HEADING_CLASS =
  'border-l-4 border-[#081b2c] pl-4 text-2xl font-extrabold tracking-tight text-black md:text-3xl lg:text-4xl';
const CARD_HEADING_CLASS = 'mb-3 text-center text-xl font-bold text-black md:text-2xl';
const BODY_TEXT_CLASS = 'text-sm leading-relaxed text-black md:text-base lg:text-lg';
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

const HyosungDetailsSection = () => {
  const [data, setData] = useState({
    performance_title: 'Proven Hydraulic Performance for Industrial Applications',
    performance_description:
      'Hyosung Goodsprings has built a global reputation by manufacturing pumps that set market trends for durability and energy efficiency. Their diverse product line is engineered to deliver consistent performance under high-load conditions, making them a preferred choice for engineers and contractors who prioritize long-term reliability and lower total cost of ownership in their projects.',
    portfolio_title: 'Our Hyosung Goodsprings Pump Portfolio',
    portfolio_description:
      'Our portfolio covers a wide spectrum of needs, from high-pressure industrial services to essential water supply and circulation. We help you navigate their extensive range to select the ideal pump for your specific duty, pressure, and application requirements.',
    card_one_title: 'Industrial Process & Plant Pumps',
    card_one_description:
      'Engineered for the toughest environments, our Hyosung industrial plant pumps are built for continuous operation in power plants, refineries, and general industrial facilities. These robust pumps handle high-temperature water, cooling media, and various process fluids, ensuring uninterrupted production and process stability.',
    card_two_title: 'Water Supply, Circulation & Pressure Boosting Systems',
    card_two_description:
      'Ensure consistent water flow for communities and facilities. We supply Hyosung pumps designed for potable water supply, sewage transfer, rainwater drainage, and irrigation. Additionally, our range includes multi-stage pressure booster systems essential for maintaining stable water pressure in high-rise buildings and large commercial complexes.',
    support_title: 'Application-Focused Support',
    support_description:
      'We provide more than just pumps. Our focus is on delivering a holistic solution. Our team offers expert application engineering to ensure perfect pump selection and integration. Combined with our local inventory and technical support, we guarantee a seamless experience from specification to operation.',
    uses_title: 'Common Uses',
    uses_items: [
      'Power Generation: Boiler feed, cooling water circulation, condensate transfer.',
      'Oil & Gas: Water injection, cooling loops, general service applications.',
      'Water & Wastewater: Raw water intake, sewage pumping, treatment plant circulation.',
      'Building Services: HVAC circulation, district cooling, fire fighting systems, potable water boosting.',
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchHyosungDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Hyosung details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const metaTitle = 'Hyosung Goodsprings Industrial Pumps & Pressure Boosting Systems | ESS-ME';
  const rawDescription = `${data.performance_title}. ${data.performance_description || data.portfolio_description || ''}`;
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data Schema (ItemList / Service / Product Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hyosung Goodsprings Pump Portfolio & Engineering Capabilities',
    description: metaDescription,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: data.card_one_title,
          description: data.card_one_description,
          brand: { '@type': 'Brand', name: 'Hyosung Goodsprings' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Product',
          name: data.card_two_title,
          description: data.card_two_description,
          brand: { '@type': 'Brand', name: 'Hyosung Goodsprings' },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: data.support_title,
          description: data.support_description,
          provider: {
            '@type': 'Organization',
            name: 'ESS-ME',
          },
        },
      },
    ],
  };

  return (
    <>
      {/* Helmet SEO Meta Tag Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph / Facebook Meta Tags */}
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
        aria-label="Hyosung Goodsprings Pump Portfolio and Engineering Support Capabilities"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-black" aria-label="Loading details">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <span className="mt-3 text-base text-gray-600">Loading details...</span>
            </div>
          ) : (
            <>
              {/* 1. PERFORMANCE OVERVIEW */}
              <Reveal className="space-y-4">
                <article>
                  <h2 className={SECTION_HEADING_CLASS}>{data.performance_title}</h2>
                  {data.performance_description && (
                    <p className={`${BODY_TEXT_CLASS} mt-4`}>{data.performance_description}</p>
                  )}
                </article>
              </Reveal>

              {/* 2. PORTFOLIO & CARDS */}
              <div className="space-y-6">
                <Reveal className="space-y-4">
                  <article>
                    <h2 className={SECTION_HEADING_CLASS}>{data.portfolio_title}</h2>
                    {data.portfolio_description && (
                      <p className={`${BODY_TEXT_CLASS} mt-4`}>{data.portfolio_description}</p>
                    )}
                  </article>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                  {/* CARD 1: PROCESS & PLANT PUMPS */}
                  <Reveal delay={100} className="h-full">
                    <article className={CARD_CLASS}>
                      <h3 className={CARD_HEADING_CLASS}>{data.card_one_title}</h3>
                      <p className={`${BODY_TEXT_CLASS} text-justify`}>{data.card_one_description}</p>
                    </article>
                  </Reveal>

                  {/* CARD 2: WATER SUPPLY & BOOSTING */}
                  <Reveal delay={250} className="h-full">
                    <article className={CARD_CLASS}>
                      <h3 className={CARD_HEADING_CLASS}>{data.card_two_title}</h3>
                      <p className={`${BODY_TEXT_CLASS} text-justify`}>{data.card_two_description}</p>
                    </article>
                  </Reveal>
                </div>
              </div>

              {/* 3 & 4. SUPPORT + COMMON USES */}
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* APPLICATION-FOCUSED SUPPORT */}
                <Reveal className="space-y-4">
                  <article>
                    <h2 className={SECTION_HEADING_CLASS}>{data.support_title}</h2>
                    {data.support_description && (
                      <p className={`${BODY_TEXT_CLASS} mt-4`}>{data.support_description}</p>
                    )}
                  </article>
                </Reveal>

                {/* COMMON USES */}
                <Reveal delay={150} className="space-y-4">
                  <article>
                    <h2 className={SECTION_HEADING_CLASS}>{data.uses_title}</h2>
                    <ul className={`mt-4 space-y-3 ${BODY_TEXT_CLASS}`}>
                      {data.uses_items?.map((item, idx) => (
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

export default HyosungDetailsSection;