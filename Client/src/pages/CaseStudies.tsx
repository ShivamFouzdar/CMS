import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Users, Target, Award, Lightbulb } from 'lucide-react';
import { fadeIn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

const caseStudies = [
  {
    id: 1,
    client: 'Urban Money Financial Services',
    industry: 'Financial Services',
    challenge: 'Difficulty sourcing qualified candidates in niche finance roles, resulting in prolonged recruitment cycles.',
    solution: 'CareerMap Solutions deployed a comprehensive recruitment strategy, combining job profiling, candidate screening, and targeted training programs to prepare applicants for high-level roles.',
    results: [
      { metric: 'Reduced hiring time by 40%', icon: TrendingUp },
      { metric: 'Improved candidate quality, with a 60% retention rate after 6 months', icon: Users },
      { metric: 'Enhanced employer reputation, leading to increased applications from top talent', icon: Award },
    ],
  },
  {
    id: 2,
    client: 'IT Tech Academy',
    industry: 'Education & Training',
    challenge: 'Scaling training programs to meet growing industry demands without sacrificing quality.',
    solution: 'Customized learning paths, digital training modules, and mentorship programs were implemented to upskill employees and students.',
    results: [
      { metric: 'Trained over 1,000 professionals in 3 months', icon: Users },
      { metric: 'Improved learner satisfaction with a 95% positive feedback score', icon: CheckCircle },
      { metric: 'Enabled career transitions for over 300 participants', icon: Target },
    ],
  },
];

export default function CaseStudies() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const selectedStudy = caseStudies.find(study => study.id === selectedCard);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 sm:py-20 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-36 h-36 sm:w-72 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-40 h-40 sm:w-80 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 text-center relative z-10">
          <motion.span 
            className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2 block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Case Studies
          </motion.span>
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Real Solutions for Career and Business Growth
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-blue-800/80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover how CareerMap Solutions delivers measurable outcomes by integrating industry knowledge with personalized strategies.
          </motion.p>
        </div>
      </div>

      {/* Case Studies Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col group h-full cursor-pointer"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeIn('up', index * 0.2)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCard(study.id);
                }}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 sm:p-5 relative overflow-hidden min-h-[120px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-xs font-medium opacity-90">Case Study #{index + 1}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 leading-tight">{study.client}</h2>
                    <p className="text-purple-100 text-xs sm:text-sm">{study.industry}</p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col min-h-0">
                  {/* Challenge */}
                  <div className="mb-3 flex-shrink-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-purple-600"></div>
                      Challenge
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed pl-3.5 min-h-[2.5rem]">
                      {truncateText(study.challenge, 70)}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="mb-3 flex-shrink-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-purple-600"></div>
                      Solution
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed pl-3.5 min-h-[2.5rem]">
                      {truncateText(study.solution, 70)}
                    </p>
                  </div>

                  {/* Results */}
                  <div className="mb-4 flex-shrink-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-purple-600"></div>
                      Key Results
                    </h3>
                    <div className="pl-3.5">
                      <div className="flex items-start gap-2 p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                        {(() => {
                          const Icon = study.results[0].icon;
                          return (
                            <>
                              <div className="flex-shrink-0 p-1.5 rounded-lg bg-purple-100 text-purple-600">
                                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </div>
                              <p className="text-gray-800 text-xs sm:text-sm font-medium flex-1">
                                {truncateText(study.results[0].metric, 60)}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCard(study.id);
                    }}
                    className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex-shrink-0 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                  >
                    <span>Read More</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Dialog for Full Case Study */}
      <Dialog open={selectedCard !== null} onOpenChange={(open) => !open && setSelectedCard(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedStudy && (
            <>
              <DialogHeader className="p-6 pb-4">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-4 relative overflow-hidden pr-20"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5" />
                      <span className="text-sm font-medium opacity-90">
                        Case Study #{caseStudies.findIndex(s => s.id === selectedStudy.id) + 1}
                      </span>
                    </div>
                    <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 pr-4">
                      {selectedStudy.client}
                    </DialogTitle>
                    <p className="text-purple-100 text-base">{selectedStudy.industry}</p>
                  </div>
                </motion.div>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-6 px-6 pb-6"
              >
                {/* Challenge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    Challenge
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed pl-4">
                    {selectedStudy.challenge}
                  </p>
                </motion.div>

                {/* Solution */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    Solution
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed pl-4">
                    {selectedStudy.solution}
                  </p>
                </motion.div>

                {/* Results */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    Key Results
                  </h3>
                  <div className="space-y-3 pl-4">
                    {selectedStudy.results.map((result, resultIndex) => {
                      const Icon = result.icon;
                      return (
                        <motion.div
                          key={resultIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 + resultIndex * 0.1 }}
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
                        >
                          <div className="flex-shrink-0 p-2 rounded-lg bg-purple-100 text-purple-600">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-gray-800 text-sm sm:text-base font-medium flex-1">
                            {result.metric}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Section */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-white/20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Proven Results, Real Impact
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Our case studies reflect how CareerMap Solutions delivers measurable outcomes by integrating industry knowledge with personalized strategies. 
                We partner with businesses to solve complex challenges and drive sustainable growth.
              </p>
            </div> */}
          </motion.div>
        </div>
      </div>

      {/* Call to Action
      <CallToAction 
        title="Ready to create your success story?"
        description="Let's discuss how CareerMap Solutions can help your business achieve similar results."
        buttonText="Get Started"
        variant="centered"
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"
      /> */}
    </div>
  );
}

