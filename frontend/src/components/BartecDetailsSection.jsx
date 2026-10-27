import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchBartecDetails } from '../services/api';

const DEFAULT_DATA = {
  trusted_title: 'Trusted Bartec Solutions for Maximum Uptime & Data Integrity',
  trusted_description:
    'Bartec is a global leader in explosion protection and analytical systems, setting the benchmark for safety and reliability. Our partnership ensures you receive IEC 61285 / DIN EN 61285 compliant shelters engineered with superior German technology. BARTEC’s solutions ensure your production processes run faster and more cost-effectively by providing a controlled, safe environment that eliminates false readings, reduces maintenance frequency, and maximizes the uptime of your critical process analyzers.',
  solutions_title: 'Our Bartec Product & Service Solutions',
  solutions_description:
    'Our collaboration with Bartec enables us to offer a fully integrated approach to analyzer protection and sample integrity. We provide both the engineered enclosure and the vital sample conditioning components as a unified system, ensuring every element is designed to work together flawlessly for maximum reliability and data accuracy in your specific application.',
  shelters_title: 'Analyzer Shelters & Houses',
  shelters_description:
    'We design and fabricate analyzer shelters tailored to your specific analyzer list and site conditions. Constructed from robust materials like GRP, stainless steel, or aluminum, our shelters are equipped with integral HVAC systems, purge systems, fire and gas detection, and hazardous area electrical fittings. This creates a standalone, climate-controlled environment that actively defends your multi-million dollar analytical investment against the region’s harsh climate.',
  sample_title: 'Sample Conditioning Systems',
  sample_description:
    'The most sophisticated analyzer is useless with a poor sample. We provide complete sample conditioning systems from Bartec, including fast loops, heated probe systems, coalescing filters, pressure regulators, and stream selection panels. Our systems ensure a clean, dry, representative, and timely sample is delivered to each analyzer at the correct pressure, temperature, and flow rate, which is the foundation of data integrity and reliability.',
  advantage_title: 'The ESS-ME Turnkey Advantage',
  advantage_description:
    'We provide single point responsibility for your entire analyzer project. Our service encompasses:',
  advantage_items: [
    {
      title: 'Design & Compliance',
      description: 'Handling all engineering, including Civil Defense approval management.'
    },
    {
      title: 'Fabrication & Integration',
      description: 'Building and pre-testing the shelter and sample panels in our facility.'
    },
    {
      title: 'Installation & Commissioning',
      description: 'On-site placement, hook-up, and SAT to ensure full system functionality.'
    }
  ],
  applications_title: 'Industry Applications',
  application_items: [
    'Refineries',
    'Petrochemical and Gas Plants',
    'Chemical Processing Facilities'
  ]
};

const BartecDetailsSection = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchBartecDetails()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.trusted_title || payload.solutions_title) {
          setData({
            trusted_title: payload.trusted_title || DEFAULT_DATA.trusted_title,
            trusted_description: payload.trusted_description || DEFAULT_DATA.trusted_description,
            solutions_title: payload.solutions_title || DEFAULT_DATA.solutions_title,
            solutions_description: payload.solutions_description || DEFAULT_DATA.solutions_description,
            shelters_title: payload.shelters_title || DEFAULT_DATA.shelters_title,
            shelters_description: payload.shelters_description || DEFAULT_DATA.shelters_description,
            sample_title: payload.sample_title || DEFAULT_DATA.sample_title,
            sample_description: payload.sample_description || DEFAULT_DATA.sample_description,
            advantage_title: payload.advantage_title || DEFAULT_DATA.advantage_title,
            advantage_description: payload.advantage_description || DEFAULT_DATA.advantage_description,
            advantage_items: payload.advantage_items?.length ? payload.advantage_items : DEFAULT_DATA.advantage_items,
            applications_title: payload.applications_title || DEFAULT_DATA.applications_title,
            application_items: payload.application_items?.length ? payload.application_items : DEFAULT_DATA.application_items
          });
        }
      })
      .catch((err) => console.error('Failed to load Bartec details:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic SEO Metadata
  const metaTitle = 'BARTEC Analyzer Shelters & Sample Conditioning Systems | Turnkey Solutions';
  const rawDescription = data.trusted_description || data.solutions_description || '';
  const metaDescription = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD ItemList / Service Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "BARTEC Explosion Protection & Analyzer Solutions",
    "description": metaDescription,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": data.shelters_title,
          "description": data.shelters_description,
          "brand": { "@type": "Brand", "name": "BARTEC" }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": data.sample_title,
          "description": data.sample_description,
          "brand": { "@type": "Brand", "name": "BARTEC" }
        }
      }
    ]
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

      {/* Main Details Section Container - Fixed Height Shell Prevents CLS */}
      <section 
        className="w-full bg-white text-black py-16 px-6 md:px-16 overflow-hidden font-sans border-b border-slate-200 min-h-[600px]"
        aria-label="BARTEC Product and Service Details"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {loading ? (
            <div className="w-full py-20 flex justify-center items-center" aria-label="Loading details">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* 1. TRUSTED BARTEC SOLUTIONS */}
              <article className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                  {data.trusted_title}
                </h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal text-justify">
                  {data.trusted_description}
                </p>
              </article>

              {/* 2. OUR BARTEC PRODUCT & SERVICE SOLUTIONS */}
              <article className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                  {data.solutions_title}
                </h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal text-justify">
                  {data.solutions_description}
                </p>
              </article>

              {/* 3. ANALYZER SHELTERS & HOUSES */}
              <article className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                  {data.shelters_title}
                </h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal text-justify">
                  {data.shelters_description}
                </p>
              </article>

              {/* 4. SAMPLE CONDITIONING SYSTEMS */}
              <article className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                  {data.sample_title}
                </h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal text-justify">
                  {data.sample_description}
                </p>
              </article>

              {/* 5. THE ESS-ME TURNKEY ADVANTAGE */}
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                  {data.advantage_title}
                </h2>
                {data.advantage_description && (
                  <p className="text-base md:text-lg text-slate-700 font-medium text-justify">
                    {data.advantage_description}
                  </p>
                )}
                <ul className="space-y-3 pt-1">
                  {data.advantage_items?.map((item, idx) => (
                    <li key={idx} className="flex items-start text-base md:text-lg text-slate-800 text-justify">
                      <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 shrink-0" />
                      <span>
                        <strong className="font-bold text-black">{item.title}: </strong>
                        <span className="text-slate-700">{item.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. INDUSTRY APPLICATIONS */}
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                  {data.applications_title}
                </h2>
                <ul className="space-y-3 pt-1">
                  {data.application_items?.map((item, idx) => (
                    <li key={idx} className="flex items-center text-base md:text-lg text-slate-800 text-justify">
                      <span className="inline-block w-2 h-2 bg-black rounded-full mr-3 shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
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

export default BartecDetailsSection;