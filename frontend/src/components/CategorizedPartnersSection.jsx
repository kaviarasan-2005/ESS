import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchPartnersPage } from '../services/api';

// Animation timing (ms)
const GROUP_STAGGER = 120;
const CARD_STAGGER = 60;

// Only used for text-only cards (no logo), so they look like the banner cards
const PARTNER_TEXT_CARD_ASPECT = 'aspect-[16/9]';

// Card height follows the image, so there is no top/bottom space
const BASE_CARD_STYLE =
  'bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl sm:hover:shadow-2xl hover:border-blue-300 transition-all duration-300 block w-full self-start group overflow-hidden relative transform hover:-translate-y-1 sm:hover:-translate-y-2';

const CategorizedPartnersSection = () => {
  const [categoryGroups, setCategoryGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchPartnersPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (Array.isArray(payload.category_groups) && payload.category_groups.length > 0) {
          setCategoryGroups(payload.category_groups);
        }
      })
      .catch((err) => console.error('Error fetching Categorized Partners:', err))
      .finally(() => setLoading(false));
  }, []);

  // Intersection Observer — plays the animation each time the section enters view
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return null;

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 lg:py-28 bg-white text-slate-900 relative overflow-hidden">
      {/* ANIMATION KEYFRAMES */}
      <style>{`
        @keyframes partnersGroupFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes partnersCardZoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }

        .partners-hidden {
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .partners-group-fade-up {
          animation: partnersGroupFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .partners-card-zoom-in {
          animation: partnersCardZoomIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .partners-group-fade-up,
          .partners-card-zoom-in {
            animation: none;
          }
          .partners-hidden { opacity: 1; }
        }
      `}</style>

      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 -left-20 w-64 h-64 sm:w-96 sm:h-96 bg-blue-100/50 rounded-full blur-2xl sm:blur-3xl opacity-70" />
        <div className="absolute bottom-10 -right-20 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-100/50 rounded-full blur-2xl sm:blur-3xl opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 space-y-12 sm:space-y-20 lg:space-y-24">
        {categoryGroups.map((group, groupIdx) => {
          if (!group.partners || group.partners.length === 0) return null;

          return (
            <div
              key={group.id || group.category_title}
              className={`space-y-6 sm:space-y-10 ${isVisible ? 'partners-group-fade-up' : 'partners-hidden'}`}
              style={{ animationDelay: `${groupIdx * GROUP_STAGGER}ms` }}
            >

              {/* SECTION HEADER */}
              <div className="flex items-center gap-2.5 sm:gap-4">
                <span className="h-6 sm:h-8 w-1 sm:w-1.5 bg-blue-600 rounded-full shrink-0" />
                <h2 className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 tracking-wider uppercase">
                  {group.category_title}
                </h2>
                <div className="flex-1 h-[1px] bg-slate-200/80" />
              </div>

              {/* RESPONSIVE LOGOS CARD GRID */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                {group.partners.map((partner, partnerIdx) => {
                  const targetPath = partner.link_url ? partner.link_url.trim() : '';
                  const isExternal = targetPath.startsWith('http://') || targetPath.startsWith('https://');

                  const cardInner = (
                    <>
                      {/* TOP LIGHT GLOW EFFECT ON HOVER */}
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />

                      {/* INNER WRAPPER - CARD HEIGHT FOLLOWS THE IMAGE, NO TOP/BOTTOM SPACE */}
                      <div className="w-full z-10 overflow-hidden">
                        {partner.logo_url ? (
                          <img
                            src={partner.logo_url}
                            alt={partner.name || 'Partner Logo'}
                            className="block w-full h-auto group-hover:scale-105 transition-transform duration-300 ease-out"
                          />
                        ) : (
                          // Text-only cards (like Xtralis) keep a banner-like size
                          <div className={`w-full ${PARTNER_TEXT_CARD_ASPECT} flex items-center justify-center`}>
                            <span className="text-sm sm:text-base font-bold text-slate-800 text-center group-hover:text-blue-600 transition-colors line-clamp-2 px-2">
                              {partner.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* HOVER BOTTOM ACCENT LINE */}
                      <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-blue-600 group-hover:w-full transition-all duration-300 z-30" />
                    </>
                  );

                  const animationClass = isVisible ? 'partners-card-zoom-in' : 'partners-hidden';
                  const animationStyle = {
                    animationDelay: `${groupIdx * GROUP_STAGGER + partnerIdx * CARD_STAGGER}ms`
                  };

                  // 1. NO LINK
                  if (!targetPath) {
                    return (
                      <div
                        key={partner.id || partner.name}
                        className={`${BASE_CARD_STYLE} ${animationClass}`}
                        style={animationStyle}
                      >
                        {cardInner}
                      </div>
                    );
                  }

                  // 2. EXTERNAL LINK
                  if (isExternal) {
                    return (
                      <a
                        key={partner.id || partner.name}
                        href={targetPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${BASE_CARD_STYLE} ${animationClass} cursor-pointer`}
                        style={animationStyle}
                        title={`Go to ${partner.name}`}
                      >
                        {cardInner}
                      </a>
                    );
                  }

                  // 3. INTERNAL ROUTE
                  return (
                    <Link
                      key={partner.id || partner.name}
                      to={targetPath}
                      onClick={handleScrollTop}
                      className={`${BASE_CARD_STYLE} ${animationClass} cursor-pointer`}
                      style={animationStyle}
                      title={`Go to ${partner.name}`}
                    >
                      {cardInner}
                    </Link>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorizedPartnersSection;