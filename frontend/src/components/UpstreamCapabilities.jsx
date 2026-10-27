import React, { useState, useEffect, useRef } from 'react';
import { fetchUpstreamInstrumentationCapabilities } from '../services/api';

const ITEM_BASE = "transition-all duration-700 ease-out motion-reduce:transition-none";
const FADE_IN = "translate-y-0 opacity-100";
const FADE_HIDDEN = "translate-y-6 opacity-0";
const STAGGER_MS = 100;
const VISIBLE_THRESHOLD = 0.15;

// Section spacing: tighter on phones, roomy on desktop
const INDUSTRIES_SECTION = "px-4 py-10 sm:px-6 md:px-12 md:py-14 lg:px-20";
const WHY_SECTION = "px-4 py-12 sm:px-6 md:px-12 md:py-20 lg:px-20";

// Headings: centered on mobile, title goes left on desktop
const INDUSTRIES_HEADING = "text-center text-2xl sm:text-3xl md:text-left md:text-4xl";
const WHY_HEADING = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
const PILL_TEXT = "text-xs sm:text-sm md:text-base";

// Justified on every screen size, no hyphenation.
const PARAGRAPH_TEXT =
  "w-full text-sm sm:text-base md:text-lg text-justify [hyphens:none] [word-break:normal] [overflow-wrap:break-word]";

const INDUSTRIES_GRID = "grid items-center gap-6 md:grid-cols-[1fr_2fr] md:gap-12";
const PILLS_WRAP =
  "flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:justify-start md:gap-4";

const PILL_CLASS =
  "break-words rounded-full border border-slate-300 bg-white px-4 py-2 text-center font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:border-sky-600 hover:text-sky-700 hover:shadow-md active:scale-95 sm:px-6 sm:py-2.5";

const UpstreamCapabilities = () => {
  const [data, setData] = useState({
    industries_title: 'Industries served',
    industries_list: ['Oil & Gas (Upstream & Midstream)'],
    why_title: 'Why ESS Saudi',
    why_description:
      "ESS Saudi supplies internationally proven water cut and upstream measurement technologies as a distributor and channel partner, and offers in-Kingdom technical support and service capability aligned with Saudi Aramco's localization objectives.",
  });

  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    loadCapabilitiesData();
  }, []);

  // Trigger reveal animation when section enters viewport
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_THRESHOLD }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const loadCapabilitiesData = async () => {
    try {
      setLoading(true);
      const res = await fetchUpstreamInstrumentationCapabilities();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Upstream Instrumentation capabilities section:', err);
    } finally {
      setLoading(false);
    }
  };

  const reveal = isVisible ? FADE_IN : FADE_HIDDEN;

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-white text-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading capabilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="w-full overflow-hidden bg-white font-sans text-black">
      {/* TOP SECTION: INDUSTRIES SERVED (title left, pills right on desktop) */}
      <section
        className={`w-full border-b border-slate-200 bg-gray-200 ${INDUSTRIES_SECTION}`}
      >
        <div className={`mx-auto max-w-6xl ${INDUSTRIES_GRID}`}>
          {/* Title */}
          <h2
            className={`font-extrabold tracking-tight text-black ${INDUSTRIES_HEADING} ${ITEM_BASE} ${reveal}`}
          >
            {data.industries_title}
          </h2>

          {/* Pills */}
          <div className={PILLS_WRAP}>
            {data.industries_list &&
              data.industries_list.map((industry, idx) => (
                // Outer div handles the reveal + stagger, inner pill handles hover
                <div
                  key={idx}
                  style={{ transitionDelay: `${(idx + 1) * STAGGER_MS}ms` }}
                  className={`max-w-full ${ITEM_BASE} ${reveal}`}
                >
                  <div className={`${PILL_CLASS} ${PILL_TEXT}`}>{industry}</div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION: WHY ESS SAUDI (centered heading, justified paragraph) */}
      <section className={`w-full bg-white text-center ${WHY_SECTION}`}>
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-4 md:space-y-6">
          <h2
            style={{ transitionDelay: `${STAGGER_MS}ms` }}
            className={`font-extrabold tracking-tight text-black ${WHY_HEADING} ${ITEM_BASE} ${reveal}`}
          >
            {data.why_title}
          </h2>
          <p
            style={{ transitionDelay: `${STAGGER_MS * 3}ms` }}
            className={`leading-relaxed text-slate-800 md:leading-loose ${PARAGRAPH_TEXT} ${ITEM_BASE} ${reveal}`}
          >
            {data.why_description}
          </p>
        </div>
      </section>
    </div>
  );
};

export default UpstreamCapabilities;