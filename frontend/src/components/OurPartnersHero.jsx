import React, { useEffect, useState } from 'react';
import { fetchPartnersPage } from '../services/api';

const DEFAULT_HEADER = {
  title: 'Our Partners',
  subtitle: 'Collaborating with Global Industry Leaders',
  bg_image_url: '',
};

const OurPartnersHero = () => {
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchPartnersPage()
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.header) {
          setHeader({
            title: payload.header.title || DEFAULT_HEADER.title,
            subtitle: payload.header.subtitle || DEFAULT_HEADER.subtitle,
            bg_image_url: payload.header.bg_image_url || payload.header.image_url || '',
          });
        }
      })
      .catch((err) => console.error('Error fetching Partners hero content:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-56 sm:h-72 lg:h-[441px] bg-[#0d131f] flex items-center justify-center text-slate-500 text-xs font-semibold">
        Loading Partners Hero...
      </div>
    );
  }

  return (
    <section className="relative w-full bg-[#1e283b] h-56 sm:h-72 lg:h-[441px] flex items-center justify-center overflow-hidden border-b border-slate-800">
      
      {/* BACKGROUND IMAGE OVERLAY (IF UPLOADED FROM ADMIN) */}
      {header.bg_image_url ? (
        <div className="absolute inset-0 z-0">
          <img
            src={header.bg_image_url}
            alt="Partners Hero Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 " />
        </div>
      ) : (
        /* CLEAN GEOMETRIC BACKGROUND IF NO IMAGE IS SET */
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
      )}

      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3 py-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
          {header.title}
        </h1>
        {header.subtitle && (
          <p className="text-xs sm:text-sm md:text-base font-medium text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {header.subtitle}
          </p>
        )}
      </div>

    </section>
  );
};

export default OurPartnersHero;