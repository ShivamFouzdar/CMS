import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CallToAction } from '@/components/sections/CallToAction';
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Clock, 
  Shield, 
  Users, 
  TrendingUp,
  ChevronRight,
  Quote,
  Plus,
  Minus,
  Target,
  Search,
  FileText,
  Lightbulb,
  GraduationCap,
  Building,
  UserCheck,
  Megaphone,
  Palette,
  Camera,
  Video,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  BarChart3,
  Eye,
  Sparkles,
  Award,
  Zap,
  Layers,
  PenTool,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Share2,
  ThumbsUp,
  TrendingDown,
  PieChart,
  Filter,
  Settings,
  Rocket,
  Heart,
  ShoppingCart,
  Factory,
  Stethoscope,
  Home,
  Briefcase,
  BookOpen
} from 'lucide-react';

export default function BrandPromotion() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
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
                  <Megaphone className="w-4 h-4 mr-2" />
                  Brand Promotion & Marketing
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Build a Strong 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    {" "}Professional Identity
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-4 leading-relaxed italic">
                  <em>Attract the Right Opportunities. Grow With Confidence.</em>
                </p>

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  In today's competitive market, your brand is NOT just your identity — it is your biggest asset. 
                  At <strong>CareerMap Solutions</strong>, we help individuals, professionals, entrepreneurs, and organizations 
                  build a powerful brand presence that creates trust, drives visibility, and attracts opportunities that matter.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button href="/contact" variant="primary" size="lg" className="flex items-center">
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button href="/contact" variant="outline" size="lg">
                    Schedule Consultation
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">100%</div>
                    <div className="text-sm text-gray-600">Brand Focus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">360°</div>
                    <div className="text-sm text-gray-600">Marketing</div>
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
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Brand Dashboard</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">Brand</div>
                            <div className="text-sm text-gray-600">Identity</div>
                          </div>
                          <Palette className="w-8 h-8 text-purple-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-indigo-600">Digital</div>
                            <div className="text-sm text-gray-600">Marketing</div>
                          </div>
                          <Globe className="w-8 h-8 text-indigo-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium">Personal Branding</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium">Social Media</span>
                        </div>
                        <span className="text-sm text-purple-600 font-medium">Growing</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium">Visibility</span>
                        </div>
                        <span className="text-sm text-indigo-600 font-medium">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Brand Promotion Matters */}
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
                Why Brand Promotion Matters Today
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Whether you're growing a company or shaping your own career, your brand influences everything
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  icon: <Eye className="w-8 h-8 text-purple-500" />,
                  title: "How people perceive you",
                  description: "Shape the narrative around your professional identity"
                },
                {
                  icon: <Target className="w-8 h-8 text-purple-500" />,
                  title: "The opportunities you attract",
                  description: "Draw the right clients, employers, and partners"
                },
                {
                  icon: <Award className="w-8 h-8 text-purple-500" />,
                  title: "Your credibility",
                  description: "Build trust and authority in the marketplace"
                },
                {
                  icon: <Heart className="w-8 h-8 text-purple-500" />,
                  title: "Customer trust",
                  description: "Foster loyalty and employee engagement"
                },
                {
                  icon: <Rocket className="w-8 h-8 text-purple-500" />,
                  title: "Competitive advantage",
                  description: "Stand out in a crowded market"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-xl text-gray-700 font-semibold">
                A strategic brand presence ensures you are <span className="text-purple-600">seen, heard, and chosen</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Services */}
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
                Our Core Brand Promotion & Marketing Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive solutions that blend creative storytelling, digital strategy, and performance-driven marketing
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <UserCheck className="w-8 h-8 text-purple-500" />,
                  title: "Personal Branding for Professionals",
                  subtitle: "Build a strong, authentic presence that sets you apart.",
                  features: [
                    "Professional CV & Resume Branding",
                    "LinkedIn Profile Optimization",
                    "Digital Portfolio Creation",
                    "Personal Brand Storytelling",
                    "Leadership & Executive Branding",
                    "Social Media Profile Set-up & Growth Strategy"
                  ],
                  benefit: "We help you become more visible, credible, and influential."
                },
                {
                  icon: <Building className="w-8 h-8 text-indigo-500" />,
                  title: "Corporate Brand Development",
                  subtitle: "For companies looking to grow their influence in the market.",
                  features: [
                    "Corporate Identity Development",
                    "Employer Branding Strategy",
                    "Brand Voice, Tone & Guidelines",
                    "Digital & Print Communication Design",
                    "Employee Branding Programs",
                    "Reputation Management & Review Strategy"
                  ],
                  benefit: "We position your business as a trusted and modern brand."
                },
                {
                  icon: <Share2 className="w-8 h-8 text-purple-500" />,
                  title: "Digital & Social Media Marketing",
                  subtitle: "Build a strong online presence backed by strategy.",
                  features: [
                    "Social Media Marketing (Facebook, Instagram, LinkedIn, X)",
                    "High-impact Ad Campaigns",
                    "Content Strategy & Calendar",
                    "Online Reputation Management (ORM)",
                    "SEO Content & Website Optimization",
                    "Lead Generation Campaigns"
                  ],
                  benefit: "We create content that your audience relates to and remembers."
                },
                {
                  icon: <Palette className="w-8 h-8 text-indigo-500" />,
                  title: "Creative Visual Branding",
                  subtitle: "Turn your brand into a visual experience that people love.",
                  features: [
                    "Logo Design & Brand Identity",
                    "Business Cards, Brochures, Corporate Kits",
                    "Promotional Videos & Reels",
                    "Product Photoshoot & Editing",
                    "UI/UX Design for Websites & Apps"
                  ],
                  benefit: "Every design tells your story — powerfully."
                },
                {
                  icon: <Briefcase className="w-8 h-8 text-purple-500" />,
                  title: "Talent Branding for Job Seekers & Entrepreneurs",
                  subtitle: "This unique CMS-exclusive service boosts your image in the job market.",
                  features: [
                    "Professional Bio + Branding Guide",
                    "Network Positioning Strategy",
                    "Thought Leadership Content",
                    "Career Marketing Materials",
                    "Interview Reputation Management"
                  ],
                  benefit: "We transform your professional presence and make recruiters notice you."
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4 italic">{service.subtitle}</p>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <p className="text-sm text-purple-600 font-medium italic mt-4">
                    {service.benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Makes CMS Different */}
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
                What Makes CMS Different?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  icon: <Layers className="w-8 h-8 text-purple-500" />,
                  title: "Brand + Career + Business Insight — All Under One Roof",
                  description: "We combine branding expertise with deep experience in recruitment, training, and business consulting."
                },
                {
                  icon: <Target className="w-8 h-8 text-indigo-500" />,
                  title: "Strategies Backed by Market Understanding",
                  description: "We understand what employers, customers, and audiences actually look for."
                },
                {
                  icon: <Settings className="w-8 h-8 text-purple-500" />,
                  title: "End-to-End Support",
                  description: "From strategy to design to execution — everything is managed by experts."
                },
                {
                  icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
                  title: "Result-Focused Branding",
                  description: "Our campaigns focus on visibility, engagement, leads, and opportunity conversion."
                }
              ].map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                    <p className="text-gray-600">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-6">Tailored for Individuals & Companies</h3>
              <p className="text-lg mb-6 opacity-90">
                Our brand promotion solutions are built for:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {[
                  "Job Seekers",
                  "Students & Freshers",
                  "Working Professionals",
                  "Startups",
                  "Corporates",
                  "Entrepreneurs"
                ].map((audience, index) => (
                  <div key={index} className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{audience}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Process */}
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
                Our Process: How We Build Your Brand
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A systematic approach that ensures your brand stands out and drives results
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                {
                  step: "01",
                  title: "Brand Discovery",
                  description: "Deep analysis of your goals, target audience, and unique strengths.",
                  icon: <Search className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "Positioning & Strategy",
                  description: "Crafting your brand story, messaging, and value approach.",
                  icon: <Target className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Creative Development",
                  description: "Designing visuals, content, and brand-building tools.",
                  icon: <PenTool className="w-6 h-6" />
                },
                {
                  step: "04",
                  title: "Marketing Execution",
                  description: "Social media, digital ads, email campaigns, SEO & outreach.",
                  icon: <Rocket className="w-6 h-6" />
                },
                {
                  step: "05",
                  title: "Performance Monitoring",
                  description: "Data-based optimization for growth and long-term impact.",
                  icon: <BarChart3 className="w-6 h-6" />
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
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-purple-600">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < 4 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 text-gray-300 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
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
                Industries We Serve
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Wherever your brand belongs — <strong className="text-purple-600">we help it stand out</strong>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { icon: <BookOpen className="w-6 h-6" />, name: "Education & EdTech" },
                { icon: <Monitor className="w-6 h-6" />, name: "IT & Software" },
                { icon: <ShoppingCart className="w-6 h-6" />, name: "E-commerce & Retail" },
                { icon: <Heart className="w-6 h-6" />, name: "Hospitality" },
                { icon: <Stethoscope className="w-6 h-6" />, name: "Healthcare" },
                { icon: <Home className="w-6 h-6" />, name: "Real Estate" },
                { icon: <Factory className="w-6 h-6" />, name: "Manufacturing" },
                { icon: <TrendingUp className="w-6 h-6" />, name: "Financial Services" },
                { icon: <Rocket className="w-6 h-6" />, name: "Startups & MSMEs" }
              ].map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 text-purple-600 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {industry.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{industry.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Message */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Success = Strategy + Visibility + Consistency
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>Your brand deserves to be <strong className="text-purple-600">seen</strong>.</p>
                <p>Your story deserves to be <strong className="text-purple-600">told</strong>.</p>
                <p>Your growth deserves a partner who understands your mission.</p>
              </div>
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white">
                <p className="text-xl font-semibold mb-2">
                  At <strong>CareerMap Solutions</strong>, we don't just promote brands —
                </p>
                <p className="text-2xl font-bold">
                  we build meaningful, lasting impressions.
                </p>
              </div>
            </motion.div>
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
                Get answers to common questions about our brand promotion services
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: "What is personal branding and why do I need it?",
                  answer: "Personal branding is the practice of marketing yourself and your career as brands. It helps you stand out in a competitive market, attract better opportunities, and build credibility. Whether you're a job seeker, professional, or entrepreneur, a strong personal brand makes you more visible and influential in your field."
                },
                {
                  question: "How long does it take to see results from brand promotion?",
                  answer: "Results vary depending on your goals and the strategies implemented. Social media growth and visibility improvements can be seen within 2-4 weeks, while comprehensive brand positioning and recognition typically develop over 3-6 months. We provide regular progress reports and adjust strategies based on performance data."
                },
                {
                  question: "Do you work with individuals or only companies?",
                  answer: "We work with both! Our services are tailored for job seekers, students, working professionals, entrepreneurs, startups, and large corporations. Whether you need personal branding for career growth or corporate branding for business expansion, we have solutions designed for your specific needs."
                },
                {
                  question: "What platforms do you manage for social media marketing?",
                  answer: "We manage and create content for all major platforms including Facebook, Instagram, LinkedIn, X (Twitter), and emerging platforms relevant to your industry. We develop platform-specific strategies that maximize engagement and reach for each channel."
                },
                {
                  question: "Can you help with both online and offline branding?",
                  answer: "Absolutely! We provide comprehensive branding solutions including digital presence (websites, social media, online reputation) and offline materials (business cards, brochures, corporate kits, print designs). Our integrated approach ensures brand consistency across all touchpoints."
                },
                {
                  question: "What makes your brand promotion different from other agencies?",
                  answer: "We combine branding expertise with deep experience in recruitment, training, and business consulting. This unique combination means we understand what employers, customers, and audiences actually look for. We don't just create beautiful designs—we create strategies that drive real opportunities and conversions."
                },
                {
                  question: "Do you provide ongoing support after the initial branding project?",
                  answer: "Yes! We offer ongoing support including content creation, social media management, performance monitoring, and strategy optimization. We believe branding is a long-term investment, and we're here to help you maintain and grow your brand presence continuously."
                },
                {
                  question: "How do you measure the success of brand promotion campaigns?",
                  answer: "We track multiple metrics including visibility (reach, impressions), engagement (likes, shares, comments), lead generation, website traffic, brand mentions, and opportunity conversion rates. We provide regular analytics reports and adjust strategies based on data-driven insights to ensure continuous improvement."
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
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
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
        title="Ready to Build a Powerful Brand?"
        description="Let's create a brand identity that attracts opportunities and accelerates growth. Schedule a consultation today."
        buttonText="Get Started Today"
        buttonHref="/contact"
      />
    </div>
  );
}

