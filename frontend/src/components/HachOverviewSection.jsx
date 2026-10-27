import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHachOverview } from '../services/api';

// Default SVG placeholder with clean white background matching the card container
const DEFAULT_CARD_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22360%22%20viewBox%3D%220%200%20600%20360%22%3E%3Crect%20fill%3D%22%23ffffff%22%20width%3D%22600%22%20height%3D%22360%22%2F%3E%3Ctext%20fill%3D%22%23081b2c%22%20font-family%3D%22sans-serif%22%20font-size%3D%2226%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20text-anchor%3D%22middle%22%3EHACH%3C%2Ftext%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2258%25%22%20text-anchor%3D%22middle%22%3EWater%20Quality%20Analysis%20Solutions%3C%2Ftext%3E%3C%2Fsvg%3E";

const HachOverviewSection = () => {
  const [data, setData] = useState({
    title: 'HACH Water Quality Analysis Solutions',
    description:
      'For over 80 years, Hach has been the global leader in water quality analysis. ESS-ME, as an authorized distributor, brings this legacy of precision and reliability to the Middle East, ensuring you get your water analysis right the first time, every time.',
    card_image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchHachOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load HACH overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Meta Setup
  const metaTitle = `${data.title} | Authorized Middle East Distributor`;
  const metaDescription = (data.description || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl =
    data.card_image_url && data.card_image_url.trim() !== ''
      ? data.card_image_url
      : DEFAULT_CARD_PLACEHOLDER;

  // JSON-LD Structured Data Schema (Product / Brand Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'HACH',
    },
    image: currentImageUrl.startsWith('data:') ? undefined : currentImageUrl,
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
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {!currentImageUrl.startsWith('data:') && (
          <meta property="og:image" content={currentImageUrl} />
        )}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {!currentImageUrl.startsWith('data:') && (
          <meta name="twitter:image" content={currentImageUrl} />
        )}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Main Container Shell - Prevents Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-24 lg:py-24"
        aria-label="HACH Water Quality Analysis Solutions Overview"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-black">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <span className="mt-3 text-sm text-gray-600">Loading section...</span>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* Title Heading */}
            <h2 className="mb-12 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-black md:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Text Description */}
              <div className="space-y-6 text-sm leading-relaxed text-black md:text-base lg:col-span-6">
                <p className="text-justify">{data.description}</p>
              </div>

              {/* Image Card Container */}
              <div className="lg:col-span-6">
                <div className="mx-auto w-full max-w-[85%] overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl">
                  <img
                    src={currentImageUrl}
                    alt={`${data.title} - Precision Water Testing`}
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="360"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_CARD_PLACEHOLDER;
                    }}
                    className="block h-auto w-full rounded-xl object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default HachOverviewSection;