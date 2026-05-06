import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const contactInfo = [
  { icon: <FaMapMarkerAlt />, title: 'Address', text: '123 Fitness Avenue, Downtown, NY 10001' },
  { icon: <FaPhoneAlt />, title: 'Phone', text: '+1 (555) 123-4567' },
  { icon: <FaEnvelope />, title: 'Email', text: 'info@dimensiongym.com' },
  { icon: <FaClock />, title: 'Hours', text: 'Mon-Fri: 5AM-11PM | Sat-Sun: 7AM-9PM' },
];

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-neon-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-neon-red font-semibold text-sm tracking-wider uppercase">Get In Touch</span>
          <h2 className="section-title mt-3">Contact Us</h2>
          <p className="section-subtitle">Ready to start your transformation? Reach out to us today.</p>
          <div className="accent-line" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
            <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="John Doe"
                  className="w-full px-5 py-3.5 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-600 focus:border-neon-red/50 focus:outline-none focus:shadow-neon transition-all duration-300" id="contact-name" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required placeholder="john@example.com"
                  className="w-full px-5 py-3.5 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-600 focus:border-neon-red/50 focus:outline-none focus:shadow-neon transition-all duration-300" id="contact-email" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required rows={5} placeholder="Tell us about your fitness goals..."
                  className="w-full px-5 py-3.5 rounded-xl bg-dark-700 border border-white/5 text-white placeholder-gray-600 focus:border-neon-red/50 focus:outline-none focus:shadow-neon transition-all duration-300 resize-none" id="contact-message" />
              </div>
              <button type="submit" className="btn-neon w-full !py-4 text-lg" id="contact-submit">
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </button>
            </form>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex items-start gap-3 p-4 glass-card-light rounded-xl">
                  <div className="text-neon-red mt-0.5">{info.icon}</div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">{info.title}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{info.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="rounded-2xl overflow-hidden border border-white/5 h-full min-h-[400px]">
              <iframe
                title="Dimension Gym Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.182!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sEmpire+State+Building!5e0!3m2!1sen!2sus!4v1"
                width="100%" height="100%" style={{ border: 0, minHeight: '400px', filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
