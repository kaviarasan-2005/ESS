import React, { useState, useEffect } from 'react';
import { fetchUpstreamInstrumentationOverview } from '../services/api';

const PARAGRAPH_CLASS =
  'text-justify [text-justify:inter-word] [hyphens:none] [text-align-last:left]';

const PARAGRAPH_TEXT_SIZE = 'text-base md:text-lg';

const NAV_BUTTON_CLASS =
  'absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-sky-600 hover:bg-white hover:text-sky-700 focus:outline-none active:scale-95';

// Right panel wrapper (extra left padding keeps content clear of the slanted edge)
const GRAY_PANEL_CLASS =
  'relative flex flex-1 flex-col items-center justify-center self-stretch p-8 lg:p-10 lg:pl-28';

// Single slanted edge: top starts further right, bottom starts at the left
const EDGE_CLIP = 'lg:[clip-path:polygon(120px_0,100%_0,100%_100%,0_100%)]';

// Slide animation (SLIDE_MS must match SLIDE_DURATION)
const SLIDE_DURATION = 'duration-500';
const SLIDE_MS = 500;

// Auto-scroll interval (milliseconds)
const AUTO_SLIDE_MS = 5000;

// Single gray panel background layer
const PanelBackground = () => (
  <div
    className={`pointer-events-none absolute inset-y-0 left-0 right-0 bg-slate-100 lg:-right-[50vw] ${EDGE_CLIP}`}
  />
);

const UpstreamOverview = () => {
  const [data, setData] = useState({
    paragraph_1:
      'Accurate water cut measurement is essential to production allocation, well testing, and fiscal metering across upstream and midstream operations. ESS Saudi supplies water cut meters and related upstream instrumentation from internationally reputed manufacturers, engineered for the wide range of flow, viscosity, and salinity conditions found in Saudi oilfield production.',
    paragraph_2:
      "Our upstream instrumentation portfolio supports well testing, production allocation metering, and fiscal metering applications, and is aligned with Saudi Aramco's In-Kingdom Total Value Add (IKTVA) localization program.",
    carousel_images: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  // Turned off briefly when snapping from the cloned slide back to the real first slide
  const [withTransition, setWithTransition] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const totalSlides = data.carousel_images?.length || 0;

  // Auto-scroll every 5 seconds (always moves forward; restarts on manual clicks)
  useEffect(() => {
    if (totalSlides <= 1) return;
    if (activeSlide >= totalSlides) return; // waiting to snap back to first

    const timer = setTimeout(() => {
      setActiveSlide((prev) => prev + 1);
    }, AUTO_SLIDE_MS);

    return () => clearTimeout(timer);
  }, [activeSlide, totalSlides]);

  // When the cloned first slide is reached, jump back to the real first slide without animation
  useEffect(() => {
    if (totalSlides <= 1 || activeSlide !== totalSlides) return;

    const snapTimer = setTimeout(() => {
      setWithTransition(false);
      setActiveSlide(0);
    }, SLIDE_MS);

    return () => clearTimeout(snapTimer);
  }, [activeSlide, totalSlides]);

  // Re-enable the slide animation right after the silent snap
  useEffect(() => {
    if (withTransition) return;

    let innerId;
    const outerId = requestAnimationFrame(() => {
      innerId = requestAnimationFrame(() => setWithTransition(true));
    });

    return () => {
      cancelAnimationFrame(outerId);
      if (innerId) cancelAnimationFrame(innerId);
    };
  }, [withTransition]);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetchUpstreamInstrumentationOverview();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Upstream Instrumentation overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const slides = data.carousel_images || [];

  // Real index (the cloned slide counts as the first image)
  const activeIndex = slides.length > 0 ? activeSlide % slides.length : 0;

  // Track slides: with 2+ images, a copy of the first slide is added at the end for the seamless loop.
  // Always has at least one slide so the placeholder can show.
  const trackSlides =
    slides.length > 1 ? [...slides, slides[0]] : slides.length > 0 ? slides : [{}];

  const handlePrev = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev >= slides.length ? prev : prev + 1));
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-white text-slate-700">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-600 border-r-transparent"></div>
          <p className="mt-2 text-xs font-semibold">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-white font-sans text-slate-700">
      <div className="mx-auto flex min-h-[500px] w-full max-w-7xl flex-col lg:flex-row">

        {/* LEFT COLUMN: TEXT CONTENT */}
        <div className="flex flex-1 items-center p-6 md:p-10 lg:py-14 lg:pr-14">
          <div className="flex w-full gap-6">

            {/* Thin accent line */}
            <div className="hidden w-[3px] shrink-0 bg-sky-700 sm:block" />

            <div
              lang="en"
              className={`space-y-5 leading-relaxed text-slate-600 md:leading-[1.8] ${PARAGRAPH_TEXT_SIZE}`}
            >
              {data.paragraph_1 && (
                <p className={PARAGRAPH_CLASS}>{data.paragraph_1}</p>
              )}
              {data.paragraph_2 && (
                <p className={PARAGRAPH_CLASS}>{data.paragraph_2}</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SLANTED GRAY PANEL + SLIDING IMAGE */}
        <div className={GRAY_PANEL_CLASS}>

          <PanelBackground />

          {/* IMAGE STAGE (no z-index here, so the image can blend into the gray panel) */}
          <div className="relative h-72 w-full max-w-lg md:h-96">

            {/* LEFT NAVIGATION ARROW */}
            {slides.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                // className={`${NAV_BUTTON_CLASS} -left-5`}
                aria-label="Previous Slide"
              >
                {/* <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg> */}
              </button>
            )}

            {/* SLIDING VIEWPORT */}
            <div className="h-full w-full overflow-hidden">
              <div
                className={`relative flex h-full ease-in-out motion-reduce:transition-none ${
                  withTransition ? `transition-[left] ${SLIDE_DURATION}` : 'transition-none'
                }`}
                style={{ left: `-${activeSlide * 100}%` }}
              >
                {trackSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="flex h-full w-full shrink-0 items-center justify-center p-2"
                  >
                    {slide.image_url ? (
                      <img
                        src={slide.image_url}
                        alt={slide.title || 'Water Cut Meter Equipment'}
                        className="max-h-[95%] max-w-[95%] object-contain mix-blend-multiply transition-all duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <span className="text-5xl">💧</span>
                        <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
                          Water Cut Meter Image
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT NAVIGATION ARROW */}
            {slides.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                // className={`${NAV_BUTTON_CLASS} -right-5`}
                aria-label="Next Slide"
              >
                {/* <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg> */}
              </button>
            )}
          </div>

          {/* THUMBNAILS */}
          {slides.length > 1 && (
            <div className="relative mt-8 flex items-center justify-center gap-6">
              {slides.map((slide, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    className="group flex cursor-pointer flex-col items-center gap-2 focus:outline-none"
                  >
                    <span
                      className={`block h-14 w-14 overflow-hidden rounded-md border bg-white/40 p-1 backdrop-blur-sm transition-all duration-300 ${
                        isActive
                          ? 'scale-110 border-sky-600 opacity-100 shadow-sm'
                          : 'border-transparent opacity-50 group-hover:scale-105 group-hover:opacity-100'
                      }`}
                    >
                      {slide.image_url ? (
                        <img
                          src={slide.image_url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                      )}
                    </span>
                    {/* Active Indicator */}
                    <span
                      className={`h-[3px] rounded-full bg-sky-700 transition-all duration-300 ${
                        isActive ? 'w-8 opacity-100' : 'w-0 opacity-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default UpstreamOverview;