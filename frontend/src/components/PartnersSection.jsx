import React, { useEffect, useState } from 'react';
import { fetchHomePage } from '../services/api';

const DEFAULT_PARTNERS = {
  tagline: 'ALLIANCES',
  title: 'Our Partners',
  items: [
    { id: '1', name: 'Gasal', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Gasal_Logo.png/640px-Gasal_Logo.png' },
    { id: '2', name: 'Maersk Oil', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Maersk_Group_Logo.svg/1280px-Maersk_Group_Logo.svg.png' },
    { id: '3', name: 'QAFCO', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/QAFCO_Logo.png/640px-QAFCO_Logo.png' },
    { id: '4', name: 'Q-Chem', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Q-Chem_Logo.png/640px-Q-Chem_Logo.png' },
    { id: '5', name: 'Qatargas', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Qatargas_Logo.png/640px-Qatargas_Logo.png' },
    { id: '6', name: 'RasGas', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/RasGas_Logo.png/640px-RasGas_Logo.png' }
  ]
};

const PartnersSection = () => {
  const [data, setData] = useState(DEFAULT_PARTNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomePage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const sec = payload.partners;

        if (sec) {
          setData({
            tagline: sec.tagline ?? DEFAULT_PARTNERS.tagline,
            title: sec.title ?? DEFAULT_PARTNERS.title,
            items: Array.isArray(sec.items) && sec.items.length > 0 ? sec.items : DEFAULT_PARTNERS.items
          });
        }
      })
      .catch((err) => console.error('Error fetching Partners section:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const items = data.items || [];
  const marqueeItems = [...items, ...items, ...items];

  return (
    <section className="py-16 sm:py-20 overflow-hidden bg-slate-200/50 border-y border-slate-300/40">
      <style>{`
        @keyframes marqueeLeftToRight {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee-ltr {
          animation: marqueeLeftToRight 35s linear infinite;
        }

        .animate-marquee-ltr:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-ltr {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 text-center">
        
        {/* SECTION HEADER */}
        {(data.tagline || data.title) && (
          <div className="space-y-2 max-w-xl mx-auto">
            {data.tagline && (
              <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase block">
                {data.tagline}
              </span>
            )}
            {data.title && (
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {data.title}
              </h2>
            )}
          </div>
        )}

        {/* INFINITE MARQUEE CONTAINER */}
        <div className="relative w-full overflow-hidden flex items-center py-2">
          
          {/* SEAMLESS EDGE FADES */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#e2e8f0] via-[#e2e8f0]/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#e2e8f0] via-[#e2e8f0]/80 to-transparent z-10" />

          {/* SCROLLING TRACK */}
          <div className="flex items-center gap-6 sm:gap-8 w-max animate-marquee-ltr py-4">
            {marqueeItems.map((partner, idx) => {
              const isFullPhoto = partner.logo_url && (
                partner.logo_url.endsWith('.jpg') || 
                partner.logo_url.endsWith('.jpeg') || 
                partner.logo_url.includes('cloudinary') ||
                partner.logo_url.includes('unsplash')
              );

              return (
                <div
                  key={`${partner.id || idx}-${idx}`}
                  className="relative z-0 hover:z-30 rounded-2xl overflow-hidden flex items-center justify-center w-[200px] sm:w-[240px] h-32 sm:h-36 shrink-0 shadow-sm hover:shadow-2xl border border-slate-200/80 scale-100 hover:scale-125 hover:-translate-y-3 transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group bg-white"
                >
                  {partner.logo_url ? (
                    isFullPhoto ? (
                      /* FULL PHOTO MODE: Edge-to-edge cover with subtle gradient & inner border */
                      <div className="relative w-full h-full">
                        <img
                          src={partner.logo_url}
                          alt={partner.name || 'Partner Image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        {/* Overlay Gradient & Name Bar for Photos */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        {partner.name && (
                          <span className="absolute bottom-3 left-3 right-3 text-[11px] font-bold text-white tracking-wide uppercase truncate text-left drop-shadow-md">
                            {partner.name}
                          </span>
                        )}
                      </div>
                    ) : (
                      /* BRAND LOGO MODE: Clean centered contain */
                      <div className="w-full h-full p-6 sm:p-8 flex items-center justify-center">
                        <img
                          src={partner.logo_url}
                          alt={partner.name || 'Partner Logo'}
                          className="max-h-full max-w-full object-contain object-center"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <span
                          style={{ display: 'none' }}
                          className="text-xs sm:text-sm font-black text-slate-800 tracking-wide uppercase text-center"
                        >
                          {partner.name || 'Partner'}
                        </span>
                      </div>
                    )
                  ) : (
                    /* NO IMAGE FALLBACK */
                    <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide uppercase text-center p-4">
                      {partner.name || 'Partner'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default PartnersSection;