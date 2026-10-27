import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchPanoramaOverview } from '../services/api';

const PanoramaOverviewSection = () => {
  const [data, setData] = useState({
    title: 'Codra Panorama SCADA System Integration',
    paragraph_1:
      "In today's industrial landscape, seamless visibility and control are non-negotiable. ESS-ME is a certified system integrator for Codra's Panorama SCADA, delivering powerful, scalable, and intuitive supervisory control solutions across the Middle East. We specialize in transforming complex operational data into actionable intelligence, providing you with a unified view of your entire enterprise, from a single pump station to a plant-wide network, ensuring informed decision-making and enhanced operational efficiency.",
    image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchPanoramaOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Panorama overview section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic SEO Metadata Construction
  const displayTitle = data.title || 'Codra Panorama SCADA System Integration';
  const metaTitle = `${displayTitle} | ESS-ME Certified Integrator`;
  const metaDescription = (data.paragraph_1 || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const currentImageUrl = data.image_url && data.image_url.trim() !== '' ? data.image_url : undefined;

  // JSON-LD Structured Data Schema (Service & Provider Context)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: displayTitle,
    description: metaDescription,
    brand: {
      '@type': 'Brand',
      name: 'Codra Panorama SCADA',
    },
    provider: {
      '@type': 'Organization',
      name: 'ESS-ME',
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

      {/* Main Section Shell - Preserves min-height to prevent Cumulative Layout Shift (CLS) */}
      <section
        className="relative min-h-[400px] w-full bg-white px-6 py-16 font-sans text-black md:px-12 lg:px-20"
        aria-label="Codra Panorama SCADA System Integration Overview"
      >
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center bg-white text-black" aria-label="Loading overview section">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-700">Loading section...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            {/* SECTION TITLE */}
            <h2 className="mb-10 text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-5xl">
              {data.title}
            </h2>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT COLUMN: BRAND / CERTIFICATION CARD */}
              <div className="w-full shrink-0 lg:w-1/2">
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gray-50 p-2 shadow-2xl">
                  <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-2 md:h-80">
                    {data.image_url && data.image_url.trim() !== '' ? (
                      <img
                        src={data.image_url}
                        alt={`${displayTitle} - Certified System Integrator`}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-slate-400">
                        <span className="text-4xl" role="img" aria-label="Desktop screen emoji">🖥️</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          Panorama Certified System Integrator
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TEXT CONTENT */}
              <article className="flex-1 text-justify text-base leading-relaxed text-black md:text-lg md:leading-loose">
                <p>{data.paragraph_1}</p>
              </article>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default PanoramaOverviewSection;