import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Loader from './components/Loader';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Trainers from './components/Trainers';
import Membership from './components/Membership';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'dashboard' | 'admin'
  const [showBooking, setShowBooking] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const goHome = () => setCurrentPage('home');
  const goDashboard = () => setCurrentPage('dashboard');
  const goAdmin = () => setCurrentPage('admin');

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#ff1a1a', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <AnimatePresence>
        {loading && <Loader />}
      </AnimatePresence>

      {!loading && (
        <>
          <ScrollProgress />
          <AuthModal />
          <BookingModal show={showBooking} onClose={() => setShowBooking(false)} />

          {currentPage === 'home' && (
            <>
              <Navbar
                onDashboard={goDashboard}
                onAdmin={goAdmin}
                onBooking={() => setShowBooking(true)}
              />
              <main>
                <Hero />
                <About />
                <Programs />
                <Trainers />
                <Membership />
                <Testimonials />
                <Gallery />
                <Contact />
              </main>
              <Footer />
              <BackToTop />
            </>
          )}

          {currentPage === 'dashboard' && isAuthenticated && (
            <>
              <Navbar onDashboard={goDashboard} onAdmin={goAdmin} onBooking={() => setShowBooking(true)} />
              <Dashboard onBack={goHome} />
            </>
          )}

          {currentPage === 'admin' && isAdmin && (
            <>
              <Navbar onDashboard={goDashboard} onAdmin={goAdmin} onBooking={() => setShowBooking(true)} />
              <AdminPanel onBack={goHome} />
            </>
          )}
        </>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
