import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchEmersonDetails } from '../services/api';

const REVEAL_THRESHOLD = 0.15;
const REVEAL_STAGGER_MS = 120;

// Fades and slides its children up the first time they scroll into view
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
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

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const EmersonDetailsSection = () => {
  const [data, setData] = useState({
    trusted_title: 'Trusted Emerson Automation in Qatar',
    trusted_subtitle:
      'Emerson is a global leader in process automation and asset management, known for its robust DeltaV DCS and PLC systems.',
    trusted_description:
      "Our certified partnership signifies a deep, proven capability to implement these technologies effectively. Our team of engineers possesses direct experience with Emerson's full portfolio, enabling us to deliver integrated solutions that solve complex control challenges, enhance plant visibility, and ensure long-term operational success for our clients in the GCC's core sectors.",
    capabilities_title: 'Our Emerson Service Capabilities',
    capabilities_description:
      'We provide end-to-end services that cover the entire automation lifecycle. From initial concept and system design to ongoing support and modernization, our Emerson-certified expertise ensures your investment delivers maximum value, scalability, and reliability for years to come.',
    deltav_title: 'DeltaV Distributed Control System (DCS) Integration',
    deltav_description:
      'As experts in the DeltaV DCS, we design and implement complete control strategies for continuous and batch processes. Our services include system architecture design, controller and I/O configuration, advanced control strategy implementation, and seamless integration with third-party PLCs and safety systems. We ensure your DeltaV system becomes the central nervous system of your plant, providing intuitive operation and powerful data analytics.',
    plc_scada_title: 'PLC & SCADA System Implementation',
    plc_scada_description:
      "For discrete and hybrid control applications, we engineer high-performance solutions using Emerson's PACSystems and RX3i PLCs. We develop robust control logic and integrate them with powerful SCADA platforms like Emerson's Movicon, creating centralized visualization and monitoring solutions that provide operators with real-time insight and control over geographically dispersed assets.",
    sis_title: 'Safety Instrumented System (SIS) Design',
    sis_description:
      "Protect your people and assets with certified safety solutions. We design and engineer Safety Instrumented Systems (SIS) using Emerson's DeltaV SIS with CHARMs technology or dedicated Guardian safety controllers. Our engineers perform SIL verification and validation to ensure these critical systems meet IEC 61511 standards, providing you with a complete safety lifecycle management solution.",
    implementation_title: 'Integrated Emerson Technology: Implementation & Beyond',
    implementation_description:
      'Our partnership with Emerson allows us to offer more than just integration. We provide strategic consulting for digital transformation, system migration services from legacy platforms, and 24/7 support contracts that include proactive system health monitoring and specialist troubleshooting to minimize your operational risk.',
    industries_title: 'Industries we Serve',
    industry_items: [
      {
        name: 'Oil & Gas',
        description: 'Upstream production platforms, midstream pipelines, and refinery process control.',
      },
      {
        name: 'Power Generation',
        description: 'Plant-wide DCS for conventional and renewable power facilities.',
      },
      {
        name: 'Water & Wastewater',
        description: 'Plant automation and SCADA for pumping stations and treatment plants.',
      },
      {
        name: 'Chemical & Petrochemical',
        description: 'Complex batch and continuous process control.',
      },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailsData();
  }, []);

  const loadDetailsData = async () => {
    try {
      setLoading(true);
      const res = await fetchEmersonDetails();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Emerson details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const metaTitle = `${data.trusted_title} | Certified Integration Services`;
  const rawDesc = `${data.trusted_subtitle} ${data.capabilities_description}`;
  const metaDescription = rawDesc.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // Structured Data (JSON-LD) for Search Crawlers
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.trusted_title,
    description: metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'ESS-ME',
    },
    brand: {
      '@type': 'Brand',
      name: 'Emerson Automation Solutions',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: data.capabilities_title,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: data.deltav_title,
            description: data.deltav_description,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: data.plc_scada_title,
            description: data.plc_scada_description,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: data.sis_title,
            description: data.sis_description,
          },
        },
      ],
    },
  };

  return (
    <>
      {/* Helmet SEO Meta Tag Injections */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph / Social Media Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Section Shell with min-height layout to prevent Cumulative Layout Shift (CLS) */}
      <section
        lang="en"
        className="relative min-h-[600px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-24 lg:py-20"
        aria-label="Emerson Service Capabilities and Industry Solutions"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-black">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <span className="mt-3 text-base text-gray-600">Loading details...</span>
            </div>
          ) : (
            <>
              {/* 1. TRUSTED EMERSON AUTOMATION */}
              <Reveal className="space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                  {data.trusted_title}
                </h2>
                <div className="h-1 w-20 rounded-full bg-[#081b2c]"></div>
                {data.trusted_subtitle && (
                  <p className="text-justify text-base font-semibold text-black md:text-lg lg:text-xl">
                    {data.trusted_subtitle}
                  </p>
                )}
                {data.trusted_description && (
                  <p className="text-justify text-base leading-relaxed text-gray-900 md:text-lg">
                    {data.trusted_description}
                  </p>
                )}
              </Reveal>

              {/* 2. OUR SERVICE CAPABILITIES */}
              <Reveal className="space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                  {data.capabilities_title}
                </h2>
                <div className="h-1 w-20 rounded-full bg-[#081b2c]"></div>
                {data.capabilities_description && (
                  <p className="text-justify text-base leading-relaxed text-gray-900 md:text-lg">
                    {data.capabilities_description}
                  </p>
                )}
              </Reveal>

              {/* 3. DELTAV DCS INTEGRATION */}
              <Reveal className="space-y-4 border-l-4 border-[#081b2c] pl-5">
                <h3 className="text-2xl font-extrabold tracking-tight text-black md:text-3xl lg:text-4xl">
                  {data.deltav_title}
                </h3>
                {data.deltav_description && (
                  <p className="text-justify text-base leading-relaxed text-gray-900 md:text-lg">
                    {data.deltav_description}
                  </p>
                )}
              </Reveal>

              {/* 4. PLC & SCADA SYSTEM */}
              <Reveal className="space-y-4 border-l-4 border-[#081b2c] pl-5">
                <h3 className="text-2xl font-extrabold tracking-tight text-black md:text-3xl lg:text-4xl">
                  {data.plc_scada_title}
                </h3>
                {data.plc_scada_description && (
                  <p className="text-justify text-base leading-relaxed text-gray-900 md:text-lg">
                    {data.plc_scada_description}
                  </p>
                )}
              </Reveal>

              {/* 5. SAFETY INSTRUMENTED SYSTEM (SIS) */}
              <Reveal className="space-y-4 border-l-4 border-[#081b2c] pl-5">
                <h3 className="text-2xl font-extrabold tracking-tight text-black md:text-3xl lg:text-4xl">
                  {data.sis_title}
                </h3>
                {data.sis_description && (
                  <p className="text-justify text-base leading-relaxed text-gray-900 md:text-lg">
                    {data.sis_description}
                  </p>
                )}
              </Reveal>

              {/* 6. IMPLEMENTATION & BEYOND */}
              <Reveal className="space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                  {data.implementation_title}
                </h2>
                <div className="h-1 w-20 rounded-full bg-[#081b2c]"></div>
                {data.implementation_description && (
                  <p className="text-justify text-base leading-relaxed text-gray-900 md:text-lg">
                    {data.implementation_description}
                  </p>
                )}
              </Reveal>

              {/* 7. INDUSTRIES WE SERVE */}
              <div className="space-y-5 pt-4">
                <Reveal>
                  <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
                    {data.industries_title}
                  </h2>
                  <div className="mt-4 h-1 w-20 rounded-full bg-[#081b2c]"></div>
                </Reveal>
                <ul className="space-y-3 text-base leading-relaxed text-gray-900 md:text-lg">
                  {data.industry_items?.map((item, idx) => (
                    <Reveal key={idx} delay={idx * REVEAL_STAGGER_MS}>
                      <li className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <span className="select-none font-bold text-black">•</span>
                        <span>
                          <strong className="font-bold text-black">{item.name}: </strong>
                          {item.description}
                        </span>
                      </li>
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

export default EmersonDetailsSection;