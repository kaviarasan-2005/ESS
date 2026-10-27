import React, { useEffect, useState } from 'react';
import { fetchSystemsHeader } from '../services/SystemsSolutions';

const DEFAULT_BANNER = {
  title: 'SYSTEMS & SOLUTIONS',
  subtitle: 'Explore Our Industrial Grade Systems & Solutions',
  bg_image_url: '',
};

// Module-level memory cache for 0ms instant rendering
let cachedBannerData = null;

const SystemsSolutionsHeaderBanner = ({ header: propHeader }) => {
  const [headerData, setHeaderData] = useState(() => {
    if (propHeader) {
      return {
        title: propHeader.title || DEFAULT_BANNER.title,
        subtitle: propHeader.subtitle || DEFAULT_BANNER.subtitle,
        bg_image_url: propHeader.bg_image_url || propHeader.image_url || '',
      };
    }
    return cachedBannerData || DEFAULT_BANNER;
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    if (headerData.bg_image_url) {
      preloadImage(headerData.bg_image_url);
    }

    if (propHeader) return;

    let isMounted = true;

    fetchSystemsHeader()
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
          title: payload.title || DEFAULT_BANNER.title,
          subtitle: payload.subtitle || DEFAULT_BANNER.subtitle,
          bg_image_url: cleanedImage,
        };

        cachedBannerData = freshData;
        setHeaderData(freshData);

        if (cleanedImage) {
          preloadImage(cleanedImage);
        }
      })
      .catch((err) => {
        console.error('Error fetching Systems & Solutions banner:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [propHeader]);

  const hasValidImage = Boolean(headerData.bg_image_url) && !imageError;

  return (
    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-[#081b2c] font-sans sm:h-72 lg:h-[441px]">
      {/* BACKGROUND IMAGE OVERLAY */}
      {hasValidImage ? (
        <div className="absolute inset-0 z-0">
          <img
            key={headerData.bg_image_url}
            src={headerData.bg_image_url}
            alt={headerData.title}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover object-center transition-opacity duration-300 ${
              imageLoaded ? 'opacity-80' : 'opacity-0'
            }`}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#081b2c]" />
      )}

      {/* CENTERED TEXT CONTENT */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
          {headerData.title}
        </h1>
        {headerData.subtitle && (
          <p className="mt-3 text-sm font-medium text-gray-200 drop-shadow-sm md:text-base lg:text-lg">
            {headerData.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SystemsSolutionsHeaderBanner;