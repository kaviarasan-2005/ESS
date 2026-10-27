import React, { useState, useEffect, useRef } from 'react';
import { fetchAnalyzerSystemsApplications } from '../services/SystemsSolutions';

const STAGGER_MS = 120;
const VISIBLE_THRESHOLD = 0.2;

// Keyframes live here so no tailwind.config change is needed.
// Animations are switched off for users who prefer reduced motion.
const ANIMATION_CSS = `
  @keyframes apps-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes apps-line-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .apps-title { animation: apps-fade-up 0.7s ease-out both; }
  .apps-line  { animation: apps-line-grow 0.7s ease-out 0.3s both; transform-origin: center; }
  .apps-item  { animation: apps-fade-up 0.6s ease-out both; }

  @media (prefers-reduced-motion: reduce) {
    .apps-title, .apps-line, .apps-item {
      animation: none !important;
      opacity: 1 !important;
    }
  }
`;

const AnalyzerSystemsApps = () => {
  const [data, setData] = useState({
    title: 'Key Applications',
    applications_list: [
      'Housing and protection for gas chromatographs and process analyzers',
      'Hazardous-area compliant analyzer shelters (purged/pressurized enclosures)',
      'Centralized analyzer houses for tank farms, terminals, and process units',
      'Climate control for temperature-sensitive analytical equipment',
      'Skid-mounted analyzer systems for modular and brownfield projects',
    ],
  });

  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    loadApplicationsData();
  }, []);

  const loadApplicationsData = async () => {
    try {
      setLoading(true);
      const res = await fetchAnalyzerSystemsApplications();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Analyzer Systems applications section:', err);
    } finally {
      setLoading(false);
    }
  };

  // Play the animation when the section scrolls into view (once)
  useEffect(() => {
    if (loading) return undefined;
    const node = sectionRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_THRESHOLD }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="flex h-48 w-full items-center justify-center bg-white text-slate-700">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#1b439b] border-r-transparent"></div>
          <p className="mt-2 animate-pulse text-xs font-semibold">Loading applications...</p>
        </div>
      </div>
    );
  }

  const items = data.applications_list || [];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-6 py-16 font-sans text-slate-800 md:px-12 lg:px-20"
    >
      <style>{ANIMATION_CSS}</style>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* CENTERED TITLE */}
        <div className="text-center">
          <h2
            className={`text-4xl font-extrabold tracking-tight text-[#0a192f] md:text-5xl lg:text-6xl ${
              isVisible ? 'apps-title' : 'opacity-0'
            }`}
          >
            {data.title}
          </h2>
          <span
            className={`mx-auto mt-4 block h-1 w-20 rounded-full bg-[#1b439b] ${
              isVisible ? 'apps-line' : 'scale-x-0'
            }`}
          />
        </div>

        {/* TWO-COLUMN LIST GRID */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#1b439b]/30 hover:bg-white hover:shadow-lg ${
                isVisible ? 'apps-item' : 'opacity-0'
              }`}
              style={{ animationDelay: `${400 + idx * STAGGER_MS}ms` }}
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1b439b] text-white">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M4 10.5l4 4 8-9" />
                </svg>
              </span>
              <p className="text-base font-medium leading-relaxed text-slate-700 md:text-lg">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalyzerSystemsApps;