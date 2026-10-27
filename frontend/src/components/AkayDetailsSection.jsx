import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchAKAYDetails } from '../services/api';

const SECTION_STYLE = 'bg-gray-100 text-black py-16 px-4 sm:px-6 lg:px-12 font-sans min-h-[600px]';
const ROW_STYLE = 'grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 py-10 border-t border-gray-200';
const HEADING_STYLE = 'text-2xl sm:text-3xl font-extrabold tracking-tight text-black lg:sticky lg:top-24 self-start';
const BODY_TEXT_STYLE = 'text-black text-sm sm:text-base leading-relaxed text-justify';
const CARD_STYLE = 'bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow';
const LIST_ROW_STYLE = 'grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-6 py-4 border-b border-gray-200 last:border-b-0';

const DEFAULT_DETAILS = {
  environment_title: 'Reliable in Harsh Process Environments',
  environment_description:
    'AKAY Industries brings a passion for manufacturing high-quality centrifugal pumps that meet rigorous international standards. Their pumps are renowned for superior hydraulics, robust mechanical seals, and construction from a wide range of corrosion-resistant materials. This focus on quality and durability ensures maximum uptime, reduced lifecycle costs, and dependable performance in demanding climates across the GCC region.',
  portfolio_title: 'Our AKAY Pumps Portfolio',
  portfolio_description:
    "We offer a comprehensive range of AKAY pumps, each designed to excel in specific fluid handling duties. Our technical team provides expert selection support to match the pump's material of construction, seal technology, and hydraulic performance to your exact process requirements, ensuring optimal efficiency and service life.",
  cards: [
    {
      id: 'card-1',
      title: 'Chemical and Process Pumps',
      description:
        'AKAY pumps allow you to handle corrosive and abrasive fluids with absolute confidence. Our AKAY chemical process pumps are available in a variety of metallurgies, including stainless steel (SS304/SS316), Hastelloy, and titanium, as well as non-metallic options.\n\nThey are engineered for continuous duty in transferring acids, solvents, caustics, and hydrocarbons, providing a leak-free and reliable solution for your most aggressive applications.',
    },
    {
      id: 'card-2',
      title: 'Cryogenic Pumps',
      description:
        "Maintain efficiency and safety in extreme cold conditions. AKAY's cryogenic pumps are specifically designed for handling liquefied gases like LNG, liquid nitrogen, and liquid oxygen at temperatures as low as -196°C.\n\nThese pumps ensure safe, vapor-free transfer critical for gas processing, storage, and transportation infrastructure, preserving product integrity and preventing energy loss.",
    },
  ],
  advantage_title: 'The ESS-ME Advantage: Your Fluid Handling Partner',
  advantage_description:
    'We go beyond supply to ensure your pumping success. Our services include:',
  advantage_bullets: [
    {
      id: 'b-1',
      label: 'Technical Selection',
      detail:
        'Guiding you to the perfect pump model and seal for your fluid and duty point.',
    },
    {
      id: 'b-2',
      label: 'Local Spare Parts Support',
      detail:
        'Ensuring rapid availability of critical components to minimize downtime.',
    },
    {
      id: 'b-3',
      label: 'After-Sales Service',
      detail:
        'Providing installation support, maintenance, and troubleshooting to protect your investment.',
    },
  ],
  industries_title: 'Industries & Applications',
  industries_bullets: [
    {
      id: 'i-1',
      label: 'Chemical & Petrochemical',
      detail: 'Acid transfer, solvent circulation, reactor feed.',
    },
    {
      id: 'i-2',
      label: 'Oil & Gas',
      detail: 'Produced water, glycol circulation, amine service.',
    },
    {
      id: 'i-3',
      label: 'Industrial Gases',
      detail: 'LNG transfer, liquid nitrogen pumping.',
    },
    {
      id: 'i-4',
      label: 'General Industry',
      detail: 'Cooling water circulation, boiler feed, filtration systems.',
    },
  ],
};

const AkayDetailsSection = () => {
  const [data, setData] = useState(DEFAULT_DETAILS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchAKAYDetails()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data || res || {};
        if (payload && (payload.environment_title || payload.cards)) {
          setData({
            environment_title:
              payload.environment_title ?? DEFAULT_DETAILS.environment_title,
            environment_description:
              payload.environment_description ??
              DEFAULT_DETAILS.environment_description,
            portfolio_title:
              payload.portfolio_title ?? DEFAULT_DETAILS.portfolio_title,
            portfolio_description:
              payload.portfolio_description ??
              DEFAULT_DETAILS.portfolio_description,
            cards:
              Array.isArray(payload.cards) && payload.cards.length > 0
                ? payload.cards
                : DEFAULT_DETAILS.cards,
            advantage_title:
              payload.advantage_title ?? DEFAULT_DETAILS.advantage_title,
            advantage_description:
              payload.advantage_description ??
              DEFAULT_DETAILS.advantage_description,
            advantage_bullets: Array.isArray(payload.advantage_bullets)
              ? payload.advantage_bullets
              : DEFAULT_DETAILS.advantage_bullets,
            industries_title:
              payload.industries_title ?? DEFAULT_DETAILS.industries_title,
            industries_bullets: Array.isArray(payload.industries_bullets)
              ? payload.industries_bullets
              : DEFAULT_DETAILS.industries_bullets,
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching AKAY details:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // SEO Dynamic Meta Setup
  const metaTitle = data?.portfolio_title
    ? `${data.portfolio_title} | Chemical & Cryogenic Centrifugal Pumps`
    : 'AKAY Centrifugal Pumps Portfolio & Technical Specifications';

  const rawDescription = data?.environment_description || data?.portfolio_description || '';
  const metaDescription = rawDescription
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Product & Service Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": data.portfolio_title || "AKAY Pumps Portfolio",
    "description": metaDescription,
    "itemListElement": data.cards?.map((card, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Product",
        "name": card.title,
        "description": card.description?.replace(/\n/g, ' '),
        "brand": {
          "@type": "Brand",
          "name": "AKAY Industries"
        }
      }
    })) || []
  };

  return (
    <>
      {/* Dynamic SEO Head Elements */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Section Container */}
      <section className={SECTION_STYLE} aria-label="AKAY Pumps Portfolio and Industry Details">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20" aria-label="Loading AKAY details">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* 1. RELIABLE IN HARSH PROCESS ENVIRONMENTS */}
              {data.environment_title && (
                <div className={`${ROW_STYLE} border-t-0 pt-0`}>
                  <h2 className={HEADING_STYLE}>{data.environment_title}</h2>
                  <div className="lg:col-span-2">
                    {data.environment_description && (
                      <p className={BODY_TEXT_STYLE}>{data.environment_description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 2. OUR AKAY PUMPS PORTFOLIO */}
              {data.portfolio_title && (
                <div className={ROW_STYLE}>
                  <h2 className={HEADING_STYLE}>{data.portfolio_title}</h2>
                  <div className="lg:col-span-2 space-y-6">
                    {data.portfolio_description && (
                      <p className={BODY_TEXT_STYLE}>{data.portfolio_description}</p>
                    )}

                    {/* PUMP CARDS GRID */}
                    {Array.isArray(data.cards) && data.cards.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.cards.map((card, idx) => (
                          <article key={card.id || idx} className={CARD_STYLE}>
                            <h3 className="text-lg font-bold text-black">{card.title}</h3>
                            {card.description && (
                              <div className="text-black text-sm leading-relaxed whitespace-pre-line text-justify">
                                {card.description}
                              </div>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. THE ESS-ME ADVANTAGE */}
              {data.advantage_title && (
                <div className={ROW_STYLE}>
                  <h2 className={HEADING_STYLE}>{data.advantage_title}</h2>
                  <div className="lg:col-span-2">
                    {data.advantage_description && (
                      <p className={`${BODY_TEXT_STYLE} font-medium mb-2`}>
                        {data.advantage_description}
                      </p>
                    )}

                    {Array.isArray(data.advantage_bullets) &&
                      data.advantage_bullets.length > 0 && (
                        <div>
                          {data.advantage_bullets.map((item, idx) => (
                            <div key={item.id || idx} className={LIST_ROW_STYLE}>
                              <strong className="text-black font-bold text-sm sm:text-base">
                                {item.label}
                              </strong>
                              <span className="sm:col-span-2 text-black text-sm sm:text-base leading-relaxed text-justify">
                                {item.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* 4. INDUSTRIES & APPLICATIONS */}
              {data.industries_title && (
                <div className={ROW_STYLE}>
                  <h2 className={HEADING_STYLE}>{data.industries_title}</h2>
                  <div className="lg:col-span-2">
                    {Array.isArray(data.industries_bullets) &&
                      data.industries_bullets.length > 0 && (
                        <div>
                          {data.industries_bullets.map((item, idx) => (
                            <div key={item.id || idx} className={LIST_ROW_STYLE}>
                              <strong className="text-black font-bold text-sm sm:text-base">
                                {item.label}
                              </strong>
                              <span className="sm:col-span-2 text-black text-sm sm:text-base leading-relaxed text-justify">
                                {item.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AkayDetailsSection;