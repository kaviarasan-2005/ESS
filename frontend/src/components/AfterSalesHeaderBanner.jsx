import React, { useEffect, useState } from 'react';
import { fetchAfterSalesHeader } from '../services/projectsServices';

const DEFAULT_BANNER = {
  title: 'After-Sales & Warranty Services',
  subtitle: 'Comprehensive Technical Support, Maintenance & Lifecycle Warranty Services',
  bg_image_url: '',
};

const CACHE_KEY = 'ess_cache_aftersales_banner';
let memCache = null;
try {
  const saved = sessionStorage.getItem(CACHE_KEY);
  if (saved) memCache = JSON.parse(saved);
} catch (e) {}

const AfterSalesHeaderBanner = () => {
  const [data, setData] = useState(() => memCache || DEFAULT_BANNER);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Instant cache verification on mount or URL change
  useEffect(() => {
    const rawImg = data.bg_image_url;
    if (rawImg) {
      const img = new Image();
      img.src = rawImg;
      if (img.complete) {
        setImageLoaded(true);
      } else {
        img.onload = () => setImageLoaded(true);
        img.onerror = () => setImageError(true);
      }
    }
  }, [data.bg_image_url]);

  useEffect(() => {
    let isMounted = true;

    fetchAfterSalesHeader()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};
        const rawImg = typeof (payload.bg_image_url || payload.image_url) === 'string'
          ? (payload.bg_image_url || payload.image_url).trim().replace(/^["']|["']$/g, '')
          : '';

        const freshData = {
          title: payload.title || DEFAULT_BANNER.title,
          subtitle: payload.subtitle || DEFAULT_BANNER.subtitle,
          bg_image_url: rawImg,
        };

        memCache = freshData;
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        } catch (e) {}

        setData((prev) => {
          if (
            prev.title === freshData.title &&
            prev.subtitle === freshData.subtitle &&
            prev.bg_image_url === freshData.bg_image_url
          ) {
            return prev;
          }
          return freshData;
        });
      })
      .catch((err) => {
        console.error('Error fetching After-Sales banner:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const hasValidImage = Boolean(data.bg_image_url) && !imageError;

  return (
    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-[#081b2c] font-sans sm:h-72 lg:h-[441px]">
      {/* BACKGROUND IMAGE OVERLAY */}
      {hasValidImage ? (
        <div className="absolute inset-0 z-0">
          <img
            key={data.bg_image_url}
            src={data.bg_image_url}
            alt={data.title}
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
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="mt-3 text-sm font-medium text-gray-200 drop-shadow-sm md:text-base lg:text-lg">
            {data.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default AfterSalesHeaderBanner;