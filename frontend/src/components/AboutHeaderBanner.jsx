import React, { useEffect, useState } from 'react';
import { fetchAboutHeader } from '../services/aboutService';

// Module-level memory cache for instant rendering across route changes
let cachedHeaderData = null;

const AboutHeaderBanner = ({ header: propHeader }) => {
  // 1. Initialize state instantly using props, module cache, or default fallbacks
  const [headerData, setHeaderData] = useState(() => {
    if (propHeader) {
      return {
        title: propHeader.title || 'About Us',
        subtitle:
          propHeader.subtitle ||
          'Learn more about our heritage and engineering capabilities.',
        bg_image_url:
          propHeader.bg_image_url || propHeader.image_url || propHeader.bg_image || '',
      };
    }
    if (cachedHeaderData) {
      return cachedHeaderData;
    }
    return {
      title: 'About Us',
      subtitle:
        'Learn more about our heritage and engineering capabilities.',
      bg_image_url: '',
    };
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // In-memory browser image preloader for zero visual latency
  const preloadImage = (url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
    if (img.complete) {
      setImageLoaded(true);
    } else {
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
    }
  };

  useEffect(() => {
    // If an image URL is already present on initial mount, trigger preloader immediately
    if (headerData.bg_image_url) {
      preloadImage(headerData.bg_image_url);
    }

    // If props are provided, skip the background API call
    if (propHeader) return;

    let isMounted = true;

    // Direct section fetch from /api/about/header
    fetchAboutHeader()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data || res || {};
        const rawImage =
          payload.bg_image_url || payload.image_url || payload.bg_image || '';

        const cleanedImage =
          typeof rawImage === 'string'
            ? rawImage.trim().replace(/^["']|["']$/g, '')
            : '';

        const freshData = {
          title: payload.title || 'About Us',
          subtitle:
            payload.subtitle ||
            'Learn more about our heritage and engineering capabilities.',
          bg_image_url: cleanedImage,
        };

        // Cache result in memory for zero-delay response on subsequent page visits
        cachedHeaderData = freshData;
        setHeaderData(freshData);

        if (cleanedImage) {
          preloadImage(cleanedImage);
        }
      })
      .catch((err) => {
        console.error('Error fetching About header section settings:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [propHeader]);

  const hasValidImage = Boolean(headerData.bg_image_url) && !imageError;

  return (
    <section className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-slate-950 font-sans text-white sm:h-72 lg:h-[441px]">
      {/* 1. DYNAMIC BACKGROUND IMAGE */}
      {hasValidImage ? (
        <div className="absolute inset-0 z-0">
          <img
            key={headerData.bg_image_url}
            src={headerData.bg_image_url}
            alt="About Banner Background"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.warn(
                'Failed to load background image:',
                headerData.bg_image_url
              );
              setImageError(true);
            }}
            className={`relative z-0 h-full w-full object-cover object-center transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Subtle overlay mask for readability */}
          <div className="absolute inset-0 z-10 bg-slate-950/40" />
        </div>
      ) : (
        /* Dark Gradient Fallback */
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
      )}

      {/* 2. HEADER CONTENT BLOCK (EXACT ORIGINAL TYPOGRAPHY PRESERVED) */}
      <div className="relative z-20 mx-auto max-w-4xl space-y-3 px-6 text-center">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-lg sm:text-5xl">
          {headerData.title}
        </h1>
        {headerData.subtitle && (
          <p className="w-full text-justify text-slate-200 whitespace-pre-line break-words [text-align-last:left] [text-justify:inter-word]">
            {headerData.subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default AboutHeaderBanner;