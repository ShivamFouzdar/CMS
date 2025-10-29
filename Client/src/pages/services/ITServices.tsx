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
  Code,
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
  TrendingDown,
  Eye,
  Filter,
  Layers,
  Cpu,
  Network,
  Code as CodeIcon,
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

export default function ITServices() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack MERN e-commerce solution with React frontend, Express.js API, and MongoDB database",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-ecommerce.com"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Complete MERN stack task management system with real-time updates and user authentication",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-tasks.com"
    },
    {
      id: 3,
      title: "Social Media Dashboard",
      description: "MERN-based social media management platform with analytics and scheduling features",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-social.com"
    },
    {
      id: 4,
      title: "Blog Platform",
      description: "Full-featured MERN blog platform with admin panel, comments, and content management",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-blog.com"
    },
    {
      id: 5,
      title: "Inventory Management",
      description: "MERN stack inventory management system with real-time tracking and reporting",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-inventory.com"
    },
    {
      id: 6,
      title: "Chat Application",
      description: "Real-time chat application built with MERN stack and Socket.io integration",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-chat.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
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
                <div className="inline-flex items-center px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium mb-6">
                  <Code className="w-4 h-4 mr-2" />
                  Full-Stack MERN Development
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Expert MERN Stack 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                    {" "}Development
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Specialized in MERN stack development - MongoDB, Express.js, React, and Node.js. 
                  We build robust, scalable full-stack applications that deliver exceptional 
                  performance and user experience.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button href="#projects" variant="primary" size="lg" className="flex items-center">
                    View Our Projects
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button href="#contact" variant="outline" size="lg">
                    Start Your Project
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600 mb-1">MERN</div>
                    <div className="text-sm text-gray-600">Stack Expert</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600 mb-1">5+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600 mb-1">100%</div>
                    <div className="text-sm text-gray-600">JavaScript</div>
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
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">MERN Stack Dashboard</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-cyan-600">React</div>
                            <div className="text-sm text-gray-600">Frontend</div>
                          </div>
                          <Code className="w-8 h-8 text-cyan-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">Node.js</div>
                            <div className="text-sm text-gray-600">Backend</div>
                          </div>
                          <Cloud className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Database className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium">MongoDB</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Database</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Settings className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Express.js</span>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">Framework</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium">Full-Stack</span>
                        </div>
                        <span className="text-sm text-purple-600 font-medium">Complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-16 md:py-24">
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
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our portfolio of successful web development projects. 
                Each project showcases our expertise in modern technologies and innovative solutions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                      <Code className="w-16 h-16 text-cyan-500" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-full hover:bg-cyan-100 transition-colors"
                          title="View Live Demo"
                        >
                          <ExternalLink className="w-5 h-5 text-cyan-600" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    <div className="flex justify-center">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
                      >
                        View Live Demo
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
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
                MERN Stack Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Specialized full-stack development services using the MERN technology stack
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Code className="w-8 h-8 text-cyan-500" />,
                  title: "React Frontend Development",
                  description: "Modern React applications with hooks, context, and state management.",
                  features: ["React Components", "Redux/Context", "React Router", "Material-UI", "Responsive Design", "Performance Optimization"]
                },
                {
                  icon: <Settings className="w-8 h-8 text-blue-500" />,
                  title: "Express.js Backend",
                  description: "Robust Node.js backend with Express.js framework and RESTful APIs.",
                  features: ["RESTful APIs", "Middleware", "Authentication", "Error Handling", "Validation", "Security"]
                },
                {
                  icon: <Database className="w-8 h-8 text-purple-500" />,
                  title: "MongoDB Database",
                  description: "NoSQL database design and optimization for scalable applications.",
                  features: ["Schema Design", "Indexing", "Aggregation", "Data Modeling", "Performance Tuning", "Backup & Recovery"]
                },
                {
                  icon: <Network className="w-8 h-8 text-green-500" />,
                  title: "Full-Stack Integration",
                  description: "Seamless integration of all MERN components for complete applications.",
                  features: ["API Integration", "State Management", "Authentication Flow", "Data Synchronization", "Real-time Updates", "Error Handling"]
                },
                {
                  icon: <Cloud className="w-8 h-8 text-red-500" />,
                  title: "Deployment & Hosting",
                  description: "MERN stack deployment on cloud platforms with CI/CD pipelines.",
                  features: ["Heroku/Vercel", "MongoDB Atlas", "Environment Setup", "Domain Configuration", "SSL Certificates", "Performance Monitoring"]
                },
                {
                  icon: <Shield className="w-8 h-8 text-orange-500" />,
                  title: "Security & Authentication",
                  description: "Secure authentication and authorization systems for MERN applications.",
                  features: ["JWT Authentication", "Password Hashing", "Session Management", "CORS Configuration", "Input Validation", "Security Headers"]
                }
              ].map((service, index) => (
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

      {/* Technology Stack */}
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
                MERN Technology Stack
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Complete MERN stack expertise with modern tools and best practices
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  category: "MongoDB",
                  technologies: ["MongoDB", "Mongoose", "Atlas", "Compass", "Aggregation", "Indexing"],
                  color: "cyan"
                },
                {
                  category: "Express.js",
                  technologies: ["Express", "Node.js", "Middleware", "REST APIs", "Authentication", "Validation"],
                  color: "blue"
                },
                {
                  category: "React",
                  technologies: ["React", "Hooks", "Context", "Router", "Redux", "Material-UI"],
                  color: "purple"
                },
                {
                  category: "Node.js",
                  technologies: ["Node.js", "NPM", "Modules", "File System", "HTTP", "Streams"],
                  color: "green"
                }
              ].map((stack, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">{stack.category}</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {stack.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`px-3 py-1 bg-${stack.color}-100 text-${stack.color}-800 text-sm rounded-full`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
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
                Our Development Process
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A proven methodology that ensures successful project delivery
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Discovery & Planning",
                  description: "We analyze your requirements and create a detailed project roadmap.",
                  icon: <Search className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "Design & Prototyping",
                  description: "Create wireframes, mockups, and interactive prototypes.",
                  icon: <PenTool className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Development & Testing",
                  description: "Build your solution with regular testing and quality assurance.",
                  icon: <Code className="w-6 h-6" />
                },
                {
                  step: "04",
                  title: "Deployment & Support",
                  description: "Launch your project and provide ongoing maintenance and support.",
                  icon: <Cloud className="w-6 h-6" />
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
                  <div className="bg-gray-50 rounded-xl p-8 text-center group hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-cyan-600">
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
                Real feedback from businesses that have transformed their digital presence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Thompson",
                  company: "TechStart Inc.",
                  role: "CTO",
                  rating: 5,
                  comment: "Exceptional web development services. They delivered our e-commerce platform ahead of schedule with outstanding quality and performance.",
                  avatar: "AT"
                },
                {
                  name: "Sarah Martinez",
                  company: "HealthTech Solutions",
                  role: "CEO",
                  rating: 5,
                  comment: "The team's expertise in React and Node.js is impressive. Our healthcare portal has been running flawlessly for over a year now.",
                  avatar: "SM"
                },
                {
                  name: "David Chen",
                  company: "EduTech Platform",
                  role: "Founder",
                  rating: 5,
                  comment: "Professional, reliable, and innovative. They built our learning management system exactly as envisioned, with excellent user experience.",
                  avatar: "DC"
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
                  
                  <Quote className="w-8 h-8 text-cyan-500 mb-4" />
                  
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-cyan-600">{testimonial.company}</div>
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
                Get answers to common questions about MERN stack development
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: "What is the MERN stack?",
                  answer: "MERN stands for MongoDB, Express.js, React, and Node.js. It's a full-stack JavaScript solution for building web applications. MongoDB handles the database, Express.js provides the backend framework, React powers the frontend, and Node.js runs the server-side JavaScript."
                },
                {
                  question: "Why choose MERN stack for web development?",
                  answer: "MERN stack offers several advantages: it uses JavaScript throughout the entire stack, has a large community and ecosystem, provides rapid development, offers excellent scalability, and includes powerful tools for both frontend and backend development."
                },
                {
                  question: "How long does a typical MERN project take?",
                  answer: "MERN projects typically take 4-12 weeks depending on complexity. Simple applications take 4-6 weeks, while complex full-stack applications with advanced features can take 8-12 weeks. We provide detailed timelines during project planning."
                },
                {
                  question: "Do you provide MongoDB database design and optimization?",
                  answer: "Yes, we specialize in MongoDB schema design, indexing strategies, aggregation pipelines, and performance optimization. We ensure your database is properly structured for scalability and efficiency."
                },
                {
                  question: "What React features do you implement?",
                  answer: "We implement modern React features including hooks, context API, React Router for navigation, state management with Redux or Context, component optimization, and responsive design with Material-UI or custom CSS."
                },
                {
                  question: "How do you handle authentication in MERN applications?",
                  answer: "We implement secure authentication using JWT tokens, password hashing with bcrypt, session management, role-based access control, and secure API endpoints. We also handle CORS configuration and security headers."
                },
                {
                  question: "Do you provide deployment and hosting services?",
                  answer: "Yes, we offer complete deployment solutions including Heroku, Vercel, or AWS hosting, MongoDB Atlas setup, domain configuration, SSL certificates, and CI/CD pipeline setup for automated deployments."
                },
                {
                  question: "Can you help with existing MERN applications?",
                  answer: "Absolutely! We can audit, refactor, enhance, or migrate existing MERN applications. We also provide code reviews, performance optimization, and help integrate new features into existing applications."
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
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-inset"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === index ? (
                        <Minus className="w-5 h-5 text-cyan-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-cyan-600" />
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
        title="Ready to Build Your MERN Stack Application?"
        description="Get started with our expert MERN stack development services today and create powerful full-stack applications."
        buttonText="Start Your MERN Project"
        buttonHref="#contact"
      />
    </div>
  );
}
