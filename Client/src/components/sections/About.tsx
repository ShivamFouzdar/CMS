import { motion } from 'framer-motion';
import { Users, Award, Globe, BarChart3, CheckCircle } from 'lucide-react';
import { fadeIn } from '@/lib/utils';

const stats = [
  { value: '5+', label: 'Years Experience', icon: <Award className="w-6 h-6 text-purple-400" /> },
  { value: '50+', label: 'Clients Worldwide', icon: <Globe className="w-6 h-6 text-purple-400" /> },
  { value: '95%', label: 'Client Retention', icon: <BarChart3 className="w-6 h-6 text-purple-400" /> },
  { value: '100+', label: 'Team Members', icon: <Users className="w-6 h-6 text-purple-400" /> },
];

const values = [
  {
    title: 'Integrity',
    description: 'We conduct our business with the highest ethical standards and transparency.',
  },
  {
    title: 'Innovation',
    description: 'We embrace change and constantly seek innovative solutions for our clients.',
  },
  {
    title: 'Excellence',
    description: 'We strive for excellence in every service we provide and every interaction we have.',
  },
  {
    title: 'Partnership',
    description: 'We build long-term relationships based on trust and mutual success.',
  },
];

interface AboutProps {
  showFullContent?: boolean;
  showHeader?: boolean;
}

export function About({ showFullContent = false, showHeader = true }: AboutProps) {
  return (
    <section id="about" className={`${showHeader ? 'py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' : ''}`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Mission and Vision Section */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('up', 0.2)}
          >
            <div className="bg-blue-100/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-purple-900/30">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">Our Mission</h3>
              <p className="text-base sm:text-lg text-blue-800/90 mb-6">
                To empower businesses with innovative, efficient, and scalable solutions that drive sustainable growth and success in an ever-changing global marketplace.
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">Our Vision</h3>
              <p className="text-base sm:text-lg text-blue-800/90">
                To be the most trusted and preferred partner for businesses seeking to transform their operations and achieve operational excellence through our comprehensive suite of services.
              </p>
            </div>

            {/* Why Choose Us Section */}
            {showFullContent && (
              <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-white/20 shadow-sm">
                <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6">Why Choose Us?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-base sm:text-lg text-blue-800/90">Proven track record of successful project delivery</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-base sm:text-lg text-blue-800/90">Dedicated team of industry experts</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-base sm:text-lg text-blue-800/90">Customized solutions tailored to your needs</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-base sm:text-lg text-blue-800/90">24/7 customer support</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8"
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
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-white/30 text-center hover:border-purple-500/50 transition-colors"
                variants={fadeIn('up', 0.2)}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:bg-purple-900/50 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-blue-800/90">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Core Values - Only show in full content mode */}
          {showFullContent && (
            <motion.div 
              className="mt-8 sm:mt-12 lg:mt-16"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6 }
                }
              }}
            >
              <div className="text-center mb-8 sm:mb-12">
                <motion.span 
                  className="text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider"
                  variants={fadeIn('up', 0.2)}
                >
                  Our Values
                </motion.span>
                <motion.h3 
                  className="text-2xl sm:text-3xl font-bold text-blue-900/90 mt-2"
                  variants={fadeIn('up', 0.3)}
                >
                  Guiding Principles That Define Us
                </motion.h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 text-blue-900/90">
                {values.map((value, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl border border-white/30 hover:border-blue-300 transition-all h-full hover:shadow-lg"
                    variants={fadeIn('up', 0.2 * (index % 2 === 0 ? 0.5 : 1))}
                  >
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900/90 mb-3 sm:mb-6">{value.title}</h3>
                        <p className="text-xs sm:text-sm text-blue-800/90">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
