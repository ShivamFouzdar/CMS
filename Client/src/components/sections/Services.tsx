"use client"

import { Briefcase, Scale, BarChart3, ArrowRight, Check, Code, UserPlus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { fadeIn } from "@/lib/utils"

const services = [
  {
    icon: <Briefcase className="w-8 h-8 text-purple-400" />,
    title: "BPO Services",
    description: "Comprehensive business process outsourcing solutions to streamline your operations and reduce costs.",
    features: [
      "Customer Service & Support",
      "Data Entry & Processing",
      "Sales & Lead Generation",
      "Backend Operations Management",
    ],
    href: "/services/bpo",
  },

  {
    icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
    title: "KPO Services",
    description: "Knowledge process outsourcing for research, analysis, and intellectual property solutions.",
    features: [
      "Market Research & Analysis",
      "Business Intelligence",
      "Financial Research",
      "Content & Documentation",
    ],
    href: "/services/kpo",
  },
  {
    icon: <Scale className="w-8 h-8 text-purple-400" />,
    title: "Legal Services",
    description: "Expert legal support and documentation services for businesses of all sizes.",
    features: [
      "Document Preparation",
      "Contract Management",
      "Compliance Support",
      "Legal Research",
    ],
    href: "/services/legal",
  },
  {
    icon: <UserPlus className="w-8 h-8 text-purple-400" />,
    title: "Recruitment",
    description: "Comprehensive talent acquisition and HR solutions to build high-performing teams.",
    features: [
      "Talent Sourcing",
      "Candidate Screening",
      "Interview Management",
      "Onboarding Support",
    ],
    href: "/services/recruitment",
  },
  {
    icon: <Code className="w-8 h-8 text-purple-400" />,
    title: "IT Services",
    description: "Full-stack MERN development services for modern web applications and digital solutions.",
    features: [
      "React Frontend Development",
      "Express.js Backend",
      "MongoDB Database",
      "Full-Stack Integration",
    ],
    href: "/services/it",
  },
]

interface ServicesProps {
  showAll?: boolean
}

export function Services({ showAll = false }: ServicesProps) {
  return (
    <section
      id="services"
      className="pt-2 pb-12 sm:pt-3 sm:pb-16 md:pt-4 md:pb-20 lg:pt-6 lg:pb-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative">
        {/* Section Header - Only show when not showing all services */}
        {!showAll && (
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <motion.span
              className="text-purple-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Services
            </motion.span>
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-3 sm:mb-4 lg:mb-6 text-balance"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Comprehensive Business Solutions
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base md:text-lg text-blue-800/80 max-w-3xl mx-auto leading-relaxed text-pretty"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Comprehensive solutions to empower your career and business growth in today's dynamic market.
            </motion.p>
          </div>
        )}

        {/* Services Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
           {services.slice(0, showAll ? services.length : 3).map((service, index) => (
             <motion.div
               key={service.title}
               className="bg-white/95 backdrop-blur-sm rounded-2xl border border-blue-100/60 hover:border-purple-200/80 transition-all duration-500 flex flex-col hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden group relative w-full max-w-sm"
               initial="hidden"
               whileInView="show"
               viewport={{ once: true }}
               variants={fadeIn("up", 0.1 * index)}
               whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
             >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

               <div className="p-5 sm:p-6 flex flex-col h-full relative z-10">
                 <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/20 flex-shrink-0">
                     {service.icon}
                   </div>
                   <h3 className="text-base sm:text-lg font-bold text-blue-900 line-clamp-2 group-hover:text-purple-800 transition-colors duration-300 flex-1">
                     {service.title}
                   </h3>
                 </div>
                <p className="text-xs sm:text-sm text-blue-800/90 mb-4 sm:mb-6 flex-grow line-clamp-3 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm text-blue-800/90 line-clamp-2 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-3 sm:pt-4 border-t border-gradient-to-r from-blue-100 via-purple-100 to-blue-100">
                  <a href={service.href}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-2 border-purple-500/60 text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-purple-600 hover:text-purple-800 transition-all duration-300 group/btn text-xs sm:text-sm font-semibold py-2 sm:py-3 rounded-xl shadow-sm hover:shadow-md bg-transparent"
                    >
                      Learn more
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && (
          <motion.div
            className="mt-12 sm:mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              href="/services"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 border-2 border-purple-600 text-sm sm:text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:border-purple-700 transition-all duration-300 group shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105"
            >
              View All Services
              <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="mt-16 sm:mt-20 lg:mt-24 text-center bg-gradient-to-br from-white/90 via-white/95 to-blue-50/80 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-blue-200/60 shadow-2xl shadow-blue-500/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-12 -translate-x-12" />

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4 sm:mb-6 text-balance">
              Need a custom solution?
            </h3>
            <p className="text-blue-800/80 mb-8 sm:mb-10 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed text-pretty">
              We understand that every business is unique. Let's discuss how we can create a tailored solution for your
              specific needs.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40"
            >
              Contact Us Today
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
