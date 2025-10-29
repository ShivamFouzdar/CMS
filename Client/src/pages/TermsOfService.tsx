import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/utils';
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-36 h-36 sm:w-72 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </motion.button>

          {/* Page Header */}
          <motion.div
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg sm:text-xl text-blue-800/80 max-w-3xl mx-auto">
              CareerMap Solutions
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mt-6 rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  Welcome to <strong className="text-blue-900">CareerMap Solutions</strong>. By accessing our website and using our career guidance, recruitment, training, and consultancy services, you agree to the following terms:
                </p>
              </div>
            </motion.div>

            {/* Our Services */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Our Services</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Career Guidance</h3>
                    <p className="text-gray-700">Expert advice to help individuals navigate career paths, interviews, and job transitions.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Recruitment Support</h3>
                    <p className="text-gray-700">Connecting employers with qualified candidates through tailored hiring strategies.</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Training & Upskilling</h3>
                    <p className="text-gray-700">Workshops, certification programs, and courses designed to enhance professional capabilities.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Consultancy</h3>
                    <p className="text-gray-700">Strategic advice to organizations on workforce planning, talent acquisition, and retention.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* User Responsibilities */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">User Responsibilities</h2>
                </div>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Provide accurate personal and professional information for effective service delivery.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Use our platforms and services in compliance with applicable laws and ethical standards.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Avoid fraudulent activities or misuse of information.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Intellectual Property</h2>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  All content, including training materials, assessments, templates, and reports, is owned by CareerMap Solutions and protected by copyright laws.
                </p>
              </div>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mr-4">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Limitation of Liability</h2>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  While we provide expert guidance and support, CareerMap Solutions is not responsible for job placements, career outcomes, or training results.
                </p>
              </div>
            </motion.div>

            {/* Modifications */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Modifications</h2>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  We reserve the right to update our services and terms periodically. Continued use indicates your acceptance of these changes.
                </p>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-200">
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-900 mb-4">
                  Need Assistance?
                </h3>
                <p className="text-gray-700 mb-6">
                  If you have any questions about these terms or need support with our services, please don't hesitate to contact us.
                </p>
                <a
                  href="mailto:support@careermapsolutions.com"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Support Team
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsOfService;
