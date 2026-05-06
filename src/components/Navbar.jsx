import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaUser, FaUserShield, FaCalendarPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Programs', href: '#programs' },
  { name: 'Trainers', href: '#trainers' },
  { name: 'Membership', href: '#membership' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar({ onDashboard, onAdmin, onBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, openAuth } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-900/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-transparent'
      }`}
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group" id="nav-logo">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-red to-neon-redDark flex items-center justify-center shadow-neon group-hover:shadow-neon-strong transition-shadow duration-300">
              <span className="text-white font-montserrat font-black text-lg">DG</span>
            </div>
            <span className="text-xl font-montserrat font-bold tracking-wide">
              <span className="text-neon-red">DIMENSION</span>
              <span className="text-white"> GYM</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
                id={`nav-${link.name.toLowerCase()}`}
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-neon-red rounded-full transition-all duration-300 group-hover:w-6 shadow-[0_0_8px_rgba(255,26,26,0.5)]" />
              </a>
            ))}

            {/* Book Session button (for authenticated members) */}
            {isAuthenticated && (
              <button
                onClick={onBooking}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group flex items-center gap-1.5"
                id="nav-booking"
              >
                <FaCalendarPlus size={11} /> Book
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-neon-red rounded-full transition-all duration-300 group-hover:w-6 shadow-[0_0_8px_rgba(255,26,26,0.5)]" />
              </button>
            )}

            {/* Auth / Dashboard buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-3">
                {isAdmin && (
                  <button
                    onClick={onAdmin}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-white/5"
                    id="nav-admin"
                    title="Admin Panel"
                  >
                    <FaUserShield size={12} /> Admin
                  </button>
                )}
                <button
                  onClick={onDashboard}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-white/10"
                  id="nav-dashboard"
                >
                  <FaUser size={11} /> {user?.name?.split(' ')[0]}
                </button>
              </div>
            ) : (
              <button
                onClick={openAuth}
                className="ml-4 btn-neon text-sm !px-6 !py-2.5"
                id="nav-join"
              >
                Join Now
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white text-2xl p-2 hover:text-neon-red transition-colors"
            id="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-900/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 text-lg font-medium"
                >
                  {link.name}
                </motion.a>
              ))}

              {isAuthenticated && (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); onBooking?.(); }}
                    className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 text-lg font-medium text-left flex items-center gap-2"
                  >
                    <FaCalendarPlus size={14} /> Book Session
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onDashboard?.(); }}
                    className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 text-lg font-medium text-left flex items-center gap-2"
                  >
                    <FaUser size={14} /> Dashboard
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { setMobileOpen(false); onAdmin?.(); }}
                      className="py-3 px-4 text-yellow-400/80 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all duration-200 text-lg font-medium text-left flex items-center gap-2"
                    >
                      <FaUserShield size={14} /> Admin Panel
                    </button>
                  )}
                </>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => { setMobileOpen(false); onDashboard?.(); }}
                  className="btn-outline text-center mt-4 flex items-center justify-center gap-2"
                >
                  <FaUser size={12} /> {user?.name}
                </button>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); openAuth(); }}
                  className="btn-neon text-center mt-4"
                >
                  Join Now
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
