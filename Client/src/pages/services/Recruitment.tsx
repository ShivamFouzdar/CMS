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
  UserPlus,
  BarChart3,
  Target,
  Plus,
  Minus,
  Search,
  FileText,
  GraduationCap,
  Code,
  Building,
  UserCheck,
  Video,
  Heart,
  ShoppingCart,
  Factory
} from 'lucide-react';

export default function Recruitment() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Talent Acquisition & HR
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Find the Perfect 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                    {" "}Talent for Your Business
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Transform your hiring process with our comprehensive recruitment solutions. 
                  From sourcing top talent to onboarding success, we help you build 
                  high-performing teams that drive business growth.
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
                    <div className="text-3xl font-bold text-green-600 mb-1">1000+</div>
                    <div className="text-sm text-gray-600">Placements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">30</div>
                    <div className="text-sm text-gray-600">Days Avg</div>
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
                      src="/recruitment.png" 
                      alt="Recruitment Services" 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Services Overview */}
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
                Comprehensive Recruitment Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our end-to-end recruitment services cover every aspect of talent acquisition, 
                from initial sourcing to successful placement and retention.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Search className="w-6 h-6 text-white" />,
                  title: "Talent Sourcing",
                  description: "Advanced sourcing strategies to find the best candidates across multiple channels.",
                  features: ["Job Board Management", "Social Media Sourcing", "Referral Programs", "Passive Candidate Search", "Database Mining", "AI-Powered Matching"],
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: <Users className="w-6 h-6 text-white" />,
                  title: "Candidate Screening",
                  description: "Comprehensive screening and assessment processes to identify top talent.",
                  features: ["Resume Screening", "Phone Interviews", "Skills Assessment", "Background Checks", "Reference Verification", "Cultural Fit Analysis"],
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                },
                {
                  icon: <Video className="w-6 h-6 text-white" />,
                  title: "Interview Management",
                  description: "Structured interview processes with expert coordination and evaluation.",
                  features: ["Interview Scheduling", "Panel Coordination", "Technical Assessments", "Behavioral Interviews", "Video Interviews", "Feedback Collection"],
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                },
                {
                  icon: <FileText className="w-6 h-6 text-white" />,
                  title: "Job Description Writing",
                  description: "Compelling job descriptions that attract the right candidates.",
                  features: ["Job Analysis", "Requirements Definition", "Compensation Research", "Market Analysis", "SEO Optimization", "A/B Testing"],
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-50 to-red-50",
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-white" />,
                  title: "Recruitment Analytics",
                  description: "Data-driven insights to optimize your hiring process and outcomes.",
                  features: ["Time-to-Hire Tracking", "Source Effectiveness", "Candidate Pipeline", "Cost Analysis", "Quality Metrics", "Predictive Analytics"],
                  gradient: "from-pink-500 to-rose-500",
                  bgGradient: "from-pink-50 to-rose-50",
                },
                {
                  icon: <UserCheck className="w-6 h-6 text-white" />,
                  title: "Onboarding Support",
                  description: "Seamless onboarding experience to ensure new hire success and retention.",
                  features: ["Welcome Programs", "Documentation", "Training Coordination", "Mentor Matching", "Progress Tracking", "Retention Programs"],
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
                Why Choose Our Recruitment Services?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We combine industry expertise with cutting-edge technology to deliver 
                recruitment solutions that consistently exceed expectations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <GraduationCap className="w-8 h-8 text-green-500" />,
                  title: "Expert Recruiters",
                  description: "Certified recruiters with deep industry knowledge and proven track records.",
                  stat: "50+"
                },
                {
                  icon: <Clock className="w-8 h-8 text-blue-500" />,
                  title: "Fast Placement",
                  description: "Average placement time 30% faster than industry standards.",
                  stat: "30d"
                },
                {
                  icon: <Shield className="w-8 h-8 text-purple-500" />,
                  title: "Quality Guarantee",
                  description: "90-day replacement guarantee for all permanent placements.",
                  stat: "90d"
                },
                {
                  icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
                  title: "Proven Results",
                  description: "95% client satisfaction rate with successful placements.",
                  stat: "95%"
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
                  <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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

      {/* Recruitment Process */}
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
                Our Recruitment Process
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A systematic approach that ensures quality hires and successful placements
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Job Analysis & Planning",
                  description: "We analyze your requirements and create a comprehensive recruitment strategy.",
                  icon: <Target className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "Sourcing & Screening",
                  description: "Advanced sourcing techniques to find and screen the best candidates.",
                  icon: <Search className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Interview & Assessment",
                  description: "Structured interviews and assessments to evaluate candidate fit.",
                  icon: <Video className="w-6 h-6" />
                },
                {
                  step: "04",
                  title: "Placement & Onboarding",
                  description: "Successful placement with comprehensive onboarding support.",
                  icon: <UserCheck className="w-6 h-6" />
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
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-green-600">
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

      {/* Industry Expertise */}
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
                Industry Expertise
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Specialized recruitment across multiple industries and verticals
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Code className="w-6 h-6 text-white" />,
                  title: "Technology",
                  description: "Software engineers, developers, data scientists, and IT professionals.",
                  features: ["Software Development", "Data Science", "Cybersecurity", "DevOps", "Product Management", "UI/UX Design"],
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                },
                {
                  icon: <Building className="w-6 h-6 text-white" />,
                  title: "Finance & Banking",
                  description: "Financial analysts, investment bankers, and banking professionals.",
                  features: ["Investment Banking", "Risk Management", "Financial Analysis", "Compliance", "Trading", "Fintech"],
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: <Heart className="w-6 h-6 text-white" />,
                  title: "Healthcare",
                  description: "Medical professionals, healthcare administrators, and life sciences experts.",
                  features: ["Clinical Research", "Medical Devices", "Pharmaceuticals", "Healthcare IT", "Nursing", "Administration"],
                  gradient: "from-red-500 to-pink-500",
                  bgGradient: "from-red-50 to-pink-50",
                },
                {
                  icon: <ShoppingCart className="w-6 h-6 text-white" />,
                  title: "Retail & E-commerce",
                  description: "Retail managers, e-commerce specialists, and supply chain professionals.",
                  features: ["Retail Management", "E-commerce", "Supply Chain", "Merchandising", "Digital Marketing", "Operations"],
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                },
                {
                  icon: <GraduationCap className="w-6 h-6 text-white" />,
                  title: "Education",
                  description: "Teachers, administrators, and educational technology professionals.",
                  features: ["Teaching", "Administration", "EdTech", "Curriculum Development", "Student Services", "Research"],
                  gradient: "from-orange-500 to-amber-500",
                  bgGradient: "from-orange-50 to-amber-50",
                },
                {
                  icon: <Factory className="w-6 h-6 text-white" />,
                  title: "Manufacturing",
                  description: "Engineers, production managers, and quality assurance professionals.",
                  features: ["Engineering", "Production", "Quality Control", "Supply Chain", "Maintenance", "Safety"],
                  gradient: "from-gray-500 to-slate-500",
                  bgGradient: "from-gray-50 to-slate-50",
                }
              ].map((industry, index) => (
                <ServiceCard
                  key={industry.title}
                  icon={industry.icon}
                  title={industry.title}
                  description={industry.description}
                  features={industry.features}
                  gradient={industry.gradient}
                  bgGradient={industry.bgGradient}
                  animationDelay={0.1 * index}
                  showFeatures={6}
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
                Real feedback from companies that have transformed their hiring with our services
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  company: "TechStart Inc.",
                  role: "HR Director",
                  rating: 5,
                  comment: "Outstanding recruitment services that helped us find top-tier developers in record time. Their screening process is incredibly thorough.",
                  avatar: "SJ"
                },
                {
                  name: "Michael Chen",
                  company: "Global Finance",
                  role: "VP of Operations",
                  rating: 5,
                  comment: "The quality of candidates they provided was exceptional. We've seen a significant improvement in our team's performance since using their services.",
                  avatar: "MC"
                },
                {
                  name: "Emily Rodriguez",
                  company: "HealthTech Solutions",
                  role: "CEO",
                  rating: 5,
                  comment: "Professional, efficient, and results-driven. They understood our culture and found candidates who were a perfect fit for our organization.",
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
                  
                  <Quote className="w-8 h-8 text-green-500 mb-4" />
                  
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-green-600">{testimonial.company}</div>
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
                Get answers to common questions about our recruitment services
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: "What types of positions do you recruit for?",
                  answer: "We recruit for a wide range of positions across multiple industries including technology, finance, healthcare, manufacturing, retail, and more. From entry-level to C-suite positions, we have expertise in finding the right talent for any role."
                },
                {
                  question: "How long does the recruitment process typically take?",
                  answer: "Our average time-to-hire is 30 days, which is 30% faster than industry standards. However, this can vary depending on the role complexity, market conditions, and specific requirements. We provide realistic timelines during our initial consultation."
                },
                {
                  question: "Do you offer guarantees on your placements?",
                  answer: "Yes, we offer a 90-day replacement guarantee for all permanent placements. If a candidate doesn't work out within this period, we'll find a replacement at no additional cost. This demonstrates our confidence in the quality of our placements."
                },
                {
                  question: "What makes your recruitment process different?",
                  answer: "Our process combines advanced technology with human expertise. We use AI-powered matching, comprehensive screening, structured interviews, and cultural fit assessment to ensure we find candidates who are not just qualified but also the right fit for your organization."
                },
                {
                  question: "Do you work with both small and large companies?",
                  answer: "Absolutely! We work with startups, mid-size companies, and large enterprises. Our flexible approach allows us to scale our services to meet the needs of any organization, whether you're hiring one person or building an entire team."
                },
                {
                  question: "What industries do you specialize in?",
                  answer: "We have deep expertise in technology, finance, healthcare, manufacturing, retail, education, and professional services. Our recruiters are industry specialists who understand the unique requirements and challenges of each sector."
                },
                {
                  question: "How do you ensure candidate quality?",
                  answer: "We use a multi-stage screening process including resume analysis, phone interviews, skills assessments, reference checks, and cultural fit evaluation. Our recruiters are trained to identify not just technical skills but also soft skills and cultural alignment."
                },
                {
                  question: "What support do you provide after placement?",
                  answer: "We provide comprehensive onboarding support including welcome programs, documentation assistance, training coordination, and regular check-ins. We also offer retention programs to help ensure long-term success and satisfaction for both the candidate and your organization."
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
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <Minus className="w-5 h-5 text-green-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-green-600" />
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
        title="Ready to Find Your Next Great Hire?"
        description="Get started with our comprehensive recruitment services today and build the team that will drive your business forward."
        buttonText="Get Started Today"
        buttonHref="/contact"
      />
    </div>
  );
}
