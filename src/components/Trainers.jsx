import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import trainer1 from '../assets/images/trainer-1.png';
import trainer2 from '../assets/images/trainer-2.png';
import trainer3 from '../assets/images/trainer-3.png';

const trainers = [
  {
    name: 'Marcus Kane',
    role: 'Head Strength Coach',
    bio: 'NSCA certified with 12+ years in competitive powerlifting. Specializes in building raw strength and explosive power.',
    img: trainer1,
    social: { instagram: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Sarah Chen',
    role: 'Fitness & Nutrition Coach',
    bio: 'ACE certified trainer and sports nutritionist. Expert in body recomposition and sustainable transformation.',
    img: trainer2,
    social: { instagram: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'David Reeves',
    role: 'CrossFit & HIIT Specialist',
    bio: 'Former CrossFit Games athlete. Brings competitive intensity and advanced programming to every session.',
    img: trainer3,
    social: { instagram: '#', twitter: '#', linkedin: '#' },
  },
];

export default function Trainers() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="trainers" className="py-24 lg:py-32 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-red/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-neon-red font-semibold text-sm tracking-wider uppercase">
            Expert Coaches
          </span>
          <h2 className="section-title mt-3">Meet Our Trainers</h2>
          <p className="section-subtitle">
            World-class coaches dedicated to helping you achieve your personal best.
          </p>
          <div className="accent-line" />
        </motion.div>

        {/* Trainer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative"
              id={`trainer-${i + 1}`}
            >
              <div className="relative overflow-hidden rounded-2xl">
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={trainer.img}
                    alt={trainer.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Social Icons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <a href={trainer.social.instagram} className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-neon-red hover:shadow-neon transition-all duration-300">
                    <FaInstagram size={14} />
                  </a>
                  <a href={trainer.social.twitter} className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-neon-red hover:shadow-neon transition-all duration-300">
                    <FaTwitter size={14} />
                  </a>
                  <a href={trainer.social.linkedin} className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-neon-red hover:shadow-neon transition-all duration-300">
                    <FaLinkedinIn size={14} />
                  </a>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-neon-red text-xs font-semibold tracking-wider uppercase">
                    {trainer.role}
                  </span>
                  <h3 className="text-2xl font-montserrat font-bold text-white mt-1">
                    {trainer.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 overflow-hidden">
                    {trainer.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
