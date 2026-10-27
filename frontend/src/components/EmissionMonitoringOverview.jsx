import React, { useState, useEffect } from 'react';
import { fetchEmissionMonitoringOverview } from '../services/SystemsSolutions';

const AUTOPLAY_MS = 5000;

// Keyframes live here so no tailwind.config change is needed.
// Everything is switched off for users who prefer reduced motion.
const ANIMATION_CSS = `
  @keyframes ess-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ess-slide-in {
    from { opacity: 0; transform: scale(0.96) translateX(16px); }
    to   { opacity: 1; transform: scale(1) translateX(0); }
  }
  @keyframes ess-line-grow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes ess-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }

  .ess-media     { animation: ess-fade-up 0.7s ease-out both; }
  .ess-line      { animation: ess-line-grow 0.8s ease-out 0.2s both; transform-origin: top; }
  .ess-para-1    { animation: ess-fade-up 0.7s ease-out 0.35s both; }
  .ess-para-2    { animation: ess-fade-up 0.7s ease-out 0.55s both; }
  .ess-slide     { animation: ess-slide-in 0.5s ease-out both; }
  .ess-float     { animation: ess-float 3s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .ess-media, .ess-line, .ess-para-1, .ess-para-2,
    .ess-slide, .ess-float {
      animation: none !important;
    }
  }
`;

const EmissionMonitoringOverview = () => {
  const [data, setData] = useState({
    paragraph_1:
      'Environmental compliance and regulatory reporting depend on accurate, continuous emissions and air quality data. ESS supplies emission monitoring systems, including Continuous Emissions Monitoring Systems (CEMS) and Ambient Air Quality Monitoring Systems (AQMS), from internationally reputed manufacturers, engineered to meet recognized environmental monitoring and reporting standards.',
    paragraph_2:
      'Our scope covers stack-mounted CEMS analyzer packages, ambient air quality monitoring stations, data acquisition and reporting systems, and integration support for regulatory compliance submissions.',
    carousel_images: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchEmissionMonitoringOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Emission Monitoring overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const slides = data.carousel_images || [];

  const handlePrev = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Autoplay: restarts on every slide change (manual or auto), pauses on hover
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return undefined;
    const timer = setTimeout(handleNext, AUTOPLAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide, isPaused, slides.length]);

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-[#f8fafc] text-slate-700">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1b439b] border-r-transparent"></div>
          <p className="mt-2 animate-pulse text-xs font-semibold">Loading overview...</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[activeSlide] || null;

  return (
    <section
      lang="en"
      className="w-full overflow-hidden bg-[#f8fafc] px-6 py-16 font-sans text-slate-800 md:px-12 lg:px-20"
    >
      <style>{ANIMATION_CSS}</style>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

          {/* LEFT COLUMN: CLEAN MEDIA VIEWER */}
          <div className="ess-media lg:col-span-6">
            <div
              className="relative group overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            >

              {/* IMAGE FRAME WITH CONSTANT ASPECT RATIO */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                {currentSlide && currentSlide.image_url ? (
                  <img
                    // key forces a remount so the entrance animation replays on each slide
                    key={activeSlide}
                    src={currentSlide.image_url}
                    alt={currentSlide.title || 'Emission Monitoring System Equipment'}
                    // object-cover fills the whole frame (no side gaps), centered
                    className="ess-slide h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="ess-float rounded-full bg-slate-100 p-4">
                      <span className="text-4xl">🌱</span>
                    </div>
                    <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Emission Monitoring Image
                    </span>
                  </div>
                )}

                {/* OVERLAY NAVIGATION ARROWS */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      aria-label="Previous Slide"
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-[#1b439b] hover:text-white hover:scale-110 active:scale-95 md:opacity-0 md:group-hover:opacity-100"
                    >
                      ❮
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next Slide"
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-[#1b439b] hover:text-white hover:scale-110 active:scale-95 md:opacity-0 md:group-hover:opacity-100"
                    >
                      ❯
                    </button>
                  </>
                )}

              </div>

              {/* SLIDE THUMBNAILS / INDICATORS */}
              {slides.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id || idx}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`group relative overflow-hidden rounded-lg transition-all duration-500 ease-out ${
                        activeSlide === idx
                          ? 'h-10 w-14 ring-2 ring-[#1b439b] ring-offset-1'
                          : 'h-10 w-10 opacity-60 hover:-translate-y-0.5 hover:opacity-100'
                      }`}
                    >
                      {slide.image_url ? (
                        <img
                          src={slide.image_url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] font-bold text-slate-500">
                          #{idx + 1}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN: CONTENT */}
          <div className="relative space-y-6 pl-6 md:pl-8 lg:col-span-6">
            {/* Accent line grows down on load (replaces the static border-l-4) */}
            <span className="ess-line absolute left-0 top-0 h-full w-1 rounded-full bg-[#1b439b]" />

            {data.paragraph_1 && (
              <p className="ess-para-1 text-justify text-sm leading-relaxed text-slate-700 md:text-lg md:leading-loose">
                {data.paragraph_1}
              </p>
            )}
            {data.paragraph_2 && (
              <p className="ess-para-2 text-justify text-sm leading-relaxed text-slate-700 md:text-lg md:leading-loose">
                {data.paragraph_2}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default EmissionMonitoringOverview;