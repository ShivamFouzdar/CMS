import { motion } from 'framer-motion';
import { About as AboutSection } from '@/components/sections/About';
import { CallToAction } from '@/components/sections/CallToAction';
import { Team } from '@/components/sections/Team';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner with Large Card */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 md:py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Large Card */}
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20">
                <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg sm:rounded-xl overflow-hidden">
                  {/* Team icon placeholder */}
                  <div className="w-full h-full flex items-center justify-center text-purple-900/20">
                    <svg className="w-1/3 h-1/3 sm:w-1/2 sm:h-1/2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H17c-.8 0-1.54.37-2.01.99L14 9.5 12.01 7.99A2.5 2.5 0 0 0 10 7H8.46c-.8 0-1.54.37-2.01.99L4 8.5v13.5h2V14h2v8.5h2V14h2v8.5h2V14h2v8.5h2V14h2v8.5z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Experience badge */}
                <motion.div 
                  className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg w-32 sm:w-40 border border-purple-400/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="text-lg sm:text-2xl font-bold">5+</div>
                  <div className="text-xs sm:text-sm text-purple-100">Years Experience</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              className="space-y-6 order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div>
                <motion.span 
                  className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2 block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  About Us
                </motion.span>
                <motion.h1 
                  className="text-3xl md:text-5xl font-bold text-blue-900 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  About CareerMap Solutions
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl text-blue-800/80 max-w-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Learn more about our mission, values, and the team behind CareerMap Solutions.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* About Content - Mission, Vision, Values */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <AboutSection showFullContent={true} showHeader={false} />
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-blue-900 mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Leadership Team
            </motion.h2>
            <motion.p 
              className="text-lg text-blue-800/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Meet the experienced professionals who lead our company to success.
            </motion.p>
          </div>
          <Team />
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction 
        title="Ready to work with us?"
        description="Get in touch to learn more about how we can help your business succeed."
        buttonText="Contact Us"
        variant="centered"
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"
      />
    </div>
  );
}
