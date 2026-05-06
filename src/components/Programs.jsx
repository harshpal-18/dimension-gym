import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GiWeightLiftingUp, GiRunningShoe, GiWeightScale, GiStrong, GiMuscleUp } from 'react-icons/gi';

const programs = [
  {
    icon: <GiWeightLiftingUp />,
    title: 'Strength Training',
    desc: 'Build raw power with our comprehensive strength programs. Olympic lifts, powerlifting, and functional strength training.',
    features: ['Free Weights', 'Machines', 'Progressive Overload'],
  },
  {
    icon: <GiRunningShoe />,
    title: 'Cardio Fitness',
    desc: 'Boost endurance and cardiovascular health with high-energy cardio sessions designed to maximize fat burn.',
    features: ['HIIT Sessions', 'Treadmill', 'Cycling'],
  },
  {
    icon: <GiWeightScale />,
    title: 'Weight Loss',
    desc: 'Transform your body with our proven weight loss programs combining nutrition guidance and targeted exercises.',
    features: ['Meal Plans', 'Body Tracking', 'Custom Routines'],
  },
  {
    icon: <GiStrong />,
    title: 'CrossFit',
    desc: 'Challenge your limits with dynamic, high-intensity functional movements in a competitive group setting.',
    features: ['WODs', 'Olympic Lifting', 'Gymnastics'],
  },
  {
    icon: <GiMuscleUp />,
    title: 'Personal Training',
    desc: 'Get one-on-one attention from certified coaches who create customized programs for your unique goals.',
    features: ['1-on-1 Coaching', 'Goal Setting', 'Progress Tracking'],
  },
];

export default function Programs() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="programs" className="py-24 lg:py-32 relative bg-dark-800/50">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-red/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-neon-red font-semibold text-sm tracking-wider uppercase">
            Our Programs
          </span>
          <h2 className="section-title mt-3">
            Build Your Perfect Body
          </h2>
          <p className="section-subtitle">
            Choose from our diverse range of training programs designed to help you 
            achieve any fitness goal.
          </p>
          <div className="accent-line" />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card-light p-8 group hover:shadow-neon transition-all duration-500 cursor-pointer relative overflow-hidden ${
                i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
              id={`program-${program.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-red/0 to-neon-red/0 group-hover:from-neon-red/5 group-hover:to-transparent transition-all duration-500" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-neon-red/10 flex items-center justify-center text-neon-red text-2xl mb-6 group-hover:bg-neon-red/20 group-hover:scale-110 transition-all duration-300">
                  {program.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-montserrat font-bold text-white mb-3 group-hover:text-neon-redLight transition-colors duration-300">
                  {program.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  {program.desc}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {program.features.map((feature, fi) => (
                    <span
                      key={fi}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="mt-6 flex items-center gap-2 text-neon-red text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
