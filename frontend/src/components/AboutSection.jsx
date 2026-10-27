import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomePage } from '../services/api';

const DEFAULT_ABOUT = {
  tagline: 'ESSME',
  title: 'Welcome To Essential Systems & Services',
  description: 'Essential Systems & Services (ESS Middle East) is an ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certified engineering services company based in Doha, Qatar. With over 20 years of expertise in Middle East operations, we provide environmental and instrumentation engineering solutions to the commercial and industrial sectors in the Middle East.',
  secondary_description: '',
  description_line_height: 1.8,
  description_spacing: 16,
  features: [],
  mission_statement: '',
  vision_statement: '',
  cta_text: 'Choose Our Services',
  cta_url: '/about',
  image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  floating_badge_title: '',
  floating_badge_subtitle: ''
};

const AboutSection = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchHomePage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        
        if (payload.about) {
          setAboutData(payload.about);
        } else {
          setAboutData(DEFAULT_ABOUT);
        }
      })
      .catch((err) => {
        console.error('Error fetching about section:', err);
        setAboutData(DEFAULT_ABOUT);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    const currentRef = sectionRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loading]);

  if (loading || !aboutData) return null;

  const hasMission = Boolean(aboutData.mission_statement);
  const hasVision = Boolean(aboutData.vision_statement);
  const featureCount = Array.isArray(aboutData.features) ? aboutData.features.length : 0;

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 md:py-24 text-slate-800 bg-white overflow-hidden">
      <style>{`
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .slide-hidden { opacity: 0; }
        .animate-slide-left { animation: slideInLeft 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-right { animation: slideInRight 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .slide-hidden { opacity: 1; }
          .animate-slide-left, .animate-slide-right { animation: none; }
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">

          {/* LEFT COLUMN — DYNAMIC TEXT FROM ADMIN PANEL */}
          <div
            className={`lg:col-span-7 flex flex-col justify-center order-2 lg:order-1 ${
              isVisible ? 'animate-slide-left' : 'slide-hidden'
            }`}
          >
            <div className="flex flex-col justify-center space-y-5 my-auto py-2">
              
              {/* TAGLINE */}
              {aboutData.tagline && (
                <div className="inline-flex items-center gap-2">
                  <span className="w-5 h-[2px] bg-[#10b981]" />
                  <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-800 uppercase">
                    {aboutData.tagline}
                  </span>
                </div>
              )}

              {/* MAIN TITLE */}
              {aboutData.title && (
                <h2 className="text-2xl sm:text-3xl md:text-2xl font-extrabold uppercase text-slate-900 leading-tight text-left">
                  {aboutData.title}
                </h2>
              )}

              {/* MAIN DESCRIPTION & SECONDARY PARAGRAPHS — JUSTIFIED */}
              {(aboutData.description || aboutData.secondary_description || aboutData.description_html) && (
                <div className="space-y-4 text-slate-700 text-base sm:text-lg font-normal leading-relaxed w-full">
                  {aboutData.description && (
                    <p className="w-full text-justify [text-justify:inter-word] [text-align-last:left] whitespace-pre-line break-words">
                      {aboutData.description.trim()}
                    </p>
                  )}

                  {!aboutData.description && aboutData.description_html && (
                    <p
                      className="w-full text-justify [text-justify:inter-word] [text-align-last:left] whitespace-pre-line break-words"
                      dangerouslySetInnerHTML={{ __html: aboutData.description_html }}
                    />
                  )}

                  {aboutData.secondary_description && (
                    <p className="w-full text-justify [text-justify:inter-word] [text-align-last:left] whitespace-pre-line break-words">
                      {aboutData.secondary_description.trim()}
                    </p>
                  )}
                </div>
              )}

              {/* CALL TO ACTION BUTTON */}
              {(aboutData.cta_url || aboutData.cta_text) && (
                <div className="pt-2 text-left">
                  <Link
                    to={aboutData.cta_url || '/about'}
                    className="inline-flex items-center justify-center bg-[#1E3A8A] hover:bg-[#155CFB] text-white text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-full shadow-md transition-all duration-300"
                  >
                    {aboutData.cta_text || 'Choose Our Services'}
                  </Link>
                </div>
              )}

              {/* DYNAMIC CHECKMARK FEATURES LIST */}
              {featureCount > 0 && (
                <div
                  className={`grid gap-3 pt-3 ${
                    featureCount === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {aboutData.features.map((item, idx) => {
                    const title = typeof item === 'string' ? item : item.title;
                    const subText = typeof item === 'object'
                      ? (item.subtitle || item.description || item.detail || '')
                      : null;

                    return (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{title}</h4>
                          {subText && (
                            <p className="text-[11px] text-slate-500 font-normal text-justify [text-justify:inter-word] [text-align-last:left] whitespace-pre-line">
                              {subText}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MISSION & VISION */}
              {(hasMission || hasVision) && (
                <div
                  className={`grid gap-4 pt-4 border-t border-slate-200 ${
                    hasMission && hasVision ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {hasMission && (
                    <div className="bg-slate-50 p-4 rounded-xl space-y-1.5 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        
                      </div>
                      <p className="text-xs text-slate-600 text-justify [text-justify:inter-word] [text-align-last:left] leading-relaxed">
                        {aboutData.mission_statement.trim()}
                      </p>
                    </div>
                  )}
                  {hasVision && (
                    <div className="bg-slate-50 p-4 rounded-xl space-y-1.5 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Our Vision</h5>
                      </div>
                      <p className="text-xs text-slate-600 text-justify [text-justify:inter-word] [text-align-last:left] leading-relaxed">
                        {aboutData.vision_statement.trim()}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN — CLEAN DYNAMIC IMAGE (OVERLAY BADGES & LOGO REMOVED) */}
          <div
            className={`lg:col-span-5 relative order-1 lg:order-2 flex flex-col justify-center h-full min-h-[350px] ${
              isVisible ? 'animate-slide-right' : 'slide-hidden'
            }`}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-900">
              <img
                src={aboutData.image_url || DEFAULT_ABOUT.image_url}
                alt={aboutData.title || 'About Us'}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_ABOUT.image_url;
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;