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
  Headphones,
  Mail,
  MessageSquare,
  BarChart3,
  Briefcase,
  Phone,
  Database,
  Settings,
  Target,
  Plus,
  Minus,
  Globe,
  Zap,
  Award,
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  Video,
  Mic,
  Camera,
  MessageCircle,
  Send,
  Bot,
  User,
  Calendar,
  CheckSquare,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Image,
  Link,
  Smile,
  Heart,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';

export default function CustomerSupport() {
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
                <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                  <Headphones className="w-4 h-4 mr-2" />
                  24/7 Customer Support
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Exceptional Customer Support That 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {" "}Never Sleeps
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Deliver outstanding customer experiences with our comprehensive support solutions. 
                  From live chat to phone support, we provide round-the-clock assistance that keeps 
                  your customers happy and your business thriving.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button href="/contact" variant="primary" size="lg" className="flex items-center">
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button href="/contact" variant="outline" size="lg">
                    Contact Us
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Availability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">30s</div>
                    <div className="text-sm text-gray-600">Response Time</div>
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
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Live Support Dashboard</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Live</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-indigo-600">247</div>
                            <div className="text-sm text-gray-600">Active Chats</div>
                          </div>
                          <MessageSquare className="w-8 h-8 text-indigo-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">4.9</div>
                            <div className="text-sm text-gray-600">Rating</div>
                          </div>
                          <Star className="w-8 h-8 text-purple-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium">Live Chat</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Phone className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Phone Support</span>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">Available</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium">Email Support</span>
                        </div>
                        <span className="text-sm text-purple-600 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
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
                Multi-Channel Support Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Reach your customers wherever they are with our comprehensive support channels. 
                From instant chat to video calls, we provide seamless communication across all platforms.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <MessageSquare className="w-8 h-8 text-indigo-500" />,
                  title: "Live Chat Support",
                  description: "Instant real-time chat support with AI-powered responses and human handoff.",
                  features: ["Instant Responses", "AI Chatbot Integration", "File Sharing", "Screen Sharing", "Chat History", "Multi-language Support"],
                  color: "indigo"
                },
                {
                  icon: <Phone className="w-8 h-8 text-green-500" />,
                  title: "Phone Support",
                  description: "Professional voice support with call routing and quality monitoring.",
                  features: ["Toll-free Numbers", "Call Routing", "Call Recording", "Quality Monitoring", "Voicemail", "Callback Service"],
                  color: "green"
                },
                {
                  icon: <Mail className="w-8 h-8 text-blue-500" />,
                  title: "Email Support",
                  description: "Comprehensive email support with ticket management and automation.",
                  features: ["Ticket Management", "Auto-responses", "Priority Queuing", "Email Templates", "Attachment Support", "SLA Tracking"],
                  color: "blue"
                },
                {
                  icon: <Video className="w-8 h-8 text-purple-500" />,
                  title: "Video Support",
                  description: "Face-to-face support through video calls for complex issues.",
                  features: ["HD Video Calls", "Screen Sharing", "Recording", "Whiteboard", "Co-browsing", "Mobile Support"],
                  color: "purple"
                },
                {
                  icon: <Smartphone className="w-8 h-8 text-orange-500" />,
                  title: "Mobile App Support",
                  description: "Dedicated mobile app support with push notifications and in-app chat.",
                  features: ["In-app Chat", "Push Notifications", "Offline Support", "App Store Support", "Mobile Optimization", "Touch Support"],
                  color: "orange"
                },
                {
                  icon: <Bot className="w-8 h-8 text-pink-500" />,
                  title: "AI-Powered Support",
                  description: "Intelligent chatbots and AI assistants for instant customer help.",
                  features: ["Natural Language", "Learning AI", "24/7 Availability", "Multi-language", "Integration APIs", "Analytics"],
                  color: "pink"
                }
              ].map((channel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${channel.color}-50 to-${channel.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {channel.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{channel.title}</h3>
                    <p className="text-gray-600 mb-4">{channel.description}</p>
                  </div>
                  
                  <ul className="space-y-2">
                    {channel.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
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
                Why Choose Our Customer Support?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We combine cutting-edge technology with human expertise to deliver 
                exceptional customer support that drives satisfaction and loyalty.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Clock className="w-8 h-8 text-green-500" />,
                  title: "Lightning Fast",
                  description: "Average response time under 30 seconds",
                  stat: "<30s"
                },
                {
                  icon: <Globe className="w-8 h-8 text-blue-500" />,
                  title: "Global Coverage",
                  description: "Support in 20+ languages worldwide",
                  stat: "20+"
                },
                {
                  icon: <Shield className="w-8 h-8 text-purple-500" />,
                  title: "Secure & Reliable",
                  description: "Enterprise-grade security and uptime",
                  stat: "99.9%"
                },
                {
                  icon: <Users className="w-8 h-8 text-orange-500" />,
                  title: "Expert Team",
                  description: "Certified support professionals",
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
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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

      {/* Support Process */}
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
                Our Support Process
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A streamlined approach that ensures every customer inquiry is handled 
                efficiently and effectively
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Customer Inquiry",
                  description: "Customer reaches out through any channel - chat, phone, email, or video.",
                  icon: <MessageCircle className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "Instant Response",
                  description: "AI-powered initial response or immediate human agent connection.",
                  icon: <Zap className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Issue Resolution",
                  description: "Expert agents work to resolve the issue quickly and effectively.",
                  icon: <Target className="w-6 h-6" />
                },
                {
                  step: "04",
                  title: "Follow-up & Feedback",
                  description: "Post-resolution follow-up and customer satisfaction survey.",
                  icon: <ThumbsUp className="w-6 h-6" />
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
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-indigo-600">
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

      {/* Technology Stack */}
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
                Advanced Technology Stack
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Powered by cutting-edge technology to deliver seamless customer experiences
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Bot className="w-8 h-8 text-blue-500" />,
                  title: "AI & Machine Learning",
                  description: "Intelligent chatbots and predictive analytics for better customer service.",
                  features: ["Natural Language Processing", "Sentiment Analysis", "Predictive Routing", "Auto-responses"]
                },
                {
                  icon: <BarChart3 className="w-8 h-8 text-green-500" />,
                  title: "Analytics & Reporting",
                  description: "Comprehensive analytics dashboard with real-time insights and reporting.",
                  features: ["Real-time Analytics", "Performance Metrics", "Customer Insights", "Custom Reports"]
                },
                {
                  icon: <Settings className="w-8 h-8 text-purple-500" />,
                  title: "Integration & APIs",
                  description: "Seamless integration with your existing tools and systems.",
                  features: ["CRM Integration", "REST APIs", "Webhook Support", "Custom Integrations"]
                },
                {
                  icon: <Shield className="w-8 h-8 text-red-500" />,
                  title: "Security & Compliance",
                  description: "Enterprise-grade security with compliance certifications.",
                  features: ["Data Encryption", "SOC 2 Compliance", "GDPR Ready", "Security Audits"]
                },
                {
                  icon: <Monitor className="w-8 h-8 text-indigo-500" />,
                  title: "Omnichannel Platform",
                  description: "Unified platform managing all customer touchpoints.",
                  features: ["Unified Dashboard", "Cross-channel History", "Consistent Experience", "Centralized Management"]
                },
                {
                  icon: <Zap className="w-8 h-8 text-yellow-500" />,
                  title: "Automation & Workflows",
                  description: "Automated workflows and intelligent routing for efficiency.",
                  features: ["Smart Routing", "Workflow Automation", "Escalation Rules", "Task Management"]
                }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      {tech.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{tech.title}</h3>
                    <p className="text-gray-600 mb-4">{tech.description}</p>
                  </div>
                  
                  <ul className="space-y-2">
                    {tech.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
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
                Real feedback from businesses that have transformed their customer support
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Mitchell",
                  company: "E-commerce Plus",
                  role: "Customer Success Director",
                  rating: 5,
                  comment: "Outstanding 24/7 support that significantly improved our customer satisfaction scores. The team is incredibly responsive and professional.",
                  avatar: "SM"
                },
                {
                  name: "David Chen",
                  company: "TechStart Solutions",
                  role: "VP of Operations",
                  rating: 5,
                  comment: "The AI-powered chat support reduced our response time by 80% while maintaining high quality. Our customers love the instant responses.",
                  avatar: "DC"
                },
                {
                  name: "Emily Rodriguez",
                  company: "Global Services Inc.",
                  role: "Customer Experience Manager",
                  rating: 5,
                  comment: "Multi-channel support that covers all our customer touchpoints. The integration with our CRM was seamless and the analytics are invaluable.",
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
                  
                  <Quote className="w-8 h-8 text-indigo-500 mb-4" />
                  
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-indigo-600">{testimonial.company}</div>
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
                Get answers to common questions about our customer support services
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: "What support channels do you offer?",
                  answer: "We offer comprehensive support across multiple channels including live chat, phone support, email, video calls, mobile app support, and AI-powered chatbots. All channels are integrated for a seamless customer experience."
                },
                {
                  question: "Do you provide 24/7 support?",
                  answer: "Yes, we provide round-the-clock support 24/7/365. Our global team ensures that your customers can get help at any time, regardless of their timezone or location."
                },
                {
                  question: "How do you ensure quality in customer support?",
                  answer: "We maintain high quality through rigorous training programs, quality monitoring, regular performance reviews, customer satisfaction surveys, and continuous improvement processes. Our agents are certified professionals with ongoing education."
                },
                {
                  question: "Can you integrate with our existing systems?",
                  answer: "Absolutely! We offer seamless integration with popular CRM systems, helpdesk platforms, e-commerce platforms, and custom APIs. Our team works with you to ensure smooth integration with your existing workflow."
                },
                {
                  question: "What languages do you support?",
                  answer: "We support over 20 languages including English, Spanish, French, German, Portuguese, Italian, Dutch, Japanese, Korean, Chinese, Arabic, and many more. Our multilingual team ensures effective communication with your global customer base."
                },
                {
                  question: "How do you handle peak volumes and scaling?",
                  answer: "Our platform is designed to handle high volumes with automatic scaling, intelligent routing, and queue management. We can quickly scale up resources during peak times and seasonal demands to maintain service quality."
                },
                {
                  question: "What security measures do you have in place?",
                  answer: "We implement enterprise-grade security including data encryption, secure data centers, regular security audits, compliance with international standards (SOC 2, GDPR), and strict access controls to protect your customer data."
                },
                {
                  question: "Do you provide analytics and reporting?",
                  answer: "Yes, we provide comprehensive analytics and reporting including real-time dashboards, performance metrics, customer satisfaction scores, response times, resolution rates, and custom reports tailored to your business needs."
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
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <Minus className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-indigo-600" />
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
        title="Ready to Transform Your Customer Support?"
        description="Get started with our comprehensive customer support solutions today and deliver exceptional experiences to your customers."
        buttonText="Get Started Today"
        buttonHref="/contact"
      />
    </div>
  );
}
