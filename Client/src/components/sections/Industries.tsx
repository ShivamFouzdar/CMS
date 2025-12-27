"use client"

import { BookOpen, Monitor, ShoppingCart, Heart, Stethoscope, Home, Factory, TrendingUp, Rocket, Truck } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn } from "@/lib/utils"

const industries = [
  {
    icon: <BookOpen className="w-8 h-8 text-white" />,
    name: "Education & EdTech",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    icon: <Monitor className="w-8 h-8 text-white" />,
    name: "IT & Software",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-white" />,
    name: "E-commerce & Retail",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
  },
  {
    icon: <Heart className="w-8 h-8 text-white" />,
    name: "Hospitality",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50",
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-white" />,
    name: "Healthcare",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    icon: <Home className="w-8 h-8 text-white" />,
    name: "Real Estate",
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-blue-50",
  },
  {
    icon: <Factory className="w-8 h-8 text-white" />,
    name: "Manufacturing",
    gradient: "from-gray-600 to-gray-800",
    bgGradient: "from-gray-50 to-gray-100",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    name: "Financial Services",
    gradient: "from-yellow-500 to-amber-500",
    bgGradient: "from-yellow-50 to-amber-50",
  },
  {
    icon: <Rocket className="w-8 h-8 text-white" />,
    name: "Startups & MSMEs",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
  },
  {
    icon: <Truck className="w-8 h-8 text-white" />,
    name: "Logistics & Supply Chain",
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-50 to-orange-50",
  },
]

export function Industries() {
  return (
    <section
      id="industries"
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/10 to-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
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
          <motion.h2
            variants={fadeIn('up', 0.2)}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent leading-tight"
          >
            Industries We Serve
          </motion.h2>
          
          <motion.p
            variants={fadeIn('up', 0.3)}
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Wherever your brand belongs —{' '}
            <span className="text-purple-600 font-semibold">we help it stand out</span>
          </motion.p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              className="group relative"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn("up", 0.1 * index)}
            >
              {/* Card */}
              <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Icon with Gradient Background */}
                <div className={`relative mb-4 sm:mb-6 w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br ${industry.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {industry.icon}
                  <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>

                {/* Industry Name */}
                <div className="relative z-10 text-center">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                    {industry.name}
                  </h3>
                </div>

                {/* Decorative Corner Element */}
                <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${industry.gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

