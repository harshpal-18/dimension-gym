import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCheck, FaStar } from 'react-icons/fa';
import { usePayment } from '../hooks/usePayment';

const plans = [
  {
    name: 'Basic', price: 29, period: 'month',
    description: 'Perfect for beginners starting their fitness journey',
    features: ['Gym Floor Access', 'Locker Room Access', 'Basic Equipment', '2 Group Classes/Week', 'Fitness Assessment'],
    notIncluded: ['Personal Training', 'Nutrition Plan', 'Sauna & Steam'],
    highlighted: false,
  },
  {
    name: 'Standard', price: 59, period: 'month',
    description: 'Our most popular plan for serious athletes',
    features: ['Full Gym Access', 'Unlimited Group Classes', 'Personal Locker', '2 PT Sessions/Month', 'Nutrition Guidance', 'Sauna & Steam Room', 'Workout App Access'],
    notIncluded: ['Unlimited PT Sessions'],
    highlighted: true,
  },
  {
    name: 'Premium', price: 99, period: 'month',
    description: 'The ultimate package for maximum results',
    features: ['VIP Full Access 24/7', 'Unlimited Group Classes', 'Premium Locker Suite', 'Unlimited PT Sessions', 'Custom Nutrition Plan', 'Sauna, Steam & Pool', 'Recovery Zone Access', 'Priority Booking', 'Guest Passes (2/month)'],
    notIncluded: [],
    highlighted: false,
  },
];

export default function Membership() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { buyPlan, processing } = usePayment();

  return (
    <section id="membership" className="py-24 lg:py-32 relative bg-dark-800/50">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-neon-red font-semibold text-sm tracking-wider uppercase">Pricing Plans</span>
          <h2 className="section-title mt-3">Choose Your Plan</h2>
          <p className="section-subtitle">Flexible membership options designed to fit your goals and budget.</p>
          <div className="accent-line" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-500 group ${plan.highlighted ? 'bg-gradient-to-b from-neon-red/10 to-dark-800 border-2 border-neon-red/30 shadow-neon scale-[1.02] lg:scale-105' : 'glass-card-light hover:shadow-neon border border-transparent hover:border-neon-red/20'}`}
              id={`plan-${plan.name.toLowerCase()}`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-neon-red to-neon-redLight text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-neon">
                  <FaStar size={10} /> Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-sm text-gray-500">$</span>
                <span className={`text-5xl font-montserrat font-black ${plan.highlighted ? 'text-neon-red text-glow' : 'text-white'}`}>{plan.price}</span>
                <span className="text-gray-500 text-sm ml-1">/{plan.period}</span>
              </div>
              <p className="text-gray-500 text-sm mt-3">{plan.description}</p>
              <div className="w-full h-px bg-white/5 my-6" />
              <ul className="space-y-3 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlighted ? 'bg-neon-red/20 text-neon-red' : 'bg-white/5 text-neon-red'}`}><FaCheck size={8} /></div>
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f, fi) => (
                  <li key={`n-${fi}`} className="flex items-center gap-3 text-sm opacity-40">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"><span className="text-[8px]">✕</span></div>
                    <span className="text-gray-500 line-through">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => buyPlan(plan.name.toLowerCase())}
                disabled={processing}
                className={`mt-8 w-full py-3.5 rounded-xl font-semibold text-center transition-all duration-300 block disabled:opacity-50 disabled:cursor-not-allowed ${plan.highlighted ? 'btn-neon !rounded-xl' : 'border-2 border-white/10 text-white hover:border-neon-red/50 hover:bg-neon-red/5 hover:shadow-neon'}`}
              >
                {processing ? 'Processing...' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
