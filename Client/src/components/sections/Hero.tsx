import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeIn } from '@/lib/utils';
import { JobApplicationTrigger } from './JobApplicationDialog';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-32 md:pb-24 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 opacity-20 sm:opacity-30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAgMjJjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMjJjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('right', 0.2)}
            className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left order-1 lg:order-1"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-900 leading-tight mb-4 sm:mb-6"
              variants={fadeIn('up', 0.3)}
            >
              Empowering Careers. <span className="text-purple-600">Enabling Businesses.</span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-blue-800/80 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              variants={fadeIn('up', 0.4)}
            >
              At CMS, we bridge the gap between talent and opportunity, while delivering reliable business outsourcing solutions to help companies scale smarter and faster.
            </motion.p>

            {/* Image - Show on mobile only, between text and buttons */}
            <motion.div 
              className="relative lg:hidden mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative z-10 bg-white/80 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 max-w-md mx-auto">
                <div className="aspect-w-16 aspect-h-9 rounded-lg sm:rounded-xl overflow-hidden">
                  <img 
                    src="/work.png" 
                    alt="CareerMap Solutions - Empowering Careers and Enabling Businesses"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              
              {/* Decorative elements for mobile image */}
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-purple-900/20 rounded-full -z-10 blur-xl"></div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-purple-700/20 rounded-full -z-10 blur-xl"></div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12"
              variants={fadeIn('up', 0.5)}
            >
              <JobApplicationTrigger />
              <Link to="/services" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition-all duration-300 w-full"
                >
                  Grow With CMS →
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="flex flex-row justify-center lg:justify-start items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400"
              variants={fadeIn('up', 0.6)}
            >
              <div className="flex items-center">
                <div className="flex -space-x-1 sm:-space-x-2 mr-2 sm:mr-3">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 border-purple-900 bg-purple-700"
                      style={{ zIndex: 3 - i }}
                    ></div>
                  ))}
                </div>
                <span className="text-xs sm:text-sm">Trusted by 50+ businesses</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-900/50 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 sm:h-5 sm:w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm">99.9% Success Rate</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image/Illustration - Desktop only */}
          <motion.div 
            className="relative order-2 lg:order-2 hidden lg:block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative z-10 bg-white/80 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-white/20">
              <div className="aspect-w-16 aspect-h-9 rounded-lg sm:rounded-xl overflow-hidden">
                {/* Hero image */}
                <img 
                  src="/work.png" 
                  alt="CareerMap Solutions - Empowering Careers and Enabling Businesses"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-purple-900/20 rounded-full -z-10 blur-xl"></div>
            <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-purple-700/20 rounded-full -z-10 blur-xl"></div>
            
            {/* Stats cards - Compact elegant cards */}
            <div className="absolute -bottom-4 sm:-bottom-6 lg:-bottom-8 left-3 sm:left-3 lg:left-3 bg-white/95 backdrop-blur-md p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-xl w-48 sm:w-52 lg:w-56 h-18 sm:h-20 lg:h-20 border border-purple-200/50 z-20 flex flex-col justify-center items-center">
              <div className="text-xs text-gray-600 font-medium mb-1">Satisfaction</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mb-1">98%</div>
              <div className="h-1 bg-purple-100 rounded-full w-full">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full w-11/12"></div>
              </div>
            </div>
            
            <div className="absolute -top-4 sm:-top-6 lg:-top-8 right-3 sm:right-3 lg:right-3 bg-white/95 backdrop-blur-md p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-xl w-48 sm:w-52 lg:w-56 h-18 sm:h-20 lg:h-20 border border-purple-200/50 z-20 flex flex-col justify-center items-center">
              <div className="flex items-center space-x-1.5 mb-1">
                <div className="p-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-purple-600">4.9</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-medium">(2.5k+ reviews)</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
