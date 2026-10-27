import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchVogelsangOverview } from '../services/api';

const VogelsangOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Vogelsang Wastewater Equipment',
    paragraph_1:
      'To conduct efficient wastewater and industrial processing, one needs to avoid clogs, jams, and downtime. ESS-ME supplies Vogelsang wastewater equipment, delivering German-engineered solutions specifically designed to handle the toughest solids-laden and viscous fluids.',
    paragraph_2:
      'Our robust chopper pumps, macerators, and rotary lobe pumps are engineered to eliminate blockages, reduce maintenance costs, and ensure continuous, reliable operation for municipal and industrial applications across the GCC.',
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchVogelsangOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Vogelsang overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Vogelsang Wastewater Equipment';
  const metaTitle = `${displayTitle} | ESS-ME GCC Distributor`;
  const rawDescription = `${data.paragraph_1 || ''} ${data.paragraph_2 || ''}`;
  const metaDescription =
    rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    'Authorized Vogelsang distributor in the Middle East & GCC. Supplying German-engineered rotary lobe pumps, chopper pumps, and macerators for industrial wastewater.';
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl = data.image_url && data.image_url.trim() !== '' ? data.image_url : undefined;

  // JSON-LD Structured Data Schema (Product & Provider Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle,
    description: metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'Vogelsang',
    },
    provider: {
      '@type': 'Organization',
      name: 'ESS-ME',
    },
    ...(currentImageUrl && { image: currentImageUrl }),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      {/* Helmet SEO Meta Tag Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph Meta Tags */}
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
        aria-label="Vogelsang Wastewater Equipment Overview"
      >
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading overview section">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading section...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* SECTION TITLE */}
            <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            {/* items-stretch makes both columns the same height */}
            <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
              {/* LEFT COLUMN: DESCRIPTION TEXT */}
              <article className="flex w-full flex-col justify-center space-y-4 text-justify text-base leading-relaxed text-black md:text-lg md:leading-loose lg:w-0 lg:flex-1">
                {data.paragraph_1 && <p>{data.paragraph_1}</p>}
                {data.paragraph_2 && <p>{data.paragraph_2}</p>}
              </article>

              {/* RIGHT COLUMN: BRAND / PRODUCT CARD */}
              <div className="w-full lg:relative lg:w-0 lg:flex-1">
                <div className="relative h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-white/5 p-2 shadow-2xl backdrop-blur-xs md:h-80 lg:absolute lg:inset-0 lg:h-auto">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white">
                    {data.image_url && data.image_url.trim() !== '' ? (
                      <img
                        src={data.image_url}
                        alt={`${displayTitle} - Rotary Lobe Pumps & Macerators`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-slate-400">
                        <span className="text-4xl" role="img" aria-label="Gear emoji">⚙️</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          Vogelsang Equipment Image
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default VogelsangOverviewSection;