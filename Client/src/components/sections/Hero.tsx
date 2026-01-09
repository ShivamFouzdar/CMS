import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeIn } from '@/lib/utils';
import { JobApplicationTrigger } from './JobApplicationDialog';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import FloatingLines from './FloatingLines';

export function Hero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-24 lg:pt-28 pb-12 sm:pb-16 md:pb-20 lg:pb-24 min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]"
    >
      {/* 🔹 Floating Lines Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[6, 8, 10]}
          lineDistance={[10, 8, 5]}
          bendRadius={10.0}
          bendStrength={-2.0}
          mouseDamping={0.15}
          interactive={true}
          parallax={true}
          parallaxStrength={0.5}
          mixBlendMode="screen"
        />
      </div>

      {/* 🔹 Background Overlay for better text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/30 to-black/50 pointer-events-none" />

      {/* 🔹 Background Pattern */}
      <div className="absolute inset-0 z-[1] opacity-10 pointer-events-none">
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
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4 px-2"
            variants={fadeIn('up', 0.2)}
          >
            Empowering Careers.{' '}
            <span className="block mt-2 sm:mt-3 text-white leading-relaxed">
              Enabling Businesses.
            </span>
          </motion.h1>

          <motion.p
            className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4"
            variants={fadeIn('up', 0.3)}
          >
            At CMS, we bridge the gap between talent and opportunity, while delivering reliable business outsourcing solutions to help companies scale smarter and faster.
          </motion.p>

          <motion.div
            className="flex flex-row gap-2 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-2 sm:px-4 w-full max-w-lg md:max-w-none mx-auto"
            variants={fadeIn('up', 0.4)}
          >
            {/* Find Your Job Button */}
            <JobApplicationTrigger className="flex-1 md:flex-none w-full md:w-auto text-[0.7rem] xs:text-sm sm:text-base px-1 xs:px-3 sm:px-6 md:px-8 h-11 xs:h-12 sm:h-14 min-h-[44px] sm:min-h-[56px] whitespace-nowrap" />

            {/* Grow With CMS Button */}
            <Link to="/contact" className="flex-1 md:flex-none w-full md:w-auto min-w-0">
              <Button
                size="lg"
                className="w-full md:w-auto h-11 xs:h-12 sm:h-14 min-h-[44px] sm:min-h-[56px] px-1 xs:px-3 sm:px-8 md:px-10 py-2 sm:py-4 text-[0.7rem] xs:text-sm sm:text-base md:text-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-xl font-semibold border-none touch-manipulation flex items-center justify-center whitespace-nowrap"
              >
                Grow With CMS <ArrowRight className="ml-1 sm:ml-2 inline-block w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="flex flex-row flex-wrap sm:flex-nowrap justify-center items-center gap-2 sm:gap-4 md:gap-6 mt-4 xs:mt-6 sm:mt-8 md:mt-12 px-1"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn('up', 0.5)}
        >
          <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 min-h-[36px] xs:min-h-[44px] max-w-[48%] flex-1 justify-center sm:flex-none">
            <div className="flex -space-x-1.5 sm:-space-x-2 flex-shrink-0">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`/${i}.png`}
                  alt={`Trusted business ${i}`}
                  className="h-5 w-5 xs:h-6 xs:w-6 sm:h-10 sm:w-10 rounded-full border border-white/50 object-cover"
                  style={{ zIndex: 3 - i }}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <span className="text-white/90 font-medium text-[0.65rem] xs:text-xs sm:text-base whitespace-nowrap text-ellipsis overflow-hidden">Trusted by businesses</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 min-h-[36px] xs:min-h-[44px] max-w-[48%] flex-1 justify-center sm:flex-none">
            <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 flex-shrink-0">
              <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-5 sm:h-5 text-yellow-300" />
            </div>
            <span className="text-white/90 font-medium text-[0.65rem] xs:text-xs sm:text-base whitespace-nowrap">99.9% Success Rate</span>
          </div>
        </motion.div>
      </div>

    </section>
  );
}