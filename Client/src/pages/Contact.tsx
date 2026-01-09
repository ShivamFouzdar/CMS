import { motion } from 'framer-motion';
import { Contact as ContactSection } from '@/components/sections/Contact';

export default function ContactPage() {
  return (
    <div className="space-y-0">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-5 md:pb-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-36 h-36 sm:w-72 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-40 h-40 sm:w-80 sm:h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 text-center relative z-10">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-blue-800/80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Have questions or ready to start your next project? We'd love to hear from you.
          </motion.p>
        </div>
      </div>

      {/* Contact Section - Using the existing Contact component */}
      <ContactSection showHeader={false} showInfoOnMobile={true} />

      {/* Map Section
      <div className="bg-gray-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Find Us</h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Visit our office or get directions to our location
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209126327!2d-73.98784492403314!3d40.74844097138977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Office Location Map"
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div> */}

      {/* Call to Action
      <CallToAction 
        title="Ready to get started?"
        description="Contact us today to learn more about how we can help your business thrive."
        buttonText="Get in Touch"
        variant="centered"
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"
      /> */}
    </div>
  );
}
