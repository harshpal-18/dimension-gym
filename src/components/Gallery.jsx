import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import g1 from '../assets/images/gallery-1.png';
import g2 from '../assets/images/gallery-2.png';
import g3 from '../assets/images/gallery-3.png';
import g4 from '../assets/images/gallery-4.png';
import g5 from '../assets/images/gallery-5.png';
import g6 from '../assets/images/gallery-6.png';

const images = [
  { src: g1, alt: 'Weight room', span: 'col-span-1 row-span-1' },
  { src: g2, alt: 'CrossFit training', span: 'col-span-1 row-span-2' },
  { src: g3, alt: 'Cardio zone', span: 'col-span-1 row-span-1' },
  { src: g4, alt: 'Boxing area', span: 'col-span-1 row-span-1' },
  { src: g5, alt: 'Deadlift action', span: 'col-span-1 row-span-1' },
  { src: g6, alt: 'Recovery zone', span: 'col-span-1 row-span-1' },
];

export default function Gallery() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="py-24 lg:py-32 relative bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-neon-red font-semibold text-sm tracking-wider uppercase">Gallery</span>
          <h2 className="section-title mt-3">Our Facility</h2>
          <p className="section-subtitle">Take a look inside Dimension Gym — where champions are made.</p>
          <div className="accent-line" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${img.span}`}
              onClick={() => setLightbox(i)}
              id={`gallery-${i + 1}`}
            >
              <img src={img.src} alt={img.alt} className="w-full h-64 lg:h-72 object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/40 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-neon-red/80 flex items-center justify-center shadow-neon">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl" onClick={() => setLightbox(null)}>✕</button>
          <img src={images[lightbox].src} alt={images[lightbox].alt} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </motion.div>
      )}
    </section>
  );
}
