import React, { useEffect, useState } from 'react';
import { fetchContactPage } from '../services/api';

const DEFAULT_MAPS = {
  section_title: "Our Locations",
  main_map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.286812852787!2d51.5284!3d25.2693",
  main_map_link: "https://maps.google.com",
  facility_maps: []
};

// Helper function to extract a clean embed URL from standard links or complete <iframe> HTML tags
const cleanEmbedUrl = (rawInput) => {
  if (!rawInput || typeof rawInput !== 'string') return '';
  let str = rawInput.trim();

  // If user pasted full <iframe src="..."> code, extract only the src URL
  if (str.includes('<iframe')) {
    const srcMatch = str.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      str = srcMatch[1];
    }
  }

  // Ensure protocol prefix exists
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    str = `https://${str}`;
  }

  return str;
};

const ContactMapsSection = () => {
  const [mapsData, setMapsData] = useState(DEFAULT_MAPS);
  const [loading, setLoading] = useState(true);

  // Fix Chrome DevTools [Violation] Non-passive touch listener warnings from Google Maps iframe
  useEffect(() => {
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
      let modOptions = options;

      if (type === 'touchstart' || type === 'touchmove') {
        if (typeof options === 'boolean') {
          modOptions = { capture: options, passive: true };
        } else if (typeof options === 'object' && options !== null) {
          modOptions = { ...options, passive: options.passive !== undefined ? options.passive : true };
        } else {
          modOptions = { passive: true };
        }
      }

      return originalAddEventListener.call(this, type, listener, modOptions);
    };

    return () => {
      EventTarget.prototype.addEventListener = originalAddEventListener;
    };
  }, []);

  useEffect(() => {
    fetchContactPage()
      .then((res) => {
        const payload = res?.data?.data || res?.data || res || {};
        if (payload.maps_section) {
          setMapsData({
            section_title: payload.maps_section.section_title || DEFAULT_MAPS.section_title,
            main_map_embed_url: payload.maps_section.main_map_embed_url || DEFAULT_MAPS.main_map_embed_url,
            main_map_link: payload.maps_section.main_map_link || DEFAULT_MAPS.main_map_link,
            facility_maps: Array.isArray(payload.maps_section.facility_maps)
              ? payload.maps_section.facility_maps
              : []
          });
        }
      })
      .catch((err) => console.error('Error fetching contact maps:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const cleanMainMapUrl = cleanEmbedUrl(mapsData.main_map_embed_url);

  return (
    <section className="w-full bg-white text-black font-sans">

      {/* 1. TOP MAIN MAP */}
      <div className="max-w-8xl mx-auto px-6 sm:px-12 pt-14 pb-8 animate-[fadeIn_0.6s_ease-out]">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          {mapsData.section_title}
        </h2>

        <div className="relative w-full h-[380px] sm:h-[450px] bg-slate-100 overflow-hidden rounded-2xl border border-slate-200 shadow-md mx-auto transition-transform duration-500 hover:scale-[1.01]">
          {cleanMainMapUrl ? (
            <iframe
              title="Main Office Map"
              src={cleanMainMapUrl}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              No valid Map URL configured.
            </div>
          )}
        </div>
      </div>

      {/* 2. SECONDARY FACILITY MAP CARDS */}
      {mapsData.facility_maps.length > 0 && (
        <div className="bg-slate-50 py-12 px-6 sm:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {mapsData.facility_maps.map((fac, index) => {
                const facUrl = cleanEmbedUrl(fac.map_embed_url);
                return (
                  <div
                    key={fac.id || fac.title || index}
                    className="space-y-4 text-center md:text-left opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight">
                      {fac.title}
                    </h3>

                    <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md transition-transform duration-500 hover:scale-[1.02]">
                      {facUrl ? (
                        <iframe
                          title={fac.title}
                          src={facUrl}
                          className="w-full h-full border-0"
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No Map URL Configured
                        </div>
                      )}
                    </div>

                    {fac.address && (
                      <p className="text-xs text-slate-500 font-medium">
                        {fac.address}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </section>
  );
};

export default ContactMapsSection;