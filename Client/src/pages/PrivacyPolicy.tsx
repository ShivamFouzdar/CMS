import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PrivacyPolicy() {
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

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10 py-4">
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
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-blue-800/80 max-w-3xl mx-auto">
              CareerMap Solutions
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-6 rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 md:py-4 lg:py-8">
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
                  At <strong className="text-blue-900">CareerMap Solutions</strong>, your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you engage with our career guidance, recruitment support, training, and consultancy services.
                </p>
              </div>
            </motion.div>

            {/* Information We Collect */}
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
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Information We Collect</h2>
                </div>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Personal details such as name, email, phone number, educational background, and professional experience.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Employment and career-related data including qualifications, certifications, job preferences, and feedback.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Interaction data from training sessions, consultations, or assessments.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Cookies and usage patterns that help us enhance your experience on our website.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* How We Use Your Information */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">How We Use Your Information</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>To provide personalized career counseling and job recommendations.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>To match candidates with employers based on skills and requirements.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>To deliver customized training programs and professional development resources.</span>
                    </li>
                  </ul>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>To communicate service updates, newsletters, and career opportunities.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>To comply with regulatory requirements and ensure the security of our systems.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Data Sharing */}
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
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Data Sharing</h2>
                </div>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We do not sell or rent your information to third parties.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We may share data with trusted employers, training partners, or service providers for recruitment or career advancement, strictly with your consent.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Security Measures */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Security Measures</h2>
                </div>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We implement robust encryption and access controls to safeguard your data.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Regular audits and security checks are performed to ensure data integrity.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Your Rights</h2>
                </div>
                <ul className="space-y-4 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Request access, updates, or deletion of your information.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Opt-out of marketing communications at any time.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Contact us for privacy-related concerns at <a href="mailto:privacy@careermapsolutions.com" className="text-blue-600 hover:text-blue-700 underline">privacy@careermapsolutions.com</a>.</span>
                  </li>
                </ul>
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
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
