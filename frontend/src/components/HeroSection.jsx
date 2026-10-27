import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomePage } from '../services/api';

const DEFAULT_SLIDES = [
  {
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
    tagline: 'THE RELIABLE FORCE IN INDUSTRIAL AUTOMATION',
    main_title: 'ESSENTIAL SYSTEMS & SERVICES',
    subtitle: 'ENGEN pioneers world-class precision automation',
    description: 'Industrial manufacturing and plant optimization engineered to accelerate scale throughput and operational safety.',
    primary_btn_text: 'Explore Our Services',
    primary_btn_url: '/services',
    secondary_btn_text: 'Watch Overview',
    secondary_btn_url: '/overview',
    stats: [
      { value: '75+', label: 'YEARS EXPERIENCE' },
      { value: '50K+', label: 'PROJECTS COMPLETED' },
      { value: '98%', label: 'SATISFACTION RATE' }
    ]
  },
  {
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
    tagline: 'TURNKEY PRECISION & EPC SUPPORT',
    main_title: 'ENGINEERING IDEAS. EMPOWERING INDUSTRIES.',
    subtitle: 'High-Tech Heavy Machinery & Integration',
    description: 'Providing world-class engineering capabilities and 24/7 field support.',
    primary_btn_text: 'Read Company Profile',
    primary_btn_url: '/about',
    secondary_btn_text: 'Our Capabilities',
    secondary_btn_url: '/capabilities',
    stats: [
      { value: '24/7', label: 'FIELD SUPPORT' },
      { value: '100%', label: 'COMPLIANCE RATE' }
    ]
  }
];

// Stagger timing parameters
const STAGGER_STEP_MS = 100;
const STAGGER_BASE_MS = 600;

// Autoplay timing
const AUTOPLAY_MS = 6500;

// Background fade + zoom-in settings
const BG_FADE_DURATION_MS = 1000;
const BG_ZOOM_DURATION_MS = AUTOPLAY_MS; // zoom finishes exactly when the next slide starts
const BG_ZOOM_SCALE = 1.12;

const TITLE_FONT_SIZE = 'clamp(1.75rem, 4vw, 3.5rem)';
const TEXT_SHADOW = '0 4px 20px rgba(0,0,0,0.85)';

const HeroSection = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState(0);
  const [direction, setDirection] = useState('next');

  const timerRef = useRef(null);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    fetchHomePage()
      .then((res) => {
        if (!isMounted) return;
        const homePayload = res?.data?.data || res?.data || res || {};
        const heroSection = homePayload.hero || homePayload.hero_section || null;
        if (heroSection) setHeroData(heroSection);
      })
      .catch((err) => console.error('Error fetching dynamic hero section:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const rawSlides = heroData?.slides;
  const slides = Array.isArray(rawSlides) && rawSlides.length > 0 
    ? rawSlides 
    : heroData?.image_url || heroData?.images?.length > 0
    ? [{
        image_url: heroData?.images?.[0] || heroData?.image_url || '',
        tagline: heroData?.tagline || '',
        main_title: heroData?.main_title || heroData?.title || 'ESSENTIAL SYSTEMS & SERVICES',
        subtitle: heroData?.subtitle || '',
        description: heroData?.description || '',
        primary_btn_text: heroData?.primary_btn_text || '',
        primary_btn_url: heroData?.primary_btn_url || '',
        secondary_btn_text: heroData?.secondary_btn_text || '',
        secondary_btn_url: heroData?.secondary_btn_url || '',
        stats: heroData?.stats || []
      }]
    : DEFAULT_SLIDES;

  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.image_url) {
        const img = new Image();
        img.src = slide.image_url;
      }
    });
  }, [slides]);

  // Tracks the previous slide so it stays underneath while the new one fades in
  useLayoutEffect(() => {
    if (lastIndexRef.current !== currentSlideIndex) {
      setPrevSlideIndex(lastIndexRef.current);
      lastIndexRef.current = currentSlideIndex;
    }
  }, [currentSlideIndex]);

  const resetAutoPlayTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setDirection('next');
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    resetAutoPlayTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const handlePrevSlide = () => {
    setDirection('prev');
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    resetAutoPlayTimer();
  };

  const handleNextSlide = () => {
    setDirection('next');
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    resetAutoPlayTimer();
  };

  const handleDotClick = (index) => {
    if (index === currentSlideIndex) return;
    setDirection(index > currentSlideIndex ? 'next' : 'prev');
    setCurrentSlideIndex(index);
    resetAutoPlayTimer();
  };

  if (loading) {
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        <div className="animate-pulse max-w-7xl mx-auto px-6 py-12 w-full flex flex-col justify-center items-center gap-6">
          <div className="h-6 w-40 bg-slate-800/80 rounded-full" />
          <div className="h-14 w-3/4 bg-slate-800/80 rounded-2xl" />
          <div className="h-6 w-1/2 bg-slate-800/80 rounded-lg" />
          <div className="h-20 w-2/3 bg-slate-800/80 rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center bg-slate-950 overflow-hidden text-white select-none">
      {/* Keyframes for background fade + zoom and text entrances */}
      <style>{`
        @keyframes heroZoomIn {
          0% { transform: scale(1); }
          100% { transform: scale(${BG_ZOOM_SCALE}); }
        }
        @keyframes heroBgFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes heroBlurSlideUp {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes heroDotProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .hero-bg-fade {
          animation: heroBgFadeIn ${BG_FADE_DURATION_MS}ms ease-out both;
        }
        .hero-zoom {
          animation: heroZoomIn ${BG_ZOOM_DURATION_MS}ms linear forwards;
        }
        .hero-stagger-item {
          opacity: 0;
          animation: heroBlurSlideUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* 1. BACKGROUND WITH FADE + ZOOM-IN */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          const isPrev = idx === prevSlideIndex && !isActive;
          const bgImg = slide.image_url || DEFAULT_SLIDES[0].image_url;

          // Previous slide stays underneath (at its final zoom) while the new one fades in
          if (isPrev) {
            return (
              <div key={slide.id || `bg-prev-${idx}`} className="absolute inset-0 z-10">
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${bgImg}')`, transform: `scale(${BG_ZOOM_SCALE})` }}
                />
              </div>
            );
          }

          if (!isActive) return null;

          return (
            <div key={slide.id || `bg-active-${idx}`} className="hero-bg-fade absolute inset-0 z-20">
              <div
                className="hero-zoom w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${bgImg}')` }}
              />
            </div>
          );
        })}
      </div>

      {/* 2. GRADIENT VIGNETTE OVERLAY */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t pointer-events-none" />

      {/* 3. NAVIGATION ARROWS */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="hidden md:flex absolute left-6 z-40 h-12 w-12 items-center justify-center rounded-full bg-slate-300/30 hover:scale-110 active:scale-95 transition-all duration-300 top-1/2 -translate-y-1/2 shadow-2xl cursor-pointer group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="hidden md:flex absolute right-6 z-40 h-12 w-12 items-center justify-center rounded-full bg-slate-300/30  hover:scale-110 active:scale-95 transition-all duration-300 top-1/2 -translate-y-1/2 shadow-2xl cursor-pointer group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 4. MAIN CONTENT CONTAINER */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 py-10 w-full flex flex-col justify-between min-h-[85vh]">
        <div className="relative max-w-5xl mx-auto w-full min-h-[460px] my-auto flex flex-col justify-center items-center text-center">
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            const slideStats = (slide.stats && slide.stats.length > 0) ? slide.stats : (idx === 0 ? heroData?.stats : []);

            let staggerIndex = 0;
            const nextDelay = () => `${STAGGER_BASE_MS + staggerIndex++ * STAGGER_STEP_MS}ms`;

            return (
              <div
                key={slide.id || `content-slide-${idx}`}
                className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'opacity-100 translate-x-0 relative z-20 pointer-events-auto'
                    : `opacity-0 ${direction === 'next' ? '-translate-x-16' : 'translate-x-16'} absolute inset-0 z-0 pointer-events-none`
                } space-y-6 flex flex-col items-center`}
              >
                {/* TAGLINE */}
                {slide.tagline && (
                  <div
                    className="hero-stagger-item inline-flex items-center gap-2 px-4 py-1.5 bg-blue-950/50 border border-blue-400/30 rounded-full backdrop-blur-md shadow-lg"
                    style={isActive ? { animationDelay: nextDelay() } : undefined}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[11px] font-bold tracking-[0.2em] text-blue-200 uppercase">
                      {slide.tagline}
                    </span>
                  </div>
                )}

                {/* MAIN TITLE */}
                <h1
                  className="hero-stagger-item md:whitespace-nowrap font-black tracking-tight leading-none text-white drop-shadow-2xl"
                  style={{
                    fontSize: TITLE_FONT_SIZE,
                    textShadow: TEXT_SHADOW,
                    ...(isActive ? { animationDelay: nextDelay() } : {})
                  }}
                >
                  {slide.main_title || slide.title || 'ESSENTIAL SYSTEMS & SERVICES'}
                </h1>

                {/* SUBTITLE */}
                {slide.subtitle && (
                  <p
                    className="hero-stagger-item text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-white font-bold text-lg sm:text-xl max-w-3xl"
                    style={isActive ? { animationDelay: nextDelay() } : undefined}
                  >
                    {slide.subtitle}
                  </p>
                )}

                {/* DESCRIPTION */}
                {slide.description && (
                  <p
                    className="hero-stagger-item text-slate-200 text-sm sm:text-base leading-relaxed font-normal max-w-2xl drop-shadow-md"
                    style={isActive ? { animationDelay: nextDelay() } : undefined}
                  >
                    {slide.description}
                  </p>
                )}

                {/* ACTION BUTTONS */}
                <div
                  className="hero-stagger-item flex flex-wrap items-center justify-center gap-4 pt-4"
                  style={isActive ? { animationDelay: nextDelay() } : undefined}
                >
                  {slide.primary_btn_text && (
                    slide.primary_btn_url?.startsWith('http') ? (
                      <a
                        href={slide.primary_btn_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                      >
                        {slide.primary_btn_text}
                      </a>
                    ) : (
                      <Link
                        to={slide.primary_btn_url || '/services'}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                      >
                        {slide.primary_btn_text}
                      </Link>
                    )
                  )}

                  {slide.secondary_btn_text && (
                    <Link
                      to={slide.secondary_btn_url || '/contact'}
                      className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-white font-bold text-xs sm:text-sm px-7 py-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] pl-0.5 shadow-md">
                        &#9654;
                      </div>
                      <span>{slide.secondary_btn_text}</span>
                    </Link>
                  )}
                </div>

                {/* STATS COUNTERS */}
                {slideStats && slideStats.length > 0 && (
                  <div
                    className="hero-stagger-item grid grid-cols-3 gap-6 pt-8 border-t border-white/15 max-w-3xl w-full mt-8 text-center"
                    style={isActive ? { animationDelay: nextDelay() } : undefined}
                  >
                    {slideStats.map((stat, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <p className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-lg">
                          {stat.value}
                        </p>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-300 tracking-wider uppercase">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* INDICATOR DOTS WITH PROGRESS */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6 relative z-30">
            {slides.map((_, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`relative h-2 rounded-full overflow-hidden transition-all duration-500 cursor-pointer ${
                    isActive ? 'w-12 bg-slate-800' : 'w-2 bg-slate-700/80 hover:bg-slate-500'
                  }`}
                >
                  {isActive && (
                    <span
                      key={currentSlideIndex}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ animation: `heroDotProgress ${AUTOPLAY_MS}ms linear forwards` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;