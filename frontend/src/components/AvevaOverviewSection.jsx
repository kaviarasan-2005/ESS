import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchAVEVAOverview } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const DEFAULT_OVERVIEW = {
  title: 'AVEVA System Platform & SCADA Solutions',
  description:
    'In the age of industrial digitalization, a SCADA system must be more than a control interface—it must be the central nervous system of your enterprise. ESS-ME is a certified system integrator for AVEVA System Platform and AVEVA Edge SCADA, delivering powerful, scalable solutions that unify control, data, and insight. We empower industries across the Middle East to break down data silos, optimize performance, and make faster, data-driven decisions with one of the world\'s most trusted industrial software platforms.',
  image: '',
  image_url: ''
};

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const AvevaOverviewSection = () => {
  const [data, setData] = useState(DEFAULT_OVERVIEW);

  useEffect(() => {
    let isMounted = true;

    fetchAVEVAOverview()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload && (payload.title || payload.description || payload.image_url || payload.image)) {
          setData({
            title: payload.title || DEFAULT_OVERVIEW.title,
            description: payload.description || DEFAULT_OVERVIEW.description,
            image: payload.image || payload.image_url || '',
            image_url: payload.image_url || payload.image || ''
          });
        }
      })
      .catch((err) => console.error('API Error, using fallback overview:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const rawImg = data.image_url || data.image;
  const imageUrl = formatImageUrl(rawImg);

  // Dynamic SEO Meta Setup
  const metaTitle = `${data.title} | System Platform & SCADA Integration`;
  const cleanDescription = data.description.replace(/\s+/g, ' ').trim().slice(0, 160);
  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  // JSON-LD Structured Data (Product / Software Service Schema)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": data.title,
    "description": cleanDescription,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Windows, Linux",
    "image": imageUrl || undefined,
    "author": {
      "@type": "Organization",
      "name": "AVEVA"
    }
  };

  return (
    <>
      {/* Helmet SEO Meta Tags */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={cleanDescription} />
        {pageUrl && <link rel="canonical" href={pageUrl} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={cleanDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={cleanDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Main Overview Section */}
      <section 
        className="w-full bg-white text-slate-900 py-16 md:py-24 font-sans border-b border-slate-200 min-h-[450px]"
        aria-label="AVEVA Solutions Overview"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* TOP HEADING TITLE */}
          <div className="max-w-4xl mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {data.title}
            </h2>
            <div className="mt-5 h-1.5 w-20 rounded-full bg-blue-600" />
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* LEFT COLUMN: DESCRIPTION TEXT */}
            <div className="lg:col-span-6">
              <p className="whitespace-pre-line text-base sm:text-lg text-slate-700 leading-8 border-l-4 border-blue-600 pl-5 sm:pl-6">
                {data.description}
              </p>
            </div>

            {/* RIGHT COLUMN: IMAGE CARD */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                {/* offset accent block behind the image */}
                <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl bg-blue-100" />

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${data.title} - Certified Industrial Software Integration`}
                      loading="lazy"
                      decoding="async"
                      width="500"
                      height="375"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider">No Image Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default AvevaOverviewSection;