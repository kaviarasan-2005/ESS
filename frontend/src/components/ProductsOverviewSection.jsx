import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsPage } from '../services/api';

const DEFAULT_CONTENT = {
  paragraph_1:
    'ESS Middle East embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.',
  paragraph_2:
    'We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.',
  button_text: 'Contact Us',
  button_link: '/contact',
  image_url: '',
};

const ProductsOverviewSection = () => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchProductsPage()
      .then((res) => {
        if (!isMounted) return;

        // Extract nested section payload safely
        const payload = res?.data?.data || res?.data || res || {};
        const overview = payload.content || {};

        setContent({
          paragraph_1: overview.paragraph_1 || DEFAULT_CONTENT.paragraph_1,
          paragraph_2: overview.paragraph_2 || DEFAULT_CONTENT.paragraph_2,
          button_text: overview.button_text || DEFAULT_CONTENT.button_text,
          button_link: overview.button_link || DEFAULT_CONTENT.button_link,
          image_url: overview.image_url || '',
        });
      })
      .catch((err) => {
        console.error('Failed to fetch Products overview content:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="bg-white text-black py-16 px-6 md:px-12 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: TEXT PARAGRAPHS & CTA BUTTON */}
        <div className="space-y-6">
       {content.paragraph_1 && (
        <p className="text-black text-sm md:text-base leading-relaxed font-normal text-justify [text-justify:inter-word] [text-align-last:left] break-words">
            {content.paragraph_1}
        </p>
        )}

          {content.paragraph_2 && (
  <p className="text-black text-sm md:text-base leading-relaxed font-normal text-justify [text-justify:inter-word] [text-align-last:left] break-words">
    {content.paragraph_2}
  </p>
)}

          <div className="pt-2">
            <Link
              to={content.button_link || '/contact'}
              className="inline-block bg-[#1E3A8A] hover:bg-[#155CFB] text-white font-bold text-xs md:text-sm px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              {content.button_text || 'Contact Us'}
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: FEATURED INDUSTRY IMAGE */}
        <div className="relative">
          <div className="rounded-lg overflow-hidden border-4 border-slate-200 shadow-2xl bg-slate-100">
            {content.image_url ? (
              <img
                src={content.image_url}
                alt="Product Industry Overview"
                className="w-full h-auto object-cover max-h-[380px]"
              />
            ) : (
              <div className="w-full h-72 bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold uppercase tracking-widest p-4 text-center">
                Industrial Network Overview
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductsOverviewSection;