import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaUsers, FaDumbbell, FaTrophy } from 'react-icons/fa';
import aboutImg from '../assets/images/about-gym.png';

const stats = [
  { icon: <FaUsers />, value: '500+', label: 'Active Members' },
  { icon: <FaDumbbell />, value: '10+', label: 'Expert Trainers' },
  { icon: <FaTrophy />, value: '5+', label: 'Years Experience' },
];

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={aboutImg}
                alt="Dimension Gym Facility"
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 glass-card p-6 shadow-neon"
            >
              <div className="text-3xl font-montserrat font-black text-neon-red">5+</div>
              <div className="text-sm text-gray-400">Years of<br/>Excellence</div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-neon-red font-semibold text-sm tracking-wider uppercase">
              About Us
            </span>
            <h2 className="section-title mt-3 !text-left">
              More Than Just<br />A Gym
            </h2>
            <div className="w-20 h-1 mt-4 rounded-full bg-gradient-to-r from-neon-red to-neon-redLight shadow-[0_0_10px_rgba(255,26,26,0.4)]" />

            <p className="text-gray-400 mt-6 leading-relaxed text-lg">
              At Dimension Gym, we believe that fitness is not just about lifting weights — 
              it&apos;s about transforming your mindset, building discipline, and pushing 
              beyond your limits every single day.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-neon-red/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-neon-red rounded-full" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Our Mission</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    To create a fitness community that inspires, challenges, and transforms 
                    lives through world-class training and support.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-neon-red/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-neon-red rounded-full" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Our Vision</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    To be the premier fitness destination where every member achieves their 
                    peak physical and mental performance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card p-8 text-center hover:shadow-neon transition-all duration-500 group"
            >
              <div className="text-neon-red text-3xl mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-montserrat font-black text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
