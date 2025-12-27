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
  ChevronRight,
  Quote,
  Scale,
  Target,
  Plus,
  Minus,
  Globe,
  Award,
  Search,
  FileText,
  GraduationCap,
  Building} from 'lucide-react';

export default function LegalServices() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
                  <Scale className="w-4 h-4 mr-2" />
                  Legal Process Outsourcing
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Expert Legal Support That 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                    {" "}Protects Your Business
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Navigate complex legal requirements with confidence through our comprehensive 
                  legal support services. From document preparation to compliance management, 
                  we provide expert legal assistance that keeps your business protected.
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
                    <div className="text-3xl font-bold text-red-600 mb-1">1000+</div>
                    <div className="text-sm text-gray-600">Legal Documents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">99%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Legal Support</div>
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
                      src="/leagal.png" 
                      alt="Legal Services" 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Services Overview */}
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
                Comprehensive Legal Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our legal support services cover every aspect of your business legal needs, 
                from document preparation to compliance management and risk assessment.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <FileText className="w-6 h-6 text-white" />,
                  title: "Document Preparation",
                  description: "Professional legal document drafting and preparation services.",
                  features: ["Contract Drafting", "Legal Agreements", "Policy Documents", "Compliance Forms", "Legal Letters", "Court Filings"],
                  gradient: "from-red-500 to-orange-500",
                  bgGradient: "from-red-50 to-orange-50",
                },
                {
                  icon: <Scale className="w-6 h-6 text-white" />,
                  title: "Contract Management",
                  description: "Complete contract lifecycle management and review services.",
                  features: ["Contract Review", "Risk Assessment", "Renewal Management", "Amendment Drafting", "Compliance Monitoring", "Archive Management"],
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                },
                {
                  icon: <Shield className="w-6 h-6 text-white" />,
                  title: "Compliance Support",
                  description: "Comprehensive compliance management and regulatory support.",
                  features: ["Regulatory Compliance", "Audit Preparation", "Policy Development", "Training Programs", "Risk Assessment", "Monitoring Systems"],
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: <Search className="w-6 h-6 text-white" />,
                  title: "Legal Research",
                  description: "In-depth legal research and analysis services.",
                  features: ["Case Law Research", "Statute Analysis", "Precedent Review", "Legal Opinions", "Due Diligence", "Risk Analysis"],
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                },
                {
                  icon: <Building className="w-6 h-6 text-white" />,
                  title: "Corporate Legal",
                  description: "Corporate legal services and business formation support.",
                  features: ["Business Formation", "Corporate Governance", "M&A Support", "IPO Preparation", "Board Documentation", "Shareholder Agreements"],
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-50 to-red-50",
                },
                {
                  icon: <Users className="w-6 h-6 text-white" />,
                  title: "Employment Law",
                  description: "Employment law compliance and HR legal support.",
                  features: ["Employment Contracts", "HR Policies", "Labor Law Compliance", "Dispute Resolution", "Termination Procedures", "Workplace Safety"],
                  gradient: "from-pink-500 to-rose-500",
                  bgGradient: "from-pink-50 to-rose-50",
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
                Why Choose Our Legal Services?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We combine legal expertise with modern technology to deliver comprehensive 
                legal solutions that protect your business and ensure compliance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <GraduationCap className="w-8 h-8 text-red-500" />,
                  title: "Expert Legal Team",
                  description: "Qualified lawyers and legal professionals with extensive experience.",
                  stat: "50+"
                },
                {
                  icon: <Shield className="w-8 h-8 text-green-500" />,
                  title: "100% Confidential",
                  description: "Strict confidentiality and attorney-client privilege protection.",
                  stat: "100%"
                },
                {
                  icon: <Clock className="w-8 h-8 text-blue-500" />,
                  title: "Fast Turnaround",
                  description: "Quick document preparation and legal support delivery.",
                  stat: "24h"
                },
                {
                  icon: <Award className="w-8 h-8 text-purple-500" />,
                  title: "Proven Track Record",
                  description: "Successful legal outcomes and client satisfaction.",
                  stat: "99%"
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
                  <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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
                Our Legal Process
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A systematic approach that ensures thorough legal support and compliance
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Legal Assessment",
                  description: "We analyze your legal requirements and identify areas needing support.",
                  icon: <Target className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "Document Preparation",
                  description: "Draft and prepare all necessary legal documents and contracts.",
                  icon: <FileText className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Review & Compliance",
                  description: "Thorough review and ensure compliance with relevant laws.",
                  icon: <Scale className="w-6 h-6" />
                },
                {
                  step: "04",
                  title: "Ongoing Support",
                  description: "Continuous legal support and updates for ongoing compliance.",
                  icon: <Shield className="w-6 h-6" />
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
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-red-600">
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

      {/* Legal Expertise Areas */}
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
                Areas of Legal Expertise
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive legal support across multiple practice areas
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Building className="w-6 h-6 text-white" />,
                  title: "Corporate Law",
                  description: "Business formation, governance, and corporate transactions.",
                  features: ["Business Formation", "Corporate Governance", "M&A Transactions", "IPO Support", "Board Documentation", "Shareholder Rights"],
                  gradient: "from-red-500 to-orange-500",
                  bgGradient: "from-red-50 to-orange-50",
                },
                {
                  icon: <FileText className="w-6 h-6 text-white" />,
                  title: "Contract Law",
                  description: "Contract drafting, review, and management services.",
                  features: ["Contract Drafting", "Contract Review", "Negotiation Support", "Risk Assessment", "Compliance Monitoring", "Dispute Resolution"],
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                },
                {
                  icon: <Users className="w-6 h-6 text-white" />,
                  title: "Employment Law",
                  description: "Employment compliance and HR legal support.",
                  features: ["Employment Contracts", "HR Policies", "Labor Compliance", "Workplace Safety", "Dispute Resolution", "Termination Procedures"],
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: <Shield className="w-6 h-6 text-white" />,
                  title: "Compliance & Regulatory",
                  description: "Regulatory compliance and risk management.",
                  features: ["Regulatory Compliance", "Risk Assessment", "Audit Support", "Policy Development", "Training Programs", "Monitoring Systems"],
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                },
                {
                  icon: <Scale className="w-6 h-6 text-white" />,
                  title: "Litigation Support",
                  description: "Legal research and litigation preparation services.",
                  features: ["Case Research", "Document Review", "Discovery Support", "Expert Witness", "Trial Preparation", "Settlement Negotiation"],
                  gradient: "from-orange-500 to-amber-500",
                  bgGradient: "from-orange-50 to-amber-50",
                },
                {
                  icon: <Globe className="w-6 h-6 text-white" />,
                  title: "International Law",
                  description: "Cross-border legal issues and international compliance.",
                  features: ["International Contracts", "Cross-border M&A", "Trade Compliance", "Immigration Law", "Tax Planning", "Regulatory Affairs"],
                  gradient: "from-pink-500 to-rose-500",
                  bgGradient: "from-pink-50 to-rose-50",
                }
              ].map((area, index) => (
                <ServiceCard
                  key={area.title}
                  icon={area.icon}
                  title={area.title}
                  description={area.description}
                  features={area.features}
                  gradient={area.gradient}
                  bgGradient={area.bgGradient}
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
                Real feedback from businesses that have benefited from our legal services
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "David Kim",
                  company: "Global Enterprises",
                  role: "General Counsel",
                  rating: 5,
                  comment: "Outstanding legal support services that helped us navigate complex compliance requirements. Highly professional and knowledgeable team.",
                  avatar: "DK"
                },
                {
                  name: "Maria Garcia",
                  company: "Innovation Labs",
                  role: "CEO",
                  rating: 5,
                  comment: "Excellent document preparation and legal guidance. They made our legal processes much more efficient and cost-effective.",
                  avatar: "MG"
                },
                {
                  name: "James Wilson",
                  company: "TechStart Inc.",
                  role: "Founder",
                  rating: 5,
                  comment: "The contract management services are exceptional. We've seen significant improvements in our legal compliance and risk management.",
                  avatar: "JW"
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
                  
                  <Quote className="w-8 h-8 text-red-500 mb-4" />
                  
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-red-600">{testimonial.company}</div>
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
                Get answers to common questions about our legal services
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: "What types of legal documents do you handle?",
                  answer: "We handle various legal documents including contracts, agreements, policies, compliance documents, business formation documents, employment contracts, and legal correspondence. Our team ensures all documents are professionally drafted and legally compliant."
                },
                {
                  question: "Do you provide legal advice?",
                  answer: "We provide legal support and document preparation services. For specific legal advice, we recommend consulting with licensed attorneys in your jurisdiction. We can assist with research and preparation to support your legal needs."
                },
                {
                  question: "How do you ensure document accuracy?",
                  answer: "Our team includes legal professionals who review all documents for accuracy, completeness, and compliance with relevant laws. We follow strict quality control processes and have multiple review stages to ensure the highest standards."
                },
                {
                  question: "Can you help with international legal requirements?",
                  answer: "Yes, we have experience with various international legal requirements and can help ensure compliance across different jurisdictions. We work with local legal experts when needed to provide comprehensive international legal support."
                },
                {
                  question: "What is your turnaround time for legal documents?",
                  answer: "Turnaround times vary based on document complexity. Simple documents can be prepared within 24-48 hours, while complex contracts may take 3-5 business days. We provide specific timelines during project planning."
                },
                {
                  question: "How do you maintain confidentiality?",
                  answer: "We maintain strict confidentiality through comprehensive NDAs, secure document handling, encrypted communication, and access controls. All team members are bound by confidentiality agreements and professional standards."
                },
                {
                  question: "Do you provide ongoing legal support?",
                  answer: "Yes, we offer ongoing legal support including document updates, compliance monitoring, legal research, and regular reviews to ensure your legal requirements are continuously met and up-to-date."
                },
                {
                  question: "What industries do you serve?",
                  answer: "We serve various industries including technology, healthcare, finance, manufacturing, retail, consulting, and more. Our legal team has experience across multiple sectors and can adapt to specific industry requirements and regulations."
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
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <Minus className="w-5 h-5 text-red-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-red-600" />
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
        title="Ready to Secure Your Business Legally?"
        description="Get started with our comprehensive legal services today and ensure your business is protected and compliant."
        buttonText="Get Started Today"
        buttonHref="/contact"
      />
    </div>
  );
}
