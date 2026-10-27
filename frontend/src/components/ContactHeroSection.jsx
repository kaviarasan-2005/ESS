import React, { useEffect, useState } from 'react';
import { fetchContactPage } from '../services/api';

// Converts relative upload paths (/uploads/...) into full backend URLs
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const ContactHeroSection = ({ header: propHeader }) => {
  const [headerData, setHeaderData] = useState(propHeader || null);

  // Automatically fetch from backend if no props are passed by a parent page
  useEffect(() => {
    fetchContactPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const header = payload.header || payload || {};
        setHeaderData(header);
      })
      .catch((err) => console.error('Error loading Contact Hero content:', err));
  }, [propHeader]);

  // Fallback defaults while loading or if data is empty
  const title = headerData?.title || 'Contact Us';
  const subtitle =
    headerData?.subtitle ||
    'Get in touch with our expert technical support and sales team.';

  // Check all possible MongoDB image key names
  const rawBgImage =
    headerData?.bg_image ||
    headerData?.bg_image_url ||
    headerData?.image_url ||
    headerData?.bg_url ||
    '';

  const bgImage = formatImageUrl(rawBgImage);
  const bgColor = headerData?.bg_color || '#0b1727';

  return (
    <section
      className="relative w-full h-56 sm:h-72 lg:h-[441px] text-center text-white overflow-hidden flex items-center justify-center transition-all duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {/* BACKGROUND IMAGE LAYER */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Contact Hero Background"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Hide image layer if URL fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Dark Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
        </div>
      )}

      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-200 text-sm sm:text-base font-medium max-w-xl mx-auto drop-shadow-sm leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default ContactHeroSection;