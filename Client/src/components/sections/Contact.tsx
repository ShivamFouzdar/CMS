import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fadeIn } from '@/lib/utils';
import { ContactForm } from '@/components/forms/ContactForm';
import { ContactInfoCard, BusinessHoursCard } from '@/components/sections/ContactInfo';

interface ContactProps {
  showHeader?: boolean;
  showInfoOnMobile?: boolean;
}

export function Contact({ showHeader = true, showInfoOnMobile = false }: ContactProps) {
  return (
    <section
      id="contact"
      className={`relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-white ${!showHeader ? 'pt-4 sm:pt-6' : ''}`}
    >

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {showHeader && (
          <motion.div
            className="text-center max-w-4xl mx-auto mb-12 sm:mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div
              variants={fadeIn('up', 0.2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Get In Touch</span>
            </motion.div>

            <motion.h2
              variants={fadeIn('up', 0.3)}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent"
            >
              Let's Discuss Your Project
            </motion.h2>

            <motion.p
              variants={fadeIn('up', 0.4)}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
            </motion.p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            className="order-1"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('right', 0.2)}
          >
            <ContactForm />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className={`${showInfoOnMobile ? 'block' : 'hidden lg:block'} space-y-6 order-2`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('left', 0.2)}
          >
            <ContactInfoCard />
            <BusinessHoursCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
