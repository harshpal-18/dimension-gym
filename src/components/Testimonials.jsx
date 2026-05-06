import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  { name: 'Alex Rodriguez', role: 'Lost 30kg in 6 months', rating: 5, text: 'Dimension Gym completely transformed my life. The trainers are phenomenal and the community is incredibly supportive. I went from barely doing a push-up to deadlifting 180kg!' },
  { name: 'Emily Watson', role: 'Marathon Runner', rating: 5, text: 'The cardio programs here are next-level. My endurance has skyrocketed and I completed my first marathon thanks to the coaching team at .' },
  { name: 'James Park', role: 'CrossFit Enthusiast', rating: 5, text: 'Best CrossFit programming I\'ve ever experienced. The coaches push you just enough and the facility is world-class. Worth every penny of the premium membership.' },
  { name: 'Maria Santos', role: 'Fitness Competitor', rating: 5, text: 'I prepared for my first bikini competition here. The personal training and nutrition guidance were top-notch. Placed first in my division!' },
  { name: 'Ryan Cooper', role: 'Business Executive', rating: 5, text: 'As a busy professional, I need efficiency. Dimension Gym delivers results-driven workouts that fit my schedule. The 24/7 access is a game-changer.' },
];

export default function Testimonials() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="testimonials" className="py-24 lg:py-32 relative">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-red/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-neon-red font-semibold text-sm tracking-wider uppercase">Testimonials</span>
          <h2 className="section-title mt-3">What Our Members Say</h2>
          <p className="section-subtitle">Real stories from real people who transformed their lives with Dimension Gym.</p>
          <div className="accent-line" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-14"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="glass-card-light p-8 h-full flex flex-col hover:shadow-neon transition-all duration-500">
                  <FaQuoteLeft className="text-neon-red/30 text-2xl mb-4" />
                  <p className="text-gray-300 text-sm leading-relaxed flex-1">{t.text}</p>
                  <div className="flex gap-1 mt-4 mb-4">
                    {[...Array(t.rating)].map((_, si) => (<FaStar key={si} className="text-neon-red text-xs" />))}
                  </div>
                  <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-red to-neon-redDark flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">{t.name}</h4>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
