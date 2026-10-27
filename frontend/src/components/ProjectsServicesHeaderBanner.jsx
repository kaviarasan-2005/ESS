import React, { useEffect, useState } from 'react';
import { fetchProjectsServicesHeader } from '../services/projectsServices';

const DEFAULT_BANNER = {
  title: 'PROJECTS & SERVICES',
  subtitle: 'Explore Our Industrial Projects & Specialized Services',
  bg_image_url: '',
};

const CACHE_KEY = 'ess_cache_projectsservices_banner';
let memCache = null;
try {
  const saved = sessionStorage.getItem(CACHE_KEY);
  if (saved) memCache = JSON.parse(saved);
} catch (e) {}

const ProjectsServicesHeaderBanner = () => {
  const [data, setData] = useState(() => memCache || DEFAULT_BANNER);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Instant cache verification on mount or URL change
  useEffect(() => {
    const rawImg = data.bg_image_url;
    if (rawImg) {
      const img = new Image();
      img.src = rawImg;
      if (img.complete) {
        setImageLoaded(true);
      } else {
        img.onload = () => setImageLoaded(true);
        img.onerror = () => setImageError(true);
      }
    }
  }, [data.bg_image_url]);

  useEffect(() => {
    let isMounted = true;

    fetchProjectsServicesHeader()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data || res || {};
        const rawImg = typeof (payload.bg_image_url || payload.image_url) === 'string'
          ? (payload.bg_image_url || payload.image_url).trim().replace(/^["']|["']$/g, '')
          : '';

        const freshData = {
          title: payload.title || DEFAULT_BANNER.title,
          subtitle: payload.subtitle || DEFAULT_BANNER.subtitle,
          bg_image_url: rawImg,
        };

        memCache = freshData;
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        } catch (e) {}

        setData((prev) => {
          if (
            prev.title === freshData.title &&
            prev.subtitle === freshData.subtitle &&
            prev.bg_image_url === freshData.bg_image_url
          ) {
            return prev;
          }
          return freshData;
        });
      })
      .catch((err) => {
        console.error('Error fetching Projects & Services banner:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const hasValidImage = Boolean(data.bg_image_url) && !imageError;

  return (
    <section className="relative flex h-60 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a152e] to-slate-950 font-sans text-white sm:h-72 lg:h-[441px]">
      
      {/* BACKGROUND IMAGE / GRADIENT */}
      {hasValidImage ? (
        <div className="absolute inset-0 z-0">
          <img
            key={data.bg_image_url}
            src={data.bg_image_url}
            alt="Projects and Services Banner"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover object-center transition-opacity duration-500 ease-out ${
              imageLoaded ? 'opacity-80' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-slate-950/20" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#08152c] to-slate-950" />
      )}

      {/* HEADER TEXT CONTENT */}
      <div className="relative z-20 mx-auto max-w-5xl space-y-3 px-6 text-center">
        <h1 className="text-3xl font-black uppercase tracking-wider text-white drop-shadow-md sm:text-5xl lg:text-6xl">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="mx-auto max-w-2xl text-sm font-semibold tracking-wide text-slate-200 drop-shadow sm:text-base lg:text-lg">
            {data.subtitle}
          </p>
        )}
      </div>

    </section>
  );
};

export default ProjectsServicesHeaderBanner;