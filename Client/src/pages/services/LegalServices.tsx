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
  Scale,
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
  Search,
  FileText,
  PieChart,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Microscope,
  Calculator,
  ChartBar,
  TrendingDown,
  Eye,
  Filter,
  Layers,
  Cpu,
  Network,
  GitBranch,
  Code,
  Database as DatabaseIcon,
  Cloud,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Copy,
  Edit,
  Trash2,
  Save,
  Send,
  CheckSquare,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Coffee,
  Moon,
  Sun,
  Gavel,
  FileCheck,
  Clipboard,
  PenTool,
  Archive,
  FolderOpen,
  Document,
  Scroll,
  Building,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Calendar,
  Clock as ClockIcon,
  Timer,
  Stopwatch,
  Hourglass,
  Calendar as CalendarIcon,
  MapPin,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MessageCircle,
  Video,
  Camera,
  Mic,
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Move,
  Copy as CopyIcon,
  Scissors,
  Clipboard as ClipboardIcon,
  Bookmark,
  Tag,
  Flag,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Star as StarIcon,
  Award as AwardIcon,
  Trophy,
  Medal,
  Ribbon,
  Crown,
  Gem,
  Diamond,
  Zap as ZapIcon,
  Flash,
  Bolt,
  Sparkles,
  Wand2,
  Magic,
  Sparkle,
  Star as StarIcon2,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Flame,
  Snowflake,
  Umbrella,
  TreePine,
  Leaf,
  Flower2,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Squirrel,
  Whale,
  Dolphin,
  Penguin,
  Butterfly,
  Bee,
  Ant,
  Spider,
  Snail,
  Octopus,
  Crab,
  Lobster,
  Shrimp,
  Fish as FishIcon,
  Turtle,
  Lizard,
  Snake,
  Frog,
  Crocodile,
  Elephant,
  Giraffe,
  Lion,
  Tiger,
  Bear,
  Wolf,
  Fox,
  Deer,
  Horse,
  Cow,
  Pig,
  Sheep,
  Goat,
  Chicken,
  Duck,
  Goose,
  Turkey,
  Eagle,
  Hawk,
  Owl,
  Parrot,
  Peacock,
  Flamingo,
  Swan,
  Pelican,
  Stork,
  Crane,
  Heron,
  Kingfisher,
  Woodpecker,
  Robin,
  Cardinal,
  Bluebird,
  Canary,
  Finch,
  Sparrow,
  Wren,
  Jay,
  Magpie,
  Crow,
  Raven,
  Pigeon,
  Dove,
  Hummingbird,
  Toucan,
  Kiwi,
  Ostrich,
  Emu,
  Cassowary,
  Rhea,
  Secretary,
  SecretaryBird,
  Vulture,
  Condor,
  Albatross,
  Petrel,
  Shearwater,
  Fulmar,
  Gannet,
  Booby,
  Cormorant,
  Shag,
  Anhinga,
  Frigatebird,
  Tropicbird,
  Gannet as GannetIcon,
  Booby as BoobyIcon,
  Cormorant as CormorantIcon,
  Shag as ShagIcon,
  Anhinga as AnhingaIcon,
  Frigatebird as FrigatebirdIcon,
  Tropicbird as TropicbirdIcon,
  Gannet as GannetIcon2,
  Booby as BoobyIcon2,
  Cormorant as CormorantIcon2,
  Shag as ShagIcon2,
  Anhinga as AnhingaIcon2,
  Frigatebird as FrigatebirdIcon2,
  Tropicbird as TropicbirdIcon2
} from 'lucide-react';

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
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Legal Dashboard</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-red-600">47</div>
                            <div className="text-sm text-gray-600">Active Cases</div>
                          </div>
                          <Gavel className="w-8 h-8 text-red-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-orange-600">98%</div>
                            <div className="text-sm text-gray-600">Compliance Rate</div>
                          </div>
                          <Shield className="w-8 h-8 text-orange-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium">Contract Review</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Processing</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Document Prep</span>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Scale className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium">Legal Research</span>
                        </div>
                        <span className="text-sm text-purple-600 font-medium">Ongoing</span>
                      </div>
                    </div>
                  </div>
                </div>
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="w-8 h-8 text-red-500" />,
                  title: "Document Preparation",
                  description: "Professional legal document drafting and preparation services.",
                  features: ["Contract Drafting", "Legal Agreements", "Policy Documents", "Compliance Forms", "Legal Letters", "Court Filings"]
                },
                {
                  icon: <Scale className="w-8 h-8 text-blue-500" />,
                  title: "Contract Management",
                  description: "Complete contract lifecycle management and review services.",
                  features: ["Contract Review", "Risk Assessment", "Renewal Management", "Amendment Drafting", "Compliance Monitoring", "Archive Management"]
                },
                {
                  icon: <Shield className="w-8 h-8 text-green-500" />,
                  title: "Compliance Support",
                  description: "Comprehensive compliance management and regulatory support.",
                  features: ["Regulatory Compliance", "Audit Preparation", "Policy Development", "Training Programs", "Risk Assessment", "Monitoring Systems"]
                },
                {
                  icon: <Search className="w-8 h-8 text-purple-500" />,
                  title: "Legal Research",
                  description: "In-depth legal research and analysis services.",
                  features: ["Case Law Research", "Statute Analysis", "Precedent Review", "Legal Opinions", "Due Diligence", "Risk Analysis"]
                },
                {
                  icon: <Building className="w-8 h-8 text-orange-500" />,
                  title: "Corporate Legal",
                  description: "Corporate legal services and business formation support.",
                  features: ["Business Formation", "Corporate Governance", "M&A Support", "IPO Preparation", "Board Documentation", "Shareholder Agreements"]
                },
                {
                  icon: <Users className="w-8 h-8 text-pink-500" />,
                  title: "Employment Law",
                  description: "Employment law compliance and HR legal support.",
                  features: ["Employment Contracts", "HR Policies", "Labor Law Compliance", "Dispute Resolution", "Termination Procedures", "Workplace Safety"]
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
                    <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Building className="w-8 h-8 text-red-500" />,
                  title: "Corporate Law",
                  description: "Business formation, governance, and corporate transactions.",
                  features: ["Business Formation", "Corporate Governance", "M&A Transactions", "IPO Support", "Board Documentation", "Shareholder Rights"]
                },
                {
                  icon: <FileText className="w-8 h-8 text-blue-500" />,
                  title: "Contract Law",
                  description: "Contract drafting, review, and management services.",
                  features: ["Contract Drafting", "Contract Review", "Negotiation Support", "Risk Assessment", "Compliance Monitoring", "Dispute Resolution"]
                },
                {
                  icon: <Users className="w-8 h-8 text-green-500" />,
                  title: "Employment Law",
                  description: "Employment compliance and HR legal support.",
                  features: ["Employment Contracts", "HR Policies", "Labor Compliance", "Workplace Safety", "Dispute Resolution", "Termination Procedures"]
                },
                {
                  icon: <Shield className="w-8 h-8 text-purple-500" />,
                  title: "Compliance & Regulatory",
                  description: "Regulatory compliance and risk management.",
                  features: ["Regulatory Compliance", "Risk Assessment", "Audit Support", "Policy Development", "Training Programs", "Monitoring Systems"]
                },
                {
                  icon: <Scale className="w-8 h-8 text-orange-500" />,
                  title: "Litigation Support",
                  description: "Legal research and litigation preparation services.",
                  features: ["Case Research", "Document Review", "Discovery Support", "Expert Witness", "Trial Preparation", "Settlement Negotiation"]
                },
                {
                  icon: <Globe className="w-8 h-8 text-pink-500" />,
                  title: "International Law",
                  description: "Cross-border legal issues and international compliance.",
                  features: ["International Contracts", "Cross-border M&A", "Trade Compliance", "Immigration Law", "Tax Planning", "Regulatory Affairs"]
                }
              ].map((area, index) => (
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
                      {area.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{area.title}</h3>
                    <p className="text-gray-600 mb-4">{area.description}</p>
                  </div>
                  
                  <ul className="space-y-2">
                    {area.features.map((feature, featureIndex) => (
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
