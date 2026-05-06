import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaHeart } from 'react-icons/fa';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Programs', href: '#programs' },
  { name: 'Trainers', href: '#trainers' },
  { name: 'Membership', href: '#membership' },
  { name: 'Contact', href: '#contact' },
];

const socials = [
  { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
  { icon: <FaInstagram />, href: '#', label: 'Instagram' },
  { icon: <FaTwitter />, href: '#', label: 'Twitter' },
  { icon: <FaYoutube />, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-red to-neon-redDark flex items-center justify-center shadow-neon">
                <span className="text-white font-montserrat font-black text-lg">DG</span>
              </div>
              <span className="text-xl font-montserrat font-bold">
                <span className="text-neon-red">DIMENSION</span> <span className="text-white">GYM</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Transform your body, transform your life. Join the most elite fitness community and unlock your true potential.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-neon-red hover:bg-neon-red/10 hover:shadow-neon transition-all duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-gray-500 hover:text-neon-red text-sm transition-colors duration-200">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold mb-5 uppercase text-sm tracking-wider">Opening Hours</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex justify-between"><span>Monday - Friday</span><span className="text-gray-300">5:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span><span className="text-gray-300">7:00 AM - 9:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span><span className="text-gray-300">7:00 AM - 9:00 PM</span></li>
            </ul>
            <div className="mt-6 p-4 glass-card-light rounded-xl">
              <p className="text-xs text-gray-400">Premium members enjoy <span className="text-neon-red font-semibold">24/7 access</span> to all facilities.</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 Dimension Gym. All rights reserved.</p>
          <p className="text-gray-600 text-xs flex items-center gap-1">Made with <FaHeart className="text-neon-red text-[10px]" /> for fitness enthusiasts</p>
        </div>
      </div>
    </footer>
  );
}
