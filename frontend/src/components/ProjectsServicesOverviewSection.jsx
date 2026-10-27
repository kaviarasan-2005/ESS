import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjectsServicesOverview } from '../services/projectsServices';

const DEFAULT_OVERVIEW = {
  paragraph_1:
    "ESS Saudi embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.",
  paragraph_2:
    "We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.",
  image_url: "",
  cta_button_text: "Contact Us",
  cta_button_url: "/contact",
};

const CACHE_KEY = 'ess_cache_projectsservices_overview';
let memCache = null;
try {
  const saved = sessionStorage.getItem(CACHE_KEY);
  if (saved) memCache = JSON.parse(saved);
} catch (e) {}

const ProjectsServicesOverviewSection = () => {
  const [data, setData] = useState(() => memCache || DEFAULT_OVERVIEW);
  const [hasFetched, setHasFetched] = useState(() => Boolean(memCache));
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentImage = data.image_url || '';

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

    fetchProjectsServicesOverview()
      .then((res) => {
        if (!isMounted) return;

        // Unwraps Axios res.data.data, res.data, or top-level payload
        const payload = res?.data?.data || res?.data || res || {};

        // Extracts images using all potential backend keys
        const rawImg = typeof (payload.image_url || payload.bg_image_url || payload.image) === 'string'
          ? (payload.image_url || payload.bg_image_url || payload.image).trim().replace(/^["']|["']$/g, '')
          : '';

        // Extracts CTA buttons using both naming conventions
        const buttonText =
          payload.cta_button_text ||
          payload.button_text ||
          DEFAULT_OVERVIEW.cta_button_text;

        const buttonUrl =
          payload.cta_button_url ||
          payload.button_link ||
          payload.button_url ||
          DEFAULT_OVERVIEW.cta_button_url;

        const freshData = {
          paragraph_1: payload.paragraph_1 ?? DEFAULT_OVERVIEW.paragraph_1,
          paragraph_2: payload.paragraph_2 ?? DEFAULT_OVERVIEW.paragraph_2,
          image_url: rawImg || DEFAULT_OVERVIEW.image_url,
          cta_button_text: buttonText,
          cta_button_url: buttonUrl,
        };

        memCache = freshData;
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        } catch (e) {}

        setData((prev) => {
          if (
            prev.paragraph_1 === freshData.paragraph_1 &&
            prev.paragraph_2 === freshData.paragraph_2 &&
            prev.image_url === freshData.image_url &&
            prev.cta_button_text === freshData.cta_button_text &&
            prev.cta_button_url === freshData.cta_button_url
          ) {
            return prev;
          }
          return freshData;
        });
      })
      .catch((err) => {
        console.error('Error fetching Projects & Services Overview:', err);
      })
      .finally(() => {
        if (isMounted) setHasFetched(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative w-full bg-white py-16 font-sans text-slate-800 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">

          {/* LEFT COLUMN: TEXT PARAGRAPHS & CTA */}
          <div className="flex flex-col justify-center space-y-6 lg:col-span-6">
            {data.paragraph_1 && (
              <p className="text-justify text-lg font-normal leading-relaxed text-slate-700 sm:text-xl sm:leading-relaxed">
                {data.paragraph_1}
              </p>
            )}

            {data.paragraph_2 && (
              <p className="text-justify text-lg font-normal leading-relaxed text-slate-700 sm:text-xl sm:leading-relaxed">
                {data.paragraph_2}
              </p>
            )}

            {/* CTA BUTTON */}
            {data.cta_button_text && (
              <div className="pt-2">
                <Link
                  to={data.cta_button_url || '/contact'}
                  className="inline-block rounded-full bg-[#1e3a8a] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#172e6e] hover:shadow-lg"
                >
                  {data.cta_button_text}
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: FEATURED IMAGE */}
          <div className="flex lg:col-span-6">
            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-xl sm:rounded-3xl min-h-[320px] sm:min-h-[400px]">
              {currentImage ? (
                <img
                  key={currentImage}
                  src={currentImage}
                  alt="Projects & Services Overview"
                  onLoad={() => setImageLoaded(true)}
                  className={`h-[320px] w-full object-cover sm:h-[400px] lg:h-full lg:min-h-[440px] transition-opacity duration-300 ${
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
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProjectsServicesOverviewSection;