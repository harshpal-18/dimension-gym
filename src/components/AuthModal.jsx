import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiMail, HiLockClosed, HiUser, HiPhone } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthModal() {
  const { showAuthModal, closeAuth, login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success('Welcome back! 💪');
      } else {
        await signup(form.name, form.email, form.phone, form.password);
        toast.success('Account created! Welcome to Dimension Gym! 🔥');
      }
      closeAuth();
      setForm({ name: '', email: '', phone: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setForm({ name: '', email: '', phone: '', password: '' });
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeAuth}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="glass-card w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeAuth}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <HiX size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-red to-neon-redDark flex items-center justify-center shadow-neon">
                  <span className="text-white font-montserrat font-black text-xs">DG</span>
                </div>
                <span className="text-lg font-montserrat font-bold">
                  <span className="text-neon-red">DIMENSION</span> <span className="text-white">GYM</span>
                </span>
              </div>
              <h2 className="text-2xl font-montserrat font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isLogin ? 'Sign in to access your dashboard' : 'Join the Dimension Gym community'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required={!isLogin}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-600 focus:border-neon-red/50 focus:outline-none transition-all duration-300 text-sm"
                  />
                </div>
              )}

              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-600 focus:border-neon-red/50 focus:outline-none transition-all duration-300 text-sm"
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-600 focus:border-neon-red/50 focus:outline-none transition-all duration-300 text-sm"
                  />
                </div>
              )}

              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-600 focus:border-neon-red/50 focus:outline-none transition-all duration-300 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full !py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Processing...
                  </span>
                ) : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Switch mode */}
            <p className="text-center text-gray-500 text-sm mt-6">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={switchMode} className="text-neon-red hover:text-neon-redLight transition-colors font-medium">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
