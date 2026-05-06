import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      className="loader-container"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <span className="text-3xl font-montserrat font-black tracking-wider">
            <span className="text-neon-red text-glow">DIMENSION</span>
            <span className="text-white ml-2">GYM</span>
          </span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 200 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="loader-bar" />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xs text-gray-500 tracking-[0.3em] uppercase font-poppins"
        >
          Loading Experience
        </motion.p>
      </div>
    </motion.div>
  );
}
