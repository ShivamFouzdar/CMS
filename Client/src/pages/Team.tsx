import { motion } from 'framer-motion';
import { Team } from '@/components/sections/Team';

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">

          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2 block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our Team
            </motion.span>
            <motion.h1 
              className="text-3xl md:text-5xl font-bold text-blue-900 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Our Leadership Team
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-blue-800/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Meet the experienced professionals who lead our company to success.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Team />
        </div>
      </div>
    </div>
  );
}

