import React, { useEffect, useState, useRef } from 'react';
import { fetchHomePage } from '../services/api';

const DEFAULT_SOLUTIONS = {
  tagline: 'ESSME',
  title: 'Solutions',
  description: 'Custom engineered turn-key modules tailored from concept prototyping straight to site deployment.',
  items: [
    {
      id: 'sol-1',
      icon: 'factory',
      title: 'Design, Engineering, Supply, Installation',
      description: 'Full lifecycle structural detailing, on-site welding, piping spools fabrication, and foundation mounting.'
    },
    {
      id: 'sol-2',
      icon: 'bot',
      title: 'Testing & Commissioning',
      description: 'AI sensor networks, real-time industrial telematics, PLC programming, and high-speed robotic integration.'
    },
    {
      id: 'sol-3',
      icon: 'wrench',
      title: 'Calibration Services',
      description: 'Vibration surveillance, predictive failure diagnosis, thermal inspections, and urgent field refurbishment.'
    },
    {
      id: 'sol-4',
      icon: 'shield',
      title: 'Annual Maintenance Contract Services',
      description: 'Hazardous environment assessments, explosion-proof verification, pressure testing, and emission metrics.'
    },
    {
      id: 'sol-5',
      icon: 'factory',
      title: 'Periodic Maintenance',
      description: 'Scheduled preventive maintenance and systemic performance tuning.'
    }
  ]
};

const RenderIcon = ({ name }) => {
  const iconMap = {
    factory: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
    ),
    bot: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3v2m6-2v2M9 5h6a2 2 0 012 2v1H7V7a2 2 0 012-2zM4 11h16M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8M9 15h.01M15 15h.01" />
    ),
    wrench: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    )
  };

  return (
    <svg className="w-12 h-12 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {iconMap[name] || iconMap.factory}
    </svg>
  );
};

const SolutionsSection = () => {
  const [data, setData] = useState(DEFAULT_SOLUTIONS);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState({});
  const cardRefs = useRef({});

  useEffect(() => {
    fetchHomePage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        const sec = payload.solutions;

        if (sec) {
          setData({
            tagline: sec.tagline ?? DEFAULT_SOLUTIONS.tagline,
            title: sec.title ?? DEFAULT_SOLUTIONS.title,
            description: sec.description ?? DEFAULT_SOLUTIONS.description,
            items: Array.isArray(sec.items) && sec.items.length > 0 ? sec.items : DEFAULT_SOLUTIONS.items
          });
        }
      })
      .catch((err) => console.error('Error fetching Solutions section:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.dataset.cardId;
            setVisibleCards((prev) => ({ ...prev, [cardId]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const currentCards = Object.values(cardRefs.current).filter(Boolean);
    currentCards.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, data]);

  if (loading) {
    return (
      <div className="py-24 bg-white text-center text-slate-400 text-xs font-semibold animate-pulse">
        Loading Solutions...
      </div>
    );
  }

  const items = data.items || [];

  return (
    <section className="py-20 sm:py-24 bg-white text-slate-900 overflow-hidden relative">
      <style>{`
        @keyframes whiteFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @keyframes cardRise {
          from { opacity: 0; transform: translateY(36px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }

        .white-card-float {
          animation: whiteFloat 4.5s ease-in-out infinite;
        }

        .solution-card-hidden {
          opacity: 0;
          transform: translateY(36px) scale(0.96);
        }

        .solution-card-visible {
          animation: cardRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .solution-icon-wrap {
          transition: transform 0.4s ease, background-color 0.4s ease;
        }

        .group:hover .solution-icon-wrap {
          transform: scale(1.08) rotate(-3deg);
          background-color: rgb(226 232 240);
        }

        .group:hover .solution-icon-wrap svg {
          animation: iconPulse 1.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .white-card-float,
          .solution-card-visible,
          .solution-icon-wrap,
          .group:hover .solution-icon-wrap svg {
            animation: none;
          }
          .solution-card-hidden {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4 border-b border-slate-200 pb-8">
          {data.tagline && (
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[2px] bg-slate-800" />
              <span className="text-xs font-black text-slate-800 tracking-widest uppercase block">
                {data.tagline}
              </span>
              <span className="w-8 h-[2px] bg-slate-800" />
            </div>
          )}
          {data.title && (
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
              {data.title}
            </h2>
          )}
          {data.description && (
            <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed pt-1">
              {data.description}
            </p>
          )}
        </div>

        {/* 5-COLUMN GRID: each card fits its own content height */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10 items-start">
            {items.map((item, idx) => {
              const iconUrl = item.icon_url || (item.icon && item.icon.startsWith('http') ? item.icon : null);
              const cardId = item.id || idx;
              const isVisible = Boolean(visibleCards[cardId]);

              return (
                <div
                  key={cardId}
                  data-card-id={cardId}
                  ref={(el) => {
                    cardRefs.current[cardId] = el;
                  }}
                  className={`group white-card-float relative bg-white border border-slate-200 rounded-2xl px-4 pt-8 pb-6 flex flex-col items-center justify-start text-center shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-500
                    ${isVisible ? 'solution-card-visible' : 'solution-card-hidden'}
                  `}
                  style={{
                    animationDelay: isVisible ? `${idx * 0.15}s` : '0s'
                  }}
                >
                  {/* ICON CONTAINER FIXED AT TOP */}
                  <div className="flex justify-center items-center w-full mb-5 shrink-0">
                    <div className="solution-icon-wrap w-20 h-20 p-2 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={item.title || 'Solution Icon'}
                          className="w-full h-full object-contain mix-blend-multiply scale-100"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <RenderIcon name={item.icon} />
                      )}
                    </div>
                  </div>

                  {/* TITLE AND DESCRIPTION: sits right under the icon */}
                  <div className="w-full flex flex-col items-center justify-start">
                    {/* FIXED MIN-HEIGHT FOR TITLE ENSURES ALL TITLES ALIGN ON THE SAME BASELINE */}
                    <div className="min-h-[3.25rem] flex items-center justify-center mb-2">
                      <h3 className="text-lg font-bold text-slate-900 text-center leading-snug tracking-tight">
                        {item.title}
                      </h3>
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-500 text-center leading-relaxed font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;