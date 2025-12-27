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
  TrendingUp,
  ChevronRight,
  Quote,
  Brain,
  BarChart3,
  Database,
  Settings,
  Target,
  Plus,
  Minus,
  Search,
  FileText,
  GraduationCap,
  Microscope,
  Calculator,
  Layers,
  Cpu,
  Network,
  Cloud,
  Lock} from 'lucide-react';

export default function KPOServices() {
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
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                  <Brain className="w-4 h-4 mr-2" />
                  Knowledge Process Outsourcing
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Transform Data into 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {" "}Strategic Intelligence
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Leverage our expert knowledge process outsourcing services to gain competitive 
                  advantages through data-driven insights, research excellence, and intellectual 
                  property solutions that drive business growth.
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
                    <div className="text-3xl font-bold text-blue-600 mb-1">95%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600">Research Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Expert Support</div>
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
                      src="/KPO.png" 
                      alt="KPO Services" 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* KPO Services Overview */}
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
                Comprehensive KPO Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our knowledge process outsourcing services cover the full spectrum of intellectual 
                work, from research and analysis to content creation and data intelligence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Search className="w-6 h-6 text-white" />,
                  title: "Market Research & Analysis",
                  description: "Comprehensive market research and competitive analysis to drive strategic decisions.",
                  features: ["Industry Analysis", "Competitor Benchmarking", "Market Sizing", "Trend Analysis", "SWOT Analysis", "Growth Opportunities"],
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-white" />,
                  title: "Business Intelligence",
                  description: "Transform raw data into actionable insights and strategic recommendations.",
                  features: ["Data Visualization", "Predictive Analytics", "KPI Dashboards", "Performance Metrics", "ROI Analysis", "Strategic Planning"],
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: <FileText className="w-6 h-6 text-white" />,
                  title: "Content & Documentation",
                  description: "Professional content creation and technical documentation services.",
                  features: ["Technical Writing", "Research Papers", "White Papers", "Case Studies", "User Manuals", "API Documentation"],
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                },
                {
                  icon: <Calculator className="w-6 h-6 text-white" />,
                  title: "Financial Research",
                  description: "In-depth financial analysis and investment research services.",
                  features: ["Financial Modeling", "Valuation Analysis", "Risk Assessment", "Investment Research", "Credit Analysis", "Due Diligence"],
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-50 to-red-50",
                },
                {
                  icon: <Microscope className="w-6 h-6 text-white" />,
                  title: "Scientific Research",
                  description: "Specialized research in various scientific and technical domains.",
                  features: ["Literature Review", "Data Collection", "Statistical Analysis", "Research Design", "Peer Review", "Publication Support"],
                  gradient: "from-pink-500 to-rose-500",
                  bgGradient: "from-pink-50 to-rose-50",
                },
                {
                  icon: <Layers className="w-6 h-6 text-white" />,
                  title: "Data Processing & Mining",
                  description: "Advanced data processing and mining to extract valuable insights.",
                  features: ["Data Cleaning", "Pattern Recognition", "Machine Learning", "Data Integration", "Quality Assurance", "Insight Generation"],
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
                  showFeatures={6}
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
                Why Choose Our KPO Services?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We combine deep domain expertise with cutting-edge technology to deliver 
                knowledge solutions that drive real business value.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
                  title: "Expert Team",
                  description: "PhD-level researchers and industry experts with deep domain knowledge.",
                  stat: "100+"
                },
                {
                  icon: <Shield className="w-8 h-8 text-green-500" />,
                  title: "Quality Assurance",
                  description: "Rigorous quality control and peer review processes ensure accuracy.",
                  stat: "99.5%"
                },
                {
                  icon: <Clock className="w-8 h-8 text-purple-500" />,
                  title: "Fast Delivery",
                  description: "Quick turnaround times without compromising on quality.",
                  stat: "48h"
                },
                {
                  icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
                  title: "Proven Results",
                  description: "Track record of delivering actionable insights and business value.",
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
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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
                Our Research Process
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A systematic approach that ensures thorough research and actionable insights
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Requirement Analysis",
                  description: "We analyze your research needs and define the scope and objectives.",
                  icon: <Target className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "Research Design",
                  description: "Develop comprehensive research methodology and data collection strategy.",
                  icon: <Settings className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Data Collection & Analysis",
                  description: "Gather data from multiple sources and perform in-depth analysis.",
                  icon: <Database className="w-6 h-6" />
                },
                {
                  step: "04",
                  title: "Insights & Reporting",
                  description: "Deliver actionable insights with comprehensive reports and recommendations.",
                  icon: <FileText className="w-6 h-6" />
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
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
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

      {/* Technology & Tools */}
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
                Advanced Research Tools & Technology
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Leveraging cutting-edge tools and methodologies for superior research outcomes
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Cpu className="w-6 h-6 text-white" />,
                  title: "AI & Machine Learning",
                  description: "Advanced AI tools for data analysis, pattern recognition, and predictive modeling.",
                  features: ["Machine Learning Models", "Natural Language Processing", "Predictive Analytics", "Automated Insights"],
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                },
                {
                  icon: <Database className="w-6 h-6 text-white" />,
                  title: "Big Data Analytics",
                  description: "Powerful data processing and analysis tools for handling large datasets.",
                  features: ["Data Warehousing", "ETL Processes", "Real-time Analytics", "Data Visualization"],
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: <Cloud className="w-6 h-6 text-white" />,
                  title: "Cloud Computing",
                  description: "Scalable cloud infrastructure for research and data processing.",
                  features: ["Cloud Storage", "Scalable Computing", "Global Access", "Cost Optimization"],
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                },
                {
                  icon: <Network className="w-6 h-6 text-white" />,
                  title: "Research Databases",
                  description: "Access to premium research databases and academic resources.",
                  features: ["Academic Journals", "Industry Reports", "Patent Databases", "News Archives"],
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-50 to-red-50",
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-white" />,
                  title: "Visualization Tools",
                  description: "Advanced data visualization and reporting tools.",
                  features: ["Interactive Dashboards", "Custom Charts", "Infographics", "3D Visualizations"],
                  gradient: "from-pink-500 to-rose-500",
                  bgGradient: "from-pink-50 to-rose-50",
                },
                {
                  icon: <Lock className="w-6 h-6 text-white" />,
                  title: "Security & Compliance",
                  description: "Enterprise-grade security for sensitive research data.",
                  features: ["Data Encryption", "Access Controls", "Audit Trails", "Compliance Standards"],
                  gradient: "from-red-500 to-orange-500",
                  bgGradient: "from-red-50 to-orange-50",
                }
              ].map((tech, index) => (
                <ServiceCard
                  key={tech.title}
                  icon={tech.icon}
                  title={tech.title}
                  description={tech.description}
                  features={tech.features}
                  gradient={tech.gradient}
                  bgGradient={tech.bgGradient}
                  animationDelay={0.1 * index}
                  showFeatures={4}
                />
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
                Real feedback from businesses that have leveraged our KPO expertise
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  company: "Research Institute",
                  role: "Research Director",
                  rating: 5,
                  comment: "Exceptional research quality and insights that helped us make critical business decisions. The team's expertise is unmatched.",
                  avatar: "SJ"
                },
                {
                  name: "Michael Chen",
                  company: "Investment Firm",
                  role: "Portfolio Manager",
                  rating: 5,
                  comment: "Outstanding financial research and analysis services. Their reports are comprehensive and actionable, providing real value to our investment decisions.",
                  avatar: "MC"
                },
                {
                  name: "Emily Rodriguez",
                  company: "Tech Startup",
                  role: "CEO",
                  rating: 5,
                  comment: "The market research provided by their team was instrumental in our product launch strategy. Highly professional and thorough work.",
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
                  
                  <Quote className="w-8 h-8 text-blue-500 mb-4" />
                  
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-blue-600">{testimonial.company}</div>
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
                Get answers to common questions about our KPO services
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: "What types of research do you specialize in?",
                  answer: "We specialize in market research, business intelligence, financial research, scientific research, competitive analysis, and data analytics across various industries including technology, healthcare, finance, manufacturing, and consulting."
                },
                {
                  question: "How do you ensure research quality and accuracy?",
                  answer: "We maintain high quality through rigorous methodology, peer review processes, multiple data source validation, expert analysis, and comprehensive quality control measures. Our team includes PhD-level researchers and industry experts."
                },
                {
                  question: "What is the typical turnaround time for research projects?",
                  answer: "Turnaround times vary based on project complexity and scope. Simple research projects can be completed in 1-2 weeks, while comprehensive studies may take 4-8 weeks. We provide detailed timelines during project planning."
                },
                {
                  question: "Do you provide ongoing research support?",
                  answer: "Yes, we offer ongoing research support including regular updates, trend monitoring, competitive intelligence, and continuous market analysis to help you stay ahead of industry developments."
                },
                {
                  question: "How do you handle confidential research projects?",
                  answer: "We have strict confidentiality agreements and secure processes in place. All team members sign NDAs, and we use encrypted systems and secure data handling protocols to protect sensitive information."
                },
                {
                  question: "Can you customize research methodologies?",
                  answer: "Absolutely! We tailor our research methodologies to meet your specific requirements, industry standards, and business objectives. Our flexible approach ensures research that directly addresses your needs."
                },
                {
                  question: "What formats do you deliver research results in?",
                  answer: "We deliver results in various formats including comprehensive reports, executive summaries, presentations, dashboards, infographics, and interactive visualizations. We can customize the format to your preferences."
                },
                {
                  question: "Do you provide post-research support and consultation?",
                  answer: "Yes, we offer post-research consultation to help you understand and implement the findings. This includes strategy development, action planning, and ongoing support to maximize the value of our research."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <Minus className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-blue-600" />
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
        title="Ready to Transform Your Knowledge Processes?"
        description="Get started with our expert KPO services today and unlock the power of data-driven insights for your business."
        buttonText="Get Started Today"
        buttonHref="/contact"
      />
    </div>
  );
}
