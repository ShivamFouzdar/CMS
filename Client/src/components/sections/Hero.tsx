import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeIn } from '@/lib/utils';
import { JobApplicationTrigger } from './JobApplicationDialog';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const backgroundImages = [
  '/work.png',
];

export function Hero() {
  return (
    <section 
      className="relative flex items-center justify-center overflow-hidden pt-18 sm:pt-24 md:pt-24 lg:pt-28 pb-16 sm:pb-20 md:pb-24 lg:pb-28 min-h-[600px] sm:min-h-[700px] md:min-h-[800px]"
    >
      {/* 🔹 Background Image with Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src={backgroundImages[0]}
          alt="CareerMap Solutions Background"
          className="w-full h-full object-cover"
          style={{ 
            filter: 'contrast(1.1) brightness(0.9)',
            WebkitFilter: 'contrast(1.1) brightness(0.9)',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.25 }}
          transition={{
            duration: 15,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        {/* Gradient Overlays - Balanced contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-purple-900/65 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* 🔹 Background Pattern */}
      <div className="absolute inset-0 z-[1] opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      {/* 🔹 Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn('up', 0.2)}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            variants={fadeIn('up', 0.1)}
            className="inline-block mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg"
          >
            <span className="text-sm sm:text-base text-white font-bold">
              🚀 Transform Your Career & Business
            </span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2 sm:mb-2"
            variants={fadeIn('up', 0.2)}
          >
            Empowering Careers.{' '}
            <span className="block mt-2 sm:mt-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent  leading-relaxed pt-1 sm:pt-2 pb-0.5 sm:pb-1">
              Enabling Businesses.
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8"
            variants={fadeIn('up', 0.3)}
          >
            At CMS, we bridge the gap between talent and opportunity, while delivering reliable business outsourcing solutions to help companies scale smarter and faster.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12"
            variants={fadeIn('up', 0.4)}
          >
            <JobApplicationTrigger />
            <Link to="/services" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="h-12 sm:h-14 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-xl font-semibold w-full sm:w-auto border-none"
              >
                Grow With CMS <ArrowRight className="ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn('up', 0.5)}
        >
          <div className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white/50 bg-gradient-to-br from-purple-400 to-pink-400"
                  style={{ zIndex: 3 - i }}
                />
              ))}
            </div>
            <span className="text-white/90 font-medium text-sm sm:text-base">Trusted by 50+ businesses</span>
          </div>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            </div>
            <span className="text-white/90 font-medium text-sm sm:text-base">99.9% Success Rate</span>
          </div>
        </motion.div>
      </div>

    </section>
  );
}