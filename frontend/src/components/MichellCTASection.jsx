import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMichellCTA } from '../services/api';

const MichellCTASection = () => {
  const [data, setData] = useState({
    title: 'Need the right analyzer for your application?',
    subtitle:
      'Tell us your gas, pressure, and measurement range. Our team will match an analyzer to your plant.',
    button_text: 'Contact Us',
    button_link: '/contact',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCTAData();
  }, []);

  const loadCTAData = async () => {
    try {
      setLoading(true);
      const res = await fetchMichellCTA();
      const content = res?.data?.data || res?.data || res;
      if (content) {
        setData((prev) => ({ ...prev, ...content }));
      }
    } catch (err) {
      console.error('Failed to load Michell CTA section:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 w-full items-center justify-center bg-[#f0f4f9] text-slate-700">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-slate-700 border-r-transparent"></div>
          <p className="mt-2 text-xs font-medium">Loading section...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#e3edf8] px-6 py-16 text-center font-sans md:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* HEADING */}
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0e1d30] md:text-3xl lg:text-4xl">
          {data.title}
        </h2>

        {/* SUBTITLE */}
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-[#5c6d82] md:text-sm md:leading-normal">
          {data.subtitle}
        </p>

        {/* REDIRECT BUTTON */}
        <div className="pt-4">
          <Link
            to={data.button_link || '/contact'}
            className="inline-block rounded-full bg-[#1b439b] px-8 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#153478] hover:shadow-lg md:text-sm"
          >
            {data.button_text}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MichellCTASection;