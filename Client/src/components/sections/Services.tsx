"use client"

"use client"

import { Suspense, lazy } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ServiceCard } from "@/components/ui/ServiceCard"
import { fadeIn } from "@/lib/utils"
// Lazy load heavy 3D component
const Ballpit = lazy(() => import("@/components/ui/Ballpit"))

import { useServices } from "@/context/ServiceContext"
import { getServiceIcon, getServiceGradient, getServiceFeatures } from "@/utils/serviceUtils"

interface ServicesProps {
  showAll?: boolean
}

export function Services({ showAll = false }: ServicesProps) {
  const { services, isLoading } = useServices()

  // Filter only active services
  const activeServices = services.filter(service => service.isActive)

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
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-white"
    >


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
          <div className="md:hidden overflow-x-auto scrollbar-hide overscroll-x-contain pb-4 -mx-4 px-4 snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {activeServices.slice(0, showAll ? activeServices.length : 3).map((service) => {
                const { gradient, bgGradient } = getServiceGradient(service.slug)
                const features = getServiceFeatures(service.slug)
                return (
                  <div
                    key={service.name}
                    className="group relative flex-shrink-0 snap-center"
                    style={{ width: '85vw', maxWidth: '380px', minWidth: '320px' }}
                  >
                    <ServiceCard
                      title={service.name}
                      description={service.description}
                      icon={getServiceIcon(service.icon, "w-6 h-6 text-white")}
                      features={features}
                      gradient={gradient}
                      bgGradient={bgGradient}
                      href={`/services/${service.slug}`}
                      className="h-full"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:contents">
            {activeServices.slice(0, showAll ? activeServices.length : 3).map((service) => {
              const { gradient, bgGradient } = getServiceGradient(service.slug)
              const features = getServiceFeatures(service.slug)

              return (
                <motion.div
                  key={service.name}
                  className="group relative"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn("up", 0)}
                >
                  <ServiceCard
                    title={service.name}
                    description={service.description}
                    icon={getServiceIcon(service.icon, "w-6 h-6 text-white")}
                    features={features}
                    gradient={gradient}
                    bgGradient={bgGradient}
                    href={`/services/${service.slug}`}
                    className="h-full"
                  />
                </motion.div>
              )
            })}
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
          <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[500px] max-h-[300px] sm:max-h-[500px]">
            {/* Ballpit Background */}
            <div className="absolute inset-0 w-full h-full">
              <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
                <Ballpit
                  count={80}
                  gravity={0.7}
                  friction={0.8}
                  wallBounce={0.95}
                  followCursor={true}
                  colors={[0x8b5cf6, 0x3b82f6, 0x6366f1]}
                  className="opacity-30"
                  touchInteraction="long-hold"
                />
              </Suspense>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center min-h-[300px] sm:min-h-[500px] p-4 sm:p-12 md:p-16 lg:p-20">
              <div className="text-center max-w-3xl mx-auto px-2 sm:px-4">
                <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-6">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-8 md:mb-10 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Let's discuss how we can create a custom solution tailored to your unique needs and goals.
                </p>
                <Button
                  href="/contact"
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-4 xs:px-6 sm:px-8 md:px-10 py-2 sm:py-5 md:py-6 text-sm xs:text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 min-h-[40px] sm:min-h-[48px] touch-manipulation"
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
