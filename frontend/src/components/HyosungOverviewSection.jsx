import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHyosungOverview } from '../services/api';

const HyosungOverviewSection = () => {
  const [data, setData] = useState({
    title: '',
    description: '',
    card_image_url: '',
    card_fallback_title: '',
    card_fallback_subtitle: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchHyosungOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Hyosung overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Strict URL Validation Check
  const rawUrl = data.card_image_url || data.card_image || '';
  const isValidImage =
    rawUrl &&
    rawUrl.trim() !== '' &&
    rawUrl !== 'undefined' &&
    rawUrl !== 'null';

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Hyosung Goodsprings Industrial Pumps';
  const metaTitle = `${displayTitle} | Overview & Solutions`;
  const metaDescription = (data.description || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl = isValidImage ? rawUrl : undefined;

  // JSON-LD Structured Data Schema (Product / Brand Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle,
    description: metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'Hyosung Goodsprings',
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
        {metaDescription && (
          <meta property="og:description" content={metaDescription} />
        )}
        {currentImageUrl && <meta property="og:image" content={currentImageUrl} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        {metaDescription && (
          <meta name="twitter:description" content={metaDescription} />
        )}
        {currentImageUrl && <meta name="twitter:image" content={currentImageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Section Shell with min-height layout to prevent Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-24 lg:py-24"
        aria-label="Hyosung Goodsprings Overview"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-black" aria-label="Loading overview section">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <span className="mt-3 text-base text-gray-600">Loading section...</span>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* Dynamic Title Heading */}
            {data.title && (
              <h2 className="mb-12 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-black md:text-4xl lg:text-5xl">
                {data.title}
              </h2>
            )}

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Dynamic Paragraph Description */}
              {data.description && (
                <div className="space-y-6 text-base leading-relaxed text-black md:text-lg lg:col-span-6">
                  <p className="text-justify">{data.description}</p>
                </div>
              )}

              {/* Dynamic Image Card Container */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl flex flex-col items-center justify-center text-center">
                  {isValidImage ? (
                    <img
                      src={rawUrl}
                      alt={displayTitle}
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="338"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    /* DYNAMIC BACKEND-FED CARD CONTENT */
                    <div className="flex flex-col items-center justify-center space-y-2 select-none">
                      <span className="text-2xl md:text-3xl font-black tracking-wider text-[#081b2c] uppercase">
                        {data.card_fallback_title || displayTitle}
                      </span>
                      {data.card_fallback_subtitle && (
                        <span className="text-sm md:text-base font-extrabold tracking-widest text-sky-600 uppercase">
                          {data.card_fallback_subtitle}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default HyosungOverviewSection;