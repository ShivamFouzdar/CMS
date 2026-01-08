"use client"

import { useState, useEffect } from "react"
import { Briefcase, Scale, BarChart3, ArrowRight, Check, Code, UserPlus, Megaphone, Sparkles, Headphones } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { fadeIn } from "@/lib/utils"
import Ballpit from "@/components/ui/Ballpit"
import { servicesService } from "@/services/servicesService"

const servicesData = [
  {
    slug: "bpo",
    icon: <Briefcase className="w-6 h-6 text-white" />,
    title: "BPO Services",
    description: "Comprehensive business process outsourcing solutions to streamline your operations and reduce costs.",
    features: [
      "Customer Service & Support",
      "Data Entry & Processing",
      "Sales & Lead Generation",
      "Backend Operations Management",
    ],
    href: "/services/bpo",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    slug: "kpo",
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    title: "KPO Services",
    description: "Knowledge process outsourcing for research, analysis, and intellectual property solutions.",
    features: [
      "Market Research & Analysis",
      "Business Intelligence",
      "Financial Research",
      "Content & Documentation",
    ],
    href: "/services/kpo",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    slug: "legal",
    icon: <Scale className="w-6 h-6 text-white" />,
    title: "Legal Services",
    description: "Expert legal support and documentation services for businesses of all sizes.",
    features: [
      "Document Preparation",
      "Contract Management",
      "Compliance Support",
      "Legal Research",
    ],
    href: "/services/legal",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
  },
  {
    slug: "recruitment",
    icon: <UserPlus className="w-6 h-6 text-white" />,
    title: "Recruitment",
    description: "Comprehensive talent acquisition and HR solutions to build high-performing teams.",
    features: [
      "Talent Sourcing",
      "Candidate Screening",
      "Interview Management",
      "Onboarding Support",
    ],
    href: "/services/recruitment",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    slug: "it",
    icon: <Code className="w-6 h-6 text-white" />,
    title: "IT Services",
    description: "Full-stack development services for modern web applications and digital solutions.",
    features: [
      "React Frontend Development",
      "Express.js Backend",
      "MongoDB Database",
      "Full-Stack Integration",
    ],
    href: "/services/it",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
  },
  {
    slug: "brand-promotion",
    icon: <Megaphone className="w-6 h-6 text-white" />,
    title: "Brand Promotion & Marketing",
    description: "Build a strong professional identity with comprehensive branding and marketing solutions.",
    features: [
      "Personal Branding",
      "Digital Marketing",
      "Social Media Management",
      "Creative Visual Branding",
    ],
    href: "/services/brand-promotion",
    gradient: "from-orange-500 to-pink-500",
    bgGradient: "from-orange-50 to-pink-50",
  },
  {
    slug: "support",
    icon: <Headphones className="w-6 h-6 text-white" />,
    title: "Customer Support",
    description: "24/7 round-the-clock customer assistance across multiple channels to keep your customers happy.",
    features: [
      "24/7 Availability",
      "Multi-channel Support",
      "AI-Powered Chatbots",
      "Global Coverage",
    ],
    href: "/services/support",
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-blue-50",
  },
]

interface ServicesProps {
  showAll?: boolean
}

export function Services({ showAll = false }: ServicesProps) {
  const [services, setServices] = useState(servicesData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const response = await servicesService.getActiveServices()
        if (response.success) {
          const activeSlugs = response.data
            .filter((s: any) => s.isActive)
            .map((s: any) => s.slug)

          setServices(servicesData.filter(service => activeSlugs.includes(service.slug)))
        }
      } catch (error) {
        console.error('Failed to sync services visibility:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVisibility()
  }, [])

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <section
      id="services"
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-purple-50/50"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/10 to-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        {!showAll && (
          <motion.div
            className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20"
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
            <motion.div
              variants={fadeIn('up', 0.2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Our Services</span>
            </motion.div>

            <motion.h2
              variants={fadeIn('up', 0.3)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent leading-tight"
            >
              Comprehensive Business Solutions
            </motion.h2>

            <motion.p
              variants={fadeIn('up', 0.4)}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Empower your business with cutting-edge solutions designed to drive growth and innovation
            </motion.p>
          </motion.div>
        )}

        {/* Modern Services Grid - Horizontal scroll on mobile, grid on desktop */}
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Mobile: Horizontal scrollable container */}
          <div className="md:hidden overflow-x-auto scrollbar-hide overscroll-x-contain touch-pan-x pb-4 -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {services.slice(0, showAll ? services.length : 3).map((service) => (
                <motion.div
                  key={service.title}
                  className="group relative flex-shrink-0"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn("up", 0)}
                  style={{ width: '85vw', maxWidth: '380px', minWidth: '320px' }}
                >
                  {/* Card with modern design */}
                  <div className="relative h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden w-full">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    {/* Icon with Gradient Background */}
                    <div className={`relative mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {service.icon}
                      <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                        {service.title}
                      </h3>

                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>

                      {/* Features List */}
                      <ul className="space-y-3 mb-8">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-md`}>
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <a href={service.href} className="inline-flex items-center gap-2 group/btn min-h-[44px] touch-manipulation">
                        <span className={`text-sm font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover/btn:gap-3 transition-all duration-300`}>
                          Learn More
                        </span>
                        <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover/btn:translate-x-1 transition-transform duration-300`} />
                      </a>
                    </div>

                    {/* Decorative Corner Element */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity duration-500`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:contents">
            {services.slice(0, showAll ? services.length : 3).map((service) => (
              <motion.div
                key={service.title}
                className="group relative"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn("up", 0)}
              >
                {/* Card with modern design */}
                <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  {/* Icon with Gradient Background */}
                  <div className={`relative mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {service.icon}
                    <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-md`}>
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <a href={service.href} className="inline-flex items-center gap-2 group/btn min-h-[44px] touch-manipulation">
                      <span className={`text-sm font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover/btn:gap-3 transition-all duration-300`}>
                        Learn More
                      </span>
                      <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover/btn:translate-x-1 transition-transform duration-300`} />
                    </a>
                  </div>

                  {/* Decorative Corner Element */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity duration-500`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        {!showAll && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="/services"
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 touch-manipulation"
            >
              <span className="text-sm sm:text-base">View All Services</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        )}

        {/* Modern CTA Section with Ballpit */}
        <motion.div
          className="mt-20 sm:mt-24 lg:mt-32 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl overflow-hidden min-h-[500px] max-h-[500px]">
            {/* Ballpit Background */}
            <div className="absolute inset-0 w-full h-full">
              <Ballpit
                count={80}
                gravity={0.7}
                friction={0.8}
                wallBounce={0.95}
                followCursor={true}
                colors={[0x8b5cf6, 0x3b82f6, 0x6366f1]}
                className="opacity-30"
              />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center min-h-[400px] sm:min-h-[500px] p-6 sm:p-12 md:p-16 lg:p-20">
              <div className="text-center max-w-3xl mx-auto px-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
                  Let's discuss how we can create a custom solution tailored to your unique needs and goals.
                </p>
                <Button
                  href="/contact"
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 min-h-[48px] touch-manipulation"
                >
                  Get Started Today
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
