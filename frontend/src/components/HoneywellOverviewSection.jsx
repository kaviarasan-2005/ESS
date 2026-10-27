import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHoneywellOverview } from '../services/api';

const HoneywellOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Honeywell Automation Solutions',
    paragraph_1:
      "In complex process industries, operational excellence demands an automation partner with proven technology and deep domain expertise. ESS-ME is a certified provider of Honeywell Automation Solutions, delivering the integrated control and safety systems that define modern industrial operations. We empower refineries, petrochemical plants, and power generation facilities across the Middle East to achieve superior production reliability, enhanced safety, and seamless digital transformation with Honeywell's industry-leading technology.",
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchHoneywellOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Honeywell overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Honeywell Automation Solutions';
  const metaTitle = `${displayTitle} | ESS-ME Certified Provider`;
  const metaDescription = (data.paragraph_1 || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl = data.image_url && data.image_url.trim() !== '' ? data.image_url : undefined;

  // JSON-LD Structured Data Schema (Service / Organization Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: displayTitle,
    description: metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'ESS-ME',
    },
    brand: {
      '@type': 'Brand',
      name: 'Honeywell',
    },
    ...(currentImageUrl && { image: currentImageUrl }),
  };

  return (
    <>
      {/* Helmet SEO Meta Tag Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph / Social Media Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        {metaDescription && <meta property="og:description" content={metaDescription} />}
        {currentImageUrl && <meta property="og:image" content={currentImageUrl} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        {metaDescription && <meta name="twitter:description" content={metaDescription} />}
        {currentImageUrl && <meta name="twitter:image" content={currentImageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Container Shell - Preserves min-height to prevent Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Honeywell Automation Solutions Overview"
      >
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading overview section">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-800 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading section...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* SECTION TITLE */}
            <h2 className="mb-10 text-right text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:gap-14">
              {/* LEFT COLUMN: IMAGE CARD (height follows the text on desktop) */}
              <div className="flex w-full min-w-0 lg:flex-1">
                <div className="flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <div className="relative h-64 w-full bg-slate-50 md:h-80 lg:h-auto">
                    {data.image_url && data.image_url.trim() !== '' ? (
                      <img
                        src={data.image_url}
                        alt={`${displayTitle} - Integrated Control Systems`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-400">
                        <span className="text-4xl" role="img" aria-label="Gear">⚙️</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          Honeywell Industrial Automation
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TEXT CONTENT (equal width, justified) */}
              <article className="flex w-full min-w-0 flex-col justify-center lg:flex-1">
                <p className="text-justify text-sm leading-relaxed text-black md:text-base md:leading-loose">
                  {data.paragraph_1}
                </p>
              </article>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default HoneywellOverviewSection;