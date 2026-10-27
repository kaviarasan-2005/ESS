import React, { useEffect, useState } from 'react';
import { fetchAboutStory } from '../services/aboutService';

const DEFAULT_STORY = {
  tagline: '',
  title: 'Our Story: Two Decades of Trusted Partnership',
  paragraph_1:
    "For over two decades, Essential Systems & Services (ESS Saudi) has been a cornerstone of the region's industrial landscape. Managed by a team of technically qualified professionals, we bring deep-seated expertise to the Oil & Gas, Marine, and Industrial sectors across the Middle East. Our local presence in the region has given us an in-depth understanding of the unique operational challenges and opportunities within the GCC enabling us to address them efficiently using our experience and resources.",
  paragraph_2:
    "Our strength is further amplified by our strategic association with regional industry leaders. This partnership provides us with significant stability, resources, and a shared commitment to excellence, drawing from vast experience in industrial gases, electro-mechanical projects, steel fabrication, and oil field services.",
  paragraph_3:
    "This robust combination has earned us the trust of the region's most critical industries. Our distinguished client base includes major Onshore and Offshore Oil & Gas companies, leading Petrochemical producers, Power Generation plants, and Water and Waste Water Treatment operators.",
};

// Module-level memory cache for 0ms instant loading on page navigation
let cachedStoryData = null;

const OurStorySection = () => {
  // Initialize state instantly from memory cache if available, or fall back to default
  const [story, setStory] = useState(() => cachedStoryData || DEFAULT_STORY);

  useEffect(() => {
    let isMounted = true;

    // Direct section fetch from /api/about/story
    fetchAboutStory()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data || res || {};

        const freshStory = {
          tagline: payload.tagline || DEFAULT_STORY.tagline,
          title: payload.title || DEFAULT_STORY.title,
          paragraph_1: payload.paragraph_1 || DEFAULT_STORY.paragraph_1,
          paragraph_2: payload.paragraph_2 || DEFAULT_STORY.paragraph_2,
          paragraph_3: payload.paragraph_3 || DEFAULT_STORY.paragraph_3,
        };

        // Sync local state & module-level cache
        cachedStoryData = freshStory;
        setStory(freshStory);
      })
      .catch((err) => console.error('Error loading Our Story content:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 text-slate-900 sm:px-6 sm:py-20">
      {/* Soft Light Grid Accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] opacity-40 [background-size:24px_24px]" />

      {/* Frosted gray panel: blurred background with gray tint behind the content */}
      <div className="relative z-10 mx-auto max-w-5xl space-y-10 rounded-3xl border border-slate-200/80 bg-slate-50/70 px-6 py-10 text-center shadow-xl backdrop-blur-md sm:px-12 sm:py-14">
        {/* Tagline with Accent Lines */}
        {story.tagline && (
          <div className="flex items-center justify-center gap-4">
            <span className="h-[2px] w-16 bg-emerald-500" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 sm:text-sm">
              {story.tagline}
            </span>
            <span className="h-[2px] w-16 bg-emerald-500" />
          </div>
        )}

        {/* Headline */}
        {story.title && (
          <h2 className="mx-auto max-w-4xl text-3xl font-black uppercase leading-tight tracking-tight text-[#1E3A8A] sm:text-4xl lg:text-4xl">
            {story.title}
          </h2>
        )}

        {/* Paragraphs */}
        <div className="mx-auto max-w-4xl space-y-8 text-justify text-base font-normal leading-relaxed text-slate-700 sm:text-lg sm:leading-loose [text-align-last:left]">
          {story.paragraph_1 && <p>{story.paragraph_1}</p>}
          {story.paragraph_2 && <p>{story.paragraph_2}</p>}
          {story.paragraph_3 && <p>{story.paragraph_3}</p>}
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;