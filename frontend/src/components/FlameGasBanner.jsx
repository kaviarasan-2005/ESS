import React, { useState, useEffect } from 'react';
import { fetchFlameGasBanner } from '../services/api';

const FlameGasBanner = () => {
  const [data, setData] = useState({
    title: 'Flame & Gas Detectors',
    subtitle: 'Advanced Flame & Hazardous Gas Detection Solutions',
    bg_image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBannerData();
  }, []);

  const loadBannerData = async () => {
    try {
      setLoading(true);
      const res = await fetchFlameGasBanner();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Flame & Gas banner section:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-56 w-full items-center justify-center sm:h-72 lg:h-[441px] bg-[#081b2c] text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-300">Loading banner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-[#081b2c] font-sans sm:h-72 lg:h-[441px]">
      {/* BACKGROUND IMAGE OVERLAY */}
      {data.bg_image_url && data.bg_image_url.trim() !== '' ? (
        <div className="absolute inset-0 z-0">
          <img
            src={data.bg_image_url}
            alt={data.title}
            className="h-full w-full object-cover object-center opacity-80 "
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

export default FlameGasBanner;