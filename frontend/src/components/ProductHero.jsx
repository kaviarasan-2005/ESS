import React, { useEffect, useState } from 'react';
import { fetchProductsPage } from '../services/api';

const ProductHero = ({ header: propHeader }) => {
  // Initialize state with default fallback values for instant initial render
  const [headerData, setHeaderData] = useState(() => ({
    title: propHeader?.title || 'PRODUCTS',
    subtitle:
      propHeader?.subtitle ||
      'Explore Our Industrial Grade Hardware & Equipment',
    bg_image:
      propHeader?.bg_image ||
      propHeader?.bg_image_url ||
      propHeader?.bg_url ||
      propHeader?.image_url ||
      propHeader?.image ||
      '',
    bg_color: propHeader?.bg_color || '#0b1727',
  }));

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // If props are passed, sync state immediately
    if (propHeader) {
      const img =
        propHeader.bg_image ||
        propHeader.bg_image_url ||
        propHeader.bg_url ||
        propHeader.image_url ||
        propHeader.image ||
        '';

      setHeaderData({
        title: propHeader.title || 'PRODUCTS',
        subtitle:
          propHeader.subtitle ||
          'Explore Our Industrial Grade Hardware & Equipment',
        bg_image: typeof img === 'string' ? img.trim().replace(/^["']|["']$/g, '') : '',
        bg_color: propHeader.bg_color || '#0b1727',
      });
      return;
    }

    // Async background API fetch (non-blocking for UI text)
    let isMounted = true;
    fetchProductsPage()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const header = payload.header || {};

        const rawImage =
          header.bg_image ||
          header.bg_image_url ||
          header.bg_url ||
          header.image_url ||
          header.image ||
          '';

        const cleanedImage =
          typeof rawImage === 'string'
            ? rawImage.trim().replace(/^["']|["']$/g, '')
            : '';

        setHeaderData({
          title: header.title || 'PRODUCTS',
          subtitle:
            header.subtitle ||
            'Explore Our Industrial Grade Hardware & Equipment',
          bg_image: cleanedImage,
          bg_color: header.bg_color || '#0b1727',
        });
        setImageError(false);
      })
      .catch((err) => {
        console.error('Failed to load ProductHero data:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [propHeader]);

  const hasValidImage = Boolean(headerData.bg_image) && !imageError;

  return (
    <section
      className="relative flex h-56 w-full items-center justify-center overflow-hidden font-sans text-center text-white transition-colors duration-500 sm:h-72 lg:h-[441px]"
      style={{ backgroundColor: headerData.bg_color }}
    >
      {/* 1. HERO BACKGROUND IMAGE WITH FADE-IN */}
      {hasValidImage ? (
        <div className="absolute inset-0 z-0">
          <img
            key={headerData.bg_image}
            src={headerData.bg_image}
            alt="Products Hero Banner"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.error('Hero image failed to load:', headerData.bg_image);
              setImageError(true);
            }}
            className={`h-full w-full object-cover object-center transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 z-10 bg-slate-950/40" />
        </div>
      ) : (
        /* Dark Fallback Gradient */
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
      )}

      {/* 2. HERO CONTENT (ALWAYS VISIBLE INSTANTLY) */}
      <div className="relative z-20 mx-auto max-w-4xl space-y-3 px-6 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
          {headerData.title}
        </h1>
        {headerData.subtitle && (
          <p className="mx-auto max-w-xl text-sm font-medium leading-relaxed text-slate-200 drop-shadow-sm sm:text-base">
            {headerData.subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductHero;