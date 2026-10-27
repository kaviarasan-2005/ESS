import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchAboutPage } from '../services/api';

const DEFAULT_DIVISIONS_DATA = {
  title: "To deliver comprehensive, end-to-end service, ESS Middle East is structured into specialized divisions:",
  image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  divisions: [
    { id: "div-1", title: "Fire & Gas Systems", link_url: "/services/fire-and-gas-systems" },
    { id: "div-2", title: "Analytical Instrumentation", link_url: "/services/analytical-instrumentation" },
    { id: "div-3", title: "Analyzer System Integration", link_url: "/analyzer-integration" },
    { id: "div-4", title: "Industrial Automation", link_url: "/industrial-automation" },
    { id: "div-5", title: "Process Division", link_url: "/process-division" }
  ],
  description_1: "This focused approach ensures expert-level knowledge and tailored solutions for every facet of your operation.",
  description_2: "We invest relentlessly in our people and infrastructure. Our engineers receive advanced, factory-level training in Europe and the USA directly from our global Original Equipment Manufacturer (OEM) partners. This ensures that our technical support is backed by hands-on, product-specific expertise which will effectively address the practical challenges of clients.",
  cta_text: "Start a Conversation",
  cta_url: "/contact"
};

// Animation timing (ms)
const BANNER_TEXT_DELAY = 200;
const CARD_START_DELAY = 250;
const CARD_STAGGER = 120;
const BOTTOM_EXTRA_DELAY = 150;

// Helper function to dynamically generate route paths if link_url is not set in backend
const getDivisionRoute = (item) => {
  if (item.link_url && item.link_url.trim() !== '') return item.link_url;

  const slug = (item.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return `/services/${slug}`;
};

const SpecializedDivisionsSection = () => {
  const [data, setData] = useState(DEFAULT_DIVISIONS_DATA);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchAboutPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.specialized_divisions) {
          const sec = payload.specialized_divisions;
          setData({
            title: sec.title || DEFAULT_DIVISIONS_DATA.title,
            image_url: sec.image_url || DEFAULT_DIVISIONS_DATA.image_url,
            divisions: Array.isArray(sec.divisions) && sec.divisions.length > 0
              ? sec.divisions
              : DEFAULT_DIVISIONS_DATA.divisions,
            description_1: sec.description_1 || DEFAULT_DIVISIONS_DATA.description_1,
            description_2: sec.description_2 || DEFAULT_DIVISIONS_DATA.description_2,
            cta_text: sec.cta_text || DEFAULT_DIVISIONS_DATA.cta_text,
            cta_url: sec.cta_url || DEFAULT_DIVISIONS_DATA.cta_url
          });
        }
      })
      .catch((err) => console.error('Error loading Specialized Divisions:', err))
      .finally(() => setLoading(false));
  }, []);

  // Intersection Observer — re-evaluates whenever loading OR data changes
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
  }, [loading, data]);

  if (loading) return null;

  // Filter out empty division titles
  const visibleDivisions = data.divisions.filter((item) => item.title && item.title.trim());
  const cardsEndDelay = CARD_START_DELAY + visibleDivisions.length * CARD_STAGGER;

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-slate-100 bg-white pb-16 text-slate-900 sm:pb-24">

      {/* SCROLL ANIMATION KEYFRAMES */}
      <style>{`
        @keyframes divSlideFromLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes divSlideFromRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes divFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes divZoomIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes divImageZoomOut {
          from { transform: scale(1.2); }
          to   { transform: scale(1); }
        }

        .div-slide-left {
          animation: divSlideFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .div-slide-right {
          animation: divSlideFromRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .div-fade-up {
          animation: divFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .div-zoom-in {
          animation: divZoomIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .div-image-zoom {
          animation: divImageZoomOut 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .div-slide-left,
          .div-slide-right,
          .div-fade-up,
          .div-zoom-in,
          .div-image-zoom {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* TOP BANNER */}
      <div className="relative min-h-[340px] overflow-hidden sm:min-h-[440px]">
        <img
          src={data.image_url}
          alt="Specialized Divisions"
          className={`absolute inset-0 h-full w-full object-cover ${isVisible ? 'div-image-zoom' : 'opacity-90'}`}
          onError={(e) => {
            e.target.src = DEFAULT_DIVISIONS_DATA.image_url;
          }}
        />
        <div className="absolute inset-0 bg-[#03203c]/80" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-5 pt-12 pb-32 sm:gap-5 sm:px-6 sm:pt-20 sm:pb-36 lg:px-10">
          <span
            // className={`block h-1 w-14 rounded-full bg-blue-600 ${isVisible ? 'div-slide-left' : 'opacity-100'}`}
            style={{ animationDelay: `${BANNER_TEXT_DELAY}ms` }}
          />
          {data.title && (
            <h2
              className={`max-w-3xl text-xl font-black leading-snug text-white sm:text-3xl lg:text-4xl ${isVisible ? 'div-fade-up' : 'opacity-100'}`}
              style={{ animationDelay: `${BANNER_TEXT_DELAY + 100}ms` }}
            >
              {data.title}
            </h2>
          )}
        </div>
      </div>

      {/* FLOATING PANEL - DIVISION CARDS */}
      <div className="relative z-10 mx-auto -mt-24 max-w-7xl px-5 sm:-mt-28 sm:px-6 lg:px-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-8">
          {visibleDivisions.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {visibleDivisions.map((item, idx) => {
                const targetPath = getDivisionRoute(item);

                return (
                  <div
                    key={item.id || `div-${idx}-${item.title}`}
                    className={isVisible ? 'div-zoom-in' : 'opacity-100'}
                    style={{ animationDelay: `${CARD_START_DELAY + idx * CARD_STAGGER}ms` }}
                  >
                    <Link
                      to={targetPath}
                      className="group flex min-h-[80px] h-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-600 hover:bg-white hover:shadow-xl sm:min-h-[110px] sm:gap-4 sm:p-6"
                    >
                      <span className="min-w-0 text-sm font-bold leading-snug text-slate-800 break-words transition-colors duration-300 group-hover:text-blue-600 sm:text-base">
                        {item.title}
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 text-blue-600 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white sm:h-9 sm:w-9">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="mx-auto mt-10 max-w-7xl px-5 sm:mt-20 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-12 lg:gap-16">

          {/* LEAD STATEMENT */}
          {data.description_1 && (
            <div
              className={`border-l-4 border-blue-600 pl-4 sm:pl-6 lg:col-span-7 ${isVisible ? 'div-slide-left' : 'opacity-100'}`}
              style={{ animationDelay: `${cardsEndDelay}ms` }}
            >
              <p className="text-lg font-black leading-snug text-slate-900 break-words [text-align-last:left] [text-justify:inter-word] sm:text-2xl lg:text-3xl">
                {data.description_1}
              </p>
            </div>
          )}

          {/* DETAIL TEXT + CTA */}
          <div
            className={`space-y-6 lg:col-span-5 ${isVisible ? 'div-slide-right' : 'opacity-100'}`}
            style={{ animationDelay: `${cardsEndDelay + BOTTOM_EXTRA_DELAY}ms` }}
          >
            {data.description_2 && (
              <p className="w-full text-[15px] leading-relaxed text-justify break-words whitespace-pre-line [text-align-last:left] [text-justify:inter-word] sm:text-base">
                {data.description_2}
              </p>
            )}

            {(data.cta_text || data.cta_url) && (
              <Link
                to={data.cta_url || '/contact'}
                className="block w-full rounded-xl bg-[#1E3A8A] px-7 py-3.5 text-center text-xs font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#155CFB] hover:shadow-lg sm:inline-block sm:w-auto"
              >
                {data.cta_text || 'Start a Conversation'}
              </Link>
            )}
          </div>

        </div>
      </div>

    </section>
  );
};

export default SpecializedDivisionsSection;