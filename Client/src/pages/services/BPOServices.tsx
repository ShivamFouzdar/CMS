import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CallToAction } from '@/components/sections/CallToAction';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { 
  Star, 
  ArrowRight, 
  Clock, 
  Shield, 
  Users, 
  TrendingUp,
  ChevronRight,
  Quote,
  Headphones,
  Mail,
  MessageSquare,
  BarChart3,
  Briefcase,
  Database,
  Settings,
  Target,
  Plus,
  Minus
} from 'lucide-react';

export default function BPOServices() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Business Process Outsourcing
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Transform Your Business with 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    {" "}Expert BPO Services
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Streamline your operations, reduce costs, and scale efficiently with our comprehensive 
                  Business Process Outsourcing solutions. From customer service to data management, 
                  we handle it all so you can focus on growth.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button href="/contact" variant="default" size="lg" className="flex items-center">
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button href="/contact" variant="outline" size="lg">
                    Contact Us
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">99.9%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] group-hover:scale-[1.02]">
                  <div className="relative overflow-hidden">
                    <img 
                      src="/BPO.png" 
                      alt="BPO Services - Customer Service Team" 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Comprehensive BPO Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our BPO services cover every aspect of your business operations, 
                from customer support to back-office processing, ensuring seamless 
                integration and maximum efficiency.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Headphones className="w-6 h-6 text-white" />,
                  title: "Customer Service",
                  description: "24/7 multilingual customer support across voice, email, and chat channels.",
                  features: ["Multi-channel Support", "CRM Integration", "Quality Monitoring", "Real-time Analytics"],
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                },
                {
                  icon: <Database className="w-6 h-6 text-white" />,
                  title: "Data Entry & Processing",
                  description: "Accurate and efficient data entry, validation, and processing services.",
                  features: ["Data Validation", "OCR Processing", "Quality Checks", "Secure Handling"],
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                },
                {
                  icon: <Mail className="w-6 h-6 text-white" />,
                  title: "Email Management",
                  description: "Professional email handling, response management, and ticket resolution.",
                  features: ["Auto-routing", "Template Responses", "Escalation Management", "Performance Tracking"],
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-white" />,
                  title: "Back Office Operations",
                  description: "Complete back-office support including accounting, HR, and administrative tasks.",
                  features: ["Invoice Processing", "Payroll Management", "Document Handling", "Compliance Support"],
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-50 to-red-50",
                },
                {
                  icon: <MessageSquare className="w-6 h-6 text-white" />,
                  title: "Live Chat Support",
                  description: "Real-time chat support with instant responses and seamless customer experience.",
                  features: ["Instant Responses", "Chat Routing", "Co-browsing", "Transcript Management"],
                  gradient: "from-pink-500 to-rose-500",
                  bgGradient: "from-pink-50 to-rose-50",
                },
                {
                  icon: <Settings className="w-6 h-6 text-white" />,
                  title: "Process Automation",
                  description: "Automate repetitive tasks and streamline workflows for better efficiency.",
                  features: ["Workflow Design", "Task Automation", "Integration APIs", "Performance Monitoring"],
                  gradient: "from-indigo-500 to-purple-500",
                  bgGradient: "from-indigo-50 to-purple-50",
                }
              ].map((service, index) => (
                <ServiceCard
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  gradient={service.gradient}
                  bgGradient={service.bgGradient}
                  animationDelay={0.1 * index}
                  showFeatures={4}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our BPO Services?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We combine cutting-edge technology with human expertise to deliver 
                exceptional BPO solutions that drive real business results.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <TrendingUp className="w-8 h-8 text-green-500" />,
                  title: "Cost Reduction",
                  description: "Save up to 60% on operational costs while maintaining quality standards.",
                  stat: "60%"
                },
                {
                  icon: <Clock className="w-8 h-8 text-blue-500" />,
                  title: "24/7 Availability",
                  description: "Round-the-clock support ensuring your business never sleeps.",
                  stat: "24/7"
                },
                {
                  icon: <Shield className="w-8 h-8 text-purple-500" />,
                  title: "Data Security",
                  description: "Enterprise-grade security protocols to protect your sensitive data.",
                  stat: "100%"
                },
                {
                  icon: <Users className="w-8 h-8 text-orange-500" />,
                  title: "Expert Team",
                  description: "Skilled professionals with years of BPO experience.",
                  stat: "500+"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{benefit.stat}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Proven Process
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A systematic approach that ensures smooth implementation and maximum ROI
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Discovery & Analysis",
                  description: "We analyze your current processes and identify optimization opportunities.",
                  icon: <Target className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "Custom Solution Design",
                  description: "Tailored BPO solutions designed specifically for your business needs.",
                  icon: <Settings className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Implementation & Training",
                  description: "Seamless implementation with comprehensive training for your team.",
                  icon: <Users className="w-6 h-6" />
                },
                {
                  step: "04",
                  title: "Ongoing Optimization",
                  description: "Continuous monitoring and optimization for maximum efficiency.",
                  icon: <TrendingUp className="w-6 h-6" />
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center group hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-purple-600">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 text-gray-300 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Our Clients Say
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real feedback from businesses that have transformed their operations with our BPO services
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  company: "TechStart Inc.",
                  role: "CEO",
                  rating: 5,
                  comment: "Outstanding BPO services that helped us reduce costs by 45% while improving customer satisfaction. The team is professional and responsive.",
                  avatar: "SJ"
                },
                {
                  name: "Michael Chen",
                  company: "Global Solutions Ltd.",
                  role: "Operations Director",
                  rating: 5,
                  comment: "The data processing services are exceptional. We've seen a 60% improvement in accuracy and 40% reduction in processing time.",
                  avatar: "MC"
                },
                {
                  name: "Emily Rodriguez",
                  company: "E-commerce Plus",
                  role: "Customer Success Manager",
                  rating: 5,
                  comment: "24/7 customer support that never fails. Our customers love the quick response times and professional service quality.",
                  avatar: "ER"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-purple-500 mb-4" />
                  
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-purple-600">{testimonial.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Get answers to common questions about our BPO services
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: "What types of business processes can be outsourced?",
                  answer: "We can handle various business processes including customer service, data entry, accounting, HR administration, lead generation, back-office operations, email management, and technical support. Our team is equipped to handle both simple and complex processes across different industries."
                },
                {
                  question: "How do you ensure data security and confidentiality?",
                  answer: "We follow strict security protocols including encrypted data transmission, secure servers, comprehensive NDAs, regular security audits, and compliance with international data protection standards. All our team members undergo background checks and sign confidentiality agreements."
                },
                {
                  question: "Can you scale services based on our business needs?",
                  answer: "Yes, our BPO solutions are designed to be highly scalable. We can quickly adjust resources, add or remove services, and modify processes based on your changing business requirements, seasonal demands, or growth patterns."
                },
                {
                  question: "What is the typical contract duration?",
                  answer: "Our contracts are flexible, typically ranging from 6 months to 3 years, with options for extension based on your satisfaction and business needs. We also offer month-to-month arrangements for certain services."
                },
                {
                  question: "How do you measure and report performance?",
                  answer: "We provide comprehensive reporting through our dashboard including call volumes, response times, customer satisfaction scores, quality metrics, and cost savings. Reports are available in real-time and can be customized to your specific requirements."
                },
                {
                  question: "What languages do you support?",
                  answer: "We support over 20 languages including English, Spanish, French, German, Portuguese, Italian, Dutch, and many Asian languages. Our multilingual team ensures effective communication with your global customer base."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <Minus className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <CallToAction
        title="Ready to Transform Your Business Operations?"
        description="Get started with our BPO services today and experience the difference professional outsourcing can make."
        buttonText="Get Started Today"
        buttonHref="/contact"
      />
    </div>
  );
}