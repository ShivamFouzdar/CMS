import { motion } from 'framer-motion';
import { Users, Award, Globe, BarChart3, CheckCircle, Target, Lightbulb, Users2 } from 'lucide-react';
import { fadeIn } from '@/lib/utils';

const stats = [
  { 
    value: '5+', 
    label: 'Years Experience', 
    icon: <Award className="w-6 h-6" />,
    gradient: 'from-yellow-400 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50'
  },
  { 
    value: '50+', 
    label: 'Clients Worldwide', 
    icon: <Globe className="w-6 h-6" />,
    gradient: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50'
  },
  { 
    value: '95%', 
    label: 'Client Retention', 
    icon: <BarChart3 className="w-6 h-6" />,
    gradient: 'from-green-400 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  { 
    value: '100+', 
    label: 'Team Members', 
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-purple-400 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50'
  },
];

const values = [
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Integrity',
    description: 'We conduct our business with the highest ethical standards and transparency.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Innovation',
    description: 'We embrace change and constantly seek innovative solutions for our clients.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Excellence',
    description: 'We strive for excellence in every service we provide and every interaction we have.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <Users2 className="w-8 h-8" />,
    title: 'Partnership',
    description: 'We build long-term relationships based on trust and mutual success.',
    gradient: 'from-green-500 to-emerald-500',
  },
];

interface AboutProps {
  showFullContent?: boolean;
  showHeader?: boolean;
}

export function About({ showFullContent = false, showHeader = true }: AboutProps) {
  return (
    <section 
      id="about" 
      className={`relative py-2 sm:py-2 md:py-2 lg:py-2 overflow-hidden ${
        showHeader ? 'bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30' : ''
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Mission and Vision Section */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {/* Mission Card */}
            <motion.div
              variants={fadeIn('right', 0.2)}
              className="relative group"
            >
              <div className="relative h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 mb-6">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Our Mission</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Empowering Success</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To empower businesses with innovative, efficient, and scalable solutions that drive sustainable growth and success in an ever-changing global marketplace.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={fadeIn('left', 0.2)}
              className="relative group"
            >
              <div className="relative h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-br-full"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 mb-6">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">Our Vision</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Leading Innovation</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To be the most trusted and preferred partner for businesses seeking to transform their operations and achieve operational excellence through our comprehensive suite of services.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Modern Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
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
                variants={fadeIn('up', 0.2)}
                className="group relative"
              >
                <div className={`relative h-full bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 text-center overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`}></div>
                  
                  <div className={`relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  
                  <div className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Why Choose Us - Only show in full content mode */}
          {showFullContent && (
            <motion.div 
              className="mb-16"
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
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Us?</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    'Proven track record of successful project delivery',
                    'Dedicated team of industry experts',
                    'Customized solutions tailored to your needs',
                    '24/7 customer support'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Core Values - Only show in full content mode */}
          {showFullContent && (
            <motion.div 
              className="mt-16"
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
              <div className="text-center mb-12">
                <motion.span 
                  className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm uppercase tracking-wider mb-4"
                  variants={fadeIn('up', 0.2)}
                >
                  Our Values
                </motion.span>
                <motion.h3 
                  className="text-4xl font-bold text-gray-900"
                  variants={fadeIn('up', 0.3)}
                >
                  Guiding Principles That Define Us
                </motion.h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <motion.div 
                    key={index}
                    variants={fadeIn('up', 0.2 * (index % 2 === 0 ? 0.5 : 1))}
                    className="group relative"
                  >
                    <div className="relative h-full bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${value.gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`}></div>
                      
                      <div className="relative z-10">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <div className="text-white">
                            {value.icon}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
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
