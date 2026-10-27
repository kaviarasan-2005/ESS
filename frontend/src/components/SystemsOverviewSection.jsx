import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSystemsOverview } from '../services/SystemsSolutions';

const DEFAULT_OVERVIEW = {
  paragraph_1:
    "ESS Saudi embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.",
  paragraph_2:
    "We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.",
  image_url:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  cta_button_text: "Contact Us",
  cta_button_url: "/contact",
};

let cachedOverviewData = null;

const SystemsOverviewSection = () => {
  const [data, setData] = useState(() => cachedOverviewData || DEFAULT_OVERVIEW);

  useEffect(() => {
    let isMounted = true;

    fetchSystemsOverview()
      .then((res) => {
        if (!isMounted) return;

        const payload = res?.data || res || {};
        const freshData = {
          paragraph_1: payload.paragraph_1 ?? DEFAULT_OVERVIEW.paragraph_1,
          paragraph_2: payload.paragraph_2 ?? DEFAULT_OVERVIEW.paragraph_2,
          image_url: payload.image_url || DEFAULT_OVERVIEW.image_url,
          cta_button_text: payload.cta_button_text || DEFAULT_OVERVIEW.cta_button_text,
          cta_button_url: payload.cta_button_url || DEFAULT_OVERVIEW.cta_button_url,
        };

        cachedOverviewData = freshData;
        setData(freshData);
      })
      .catch((err) => {
        console.error('Error fetching Systems Overview:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative w-full bg-white py-16 font-sans text-slate-800 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* LEFT COLUMN: TEXT & CTA */}
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

          {/* RIGHT COLUMN: FEATURED IMAGE CARD */}
          <div className="lg:col-span-6">
            <div className="relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:rounded-3xl">
              <img
                src={data.image_url || DEFAULT_OVERVIEW.image_url}
                alt="Systems Overview"
                className="h-[320px] w-full object-cover sm:h-[400px] lg:h-full lg:min-h-[440px]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SystemsOverviewSection;