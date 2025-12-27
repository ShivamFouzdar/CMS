import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CallToAction } from '@/components/sections/CallToAction';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Shield, 
  ChevronRight,
  Quote,
  Code,
  Database,
  Settings,
  Plus,
  Minus,
  Search,
  Network,
  Cloud,
  PenTool,
  ExternalLink} from 'lucide-react';

export default function ITServices() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React frontend, Express.js API, and MongoDB database",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-ecommerce.com"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Complete Full stack task management system with real-time updates and user authentication",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-tasks.com"
    },
    {
      id: 3,
      title: "Social Media Dashboard",
      description: "Social media management platform with analytics and scheduling features",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-social.com"
    },
    {
      id: 4,
      title: "Blog Platform",
      description: "Full-featured  blog platform with admin panel, comments, and content management",
      image: "/api/placeholder/400/300",
      liveUrl: "https://example-blog.com"
    },
    {
      id: 5,
      title: "Inventory Management",
      description: "Inventory management system with real-time tracking and reporting",
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
                  Full-Stack Development
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Expert Full Stack 
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
                  <Button href="#projects" variant="default" size="lg" className="flex items-center">
                    View Our Projects
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button href="/contact" variant="outline" size="lg">
                    Start Your Project
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600 mb-1">FULL</div>
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
                className="relative group"
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] group-hover:scale-[1.02]">
                  <div className="relative overflow-hidden">
                    <img 
                      src="/IT.png" 
                      alt="IT Services" 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
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
                Full Stack Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Specialized full-stack development services using the MERN technology stack
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Code className="w-6 h-6 text-white" />,
                  title: "React Frontend Development",
                  description: "Modern React applications with hooks, context, and state management.",
                  features: ["React Components", "Redux/Context", "React Router", "Material-UI", "Responsive Design", "Performance Optimization"],
                  gradient: "from-cyan-500 to-blue-500",
                  bgGradient: "from-cyan-50 to-blue-50",
                },
                {
                  icon: <Settings className="w-6 h-6 text-white" />,
                  title: "Express.js Backend",
                  description: "Robust Node.js backend with Express.js framework and RESTful APIs.",
                  features: ["RESTful APIs", "Middleware", "Authentication", "Error Handling", "Validation", "Security"],
                  gradient: "from-blue-500 to-indigo-500",
                  bgGradient: "from-blue-50 to-indigo-50",
                },
                {
                  icon: <Database className="w-6 h-6 text-white" />,
                  title: "MongoDB Database",
                  description: "NoSQL database design and optimization for scalable applications.",
                  features: ["Schema Design", "Indexing", "Aggregation", "Data Modeling", "Performance Tuning", "Backup & Recovery"],
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                },
                {
                  icon: <Network className="w-6 h-6 text-white" />,
                  title: "Full-Stack Integration",
                  description: "Seamless integration of all MERN components for complete applications.",
                  features: ["API Integration", "State Management", "Authentication Flow", "Data Synchronization", "Real-time Updates", "Error Handling"],
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                },
                {
                  icon: <Cloud className="w-6 h-6 text-white" />,
                  title: "Deployment & Hosting",
                  description: "MERN stack deployment on cloud platforms with CI/CD pipelines.",
                  features: ["Heroku/Vercel", "MongoDB Atlas", "Environment Setup", "Domain Configuration", "SSL Certificates", "Performance Monitoring"],
                  gradient: "from-red-500 to-orange-500",
                  bgGradient: "from-red-50 to-orange-50",
                },
                {
                  icon: <Shield className="w-6 h-6 text-white" />,
                  title: "Security & Authentication",
                  description: "Secure authentication and authorization systems for MERN applications.",
                  features: ["JWT Authentication", "Password Hashing", "Session Management", "CORS Configuration", "Input Validation", "Security Headers"],
                  gradient: "from-orange-500 to-amber-500",
                  bgGradient: "from-orange-50 to-amber-50",
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
        title="Ready to Build Your Application?"
        description="Get started with our expert MERN stack development services today and create powerful full-stack applications."
        buttonText="Start Your Project"
        buttonHref="/contact"
      />
    </div>
  );
}
