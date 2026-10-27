import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchEatonMedcDetails } from '../services/api';

const DEFAULT_DATA = {
  safety_title: 'Safety in Hazardous Environments',
  safety_description:
    "Eaton's Crouse-Hinds series is globally recognized for setting the standard in hazardous location technology. Their products are engineered with rugged integrity and are certified to international standards (ATEX, IECEx) for use in Zone 1, Zone 2, and Division 1 & 2 areas. This ensures complete reliability in the challenging and volatile environments prevalent across the GCC's energy and processing sectors.",
  range_title: 'Our Eaton (MEDC) Product Range',
  range_description:
    "We provide a comprehensive range of Eaton's engineered solutions, forming a complete ecosystem for safe electrical distribution and illumination in classified areas. Our experts help you select the correct equipment for your specific area classification and environmental conditions.",
  product_cards: [
    {
      title: 'Explosion-Proof Lighting & Lighting Systems',
      description:
        'Ensure safe visibility without compromising safety. Our range of Eaton explosion-proof lighting includes LED light fixtures, floodlights, and emergency luminaires designed to operate safely and efficiently in hazardous locations. These fixtures prevent internal arcs or sparks from igniting the surrounding atmosphere, providing reliable illumination for offshore platforms, refinery process areas, and chemical plant walkways.'
    },
    {
      title: 'Industrial Plugs, Sockets & Connectors',
      description:
        'Enable safe and versatile power and data connectivity. We supply Eaton industrial plugs and sockets that are designed to be mate-under-load and have interlocked switches for absolute safety. These durable, color-coded connectors prevent disconnection under load and are essential for portable equipment, machinery, and tools used in Zone 1 and 2 areas.'
    },
    {
      title: 'Junction Boxes, Enclosures & Control Stations',
      description:
        'Protect your electrical connections and control devices. Our Eaton explosion-proof junction boxes and control stations are constructed from robust materials like copper-free aluminum and stainless steel to withstand corrosion. They house electrical components safely, containing any potential internal ignition and protecting against environmental ingress with high IP ratings.'
    }
  ],
  advantage_title: 'The ESS-ME Advantage: Your Safety Compliance Partner',
  advantage_description:
    'We provide more than just products; we offer assurance. Our services include:',
  advantage_items: [
    {
      title: 'Area Classification Review',
      description: 'Assisting in selecting the right equipment for your specific hazardous zone.'
    },
    {
      title: 'Technical Support',
      description: 'Providing guidance on installation best practices to maintain certification integrity.'
    },
    {
      title: 'Local Inventory',
      description: 'Ensuring rapid availability of critical safety components to minimize project delays and maintenance downtime.'
    }
  ],
  industries_title: 'Industries Served',
  industry_items: [
    {
      title: 'Oil & Gas',
      description: 'Offshore platforms, onshore gas plants, refineries, and pipeline stations.'
    },
    {
      title: 'Chemical & Pharmaceutical',
      description: 'Chemical processing plants, solvent storage areas, and batch production facilities.'
    },
    {
      title: 'Water & Wastewater',
      description: 'Pump stations and treatment areas where flammable gases may be present.'
    },
    {
      title: 'Mining & Bulk Handling',
      description: 'Grain silos, coal handling plants, and other dust-laden environments.'
    }
  ]
};

// Shared style constants
const BLUE = '#0066B2';
const JUSTIFY_CLASS = 'text-justify';
const HEADING_CLASS = 'text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight';
const BODY_CLASS = `text-base md:text-lg text-black leading-relaxed font-normal ${JUSTIFY_CLASS}`;
const ACCENT_BAR_CLASS = 'block w-16 h-1 bg-[#0066B2] rounded-full mb-4';
const BLOCK_CLASS = 'max-w-4xl space-y-4';
const CARD_CLASS =
  'bg-white border border-slate-200 border-t-4 border-t-[#0066B2] rounded-xl p-6 md:p-8 shadow-md space-y-3 h-full transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0';
const LIST_ITEM_CLASS = `flex items-start text-base md:text-lg text-black leading-relaxed ${JUSTIFY_CLASS}`;
const BULLET_CLASS = 'inline-block w-2 h-2 bg-[#0066B2] mt-2.5 mr-3 shrink-0';

// Animation constants
const REVEAL_THRESHOLD = 0.15;
const CARD_STAGGER_MS = 150;
const COLUMN_STAGGER_MS = 200;
const REVEAL_BASE_CLASS = 'transition-all duration-700 ease-out motion-reduce:transition-none';
const REVEAL_HIDDEN_CLASS = 'opacity-0 translate-y-8 motion-reduce:opacity-100 motion-reduce:translate-y-0';
const REVEAL_VISIBLE_CLASS = 'opacity-100 translate-y-0';

// Fades and slides its children up once, when they scroll into view
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
      className={`${REVEAL_BASE_CLASS} ${visible ? REVEAL_VISIBLE_CLASS : REVEAL_HIDDEN_CLASS} ${className}`}
    >
      {children}
    </div>
  );
};

const EatonMedcDetailsSection = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchEatonMedcDetails()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.safety_title || payload.range_title) {
          setData({
            safety_title: payload.safety_title || DEFAULT_DATA.safety_title,
            safety_description: payload.safety_description || DEFAULT_DATA.safety_description,
            range_title: payload.range_title || DEFAULT_DATA.range_title,
            range_description: payload.range_description || DEFAULT_DATA.range_description,
            product_cards: payload.product_cards?.length ? payload.product_cards : DEFAULT_DATA.product_cards,
            advantage_title: payload.advantage_title || DEFAULT_DATA.advantage_title,
            advantage_description: payload.advantage_description || DEFAULT_DATA.advantage_description,
            advantage_items: payload.advantage_items?.length ? payload.advantage_items : DEFAULT_DATA.advantage_items,
            industries_title: payload.industries_title || DEFAULT_DATA.industries_title,
            industry_items: payload.industry_items?.length ? payload.industry_items : DEFAULT_DATA.industry_items
          });
        }
      })
      .catch((err) => console.error('Failed to load Eaton MEDC details:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic SEO Metadata
  const metaTitle = 'Eaton MEDC Explosion-Proof Systems & Hazardous Area Solutions';
  const rawDescription = data.safety_description || data.range_description || '';
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD ItemList & Product Schema for Search Engine Indexing
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Eaton MEDC Product Range & Safety Solutions",
    "description": metaDescription,
    "itemListElement": (data.product_cards || []).map((card, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Product",
        "name": card.title,
        "description": card.description,
        "brand": {
          "@type": "Brand",
          "name": "Eaton MEDC"
        }
      }
    }))
  };

  return (
    <>
      {/* Helmet SEO Meta Injection */}
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

      {/* Main Section Container - Fixed Height Shell Prevents CLS */}
      <section 
        className="w-full bg-gray-100 text-black py-16 md:py-24 px-6 md:px-16 overflow-hidden font-sans border-b border-slate-200 min-h-[600px]"
        aria-label="Eaton MEDC Product Details and Specifications"
      >
        <div className="max-w-6xl mx-auto space-y-16 md:space-y-20">

          {loading ? (
            <div className="w-full py-20 flex justify-center items-center" aria-label="Loading details">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: BLUE, borderTopColor: 'transparent' }}
              />
            </div>
          ) : (
            <>
              {/* 1. SAFETY IN HAZARDOUS ENVIRONMENTS */}
              <Reveal className={BLOCK_CLASS}>
                <span className={ACCENT_BAR_CLASS} />
                <h2 className={HEADING_CLASS}>{data.safety_title}</h2>
                <p className={BODY_CLASS}>{data.safety_description}</p>
              </Reveal>

              {/* 2. PRODUCT RANGE INTRO */}
              <Reveal className={BLOCK_CLASS}>
                <span className={ACCENT_BAR_CLASS} />
                <h2 className={HEADING_CLASS}>{data.range_title}</h2>
                <p className={BODY_CLASS}>{data.range_description}</p>
              </Reveal>

              {/* 3. PRODUCT CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {data.product_cards?.map((card, idx) => (
                  <Reveal key={idx} delay={idx * CARD_STAGGER_MS} className="h-full">
                    <article className={CARD_CLASS}>
                      <h3 className="text-lg md:text-xl font-bold text-[#0066B2] leading-snug">{card.title}</h3>
                      <p className={`text-base text-black leading-relaxed ${JUSTIFY_CLASS}`}>{card.description}</p>
                    </article>
                  </Reveal>
                ))}
              </div>

              {/* 4 & 5. ADVANTAGE + INDUSTRIES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">

                {/* THE ESS-ME ADVANTAGE */}
                <Reveal className="space-y-5 lg:pr-12 lg:border-r-2 lg:border-[#0066B2]">
                  <span className={ACCENT_BAR_CLASS} />
                  <h2 className={HEADING_CLASS}>{data.advantage_title}</h2>
                  {data.advantage_description && (
                    <p className={`text-base md:text-lg text-black font-medium ${JUSTIFY_CLASS}`}>
                      {data.advantage_description}
                    </p>
                  )}
                  <ul className="space-y-4 pt-1">
                    {data.advantage_items?.map((item, idx) => (
                      <li key={idx} className={LIST_ITEM_CLASS}>
                        <span className={BULLET_CLASS} />
                        <span>
                          <strong className="font-bold text-black">{item.title} : </strong>
                          <span className="text-black">{item.description}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* INDUSTRIES SERVED */}
                <Reveal delay={COLUMN_STAGGER_MS} className="space-y-5 lg:pl-12">
                  <span className={ACCENT_BAR_CLASS} />
                  <h2 className={HEADING_CLASS}>{data.industries_title}</h2>
                  <ul className="space-y-4 pt-1">
                    {data.industry_items?.map((item, idx) => (
                      <li key={idx} className={LIST_ITEM_CLASS}>
                        <span className={BULLET_CLASS} />
                        <span>
                          <strong className="font-bold text-black">{item.title} : </strong>
                          <span className="text-black">{item.description}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

              </div>
            </>
          )}

        </div>
      </section>
    </>
  );
};

export default EatonMedcDetailsSection;