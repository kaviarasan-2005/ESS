import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchEcoPhysicsRangeSupport } from '../services/api';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/600x380?text=Eco+Physics+Oil+%26+Gas+Applications';

const EcoPhysicsRangeSupportSection = () => {
  const [data, setData] = useState({
    product_range_title: 'Our Eco Physics Product Range',
    product_range_subtitle:
      'ECO Physics offers a specialized portfolio of analyzers, with each series engineered to excel in specific environments and applications. Whether your priority is rugged reliability for continuous industrial monitoring or ultra-high sensitivity for research, we provide the precise tool to meet your measurement challenges and data quality objectives.',
    card_1_title: 'CEMS & Industrial Emissions Monitoring Analyzers',
    card_1_desc:
      'Ensure 100% compliance with regional environmental regulations. Our robust NOx analyzers for CEMS are designed for continuous, unattended operation in harsh industrial environments. They deliver the precise, drift-free data required for regulatory reporting in power plants, refineries, and large combustion facilities. These systems are built to withstand the demanding conditions of automotive, aviation, and marine engine test stands, providing accurate data for engine development and certification.',
    card_2_title: 'Ambient Air & Research-Grade NOx Analyzers',
    card_2_desc:
      "To protect public health and advance scientific understanding, ECO Physics' sensitive ambient air quality analyzers come in extremely handy. These instruments are deployed in government monitoring networks, urban air quality stations, and indoor air quality assessments to detect pollution at its source. Furthermore, ECO Physics is the preferred choice for advanced atmospheric research and cleanroom monitoring, where detecting ultratrace, part-per-trillion concentrations of NOx is critical for groundbreaking studies and protecting sensitive manufacturing processes.",
    support_title: 'Technical Expertise & Support',
    support_para_1:
      'We provide complete solutions, not just instruments. Our technical team offers expert application consulting to select the perfect analyzer for your specific needs. We manage the entire process, including system integration, installation, and commissioning.',
    support_para_2:
      'To protect your investment, we provide ISO 17025 accredited calibration services and comprehensive maintenance contracts, ensuring your ECO Physics analyzer maintains its certified accuracy and performance for years to come, with full data traceability for audits.',
    industries_title: 'Industries We Serve',
    industries_intro:
      'ECO Physics solutions find usage in the following major applications:',
    industry_list: [
      {
        label: 'Continuous Emission Monitoring (CEMS)',
        detail: 'For stack emissions compliance in power and industrial plants.',
      },
      {
        label: 'Engine & Turbine Testing',
        detail:
          'For development and emissions certification in the automotive and aerospace sectors.',
      },
      {
        label: 'Ambient Air Monitoring Networks',
        detail: 'For urban air quality and environmental impact studies.',
      },
      {
        label: 'Catalyst Research & Development',
        detail:
          'For evaluating the performance of catalytic converters and SCR systems.',
      },
      {
        label: 'Indoor & Cleanroom Air Quality',
        detail: 'Ensuring safety in sensitive environments.',
      },
    ],
    industry_image_url: '',
    industry_image_caption:
      'Eco Physics Analyzers used in Oil & Gas Industries',
    footer_text:
      'ECO Physics product applications across Doha and other places in the Middle East has been soaring of late. To know more about our offerings, send an email to our ECO Physics product experts and we will reach out to you right away.',
    contact_email: 'info@ess-me.com',
    link_text: 'send an email to our ECO Physics product experts',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSectionData();
  }, []);

  const loadSectionData = async () => {
    try {
      setLoading(true);
      const res = await fetchEcoPhysicsRangeSupport();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to fetch range and support section data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata
  const metaTitle = `${data.product_range_title} | Technical Support & Industry Applications`;
  const metaDescription = `${data.product_range_subtitle}`
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl =
    data.industry_image_url && data.industry_image_url.trim() !== ''
      ? data.industry_image_url
      : PLACEHOLDER_IMAGE;

  // JSON-LD ItemList & Service Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.product_range_title,
    description: metaDescription,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: data.card_1_title,
          description: data.card_1_desc,
          brand: { '@type': 'Brand', name: 'ECO Physics' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Product',
          name: data.card_2_title,
          description: data.card_2_desc,
          brand: { '@type': 'Brand', name: 'ECO Physics' },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: data.support_title,
          description: `${data.support_para_1} ${data.support_para_2}`,
          provider: { '@type': 'Organization', name: 'ESS-ME' },
        },
      },
    ],
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
        <meta property="og:image" content={currentImageUrl} />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={currentImageUrl} />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Container Shell - Prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[600px] bg-white px-6 py-16 text-black border-b border-slate-200 md:px-12 lg:px-24 font-sans"
        aria-label="ECO Physics Product Range, Technical Support & Applications"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-black">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-2 text-sm text-slate-600">Loading section...</p>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl space-y-16">
            {/* SECTION 1: PRODUCT RANGE */}
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-5xl">
                {data.product_range_title}
              </h2>
              <p className="mt-4 max-w-5xl text-base leading-relaxed text-slate-700 text-justify md:text-lg">
                {data.product_range_subtitle}
              </p>

              <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                <article className="rounded-xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-black md:text-xl">
                    {data.card_1_title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700 text-justify md:text-base">
                    {data.card_1_desc}
                  </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-black md:text-xl">
                    {data.card_2_title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700 text-justify md:text-base">
                    {data.card_2_desc}
                  </p>
                </article>
              </div>
            </div>

            {/* SECTION 2: TECHNICAL EXPERTISE & SUPPORT */}
            <article>
              <h2 className="text-2xl font-extrabold tracking-tight text-black md:text-4xl">
                {data.support_title}
              </h2>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-700 text-justify md:text-lg">
                <p>{data.support_para_1}</p>
                <p>{data.support_para_2}</p>
              </div>
            </article>

            {/* SECTION 3: INDUSTRIES WE SERVE */}
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-5xl">
                {data.industries_title}
              </h2>

              <div className="mt-8 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm lg:col-span-6">
                  <p className="text-base font-semibold text-black">
                    {data.industries_intro}
                  </p>
                  <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700 text-justify md:text-base">
                    {data.industry_list &&
                      data.industry_list.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black"></span>
                          <span>
                            <strong className="font-bold text-black">
                              {item.label}:
                            </strong>{' '}
                            {item.detail}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="flex flex-col items-center justify-center lg:col-span-6">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-md">
                    <img
                      src={currentImageUrl}
                      alt={
                        data.industry_image_caption ||
                        'Eco Physics Analyzers used in Oil & Gas Industries'
                      }
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="380"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {data.industry_image_caption && (
                    <p className="mt-3 text-center text-xs font-medium text-slate-600 italic">
                      {data.industry_image_caption}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER CALL-TO-ACTION EMAIL SECTION */}
            <div className="pt-4 text-sm leading-relaxed text-slate-700 text-justify md:text-base">
              <p>
                {data.footer_text}{' '}
                <a
                  href={`mailto:${data.contact_email || 'info@ess-me.com'}`}
                  className="font-bold text-black underline hover:text-slate-600"
                >
                  {data.link_text || 'send an email to our ECO Physics product experts'}
                </a>
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default EcoPhysicsRangeSupportSection;