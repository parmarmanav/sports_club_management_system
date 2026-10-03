import { useState } from 'react';
import { X } from 'lucide-react';

// Gallery uses all available images in a masonry-style grid
const GALLERY_ITEMS = [
  { src: '/images/hero.jpg', caption: 'Tennis court at golden hour' },
  { src: '/images/facilities.jpg', caption: 'Aerial view of our sports complex' },
  { src: '/images/lounge.jpg', caption: 'The Members\' Lounge & Bar' },
  { src: '/images/hero.jpg', caption: 'Professional coaching sessions' },
  { src: '/images/lounge.jpg', caption: 'Private dining area' },
  { src: '/images/facilities.jpg', caption: 'Multi-sport facilities' },
  { src: '/images/hero.jpg', caption: 'Evening tennis under lights' },
  { src: '/images/lounge.jpg', caption: 'Bar & social area' },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="page-enter">
      <section className="relative py-24 bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Gallery</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Life at the Club</h1>
          <p className="text-slate-400 max-w-lg mx-auto">A glimpse into the Champions Club experience.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {GALLERY_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => setLightbox(item)}
                className="block w-full rounded-xl overflow-hidden group cursor-pointer break-inside-avoid"
              >
                <div className="relative">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      i % 3 === 0 ? 'h-72' : i % 3 === 1 ? 'h-56' : 'h-64'
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                    <p className="text-white text-sm font-medium px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} className="w-full rounded-2xl shadow-2xl" />
            <p className="text-center text-white/80 text-sm mt-4">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
