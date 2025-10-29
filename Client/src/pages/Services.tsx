import { motion } from 'framer-motion';
import { Services } from '@/components/sections/Services';
import { CallToAction } from '@/components/sections/CallToAction';

export default function ServicesPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Professional Services
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Services</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-blue-800/80 max-w-4xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Comprehensive solutions tailored to meet your business needs and drive sustainable growth in today's competitive market.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center text-blue-700">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">6 Specialized Services</span>
            </div>
            <div className="flex items-center text-blue-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">24/7 Support Available</span>
            </div>
            <div className="flex items-center text-blue-700">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Custom Solutions</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* All Services */}
      <div className="container mx-auto px-4">
        <Services showAll={true} />
      </div>

      {/* Call to Action */}
      <CallToAction 
        title="Ready to get started?"
        description="Contact us today to learn more about how our services can help your business thrive."
        buttonText="Get in Touch"
        variant="centered"
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"
      />
    </div>
  );
}
  