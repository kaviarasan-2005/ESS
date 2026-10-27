import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchAVEVADetails } from '../services/api';

const REVEAL_THRESHOLD = 0.1;
const REVEAL_ROOT_MARGIN = '0px 0px -40px 0px';
const STAGGER_MS = 100;

const DEFAULT_DETAILS = {
  features: [
    {
      id: 'feat-1',
      title: "AVEVA's Unified Architecture for Operational Excellence",
      description:
        'AVEVA provides an unparalleled industrial software ecosystem, from the plant-floor HMI to the boardroom dashboard. Our expertise in the AVEVA System Platform allows us to build truly object-oriented, enterprise-wide SCADA systems that ensure consistency, reduce engineering time, and simplify maintenance. For smaller or distributed applications, we implement the robust and flexible AVEVA Edge SCADA, ensuring the right solution for every scale and budget, all within the AVEVA family.'
    },
    {
      id: 'feat-2',
      title: 'Our AVEVA Integration & Development Services',
      description:
        'We deliver the full spectrum of AVEVA services, from strategic system design and custom development to long-term support and expansion. Our methodology ensures your AVEVA deployment is a strategic investment that enhances operational intelligence, improves asset reliability, and scales with your business growth.'
    },
    {
      id: 'feat-3',
      title: 'Enterprise SCADA & HMI Development with System Platform',
      description:
        'We design and deploy high-performance SCADA systems using AVEVA System Platform, the industry benchmark for large-scale, mission-critical applications. Our services include developing standardized object-based graphics and templates, configuring complex alarm management, and implementing global deployment strategies. This creates a unified operational environment across multiple sites, ensuring best practices are enforced and operational knowledge is centralized.'
    },
    {
      id: 'feat-4',
      title: 'AVEVA Historian & Industrial Data Management',
      description:
        'Transform raw data into actionable intelligence. We implement AVEVA Historian (formerly Wonderware Historian) to capture, store, and distribute high-fidelity time-series data from across your operation. Coupled with AVEVA\'s analytical tools, this provides the foundation for performance monitoring, asset optimization, and advanced analytics, enabling you to identify inefficiencies, predict maintenance needs, and improve overall equipment effectiveness (OEE).'
    },
    {
      id: 'feat-5',
      title: 'System Modernization & IIoT Integration',
      description:
        'Future-proof your operations by modernizing legacy systems or extending their capabilities. We specialize in migrating older SCADA platforms to the modern AVEVA ecosystem. Furthermore, we integrate AVEVA systems with IIoT platforms and cloud services, enabling new levels of connectivity, remote monitoring, and advanced analytics that drive your digital transformation journey forward.'
    },
    {
      id: 'feat-6',
      title: 'ESS-ME Advantage in AVEVA Solutions',
      description:
        'Our partnership with AVEVA is backed by our deep domain knowledge of Middle Eastern industries. We provide localized 24/7 support, cybersecurity services tailored for industrial control systems (ICS), and comprehensive operator training. We ensure your AVEVA system is not only implemented correctly but also delivers maximum value and a strong return on investment throughout its entire lifecycle.'
    }
  ],
  applications_title: 'Key Applications',
  key_applications: [
    {
      id: 'app-1',
      industry: 'Oil & Gas',
      details: 'Plant-wide DCS & SCADA integration, pipeline SCADA, offshore platform control.'
    },
    {
      id: 'app-2',
      industry: 'Water & Wastewater',
      details: 'Centralized SCADA for distribution networks and treatment plants.'
    },
    {
      id: 'app-3',
      industry: 'Power Generation',
      details: 'Plant performance monitoring, electrical grid SCADA, renewable energy integration.'
    },
    {
      id: 'app-4',
      industry: 'Manufacturing & Logistics',
      details: 'Plant-wide MES & SCADA integration, OEE tracking, warehouse automation.'
    }
  ]
};

// Fades and slides its children up once when scrolled into view
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

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
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const AvevaSolutionsDetailsSection = () => {
  const [data, setData] = useState(DEFAULT_DETAILS);

  useEffect(() => {
    let isMounted = true;

    fetchAVEVADetails()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload && (payload.features || payload.key_applications)) {
          setData({
            features: payload.features || DEFAULT_DETAILS.features,
            applications_title: payload.applications_title || DEFAULT_DETAILS.applications_title,
            key_applications: payload.key_applications || DEFAULT_DETAILS.key_applications
          });
        }
      })
      .catch((err) => console.error('API Error, using fallback details:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // SEO Dynamic Meta Values
  const metaTitle = 'AVEVA System Platform Integration & SCADA Development Solutions';
  const rawDesc = data.features?.[0]?.description || '';
  const metaDescription = rawDesc.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD ItemList & Service Schema for Search Engine Crawlers
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AVEVA Integration & Development Services",
    "description": metaDescription,
    "itemListElement": (data.features || []).map((feature, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Service",
        "name": feature.title,
        "description": feature.description,
        "provider": {
          "@type": "Organization",
          "name": "ESS-ME"
        }
      }
    }))
  };

  return (
    <>
      {/* Helmet Meta & SEO Injections */}
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

        {/* JSON-LD Structured Data Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Section Container */}
      <section 
        className="w-full bg-white text-black py-16 md:py-24 font-sans border-b border-gray-200 overflow-hidden min-h-[500px]"
        aria-label="AVEVA System Platform Features and Key Applications"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-12">

          {/* FEATURES LIST */}
          <div className="space-y-10">
            {(data.features || []).map((feature, idx) => (
              <Reveal key={feature.id || idx} className="space-y-2">
                <article>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black tracking-tight leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-black text-xs sm:text-sm md:text-base leading-relaxed text-justify">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* KEY APPLICATIONS SECTION */}
          {data.key_applications && data.key_applications.length > 0 && (
            <div className="pt-8 border-t border-gray-200 space-y-6">
              <Reveal>
                <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                  {data.applications_title || 'Key Applications'}
                </h3>
              </Reveal>

              <ul className="space-y-3 pl-2">
                {data.key_applications.map((app, idx) => (
                  <li key={app.id || idx}>
                    <Reveal
                      delay={idx * STAGGER_MS}
                      className="flex items-start space-x-3 text-xs sm:text-sm md:text-base text-black leading-relaxed"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <div className="text-justify">
                        <strong className="text-black font-bold mr-1">{app.industry}:</strong>
                        <span>{app.details}</span>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default AvevaSolutionsDetailsSection;