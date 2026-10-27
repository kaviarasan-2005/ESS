import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchEcoPhysicsPrecision } from '../services/api';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/600x380?text=Eco+Physics+CLD+Analyzer';

const EcoPhysicsPrecisionSection = () => {
  const [data, setData] = useState({
    title: 'Unmatched Precision in NOx Analysis',
    paragraph_1:
      'ECO Physics sets the industry benchmark for accuracy and range in NOx detection. Utilizing the gold-standard Chemiluminescence detection method (CLD), these analyzers provide definitive measurements that other technologies cannot match.',
    paragraph_2:
      'They are engineered to handle challenging sample conditions, including high humidity and complex gas matrices, ensuring data integrity you can trust for compliance reporting and critical research. With measurement capabilities spanning an incredible range—from trace-level 1 ppt (parts-per-trillion) to high-concentration 10,000 ppm (parts-per-million)—a single ECO Physics analyzer can be configured for virtually any application.',
    image_url: '',
    image_caption:
      'Chemiluminescence Detection Method based Eco Physics Analyzers',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrecisionData();
  }, []);

  const loadPrecisionData = async () => {
    try {
      setLoading(true);
      const res = await fetchEcoPhysicsPrecision();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({
          ...prev,
          ...content,
        }));
      }
    } catch (err) {
      console.error('Failed to load Eco Physics precision section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Meta Tag Setup
  const metaTitle = `${data.title} | ECO Physics CLD Technology`;
  const combinedDesc = `${data.paragraph_1} ${data.paragraph_2}`;
  const metaDescription = combinedDesc
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl =
    data.image_url && data.image_url.trim() !== ''
      ? data.image_url
      : PLACEHOLDER_IMAGE;

  // JSON-LD Structured Data (Product / Technical Feature Schema)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'ECO Physics',
    },
    image: currentImageUrl,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
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
        className="relative min-h-[450px] bg-white px-6 py-20 text-black md:px-12 lg:px-24"
        aria-label="ECO Physics Precision NOx Detection Section"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-black">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-2 text-sm text-black">Loading precision section...</p>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* Main Section Header */}
            <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
              {data.title}
            </h2>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Two Body Paragraphs */}
              <div className="space-y-6 lg:col-span-7">
                <p className="text-justify text-base leading-relaxed text-black md:text-lg">
                  {data.paragraph_1}
                </p>
                <p className="text-justify text-base leading-relaxed text-black md:text-lg">
                  {data.paragraph_2}
                </p>
              </div>

              {/* Right Column: Analyzer Image Card & Caption */}
              <div className="flex flex-col items-center lg:col-span-5">
                <div className="w-full overflow-hidden rounded-lg border border-slate-300 bg-white shadow-lg">
                  <img
                    src={currentImageUrl}
                    alt={
                      data.image_caption ||
                      `${data.title} - Chemiluminescence Detection Method CLD Analyzer`
                    }
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="380"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                    className="block h-auto w-full object-cover"
                  />
                </div>

                {/* Image Caption */}
                {data.image_caption && (
                  <p className="mt-3 text-center text-xs font-medium italic text-black md:text-sm">
                    {data.image_caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default EcoPhysicsPrecisionSection;