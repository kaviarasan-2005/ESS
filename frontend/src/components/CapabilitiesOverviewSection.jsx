import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCapabilitiesOverview } from '../services/projectsServices';

const AUTOPLAY_MS = 4000;

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

  .ess-media     { animation: ess-fade-up 0.7s ease-out both; }
  .ess-line      { animation: ess-line-grow 0.8s ease-out 0.2s both; transform-origin: top; }
  .ess-para-1    { animation: ess-fade-up 0.7s ease-out 0.35s both; }
  .ess-para-2    { animation: ess-fade-up 0.7s ease-out 0.55s both; }
  .ess-slide     { animation: ess-slide-in 0.5s ease-out both; }

  @media (prefers-reduced-motion: reduce) {
    .ess-media, .ess-line, .ess-para-1, .ess-para-2, .ess-slide {
      animation: none !important;
    }
  }
`;

const DEFAULT_OVERVIEW = {
  paragraph_1:
    "In addition to supplying process instruments, analysers, and sampling systems from internationally recognised manufacturers, ESS Saudi provides in-house engineering and project execution from initial design through installation, testing, and commissioning. We work directly with EPC contractors and end users to deliver instrumentation, process analyser, control system, and safety system projects that meet project-specific technical requirements and applicable engineering and safety standards across Saudi Arabia.",
  paragraph_2:
    "Our in-house capabilities include basic and detailed engineering, panel and system integration, Factory Acceptance Testing and Site Acceptance Testing (FAT/SAT), and installation and commissioning support. This enables ESS Saudi to take full responsibility for the complete project scope from specification and design through to handover, rather than limiting our role to equipment supply alone.",
  images: [],
};

const CACHE_KEY = 'ess_cache_capabilities_overview';
let memCache = null;
try {
  const saved = sessionStorage.getItem(CACHE_KEY);
  if (saved) memCache = JSON.parse(saved);
} catch (e) {}

const CapabilitiesOverviewSection = () => {
  const [data, setData] = useState(() => memCache || DEFAULT_OVERVIEW);
  const [hasFetched, setHasFetched] = useState(() => Boolean(memCache));
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload all gallery images in background for instant slide switches
  useEffect(() => {
    if (!data.images || data.images.length === 0) return;
    data.images.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [data.images]);

  const currentImage = data.images[activeImageIdx] || data.images[0] || '';

  // Check if current image is already cached in browser
  useEffect(() => {
    if (!currentImage) {
      setImageLoaded(false);
      return;
    }
    const img = new Image();
    img.src = currentImage;
    if (img.complete) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true);
    }
  }, [currentImage]);

  useEffect(() => {
    let isMounted = true;

    fetchCapabilitiesOverview()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res || {};

        let galleryImages = Array.isArray(payload.images) && payload.images.length > 0
          ? payload.images
          : [];

        if (galleryImages.length === 0 && (payload.image_url || payload.bg_image_url)) {
          galleryImages = [payload.image_url || payload.bg_image_url];
        }

        const freshData = {
          paragraph_1: payload.paragraph_1 ?? DEFAULT_OVERVIEW.paragraph_1,
          paragraph_2: payload.paragraph_2 ?? DEFAULT_OVERVIEW.paragraph_2,
          images: galleryImages,
        };

        memCache = freshData;
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        } catch (e) {}

        setData((prev) => {
          const isSameImages =
            Array.isArray(prev.images) &&
            Array.isArray(freshData.images) &&
            prev.images.length === freshData.images.length &&
            prev.images.every((img, i) => img === freshData.images[i]);

          if (
            isSameImages &&
            prev.paragraph_1 === freshData.paragraph_1 &&
            prev.paragraph_2 === freshData.paragraph_2
          ) {
            return prev;
          }
          return freshData;
        });
      })
      .catch((err) => console.error('Error fetching Capabilities Overview:', err))
      .finally(() => {
        if (isMounted) setHasFetched(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? data.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === data.images.length - 1 ? 0 : prev + 1));
  };

  // Autoplay restarts on every image change, pauses on hover
  useEffect(() => {
    if (data.images.length <= 1 || isPaused) return undefined;
    const timer = setTimeout(handleNextImage, AUTOPLAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImageIdx, isPaused, data.images.length]);

  return (
    <section className="relative w-full bg-white py-12 font-sans text-slate-800 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">

          {/* LEFT COLUMN: TEXT PARAGRAPHS (sets the row height on large screens) */}
          <div className="flex flex-col justify-center space-y-5 lg:col-span-6">
            {data.paragraph_1 && (
              <p className="text-justify text-base font-normal leading-relaxed text-slate-700 sm:text-lg sm:leading-relaxed">
                {data.paragraph_1}
              </p>
            )}

            {data.paragraph_2 && (
              <p className="text-justify text-base font-normal leading-relaxed text-slate-700 sm:text-lg sm:leading-relaxed">
                {data.paragraph_2}
              </p>
            )}
          </div>

          {/* RIGHT COLUMN: IMAGE CARD (matches left column height on lg+) */}
          <div className="flex lg:col-span-6">
            <div
              className="group relative h-[260px] w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:h-[320px] sm:rounded-3xl lg:h-auto lg:min-h-[320px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {currentImage ? (
                <img
                  key={currentImage}
                  src={currentImage}
                  alt="Capabilities Overview"
                  onLoad={() => setImageLoaded(true)}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : !hasFetched ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-slate-200 mb-2" />
                  <div className="h-3 w-32 rounded bg-slate-200" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  No Image Available
                </div>
              )}

              {/* OVERLAY NAVIGATION ARROWS (if multiple images) */}
              {data.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-slate-700 shadow-md backdrop-blur-xs transition hover:bg-white opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next Image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-slate-700 shadow-md backdrop-blur-xs transition hover:bg-white opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Subtle dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                    {data.images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeImageIdx === idx ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CapabilitiesOverviewSection;