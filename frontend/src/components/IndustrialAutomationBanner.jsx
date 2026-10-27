import React, { useState, useEffect } from 'react';
import { fetchIndustrialAutomationBanner } from '../services/SystemsSolutions';

const IndustrialAutomationBanner = () => {
  const [data, setData] = useState({
    title: 'Industrial Automation & SIL-Rated Control Systems',
    subtitle: 'Integrated Safety & Process Control Solutions',
    bg_image_url: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBannerData();
  }, []);

  const loadBannerData = async () => {
    try {
      setLoading(true);
      const res = await fetchIndustrialAutomationBanner();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Industrial Automation banner section:', err);
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
            className="h-full w-full object-cover object-center opacity-80"
          />
         
        </div>
      ) : (
        <div className="absolute inset-0 z-0 " />
      )}

      {/* CENTERED TEXT CONTENT */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md md:text-4xl lg:text-5xl">
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

export default IndustrialAutomationBanner;