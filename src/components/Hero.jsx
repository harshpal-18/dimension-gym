import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import heroBg from '../assets/images/hero-bg.png';

export default function Hero() {
  const { isAuthenticated, openAuth } = useAuth();
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Gym workout"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-dark-900" />
        {/* Red gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-neon-red/10 via-transparent to-transparent" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-neon-red/30 bg-neon-red/10 text-neon-redLight text-sm font-medium tracking-wider uppercase">
            Welcome to Dimension Gym
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-montserrat font-black leading-[0.95] tracking-tight mb-6"
        >
          <span className="block text-white">Transform Your</span>
          <span className="block text-white">Body. Transform</span>
          <span className="block text-neon-red text-glow">Your Life.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Push your limits. Redefine what&apos;s possible. Join the most elite fitness 
          community and unlock your true potential.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => isAuthenticated ? document.getElementById('membership')?.scrollIntoView({ behavior: 'smooth' }) : openAuth()}
            className="btn-neon text-lg px-10 py-4"
            id="hero-join-btn"
          >
            Join Now
          </button>
          <a href="#membership" className="btn-outline text-lg px-10 py-4" id="hero-plans-btn">
            View Plans
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-neon-red rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
