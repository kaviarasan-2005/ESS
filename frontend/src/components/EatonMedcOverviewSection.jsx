import React, { useEffect, useState } from 'react';
import { fetchEatonMedcOverview } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const DEFAULT_DATA = {
  description:
    'In potentially explosive atmospheres, standard electrical equipment becomes a liability. ESS-ME is the trusted supplier of Eaton explosion-proof and hazardous area equipment in the Middle East, providing certified safety solutions for the Oil & Gas, chemical, and pharmaceutical industries. We supply the robust lighting, plugs, and enclosures designed to contain internal explosions and prevent the ignition of external flammable gases, dusts, and vapors, ensuring compliance and protecting your workforce.',
  image_url: ''
};

const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return `${API_BASE_URL}/${trimmed}`;
};

const EatonMedcOverviewSection = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchEatonMedcOverview()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.description || payload.image_url || payload.image) {
          setData({
            description: payload.description || DEFAULT_DATA.description,
            image_url: payload.image_url || payload.image || ''
          });
        }
      })
      .catch((err) => console.error('Failed to fetch Eaton MEDC overview:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const imageUrl = formatImageUrl(data.image_url);

  // Helper function to render text with bold highlights for "Eaton explosion-proof and hazardous area equipment"
  const renderDescription = (text) => {
    if (!text) return null;
    const highlightPhrase = "Eaton explosion-proof and hazardous area equipment";
    
    if (text.includes(highlightPhrase)) {
      const parts = text.split(highlightPhrase);
      return (
        <>
          {parts[0]}
          <strong className="font-bold text-black">{highlightPhrase}</strong>
          {parts[1]}
        </>
      );
    }
    
    return text;
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative w-full bg-white text-black py-16 md:py-24 px-6 md:px-12 overflow-hidden border-b border-slate-200 font-sans">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* LEFT: TEXT PARAGRAPH (NOW DYNAMIC) */}
          <div className="lg:col-span-6 space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-black font-normal text-justify whitespace-pre-line">
              {renderDescription(data.description)}
            </p>
          </div>

          {/* RIGHT: FEATURED IMAGE CARD */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[16/10] bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Eaton MEDC Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-2 p-4">
                  <div className="text-4xl md:text-5xl font-black text-[#0066B2] tracking-tighter">
                    FAT<span className="text-[#0066B2]">•</span>N
                  </div>
                  <div className="px-6 py-2 border-2 border-[#E31B23] rounded-full text-[#E31B23] font-black text-2xl tracking-wider uppercase">
                    MEDC
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EatonMedcOverviewSection;