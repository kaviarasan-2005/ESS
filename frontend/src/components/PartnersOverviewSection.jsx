import React, { useEffect, useState, useRef } from 'react';
import { fetchPartnersPage } from '../services/api';

const DEFAULT_OVERVIEW = {
  paragraph_1:
    "SS Middle East embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.",
  paragraph_2:
    "We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.",
  image_url:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
};

// Animation timing (ms)
const IMAGE_DELAY = 0;
const CARD_DELAY = 250;
const PARA_2_DELAY = 450;

const PartnersOverviewSection = () => {
  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchPartnersPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.overview) {
          setOverview({
            paragraph_1: payload.overview.paragraph_1 || DEFAULT_OVERVIEW.paragraph_1,
            paragraph_2: payload.overview.paragraph_2 || DEFAULT_OVERVIEW.paragraph_2,
            image_url: payload.overview.image_url || DEFAULT_OVERVIEW.image_url,
          });
        }
      })
      .catch((err) => console.error('Error fetching Partners Overview:', err))
      .finally(() => setLoading(false));
  }, []);

  // Intersection Observer — plays the animation each time the section enters view
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) return null;

  return (
    <section ref={sectionRef} className="pt-16 sm:pt-24 pb-16 sm:pb-20 bg-white text-black relative overflow-hidden">
      {/* ANIMATION KEYFRAMES & TEXT JUSTIFY OPTIMIZATIONS */}
      <style>{`
        @keyframes partnersZoomIn {
          from { opacity: 0; transform: scale(1.08); }
          to   { opacity: 1; transform: scale(1); }
        }

        @keyframes partnersRiseUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes partnersFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .partners-hidden {
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .partners-zoom-in {
          animation: partnersZoomIn 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .partners-rise-up {
          animation: partnersRiseUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .partners-fade-in {
          animation: partnersFadeIn 0.8s ease-out both;
        }

        /* ENSURES PERFECT JUSTIFIED TEXT ON MOBILE WITHOUT AWKWARD SPACING */
        .mobile-text-justify {
          text-align: justify;
          text-justify: inter-word;
          hyphens: auto;
          -webkit-hyphens: auto;
        }

        @media (prefers-reduced-motion: reduce) {
          .partners-zoom-in,
          .partners-rise-up,
          .partners-fade-in {
            animation: none;
          }
          .partners-hidden { opacity: 1; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* TOP - WIDE IMAGE BANNER */}
        <div
          className={`relative rounded-2xl overflow-hidden shadow-xl h-64 sm:h-80 lg:h-96 ${isVisible ? 'partners-zoom-in' : 'partners-hidden'}`}
          style={{ animationDelay: `${IMAGE_DELAY}ms` }}
        >
          <img
            src={overview.image_url || DEFAULT_OVERVIEW.image_url}
            alt="ESS Middle East"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_OVERVIEW.image_url;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b2545]/70 via-transparent to-transparent" />
        </div>

        {/* FLOATING TEXT CARD - OVERLAPS THE IMAGE'S BOTTOM-LEFT EDGE */}
        <div
          className={`relative z-10 -mt-16 sm:-mt-20 ml-0 sm:ml-8 lg:ml-12 max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 ${isVisible ? 'partners-rise-up' : 'partners-hidden'}`}
          style={{ animationDelay: `${CARD_DELAY}ms` }}
        >
          <span className="block w-12 h-1 bg-[#0b2545] rounded-full mb-4" />
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="text-5xl sm:text-6xl font-bold font-sans text-[#0b2545] leading-none tracking-tight shrink-0">
              E
            </span>
            <p className="mobile-text-justify text-black text-sm sm:text-base leading-relaxed pt-1">
              {overview.paragraph_1}
            </p>
          </div>
        </div>

        {/* PARAGRAPH 2 - FULLY JUSTIFIED ON MOBILE WITH PROPER BORDER & PADDING */}
        {overview.paragraph_2 && (
          <div
            className={`mt-10 sm:mt-12 flex justify-end ${isVisible ? 'partners-fade-in' : 'partners-hidden'}`}
            style={{ animationDelay: `${PARA_2_DELAY}ms` }}
          >
            <p className="max-w-2xl mobile-text-justify text-black text-sm sm:text-base leading-relaxed border-l-4 sm:border-l-0 sm:border-r-4 border-[#0b2545] pl-4 sm:pl-0 sm:pr-6">
              {overview.paragraph_2}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default PartnersOverviewSection;