import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchEmersonOverview } from '../services/api';

// Default SVG placeholder with clean white background matching the card container
const DEFAULT_CARD_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22360%22%20viewBox%3D%220%200%20600%20360%22%3E%3Crect%20fill%3D%22%23ffffff%22%20width%3D%22600%22%20height%3D%22360%22%2F%3E%3Ctext%20fill%3D%22%23081b2c%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20text-anchor%3D%22middle%22%3EEMERSON%3C%2Ftext%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2258%25%22%20text-anchor%3D%22middle%22%3EIndustrial%20Automation%20System%20Integrator%3C%2Ftext%3E%3C%2Fsvg%3E";

const EmersonOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Emerson Automation System Integration & Engineering Services',
    paragraph_1:
      'In an era of digital transformation, leveraging the right automation platform is critical for competitive advantage. ESS-ME is a certified system integrator for Emerson Automation Solutions, providing the expertise to design, deploy, and optimize their world-class technologies.',
    paragraph_2:
      "We empower industries across the Middle East to achieve unprecedented levels of operational efficiency, production reliability, and safety using Emerson's comprehensive suite of control and safety systems.",
    card_image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchEmersonOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Emerson overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Meta Tag Setup
  const metaTitle = `${data.title} | Certified Integration Services`;
  const combinedText = `${data.paragraph_1} ${data.paragraph_2}`;
  const metaDescription = combinedText
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl =
    data.card_image_url && data.card_image_url.trim() !== ''
      ? data.card_image_url
      : DEFAULT_CARD_PLACEHOLDER;

  // JSON-LD Structured Data (Service / Organization Schema)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.title,
    description: metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'ESS-ME',
    },
    brand: {
      '@type': 'Brand',
      name: 'Emerson Automation Solutions',
    },
    image: currentImageUrl.startsWith('data:') ? undefined : currentImageUrl,
  };

  return (
    <>
      {/* Helmet Meta Tag Injection */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph Meta Tags */}
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

      {/* Main Section Container with min-height shell preventing Cumulative Layout Shift (CLS) */}
      <section
        lang="en"
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-24 lg:py-15"
        aria-label="Emerson Automation System Integration Overview"
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
              {/* Text Paragraphs */}
              <div className="space-y-6 text-justify text-sm leading-relaxed text-black hyphens-auto md:text-base lg:col-span-6">
                <p>{data.paragraph_1}</p>
                <p>{data.paragraph_2}</p>
              </div>

              {/* Image Card Container */}
              <div className="lg:col-span-6">
                <div className="flex w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                  <img
                    src={currentImageUrl}
                    alt={`${data.title} - Certified System Integrator`}
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="360"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_CARD_PLACEHOLDER;
                    }}
                    className="h-auto max-h-[420px] w-full object-contain object-center"
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

export default EmersonOverviewSection;